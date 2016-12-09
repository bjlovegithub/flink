package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.runtime.executiongraph.ExecutionGraph;
import org.apache.flink.runtime.executiongraph.ExecutionJobVertex;
import org.apache.flink.runtime.jobgraph.JobVertexID;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricFetcher;
import org.apache.flink.runtime.webmonitor.metrics.MetricStore;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Test cases for {@link JobPlanHandler}
 */
public class PlanHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);
		MetricFetcher fetcher = mock(MetricFetcher.class);

		JobPlanHandler handler = new JobPlanHandler(graphHolder, fetcher);

		ExecutionGraph graph = mock(ExecutionGraph.class);

		ExecutionJobVertex jobVertex = mock(ExecutionJobVertex.class);
		when(jobVertex.getParallelism()).thenReturn(1);

		Map<JobVertexID, ExecutionJobVertex> vertexMap = new HashMap<>();
		vertexMap.put(JobVertexID.fromHexString("e0c2ef4b6dbb44ed9c33c168f57be73d"), jobVertex);
		vertexMap.put(JobVertexID.fromHexString("1d0d2e8d48049291d53be1107285639d"), jobVertex);

		when(graph.getAllVertices()).thenReturn(vertexMap);

		MetricStore store = mock(MetricStore.class);
		when(fetcher.getMetricStore()).thenReturn(store);

		MetricStore.SubtaskMetricStore metricStore = new MetricStore.SubtaskMetricStore();
		metricStore.metrics.put("numRecordsInPerSecond", "1");

		when(store.getSubtaskMetricStore(anyString(), anyString(), anyInt())).thenReturn(metricStore);


		when(graph.getJsonPlan()).thenReturn("{\"jid\":\"227a6c336c3addfba5b38892c83d3d3c\",\"name\":\"Async I/O Example\",\"nodes\":[{\"id\":\"e0c2ef4b6dbb44ed9c33c168f57be73d\",\"parallelism\":1,\"operator\":\"\",\"operator_strategy\":\"\",\"description\":\"Keyed Aggregation -&gt; Sink: Unnamed\",\"inputs\":[{\"num\":0,\"id\":\"1d0d2e8d48049291d53be1107285639d\",\"ship_strategy\":\"HASH\",\"exchange\":\"pipelined\"}],\"optimizer_properties\":{}},{\"id\":\"1d0d2e8d48049291d53be1107285639d\",\"parallelism\":1,\"operator\":\"\",\"operator_strategy\":\"\",\"description\":\"Source: Custom Source -&gt; async wait operator -&gt; Flat Map\",\"optimizer_properties\":{}}]}");


		String response = handler.handleRequest(graph, Collections.<String, String>emptyMap());

		// Expecting empty response
		assertEquals("{\"jid\":\"227a6c336c3addfba5b38892c83d3d3c\",\"name\":\"Async I/O Example\",\"nodes\":[{\"id\":\"e0c2ef4b6dbb44ed9c33c168f57be73d\",\"parallelism\":1,\"operator\":\"\",\"operator_strategy\":\"\",\"description\":\"Keyed Aggregation -&gt; Sink: Unnamed\",\"inputs\":[{\"num\":0,\"id\":\"1d0d2e8d48049291d53be1107285639d\",\"ship_strategy\":\"HASH\",\"exchange\":\"pipelined\"}],\"optimizer_properties\":{},\"vcore\":0.0,\"memory\":0.0,\"delay\":0.0,\"latency\":0.0,\"tps\":1.0,\"topology_id\":\"0\"},{\"id\":\"1d0d2e8d48049291d53be1107285639d\",\"parallelism\":1,\"operator\":\"\",\"operator_strategy\":\"\",\"description\":\"Source: Custom Source -&gt; async wait operator -&gt; Flat Map\",\"optimizer_properties\":{},\"vcore\":0.0,\"memory\":0.0,\"delay\":0.0,\"latency\":0.0,\"tps\":1.0,\"topology_id\":\"0\"}]}", response);
	}
}
