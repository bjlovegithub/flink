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
import org.apache.flink.api.common.ArchivedExecutionConfig;
import org.apache.flink.runtime.executiongraph.AccessExecutionGraph;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;

import java.io.StringWriter;
import java.util.Map;

/**
 * Request handler that returns the execution config of a job.
 */
public class JobConfigHandler extends AbstractExecutionGraphRequestHandler {

	public JobConfigHandler(ExecutionGraphHolder executionGraphHolder) {
		super(executionGraphHolder);
	}

	@Override
	public String handleRequest(AccessExecutionGraph graph, Map<String, String> params) throws Exception {

		StringWriter writer = new StringWriter();
		JsonGenerator gen = JsonFactory.jacksonFactory.createGenerator(writer);

		gen.writeStartObject();

		gen.writeArrayFieldStart("configs");

		final ArchivedExecutionConfig summary = graph.getArchivedExecutionConfig();

		if (summary != null) {
			gen.writeStartObject();
			gen.writeStringField("name", "execution-mode");
			gen.writeStringField("value", summary.getExecutionMode());
			gen.writeEndObject();

			gen.writeStartObject();
			gen.writeStringField("name", "restart-strategy");
			gen.writeStringField("value", summary.getRestartStrategyDescription());
			gen.writeEndObject();

			gen.writeStartObject();
			gen.writeStringField("name", "job-parallelism");
			gen.writeNumberField("value", summary.getParallelism());
			gen.writeEndObject();

			gen.writeStartObject();
			gen.writeStringField("name", "object-reuse-mode");
			gen.writeBooleanField("value", summary.getObjectReuseEnabled());
			gen.writeEndObject();

			Map<String, String> ucVals = summary.getGlobalJobParameters();
			if (ucVals != null) {
				for (Map.Entry<String, String> ucVal : ucVals.entrySet()) {
					gen.writeStartObject();
					gen.writeStringField("name", ucVal.getKey());
					gen.writeStringField("value", ucVal.getValue());
					gen.writeEndObject();
				}
			}
		}

		gen.writeEndArray();
		
		gen.writeEndObject();
		
		gen.close();
		
		return writer.toString();
	}
}
