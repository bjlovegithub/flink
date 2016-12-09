/**
 * Created by guowei on 15/12/10.
 */
var jobs_service = angular.module("JobService",["ngResource"]).constant('config',{web_root:'api'})


jobs_service.factory('Job',['$resource','config',
    function($resource,config){
       return {
           ExecutionJobVertices: $resource(config.web_root+"/jobs/:jobid/vertices"),
           JobVertexInfo: $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/info"),
           ExecutionJobVertexMetrics: $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/metrics"),
           ExecutionVertices: $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/execution_vertices"),
           ExecutionVertexMetrics:
               $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/metrics"),
           Executions:
               $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions"),
           ExecutionMetrics:
               $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions/:execution_id/metrics"),
           ExecutionLog:
               $resource(config.web_root+"/jobs/:jobid/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions/:execution_id/log"),
           Plan:  $resource(config.web_root+"/jobs/:jobid/plan"),
           Master: $resource(config.web_root+"/jobs/:jobid/master"),
           FailoverHistory: $resource(config.web_root+"/jobs/:jobid/failover-history"),
           Configure: $resource(config.web_root+"/jobs/:jobid/configuration"),
           About: $resource(config.web_root+"/jobs/:jobid/about"),
           Checkpoints: $resource(config.web_root+"/jobs/:jobid/checkpoints"),
           Summary: $resource(config.web_root+"/jobs/:jobid/summary"),
           Index: $resource(config.web_root+"/jobs")

       }
    }
])
