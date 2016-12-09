/**
 * Created by guowei on 15/12/10.
 */
var executions_controller = angular.module('ExecutionsController',[]);

executions_controller.controller('ExecutionsController.layout',
    ['$scope','$stateParams','Job',function($scope,$stateParams,Job){
        Job.JobVertexInfo.get({
            job_id: $stateParams.job_id,
            execution_job_vertex_id: $stateParams.execution_job_vertex_id
        }, function(result) {
            $scope.job_name = result.job_name;
            $scope.job_vertex_name = result.job_vertex_name;
            $scope.job_vertex_index = result.job_vertex_index;
        });
        $scope.job_id = $stateParams.job_id;
        $scope.job_vertex_id = $stateParams.execution_job_vertex_id;
        $scope.execution_vertex_id = $stateParams.execution_vertex_id;
        $scope.execution_id = $stateParams.execution_id;
    }]);

executions_controller.controller('ExecutionsController.metrics',
    ['$scope','$stateParams','Job','$rootScope',function($scope,$stateParams,Job,$rootScope){
        $scope.itemsByPage = 100;

        $scope.refresh = function() {
            Job.ExecutionMetrics.get({
                    job_id: $stateParams.job_id,
                    execution_job_vertex_id: $stateParams.execution_job_vertex_id,
                    execution_vertex_id: $stateParams.execution_vertex_id,
                    execution_id: $stateParams.execution_id
                }, function (result) {
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

executions_controller.controller('ExecutionsController.log',
    ['$scope','$stateParams','Job',function($scope,$stateParams,Job){
        Job.ExecutionLog.get(
            {job_id: $stateParams.job_id,
                execution_job_vertex_id: $stateParams.execution_job_vertex_id,
                execution_vertex_id: $stateParams.execution_vertex_id,
                execution_id: $stateParams.execution_id
            },function(result){
                $scope.execution_log_url = result.url
            })
    }]
);