package org.apache.flink.runtime.webmonitor.handlers;

import org.apache.flink.runtime.executiongraph.Execution;
import org.apache.flink.runtime.executiongraph.IOMetrics;
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
 * Test cases for {@link SubtaskExecutionAttemptMetricsHandler}
 */
public class SubtaskExecutionAttemptMetricsHandlerTest {
	@Test
	public void testHandler() throws Exception {
		ExecutionGraphHolder graphHolder = mock(ExecutionGraphHolder.class);
		MetricFetcher fetcher = mock(MetricFetcher.class);

		SubtaskExecutionAttemptMetricsHandler handler = new SubtaskExecutionAttemptMetricsHandler(graphHolder, fetcher);

		Execution execution = mock(Execution.class);
		when(execution.getParallelSubtaskIndex()).thenReturn(1);

		IOMetrics metrics = mock(IOMetrics.class);
		when(execution.getIOMetrics()).thenReturn(metrics);

		when(metrics.getNumRecordsIn()).thenReturn(111l);
		when(metrics.getNumRecordsOut()).thenReturn(111l);
		when(metrics.getNumRecordsInPerSecond()).thenReturn(111.0);

		MetricStore store = mock(MetricStore.class);
		when(fetcher.getMetricStore()).thenReturn(store);

		MetricStore.SubtaskMetricStore metricStore = new MetricStore.SubtaskMetricStore();
		metricStore.metrics.put("numRecordsInPerSecond", "1");

		when(store.getSubtaskMetricStore(anyString(), anyString(), anyInt())).thenReturn(metricStore);

		String response = handler.handleRequest(execution, Collections.<String, String>emptyMap());
		System.out.println(response);
	}
}
