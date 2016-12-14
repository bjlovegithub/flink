package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.runtime.executiongraph.Execution;
import org.apache.flink.runtime.executiongraph.ExecutionJobVertex;
import org.apache.flink.runtime.executiongraph.ExecutionVertex;
import org.apache.flink.runtime.executiongraph.IOMetrics;
import org.apache.flink.runtime.jobgraph.JobVertexID;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.apache.flink.runtime.webmonitor.metrics.MetricFetcher;
import org.apache.flink.runtime.webmonitor.metrics.MetricStore;
import org.junit.Test;

import java.util.Collections;

import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Test cases for {@link JobVertexMetricsHandler}
 */
public class JobVertexMetricsHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);
		MetricFetcher fetcher = mock(MetricFetcher.class);

		JobVertexMetricsHandler handler = new JobVertexMetricsHandler(graphHolder, fetcher);

		final ExecutionJobVertex jobVertex = mock(ExecutionJobVertex.class);
		ExecutionVertex vertex1 = mock(ExecutionVertex.class);
		ExecutionVertex vertex2 = mock(ExecutionVertex.class);
		ExecutionVertex[] vertices = new ExecutionVertex[2];
		vertices[0] = vertex1;
		vertices[1] = vertex2;

		when(jobVertex.getTaskVertices()).thenReturn(vertices);
		when(jobVertex.getJobVertexId()).thenReturn(new JobVertexID());

		Execution execution1 = mock(Execution.class);
		Execution execution2 = mock(Execution.class);
		when(vertex1.getCurrentExecutionAttempt()).thenReturn(execution1);
		when(vertex2.getCurrentExecutionAttempt()).thenReturn(execution2);

		IOMetrics metrics = mock(IOMetrics.class);
		when(execution1.getIOMetrics()).thenReturn(metrics);
		when(execution2.getIOMetrics()).thenReturn(null);

		when(metrics.getNumRecordsIn()).thenReturn(111l);
		when(metrics.getNumRecordsOut()).thenReturn(111l);
		when(metrics.getNumRecordsInPerSecond()).thenReturn(111.0);

		when(jobVertex.getParallelism()).thenReturn(2);

		MetricStore store = mock(MetricStore.class);
		when(fetcher.getMetricStore()).thenReturn(store);

		MetricStore.SubtaskMetricStore metricStore = new MetricStore.SubtaskMetricStore();
		metricStore.metrics.put("numRecordsInPerSecond", "1");
		metricStore.metrics.put("numRecordsIn", "6");

		when(store.getSubtaskMetricStore(anyString(), anyString(), anyInt())).thenReturn(metricStore);

		String response = handler.handleRequest(jobVertex, Collections.<String, String>emptyMap());
		System.out.println(response);
	}
}
