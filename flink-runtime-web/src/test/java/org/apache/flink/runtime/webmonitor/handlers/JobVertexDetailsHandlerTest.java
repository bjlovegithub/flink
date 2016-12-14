package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.runtime.execution.ExecutionState;
import org.apache.flink.runtime.executiongraph.Execution;
import org.apache.flink.runtime.executiongraph.ExecutionJobVertex;
import org.apache.flink.runtime.executiongraph.ExecutionVertex;
import org.apache.flink.runtime.executiongraph.IOMetrics;
import org.apache.flink.runtime.jobgraph.JobVertexID;
import org.apache.flink.runtime.taskmanager.TaskManagerLocation;
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
 * Test cases for {@link JobDetailsHandler}
 */
public class JobVertexDetailsHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);
		MetricFetcher fetcher = mock(MetricFetcher.class);

		JobVertexDetailsHandler handler = new JobVertexDetailsHandler(graphHolder, fetcher);

		final ExecutionJobVertex jobVertex = mock(ExecutionJobVertex.class);
		ExecutionVertex vertex = mock(ExecutionVertex.class);
		ExecutionVertex[] vertices = new ExecutionVertex[1];
		vertices[0] = vertex;

		when(jobVertex.getTaskVertices()).thenReturn(vertices);

		TaskManagerLocation location = mock(TaskManagerLocation.class);
		when(vertex.getCurrentAssignedResourceLocation()).thenReturn(location);
		when(location.getHostname()).thenReturn("1.1.1.1");
		when(location.dataPort()).thenReturn(1111);
		when(vertex.getExecutionState()).thenReturn(ExecutionState.RUNNING);
		when(vertex.getTaskNameWithSubtaskIndex()).thenReturn("test task");

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

		when(jobVertex.getParallelism()).thenReturn(1);

		MetricStore store = mock(MetricStore.class);
		when(fetcher.getMetricStore()).thenReturn(store);

		MetricStore.SubtaskMetricStore metricStore = new MetricStore.SubtaskMetricStore();
		metricStore.metrics.put("numRecordsInPerSecond", "1");

		when(store.getSubtaskMetricStore(anyString(), anyString(), anyInt())).thenReturn(metricStore);

		String response = handler.handleRequest(jobVertex, Collections.<String, String>emptyMap());
		System.out.println(response);
	}
}
