package org.apache.flink.runtime.webmonitor.metrics;


import com.fasterxml.jackson.core.JsonGenerator;

import java.io.IOException;

/**
 * Hold min/max/avg/count/sum for input metrics.
 */
public class MetricHolder {
	private float min;
	private float max;
	private float sum;
	private int count;
	private float avg;
	private float value;

	public MetricHolder() {
		min = Float.MAX_VALUE;
		max = sum = avg = value = 0.0f;
		count = 0;
	}

	public void update(float value) {
		min = min < value ? min : value;
		max = max > value ? max : value;
		sum += value;
		count += 1;
		avg = sum/count;

		this.value = value;
	}

	public void writeToJsonGenerator(String prefix, JsonGenerator gen, Field field) throws IOException {
		if (min == Float.MAX_VALUE) {
			min = 0.0f;
		}

		switch (field) {
			case VALUE:
				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_value");
				gen.writeNumberField("value", value);
				gen.writeEndObject();

				break;

			case SUM:
				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_sum");
				gen.writeNumberField("value", sum);
				gen.writeEndObject();

				break;

			default:
				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_value");
				gen.writeNumberField("value", value);
				gen.writeEndObject();

				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_min");
				gen.writeNumberField("value", min);
				gen.writeEndObject();

				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_max");
				gen.writeNumberField("value", max);
				gen.writeEndObject();

				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_sum");
				gen.writeNumberField("value", sum);
				gen.writeEndObject();


				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_avg");
				gen.writeNumberField("value", avg);
				gen.writeEndObject();

				gen.writeStartObject();
				gen.writeStringField("name", prefix + "_cnt");
				gen.writeNumberField("value", count);
				gen.writeEndObject();
		}
	}

	public enum Field {ALL, VALUE, SUM};
}
