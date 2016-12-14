/**
 * Created by guowei on 15/12/8.
 */
var executionJobVerticesController = angular.module('ExecutionJobVerticesController',[]);

executionJobVerticesController.controller('ExecutionJobVerticesController.layout',
    ['$scope','$stateParams','Job',function($scope,$stateParams,Job){
        Job.Summary.get({
            jobid: $stateParams.job_id
        }, function(result) {
            $scope.job_name = result.name;
        });
        $scope.job_id = $stateParams.job_id;
        $scope.topology_id = $stateParams.topology_id;
		$scope.job_vertex_id = $stateParams.vertex_id;
		$scope.job_vertex_name = $stateParams.vertex_name;
    }]);

executionJobVerticesController.controller('ExecutionJobVerticesController.overview',
    ['$scope','$stateParams','Job','BlinkMetricsBuilder','$rootScope', function($scope,$stateParams,Job,BlinkMetricsBuilder,$rootScope){
        $scope.refresh = function () {
            Job.ExecutionJobVertexSubtasks.get({
                    jobid: $stateParams.job_id,
                    vertexid: $stateParams.vertex_id
                },
                function (result) {
                    $scope.execution_vertices = result.execution_vertices;
                    if ($scope.execution_vertices_row_collection == undefined) {
                        $scope.execution_vertices_row_collection = [];
                    }
                    result.execution_vertices.forEach(function (execution_vertex, index, array) {
                        execution_vertex.blink_metric = BlinkMetricsBuilder.build(execution_vertex.metric_summary.metrics);

                        execution_vertex.id = parseInt(execution_vertex.id);
                        execution_vertex.latency = execution_vertex.blink_metric.latency('value');
                        execution_vertex.delay = execution_vertex.blink_metric.delay('value');
                        execution_vertex.in_queue_per = execution_vertex.blink_metric.in_queue('per_value');
                        execution_vertex.in_queue_cnt = execution_vertex.blink_metric.in_queue('cnt_value');
                        execution_vertex.out_queue_per = execution_vertex.blink_metric.out_queue('per_value');
                        execution_vertex.out_queue_cnt = execution_vertex.blink_metric.out_queue('cnt_value');
                        execution_vertex.tps = execution_vertex.blink_metric.tps('value');
                        execution_vertex.recv_cnt = execution_vertex.blink_metric.recv_cnt('value');
                        execution_vertex.send_cnt = execution_vertex.blink_metric.send_cnt('value');
                        execution_vertex.retry = execution_vertex.execution_summary.CANCELED + execution_vertex.execution_summary.FAILED;

                        $scope.execution_vertices_row_collection[index] = execution_vertex;
                    });
                    if ($scope.execution_vertices_displayed_collection == undefined) {
                        $scope.execution_vertices_displayed_collection = [].concat($scope.execution_vertices_row_collection);
                    }
                }
            )
        };

        $scope.refresh();
        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));
    }]);

executionJobVerticesController.controller('ExecutionJobVerticesController.metrics',
    ['$scope','$stateParams','Job','$rootScope',function($scope,$stateParams,Job,$rootScope){
        $scope.refresh = function() {
            Job.ExecutionJobVertexMetrics.get({
                    jobid: $stateParams.job_id,
                    vertexid: $stateParams.vertex_id
                },
                function (result) {
                    // group by metric group names
                    var group_map = {}
                    result.metrics.forEach(function(metric, index, array) {
                        if (group_map[metric.group] == undefined) {
                            group_map[metric.group] = []
                        }
                        group_map[metric.group].push(metric)
                    })

                    if ($scope.execution_job_vertex_metrics_row_collection == undefined) {
                        $scope.execution_job_vertex_metrics_row_collection = []
                    }
                    // sort each group
                    var sb = function(a,b){
                        var a_  = a.name + "..." + a.group
                        var b_  = b.name + "..." + b.group
                        if  (a_ > b_){
                            return 1;
                        }
                        if (a_ < b_){
                            return -1;
                        }
                        return 0;
                    }
                    for (var key in group_map) {
                        group_map[key].sort(sb)
                    }
                    $scope.group_map=group_map
                    $scope.itemsByPage = 100;
                })
        };

        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));

    }]
);

executionJobVerticesController.controller('ExecutionJobVerticesController.accumulators',
    ['$scope','$stateParams','Job','$rootScope',function($scope,$stateParams,Job,$rootScope){
        $scope.refresh = function() {
            Job.ExecutionJobVertexAccumulators.get({
                    jobid: $stateParams.job_id,
                    vertexid: $stateParams.vertex_id
                },
                function (result) {
                    $scope.accumulators=result.accumulators;
                })
        };

        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));

    }]
);

