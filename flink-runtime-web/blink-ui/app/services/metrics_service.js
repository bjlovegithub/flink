
function BlinkMetric(metrics) {
    var _t = {};
    metrics.forEach(function(metric){
        _t[metric.name]={value: metric.value,description: metric.description}
    });
    this.metrics_dict = _t;
    this.metrics_array = metrics;
}

BlinkMetric.prototype.recv_cnt = function(tag) {
    var num = this.get_metric("num_records_in_" + tag);
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else {
        return parseInt(num.value);
    }
};

BlinkMetric.prototype.send_cnt = function(tag) {
    var num = this.get_metric("num_records_out_" + tag);
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else {
        return parseInt(num.value);
    }
};

BlinkMetric.prototype.tps = function(tag) {
    var num = this.get_metric("tps_" + tag);
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else {
        return parseInt(num.value);
    }
};

BlinkMetric.prototype.latency = function(tag) {
    var num = this.get_metric("latency_" + tag);
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else {
        var ret = parseFloat(num.value);
        return ret;
    }
};

BlinkMetric.prototype.delay = function(tag) {
    var num = this.get_metric("lag_" + tag);
    if (typeof(num) === 'undefined') {
        num = this.get_metric("delay_" + tag);
    }
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else {
        return parseFloat(num.value);
    }
};

BlinkMetric.prototype.in_queue = function(tag) {
    var num = this.get_metric("queue_in_" + tag);
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else if (tag.substr(0, 3) == "cnt") {
        return parseInt(num.value);
    } else {
        return (parseFloat(num.value) * 100);
    }
};

BlinkMetric.prototype.out_queue = function(tag) {
    var num = this.get_metric("queue_out_" + tag);
    if (typeof(num) === 'undefined') {
        return "n/a";
    } else if (tag.substr(0, 3) == "cnt") {
        return parseInt(num.value);
    } else {
        return (parseFloat(num.value) * 100);
    }
};

BlinkMetric.prototype.get_metric = function(name) {
    return this.metrics_dict[name];
};

var metrics_service = angular.module("MetricsService",[]);

metrics_service.factory("BlinkMetricsBuilder",[function()
{
    return {
        build: function(metrics){
            return new BlinkMetric(metrics)
        }
    }
}]);


