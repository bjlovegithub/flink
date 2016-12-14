package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.api.common.JobID;
import org.apache.flink.runtime.execution.ExecutionState;
import org.apache.flink.runtime.executiongraph.Execution;
import org.apache.flink.runtime.executiongraph.ExecutionGraph;
import org.apache.flink.runtime.executiongraph.ExecutionJobVertex;
import org.apache.flink.runtime.executiongraph.ExecutionVertex;
import org.apache.flink.runtime.executiongraph.IOMetrics;
import org.apache.flink.runtime.jobgraph.JobStatus;
import org.apache.flink.runtime.jobgraph.JobVertexID;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricFetcher;
import org.apache.flink.runtime.webmonitor.metrics.MetricStore;
import org.junit.Test;

import java.util.Collections;
import java.util.Iterator;
import java.util.NoSuchElementException;

import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Test cases for {@link JobDetailsHandler}
 */
public class JobDetailHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);
		MetricFetcher fetcher = mock(MetricFetcher.class);

		JobDetailsHandler handler = new JobDetailsHandler(graphHolder, fetcher);

		ExecutionGraph graph = mock(ExecutionGraph.class);
		when(graph.getJobID()).thenReturn(new JobID());
		when(graph.getJobName()).thenReturn("test");
		when(graph.getState()).thenReturn(JobStatus.RUNNING);

		final ExecutionJobVertex jobVertex = mock(ExecutionJobVertex.class);
		ExecutionVertex vertex = mock(ExecutionVertex.class);
		when(vertex.getExecutionState()).thenReturn(ExecutionState.RUNNING);

		when(jobVertex.getJobVertexId()).thenReturn(new JobVertexID());
		when(jobVertex.getName()).thenReturn("FlatMap -> Async IO Operator");
		when(jobVertex.getParallelism()).thenReturn(1);
		when(jobVertex.getAggregateState()).thenReturn(ExecutionState.RUNNING);

		Execution execution = mock(Execution.class);
		when(vertex.getCurrentExecutionAttempt()).thenReturn(execution);

		IOMetrics metrics = mock(IOMetrics.class);
		when(execution.getIOMetrics()).thenReturn(metrics);

		when(metrics.getNumRecordsIn()).thenReturn(111l);
		when(metrics.getNumRecordsOut()).thenReturn(111l);
		when(metrics.getNumRecordsInPerSecond()).thenReturn(111.0);

		ExecutionVertex[] vertexArr = new ExecutionVertex[1];
		vertexArr[0] = vertex;
		when(jobVertex.getTaskVertices()).thenReturn(vertexArr);

		Iterable<ExecutionJobVertex> iterable = new Iterable<ExecutionJobVertex>() {
			@Override
			public Iterator<ExecutionJobVertex> iterator() {
				return new Iterator<ExecutionJobVertex>() {
					private int pos = 0;

					@Override
					public boolean hasNext() {
						return pos < 1;
					}

					@Override
					public ExecutionJobVertex next() {
						if (hasNext()) {
							pos++;

							return jobVertex;
						} else {
							throw new NoSuchElementException();
						}
					}

					@Override
					public void remove() {
						throw new UnsupportedOperationException();
					}
				};
			}
		};

		when(graph.getVerticesTopologically()).thenReturn(iterable);

		when(jobVertex.getParallelism()).thenReturn(1);

		MetricStore store = mock(MetricStore.class);
		when(fetcher.getMetricStore()).thenReturn(store);

		MetricStore.SubtaskMetricStore metricStore = new MetricStore.SubtaskMetricStore();
		metricStore.metrics.put("numRecordsInPerSecond", "1");

		when(store.getSubtaskMetricStore(anyString(), anyString(), anyInt())).thenReturn(metricStore);

		String response = handler.handleRequest(graph, Collections.<String, String>emptyMap());
		System.out.println(response);
	}
}
