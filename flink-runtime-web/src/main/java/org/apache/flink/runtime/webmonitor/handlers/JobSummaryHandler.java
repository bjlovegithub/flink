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
import org.apache.flink.runtime.executiongraph.AccessExecutionGraph;
import org.apache.flink.runtime.executiongraph.AccessExecutionJobVertex;
import org.apache.flink.runtime.executiongraph.AccessExecutionVertex;
import org.apache.flink.runtime.jobgraph.JobStatus;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;

import java.io.StringWriter;
import java.util.Map;

public class JobSummaryHandler extends AbstractExecutionGraphRequestHandler {
	public JobSummaryHandler(ExecutionGraphHolder executionGraphHolder) {
		super(executionGraphHolder);
	}

	@Override
	public String handleRequest(AccessExecutionGraph graph, Map<String, String> params) throws Exception {
		final StringWriter writer = new StringWriter();
		final JsonGenerator gen = JsonFactory.jacksonFactory.createGenerator(writer);

		final long now = System.currentTimeMillis();

		gen.writeStartObject();

		// basic info
		gen.writeStringField("id", graph.getJobID().toString());
		gen.writeStringField("name", graph.getJobName());
		gen.writeBooleanField("isStoppable", graph.isStoppable());
		gen.writeStringField("status", graph.getState().name());

		// times and duration
		final long jobStartTime = graph.getStatusTimestamp(JobStatus.CREATED);
		final long jobEndTime = graph.getState().isGloballyTerminalState() ?
			graph.getStatusTimestamp(graph.getState()) : -1L;
		gen.writeNumberField("start_time", jobStartTime);
		gen.writeNumberField("stop_time", jobEndTime);
		gen.writeNumberField("duration", (jobEndTime > 0 ? jobEndTime : now) - jobStartTime);
		gen.writeNumberField("now", now);
		gen.writeNumberField("vertices", graph.getAllVertices().size());

		// get the number of tasks in different status and cpu/memory usage
		int[] jobVerticesPerState = new int[ExecutionState.values().length];

		int vcore, memory;
		vcore = 0;
		memory = 0;

		for (AccessExecutionJobVertex ejv : graph.getVerticesTopologically()) {
			for (AccessExecutionVertex vertex : ejv.getTaskVertices()) {
				final ExecutionState state = vertex.getExecutionState();

				jobVerticesPerState[state.ordinal()]++;

				// TODO - Get cpu/memory info
			}
		}

		for (ExecutionState state : ExecutionState.values()) {
			gen.writeNumberField(state.name(), jobVerticesPerState[state.ordinal()]);
		}

		gen.writeNumberField("vcore_total", vcore);
		gen.writeNumberField("memory_total", memory);

		gen.writeEndObject();

		gen.close();
		return writer.toString();
	}
}
