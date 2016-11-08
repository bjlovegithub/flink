/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.flink.test.streaming.api;

import org.apache.flink.api.common.functions.FoldFunction;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.functions.RichMapFunction;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.core.fs.FileSystem;
import org.apache.flink.streaming.api.collector.selector.OutputSelector;
import org.apache.flink.streaming.api.datastream.AsyncDataStream;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.datastream.SplitStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.async.AsyncFunction;
import org.apache.flink.streaming.api.functions.async.RichAsyncFunction;
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import org.apache.flink.streaming.api.operators.async.AsyncCollector;
import org.apache.flink.streaming.util.StreamingMultipleProgramsTestBase;
import org.apache.flink.util.MathUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class StreamingOperatorsITCase extends StreamingMultipleProgramsTestBase {

	private String resultPath1;
	private String resultPath2;
	private String expected1;
	private String expected2;

	@Rule
	public TemporaryFolder tempFolder = new TemporaryFolder();

	@Before
	public void before() throws Exception {
		resultPath1 = tempFolder.newFile().toURI().toString();
		resultPath2 = tempFolder.newFile().toURI().toString();
		expected1 = "";
		expected2 = "";
	}

	@After
	public void after() throws Exception {
		compareResultsByLinesInMemory(expected1, resultPath1);
		compareResultsByLinesInMemory(expected2, resultPath2);
	}

	/**
	 * Tests the proper functioning of the streaming fold operator. For this purpose, a stream
	 * of Tuple2<Integer, Integer> is created. The stream is grouped according to the first tuple
	 * value. Each group is folded where the second tuple value is summed up.
	 *
	 * This test relies on the hash function used by the {@link DataStream#keyBy}, which is
	 * assumed to be {@link MathUtils#murmurHash}.
	 */
	@Test
	public void testGroupedFoldOperation() throws Exception {
		int numElements = 10;
		final int numKeys = 2;

		StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		DataStream<Tuple2<Integer, Integer>> sourceStream = env.addSource(new TupleSource(numElements, numKeys));

		SplitStream<Tuple2<Integer, Integer>> splittedResult = sourceStream
			.keyBy(0)
			.fold(0, new FoldFunction<Tuple2<Integer, Integer>, Integer>() {
				private static final long serialVersionUID = 4875723041825726082L;

				@Override
				public Integer fold(Integer accumulator, Tuple2<Integer, Integer> value) throws Exception {
					return accumulator + value.f1;
				}
			}).map(new RichMapFunction<Integer, Tuple2<Integer, Integer>>() {
				private static final long serialVersionUID = 8538355101606319744L;
				int key = -1;
				@Override
				public Tuple2<Integer, Integer> map(Integer value) throws Exception {
					if (key == -1){
						key = MathUtils.murmurHash(value) % numKeys;
					}
					return new Tuple2<>(key, value);
				}
			}).split(new OutputSelector<Tuple2<Integer, Integer>>() {
				private static final long serialVersionUID = -8439325199163362470L;

				@Override
				public Iterable<String> select(Tuple2<Integer, Integer> value) {
					List<String> output = new ArrayList<>();

					output.add(value.f0 + "");
					return output;
				}
			});

		splittedResult.select("0").map(new MapFunction<Tuple2<Integer,Integer>, Integer>() {
			private static final long serialVersionUID = 2114608668010092995L;

			@Override
			public Integer map(Tuple2<Integer, Integer> value) throws Exception {
				return value.f1;
			}
		}).writeAsText(resultPath1, FileSystem.WriteMode.OVERWRITE);

		splittedResult.select("1").map(new MapFunction<Tuple2<Integer, Integer>, Integer>() {
			private static final long serialVersionUID = 5631104389744681308L;

			@Override
			public Integer map(Tuple2<Integer, Integer> value) throws Exception {
				return value.f1;
			}
		}).writeAsText(resultPath2, FileSystem.WriteMode.OVERWRITE);

		StringBuilder builder1 = new StringBuilder();
		StringBuilder builder2 = new StringBuilder();
		int counter1 = 0;
		int counter2 = 0;

		for (int i = 0; i < numElements; i++) {
			if (MathUtils.murmurHash(i) % numKeys == 0) {
				counter1 += i;
				builder1.append(counter1 + "\n");
			} else {
				counter2 += i;
				builder2.append(counter2 + "\n");
			}
		}

		expected1 = builder1.toString();
		expected2 = builder2.toString();

		env.execute();
	}

	/**
	 * Tests whether the fold operation can also be called with non Java serializable types.
	 */
	@Test
	public void testFoldOperationWithNonJavaSerializableType() throws Exception {
		final int numElements = 10;

		StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		DataStream<Tuple2<Integer, NonSerializable>> input = env.addSource(new NonSerializableTupleSource(numElements));

		input
			.keyBy(0)
			.fold(
				new NonSerializable(42),
				new FoldFunction<Tuple2<Integer, NonSerializable>, NonSerializable>() {
					private static final long serialVersionUID = 2705497830143608897L;

					@Override
					public NonSerializable fold(NonSerializable accumulator, Tuple2<Integer, NonSerializable> value) throws Exception {
						return new NonSerializable(accumulator.value + value.f1.value);
					}
			})
			.map(new MapFunction<NonSerializable, Integer>() {
				private static final long serialVersionUID = 6906984044674568945L;

				@Override
				public Integer map(NonSerializable value) throws Exception {
					return value.value;
				}
			})
			.writeAsText(resultPath1, FileSystem.WriteMode.OVERWRITE);

		StringBuilder builder = new StringBuilder();

		for (int i = 0; i < numElements; i++) {
			builder.append(42 + i + "\n");
		}

		expected1 = builder.toString();

		env.execute();
	}

	@Test
	public void testAsyncWaitOperator() throws Exception {
		final int numElements = 10;

		StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

		DataStream<Tuple2<Integer, NonSerializable>> input = env.addSource(new NonSerializableTupleSource(numElements)).setParallelism(1);

		AsyncFunction<Tuple2<Integer, NonSerializable>, Integer> function = new RichAsyncFunction<Tuple2<Integer, NonSerializable>, Integer>() {
			transient ExecutorService executorService;

			@Override
			public void open(Configuration parameters) throws Exception {
				super.open(parameters);
				executorService = Executors.newFixedThreadPool(numElements);
			}

			@Override
			public void close() throws Exception {
				super.close();
				executorService.shutdown();
			}

			@Override
			public void asyncInvoke(final Tuple2<Integer, NonSerializable> input,
									final AsyncCollector<Tuple2<Integer, NonSerializable>, Integer> collector) throws Exception {
				this.executorService.submit(new Runnable() {
					@Override
					public void run() {
						// wait for while to simulate async operation here
						int sleep = (int) (new Random().nextFloat() * 100);
						try {
							Thread.sleep(sleep);
							List<Integer> ret = new ArrayList<>();
							ret.add(input.f0+input.f0);
							collector.collect(ret);
						}
						catch (InterruptedException e) {
							collector.collect(new ArrayList<Integer>(0));
						}
					}
				});
			}
		};

		DataStream<Integer> orderedResult = AsyncDataStream.orderedWait(input, function, 2).setParallelism(1);
		orderedResult.writeAsText(resultPath1, FileSystem.WriteMode.OVERWRITE).setParallelism(1);

		DataStream<Integer> unorderedResult = AsyncDataStream.unorderedWait(input, function, 2).setParallelism(1);
		unorderedResult.writeAsText(resultPath2, FileSystem.WriteMode.OVERWRITE);

		StringBuilder builder = new StringBuilder();

		for (int i = 0; i < numElements; i++) {
			builder.append(i+i + "\n");
		}

		expected1 = builder.toString();

		expected2 = expected1;

		env.execute();
	}

	private static class NonSerializable {
		// This makes the type non-serializable
		private final Object obj = new Object();

		private final int value;

		public NonSerializable(int value) {
			this.value = value;
		}
	}

	private static class NonSerializableTupleSource implements SourceFunction<Tuple2<Integer, NonSerializable>> {
		private static final long serialVersionUID = 3949171986015451520L;
		private final int numElements;

		public NonSerializableTupleSource(int numElements) {
			this.numElements = numElements;
		}


		@Override
		public void run(SourceContext<Tuple2<Integer, NonSerializable>> ctx) throws Exception {
			for (int i = 0; i < numElements; i++) {
				ctx.collect(new Tuple2<>(i, new NonSerializable(i)));
			}
		}

		@Override
		public void cancel() {}
	}

	private static class TupleSource implements SourceFunction<Tuple2<Integer, Integer>> {

		private static final long serialVersionUID = -8110466235852024821L;
		private final int numElements;
		private final int numKeys;

		public TupleSource(int numElements, int numKeys) {
			this.numElements = numElements;
			this.numKeys = numKeys;
		}

		@Override
		public void run(SourceContext<Tuple2<Integer, Integer>> ctx) throws Exception {
			for (int i = 0; i < numElements; i++) {
				// keys '1' and '2' hash to different buckets
				Tuple2<Integer, Integer> result = new Tuple2<>(1 + (MathUtils.murmurHash(i) % numKeys), i);
				ctx.collect(result);
			}
		}

		@Override
		public void cancel() {
		}
	}
}
