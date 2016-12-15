package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.api.common.ArchivedExecutionConfig;
import org.apache.flink.runtime.executiongraph.ExecutionGraph;
import org.apache.flink.runtime.webmonitor.ExecutionGraphHolder;
import org.junit.Test;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Test cases for {@link JobConfigHandler}
 */
public class JobConfigHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);

		JobConfigHandler handler = new JobConfigHandler(graphHolder);

		ExecutionGraph graph = mock(ExecutionGraph.class);
		ArchivedExecutionConfig  config = mock(ArchivedExecutionConfig.class);
		when(graph.getArchivedExecutionConfig()).thenReturn(config);
		when(config.getExecutionMode()).thenReturn("test-mode");
		when(config.getRestartStrategyDescription()).thenReturn("test");
		when(config.getParallelism()).thenReturn(6);
		when(config.getObjectReuseEnabled()).thenReturn(true);

		Map<String, String> map = new HashMap<>();
		map.put("key", "value");
		when(config.getGlobalJobParameters()).thenReturn(map);

		String response = handler.handleRequest(graph, Collections.<String, String>emptyMap());
		System.out.println(response);
	}
}
