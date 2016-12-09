/**
 * Created by guowei on 15/12/10.
 */
var execution_job_vertex_name_service = angular.module("ExecutionJobVertexNameService",["JobService","MetricsService"]).constant('config',{web_root:'api'})

execution_job_vertex_name_service.factory('ExecutionJobVertexName',['Job','BlinkMetricsBuilder',function(Job,BlinkMetricsBuilder){
    return {
        call: function($scope,$stateParams){
            console.log($stateParams)
            Job.ExecutionVertices.get({
                    job_id: $stateParams.job_id,
                    execution_job_vertex_id: $stateParams.execution_job_vertex_id
                },
                function (result) {
                    $scope.execution_vertices = result.execution_vertices;
                    if ($scope.execution_vertices_row_collection == undefined) {
                        $scope.execution_vertices_row_collection = [];
                    }
                    result.execution_vertices.forEach(function (execution_vertex, index, array) {
                        execution_vertex.blink_metric =
                            BlinkMetricsBuilder.build(execution_vertex.metric_summary.metrics)
                        $scope.execution_vertices_row_collection[index]=execution_vertex;
                        $scope.execution_job_vertex_name = execution_vertex.name
                        console.log($scope.execution_job_vertex_name)
                    })
                })
        }
    }
}])
