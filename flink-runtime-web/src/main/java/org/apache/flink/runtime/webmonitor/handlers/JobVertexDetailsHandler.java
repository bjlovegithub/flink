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

package org.apache.flink.runtime.webmonitor.handlers;

import com.fasterxml.jackson.core.JsonGenerator;
import org.apache.flink.runtime.execution.ExecutionState;
import org.apache.flink.runtime.executiongraph.AccessExecutionJobVertex;
import org.apache.flink.runtime.executiongraph.AccessExecutionVertex;
import org.apache.flink.runtime.executiongraph.IOMetrics;
import org.apache.flink.runtime.taskmanager.TaskManagerLocation;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricFetcher;
import org.apache.flink.runtime.webmonitor.metrics.MetricHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricStore;

import java.io.StringWriter;
import java.util.Map;

/**
 * A request handler that provides the details of a job vertex, including the runtime and metrics of all its subtasks.
 */
public class JobVertexDetailsHandler extends AbstractJobVertexRequestHandler {

	private final MetricFetcher fetcher;

	public JobVertexDetailsHandler(ExecutionGraphHolder executionGraphHolder, MetricFetcher fetcher) {
		super(executionGraphHolder);
		this.fetcher = fetcher;
	}

	@Override
	public String handleRequest(AccessExecutionJobVertex jobVertex, Map<String, String> params) throws Exception {
		final long now = System.currentTimeMillis();
		
		StringWriter writer = new StringWriter();
		JsonGenerator gen = JsonFactory.jacksonFactory.createGenerator(writer);

		gen.writeStartObject();

		gen.writeArrayFieldStart("execution_vertices");
		int num = 0;
		for (AccessExecutionVertex vertex : jobVertex.getTaskVertices()) {
			final ExecutionState status = vertex.getExecutionState();
			
			TaskManagerLocation location = vertex.getCurrentAssignedResourceLocation();

			long startTime = vertex.getStateTimestamp(ExecutionState.DEPLOYING);
			if (startTime == 0) {
				startTime = -1;
			}
			long endTime = status.isTerminal() ? vertex.getStateTimestamp(status) : -1;
			long duration = startTime > 0 ? ((endTime > 0 ? endTime : now) - startTime) : 0;
			
			gen.writeStartObject();
			gen.writeNumberField("id", num);
			gen.writeStringField("name", vertex.getTaskNameWithSubtaskIndex());
			gen.writeStringField("status", status.name());
			gen.writeNumberField("start_time", startTime);
			gen.writeNumberField("stop_time", endTime);
			gen.writeNumberField("duration", duration);

			// TODO - get attempts from time line server
			int[] exeSummary = new int[ExecutionState.values().length];
			gen.writeObjectFieldStart("execution_summary");
			for (ExecutionState state : ExecutionState.values()) {
				gen.writeNumberField(state.name(), exeSummary[state.ordinal()]);
			}
			gen.writeEndObject();

			if (location != null) {
				gen.writeStringField("host", location.getHostname());
				gen.writeNumberField("port", location.dataPort());
			}

			// get metrics
			MetricHolder queueInCountHolder = new MetricHolder();
			MetricHolder queueOutCountHolder = new MetricHolder();
			MetricHolder queueInPerHolder = new MetricHolder();
			MetricHolder queueOutPerHolder = new MetricHolder();
			MetricHolder lagHolder = new MetricHolder();
			MetricHolder latencyHolder = new MetricHolder();
			MetricHolder delayHolder = new MetricHolder();
			MetricHolder recordsInCountHolder = new MetricHolder();
			MetricHolder recordsOutCountHolder = new MetricHolder();
			MetricHolder tpsHolder = new MetricHolder();

			IOMetrics ioMetrics = vertex.getCurrentExecutionAttempt().getIOMetrics();

			// execAttempt is already finished, use final metrics stored in ExecutionGraph
			if (ioMetrics != null) {
				recordsInCountHolder.update(ioMetrics.getNumRecordsIn());
				recordsOutCountHolder.update(ioMetrics.getNumRecordsOut());
				tpsHolder.update((float)ioMetrics.getNumRecordsInPerSecond());
			} else {
				// execAttempt is still running, use MetricQueryService instead
				fetcher.update();
				MetricStore.SubtaskMetricStore metrics =
					fetcher.getMetricStore().getSubtaskMetricStore(
						params.get("jobid"),
						jobVertex.getJobVertexId().toString(),
						vertex.getParallelSubtaskIndex());
				if (metrics != null) {
					recordsInCountHolder.update(Float.valueOf(metrics.getMetric("numRecordsIn", "0")));
					recordsOutCountHolder.update(Float.valueOf(metrics.getMetric("numRecordsOut", "0")));
					queueInCountHolder.update(Float.valueOf(metrics.getMetric("inputQueueLength", "0")));
					queueOutCountHolder.update(Float.valueOf(metrics.getMetric("outputQueueLength", "0")));
					queueInPerHolder.update(Float.valueOf(metrics.getMetric("inPoolUsage", "0")));
					queueOutPerHolder.update(Float.valueOf(metrics.getMetric("outPoolUsage", "0")));
					latencyHolder.update(Float.valueOf(metrics.getMetric("latency", "0")));
					tpsHolder.update(Float.valueOf(metrics.getMetric("numRecordsInPerSecond", "0")));
				}
			}

			gen.writeObjectFieldStart("metric_summary");
			gen.writeArrayFieldStart("metrics");
			queueInCountHolder.writeToJsonGenerator("queue_in_cnt", gen, MetricHolder.Field.VALUE);
			queueOutCountHolder.writeToJsonGenerator("queue_out_cnt", gen, MetricHolder.Field.VALUE);
			queueInPerHolder.writeToJsonGenerator("queue_in_per", gen, MetricHolder.Field.VALUE);
			queueOutPerHolder.writeToJsonGenerator("queue_out_per", gen, MetricHolder.Field.VALUE);
			lagHolder.writeToJsonGenerator("lag", gen, MetricHolder.Field.VALUE);
			latencyHolder.writeToJsonGenerator("latency", gen, MetricHolder.Field.VALUE);
			delayHolder.writeToJsonGenerator("delay", gen, MetricHolder.Field.VALUE);
			recordsInCountHolder.writeToJsonGenerator("num_records_in", gen, MetricHolder.Field.VALUE);
			recordsOutCountHolder.writeToJsonGenerator("num_records_out", gen, MetricHolder.Field.VALUE);
			tpsHolder.writeToJsonGenerator("tps", gen, MetricHolder.Field.VALUE);
			gen.writeEndArray();
			gen.writeEndObject();

			gen.writeEndObject();
			
			num++;
		}
		gen.writeEndArray();
		
		gen.writeEndObject();

		gen.close();

		return writer.toString();
	}
}
