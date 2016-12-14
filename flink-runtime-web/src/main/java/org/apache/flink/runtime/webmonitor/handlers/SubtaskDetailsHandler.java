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
import org.apache.flink.runtime.executiongraph.AccessExecution;
import org.apache.flink.runtime.executiongraph.AccessExecutionVertex;
import org.apache.flink.runtime.taskmanager.TaskManagerLocation;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;

import java.io.StringWriter;
import java.util.Map;

/**
 * Get details for current sub task(a.k.a {@link AccessExecutionVertex}, including all task attempts.
 */
public class SubtaskDetailsHandler extends AbstractSubtaskRequestHandler {
	
	public SubtaskDetailsHandler(ExecutionGraphHolder executionGraphHolder) {
		super(executionGraphHolder);
	}

	@Override
	public String handleRequest(AccessExecutionVertex vertex, Map<String, String> params) throws Exception {
		final long now = System.currentTimeMillis();

		StringWriter writer = new StringWriter();
		JsonGenerator gen = JsonFactory.jacksonFactory.createGenerator(writer);

		gen.writeStartObject();

		gen.writeArrayFieldStart("executions");

		final AccessExecution currentAttempt = vertex.getCurrentExecutionAttempt();
		if (currentAttempt != null) {
			gen.writeStartObject();
			
			gen.writeStringField("id", currentAttempt.getAttemptId().toString());

			gen.writeNumberField("attempt_number", currentAttempt.getAttemptNumber());

			ExecutionState status = currentAttempt.getState();
			gen.writeStringField("status", status.name());

			long startTime = currentAttempt.getStateTimestamp(ExecutionState.DEPLOYING);
			if (startTime == 0) {
				startTime = -1;
			}
			long endTime = status.isTerminal() ? currentAttempt.getStateTimestamp(status) : -1;
			long duration = startTime > 0 ? ((endTime > 0 ? endTime : now) - startTime) : 0;

			gen.writeNumberField("start_time", startTime);
			gen.writeNumberField("stop_time", endTime);
			gen.writeNumberField("duration", duration);

			TaskManagerLocation location = vertex.getCurrentAssignedResourceLocation();
			if (location != null) {
				gen.writeStringField("host", location.getHostname());
			}

			// todo - get container / message from timeline server

			gen.writeEndObject();
		}

		// TODO - get history attempts from timeline server

		gen.writeEndArray();
		gen.writeEndObject();

		gen.close();

		return writer.toString();
	}
}
