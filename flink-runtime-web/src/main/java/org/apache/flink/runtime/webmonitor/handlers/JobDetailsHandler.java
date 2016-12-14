/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.	See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *	   http://www.apache.org/licenses/LICENSE-2.0
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
import org.apache.flink.runtime.executiongraph.AccessExecutionGraph;
import org.apache.flink.runtime.executiongraph.AccessExecutionJobVertex;
import org.apache.flink.runtime.executiongraph.AccessExecutionVertex;
import org.apache.flink.runtime.executiongraph.IOMetrics;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricFetcher;
import org.apache.flink.runtime.webmonitor.metrics.MetricHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricStore;

import java.io.StringWriter;
import java.util.Map;

/**
 * Request handler that returns details about a job, including:
 * <ul>
 *	   <li>Dataflow plan</li>
 *	   <li>id, name, and current status</li>
 *	   <li>start time, end time, duration</li>
 *	   <li>number of job vertices in each state (pending, running, finished, failed)</li>
 *	   <li>info about job vertices, including runtime, status, I/O bytes and records, subtasks in each status</li>
 * </ul>
 */
public class JobDetailsHandler extends AbstractExecutionGraphRequestHandler {

	private final MetricFetcher fetcher;

	public JobDetailsHandler(ExecutionGraphHolder executionGraphHolder, MetricFetcher fetcher) {
		super(executionGraphHolder);
		this.fetcher = fetcher;
	}

	@Override
	public String handleRequest(AccessExecutionGraph graph, Map<String, String> params) throws Exception {
		final StringWriter writer = new StringWriter();
		final JsonGenerator gen = JsonFactory.jacksonFactory.createGenerator(writer);

		final long now = System.currentTimeMillis();
		
		gen.writeStartObject();
		
		// basic info
		gen.writeStringField("jid", graph.getJobID().toString());
		gen.writeStringField("name", graph.getJobName());
		gen.writeStringField("state", graph.getState().name());
		
		// job vertices
		gen.writeArrayFieldStart("job_vertices");

		for (AccessExecutionJobVertex ejv : graph.getVerticesTopologically()) {
			int[] tasksPerState = new int[ExecutionState.values().length];
			long startTime = Long.MAX_VALUE;
			long endTime = 0;
			boolean allFinished = true;
			
			for (AccessExecutionVertex vertex : ejv.getTaskVertices()) {
				final ExecutionState state = vertex.getExecutionState();
				tasksPerState[state.ordinal()]++;

				// take the earliest start time
				long started = vertex.getStateTimestamp(ExecutionState.DEPLOYING);
				if (started > 0) {
					startTime = Math.min(startTime, started);
				}
				
				allFinished &= state.isTerminal();
				endTime = Math.max(endTime, vertex.getStateTimestamp(state));
			}
			
			long duration;
			if (startTime < Long.MAX_VALUE) {
				if (allFinished) {
					duration = endTime - startTime;
				}
				else {
					endTime = -1L;
					duration = now - startTime;
				}
			}
			else {
				startTime = -1L;
				endTime = -1L;
				duration = -1L;
			}
			
			gen.writeStartObject();
			gen.writeStringField("id", ejv.getJobVertexId().toString());
			// TODO - get topology id
			gen.writeStringField("topology_id", "0");
			gen.writeStringField("name", ejv.getName());
			gen.writeNumberField("parallelism", ejv.getParallelism());
			gen.writeStringField("status", ejv.getAggregateState().name());

			gen.writeNumberField("start_time", startTime);
			gen.writeNumberField("stop_time", endTime);
			gen.writeNumberField("duration", duration);

			// write summary info for all subtasks.
			int[] subTaskPerState = new int[ExecutionState.values().length];
			
			for (AccessExecutionVertex vertex : ejv.getTaskVertices()) {
				ExecutionState state = vertex.getExecutionState();
				subTaskPerState[state.ordinal()]++;
			}

			gen.writeObjectFieldStart("execution_summary");
			for (ExecutionState state : ExecutionState.values()) {
				gen.writeNumberField(state.name(), subTaskPerState[state.ordinal()]);
			}
			gen.writeEndObject();
			
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

			for (AccessExecutionVertex vertex : ejv.getTaskVertices()) {
				IOMetrics ioMetrics = vertex.getCurrentExecutionAttempt().getIOMetrics();

				// execAttempt is already finished, use final metrics stored in ExecutionGraph
				if (ioMetrics != null) {
					recordsInCountHolder.update(ioMetrics.getNumRecordsIn());
					recordsOutCountHolder.update(ioMetrics.getNumRecordsOut());
					tpsHolder.update((float)ioMetrics.getNumRecordsInPerSecond());
				}
				else {
					// for running execution attempt
					fetcher.update();
					MetricStore.SubtaskMetricStore metrics = fetcher.getMetricStore().getSubtaskMetricStore(graph.getJobID().toString(), ejv.getJobVertexId().toString(), vertex.getParallelSubtaskIndex());
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
			}

			gen.writeObjectFieldStart("metric_summary");
			gen.writeArrayFieldStart("metrics");
			queueInCountHolder.writeToJsonGenerator("queue_in_cnt", gen, MetricHolder.Field.ALL);
			queueOutCountHolder.writeToJsonGenerator("queue_out_cnt", gen, MetricHolder.Field.ALL);
			queueInPerHolder.writeToJsonGenerator("queue_in_per", gen, MetricHolder.Field.ALL);
			queueOutPerHolder.writeToJsonGenerator("queue_out_per", gen, MetricHolder.Field.ALL);
			lagHolder.writeToJsonGenerator("lag", gen, MetricHolder.Field.ALL);
			latencyHolder.writeToJsonGenerator("latency", gen, MetricHolder.Field.ALL);
			delayHolder.writeToJsonGenerator("delay", gen, MetricHolder.Field.ALL);
			recordsInCountHolder.writeToJsonGenerator("num_records_in", gen, MetricHolder.Field.ALL);
			recordsOutCountHolder.writeToJsonGenerator("num_records_out", gen, MetricHolder.Field.ALL);
			tpsHolder.writeToJsonGenerator("tps", gen, MetricHolder.Field.ALL);
			gen.writeEndArray();
			gen.writeEndObject();
			
			gen.writeEndObject();
		}
		gen.writeEndArray();

		gen.writeEndObject();

		gen.close();
		return writer.toString();
	}
}
