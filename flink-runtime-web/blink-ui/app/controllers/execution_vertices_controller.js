/**
 * Created by guowei on 15/12/8.
 */
var execution_vertices_controller = angular.module('ExecutionVerticesController',[]);

execution_vertices_controller.controller('ExecutionVerticesController.layout',
    ['$scope','$stateParams','Job',function($scope,$stateParams,Job){
        Job.Summary.get({
            jobid: $stateParams.job_id,
        }, function(result) {
            $scope.job_name = result.job_name;
        });
        $scope.job_id = $stateParams.job_id;
		// execution job vertex id
        $scope.vertex_id = $stateParams.vertex_id;
		// sub task id in the current execution job vertex
        $scope.subtask_id = $stateParams.subtask_id;
		// name of execution job vertex
		$scope.vertex_name = $stateParams.vertex_name;
		$scope.topology_id = $stateParams.topology_id;
		console.log($stateParams);
    }]);

execution_vertices_controller.controller('ExecutionVerticesController.overview',
    ['$scope','$stateParams','Job','BlinkMetricsBuilder','$rootScope',function($scope,$stateParams,Job,BlinkMetricsBuilder,$rootScope){

        $scope.refresh = function() {
            console.log("Get executions of execution vertex (" +
                $stateParams.job_id + ", " +
                $stateParams.vertex_id + ", " +
                $stateParams.subtask_id + ")");

            Job.Executions.get({
                jobid: $stateParams.job_id,
                vertexid: $stateParams.vertex_id,
                subtaskid: $stateParams.subtask_id
            }, function (result) {
                if ($scope.executions_row_collection == undefined) {
                    $scope.executions_row_collection = [];
                }

                result.executions.forEach(function (execution, index, array) {
                    $scope.executions_row_collection[index] = execution;
                    $scope.total += 1;
                });

                if ($scope.executions_displayed_collection == undefined) {
                    $scope.executions_displayed_collection = [].concat($scope.executions_row_collection);
                }
            });
        };
        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));
    }]);

execution_vertices_controller.controller('ExecutionVerticesController.metrics',
    ['$scope','$stateParams','Job','$rootScope',function($scope,$stateParams,Job,$rootScope) {
        $scope.itemsByPage = 100;

        $scope.refresh = function() {
            Job.ExecutionVertexMetrics.get({
                jobid: $stateParams.job_id,
                vertexid: $stateParams.vertex_id,
                subtaskid: $stateParams.subtask_id
            }, function (result) {
                // group by metric group names
                var group_map = {}
                result.metrics.forEach(function (metric, index, array) {
                    if (group_map[metric.group] == undefined) {
                        group_map[metric.group] = []
                    }
                    group_map[metric.group].push(metric)
                })

                if ($scope.execution_job_vertex_metrics_row_collection == undefined) {
                    $scope.execution_job_vertex_metrics_row_collection = []
                }
                // sort each group
                var sb = function (a, b) {
                    var a_ = a.name + "..." + a.group
                    var b_ = b.name + "..." + b.group
                    if (a_ > b_) {
                        return 1;
                    }
                    if (a_ < b_) {
                        return -1;
                    }
                    return 0;
                };

                for (var key in group_map) {
                    group_map[key].sort(sb)
                }
                $scope.group_map = group_map
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


execution_vertices_controller.controller('ExecutionVerticesController.accumulators',
    ['$scope','$stateParams','Job','$rootScope',function($scope,$stateParams,Job,$rootScope) {
        $scope.itemsByPage = 100;

        $scope.refresh = function() {
            Job.ExecutionVertexAccumulators.get({
                jobid: $stateParams.job_id,
                vertexid: $stateParams.vertex_id,
                subtaskid: $stateParams.subtask_id
            }, function (result) {
                $scope.result = result.accumulators;
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
