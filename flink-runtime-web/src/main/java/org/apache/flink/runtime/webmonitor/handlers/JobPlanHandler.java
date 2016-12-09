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

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.flink.runtime.executiongraph.AccessExecutionGraph;
import org.apache.flink.runtime.executiongraph.AccessExecutionJobVertex;
import org.apache.flink.runtime.jobgraph.JobVertexID;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricFetcher;
import org.apache.flink.runtime.webmonitor.metrics.MetricStore;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.Map;

/**
 * Request handler that returns the JSON program plan of a job graph.
 */
public class JobPlanHandler extends AbstractExecutionGraphRequestHandler {

	private final MetricFetcher fetcher;

	
	public JobPlanHandler(ExecutionGraphHolder executionGraphHolder, MetricFetcher fetcher) {
		super(executionGraphHolder);

		this.fetcher = fetcher;
	}

	/**
	 * Get metrics from {@link MetricFetcher} and add them into plan json.
	 *
	 * @param json Graph JSON from {@link AccessExecutionGraph#getJsonPlan()}
	 * @return A JSON String.
     */
	private String addMetricInfo(String json, String jobId, AccessExecutionGraph graph) throws IOException {
		final JsonFactory factory = new JsonFactory();

		final StringWriter writer = new StringWriter(1024);

		final JsonGenerator gen = factory.createGenerator(writer);

		gen.writeStartObject();

		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode rootNode = objectMapper.readTree(json);

		Iterator<Map.Entry<String, JsonNode>> iterator = rootNode.fields();

		while (iterator.hasNext()) {
			Map.Entry<String, JsonNode> entry = iterator.next();

			if (entry.getKey().equals("nodes")) {
				// visit each node
				Iterator<JsonNode> arrayIterator = entry.getValue().elements();

				if (arrayIterator.hasNext()) {
					fetcher.update();
				}

				gen.writeArrayFieldStart("nodes");

				while (arrayIterator.hasNext()) {
					JsonNode nodeMap = arrayIterator.next();

					String vertexId = nodeMap.get("id").asText();

					AccessExecutionJobVertex jobVertex = graph.getAllVertices().get(JobVertexID.fromHexString(vertexId));

					// get the metrics for the current execution job vertex
					float delay = 0.0f;
					float latency = 0.0f;
					float tps = 0.0f;
					float vcore = 0.0f;
					float memory = 0.0f;

					for (int subTaskId = 0; subTaskId < jobVertex.getParallelism(); ++subTaskId){

						MetricStore.SubtaskMetricStore store = fetcher.getMetricStore().getSubtaskMetricStore(jobId, vertexId, subTaskId);

						if (store != null) {
							latency += Float.valueOf(store.getMetric("latency", "0"));
							tps += Float.valueOf(store.getMetric("numRecordsInPerSecond", "0"));
						}
					}

					((ObjectNode)nodeMap).put("vcore", vcore);
					((ObjectNode)nodeMap).put("memory", memory);
					((ObjectNode)nodeMap).put("delay", delay);
					((ObjectNode)nodeMap).put("latency", latency);
					((ObjectNode)nodeMap).put("tps", tps);
					((ObjectNode)nodeMap).put("topology_id", "0");

					gen.writeRaw(nodeMap.toString());

					if (arrayIterator.hasNext()) {
						gen.writeRaw(',');
					}
				}

				gen.writeEndArray();
			}
			else {
				System.out.println("write: "+entry);
				gen.writeStringField(entry.getKey(), entry.getValue().asText());
			}
		}

		gen.writeEndObject();

		gen.close();

		return writer.toString();
	}

	@Override
	public String handleRequest(AccessExecutionGraph graph, Map<String, String> params) throws Exception {
		return addMetricInfo(graph.getJsonPlan(), params.get("jobid"), graph);
	}
}
