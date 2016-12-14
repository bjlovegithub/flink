package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.runtime.execution.ExecutionState;
import org.apache.flink.runtime.executiongraph.Execution;
import org.apache.flink.runtime.executiongraph.ExecutionAttemptID;
import org.apache.flink.runtime.executiongraph.ExecutionVertex;
import org.apache.flink.runtime.taskmanager.TaskManagerLocation;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.junit.Test;

import java.util.Collections;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Test cases for {@link SubtaskDetailsHandler}
 */
public class SubtaskDetailsHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);

		SubtaskDetailsHandler handler = new SubtaskDetailsHandler(graphHolder);

		ExecutionVertex vertex = mock(ExecutionVertex.class);
		Execution execution = mock(Execution.class);		

		when(vertex.getCurrentExecutionAttempt()).thenReturn(execution);
		when(execution.getAttemptId()).thenReturn(new ExecutionAttemptID());
		when(execution.getState()).thenReturn(ExecutionState.RUNNING);
		when(execution.getStateTimestamp(any(ExecutionState.class))).thenReturn(0l);

		TaskManagerLocation location = mock(TaskManagerLocation.class);
		when(vertex.getCurrentAssignedResourceLocation()).thenReturn(location);
		when(location.getHostname()).thenReturn("1.1.1.1");
		when(location.dataPort()).thenReturn(1111);

		String response = handler.handleRequest(vertex, Collections.<String, String>emptyMap());
		System.out.println(response);
	}
}
