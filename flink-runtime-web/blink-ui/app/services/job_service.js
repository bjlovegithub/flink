/**
 * Created by guowei on 15/12/10.
 */
var jobs_service = angular.module("JobService",["ngResource"]).constant('config',{web_root:'api'})


jobs_service.factory('Job',['$resource','config',
    function($resource,config){
       return {
           Index: $resource(config.web_root+"/jobs"),

		   // apis for job overview page
		   // get summary info for current job
           Summary: $resource(config.web_root+"/jobs/:jobid/summary"),
		   // get job plan
           Plan:  $resource(config.web_root+"/jobs/:jobid/plan"),
		   // get the summary info for each execution job vertex
           ExecutionJobVertices: $resource(config.web_root+"/jobs/:jobid/vertices"),

		   // apis for execution job vertex
		   // get info for all subtasks belonging to current execution job vertex
           ExecutionJobVertexSubtasks: $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks"),
		   // get the aggregated metrics and accumulators for current execution job vertex
           ExecutionJobVertexMetrics: $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/metrics"),
		   ExecutionJobVertexAccumulators: $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/accumulators"),

		   // apis for execution vertex(sub task)
		   // get all executions(attempts) for current execution vertex
           Executions: $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid"),
		   // get aggregated metrics and accumulators for current execution vertex(all attempts)
           ExecutionVertexMetrics: $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/metrics"),
		   ExecutionVertexAccumulators: $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/accumulators"),
		   // apis for execution attempts
           ExecutionMetrics:
               $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/metrics"),
           ExecutionAccumulators:
               $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/accumulators"),
           ExecutionLog:
               $resource(config.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/log"),


		   // apis for job manager
           Master: $resource(config.web_root+"/jobs/:jobid/master"),
           FailoverHistory: $resource(config.web_root+"/jobs/:jobid/failover-history"),

		   // apis for misc
           Configure: $resource(config.web_root+"/jobs/:jobid/configuration"),
           About: $resource(config.web_root+"/jobs/:jobid/about"),

		   // apis for checkpoints
           Checkpoints: $resource(config.web_root+"/jobs/:jobid/checkpoints")
       }
    }
])
