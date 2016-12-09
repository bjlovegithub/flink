'use strict'
var blinkJobMasterApp= angular.module('blinkJobMasterApp',[
    'ui.router',
    'ui.bootstrap',
    'JobsController',
    'ExecutionJobVerticesController',
    'ExecutionVerticesController',
    'ExecutionsController',
    'JobService',
    'PlanService',
    'smart-table',
    'MetricsService',
    'JobNameService',
    'ExecutionJobVertexNameService',
    'angularUtils.directives.dirPagination'
]);



blinkJobMasterApp.config(['$urlRouterProvider','$stateProvider',
    function($urlRouterProvider,$stateProvider) {
        $urlRouterProvider.otherwise("main")
        $stateProvider.state('main',{
            url:'/main',
            templateUrl: 'views/jobs/layout.html',
            controller: 'JobsController.index'
        })
        .state('job', {
            url:'/jobs/:jobid',
            templateUrl: 'views/jobs/layout.html',
            controller: 'JobsController.show'
        })
        .state('job.overview',{
            abstract: true,
            templateUrl: 'views/jobs/overview.html',
        })
        .state('job.overview.sub',{
            url:'/overview',
            views:{
                "title":{
                    templateUrl:"views/jobs/title.html",
                    controller:"JobsController.title"
                },
                "summary":{
                    templateUrl:"views/jobs/summary.html",
                    controller:"JobsController.summary"
                },
                "ejvs":{
                    templateUrl:"views/jobs/ejvs.html",
                    controller: 'JobsController.ejvs'

                },
                "plan":{
                    templateUrl:"views/jobs/plan.html",
                    controller:"JobsController.plan"
                }
            }
        })
        .state('job.master',{
            url: '/master',
            templateUrl: 'views/master/layout.html',
            controller: 'JobsController.master_layout'
        })
        .state('job.master.overview',{
            url: '/log',
            templateUrl: 'views/master/overview.html',
            controller: 'JobsController.master_overview'
        })
        .state('job.master.failover_histories',{
            url: '/failover_histories',
            templateUrl: 'views/master/failover_history.html',
            controller: 'JobsController.failover_histories'
        })
        .state('job.about',{
            url: '/about',
            templateUrl: 'views/jobs/about.html',
            controller: 'JobsController.about'
        })
        .state('job.checkpoints',{
                    url: '/checkpoints',
                    templateUrl: 'views/jobs/checkpoints.html',
                    controller: 'JobsController.checkpoints'
        })
        .state('job.configure',{
            url: '/configure',
            templateUrl: 'views/jobs/configure.html',
            controller: "JobsController.configure"
        })
        .state('job.execution_job_vertex',{
            url: '/execution_job_vertices/:execution_job_vertex_id',
            templateUrl: "views/execution_job_vertices/layout.html",
            controller: "ExecutionJobVerticesController.layout"
        })
        .state('job.execution_job_vertex.overview',{
            url: '/overview',
            templateUrl: "views/execution_job_vertices/overview.html",
            controller: "ExecutionJobVerticesController.overview"
        })
        .state('job.execution_job_vertex.metrics',{
            url: '/metrics',
            templateUrl: "views/execution_job_vertices/metrics.html",
            controller: "ExecutionJobVerticesController.metrics"
        })
        .state('job.execution_vertex',{
            url: '/execution_job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id',
            templateUrl: "views/execution_vertices/layout.html",
            controller: "ExecutionVerticesController.layout"

        })
        .state('job.execution_vertex.overview',{
            url: '/overview',
            templateUrl: "views/execution_vertices/overview.html",
            controller: "ExecutionVerticesController.overview",

        })
        .state("job.execution_vertex.metrics",{
            url: '/metrics',
            templateUrl: "views/execution_vertices/metrics.html",
            controller: "ExecutionVerticesController.metrics"
        })
        .state('job.execution',{
            url: '/execution_job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions/:execution_id',
            templateUrl: "views/executions/layout.html",
            controller: "ExecutionsController.layout"
        })
        .state('job.execution.metrics',{
            url: '/metrics',
            templateUrl: "views/executions/metrics.html",
            controller: "ExecutionsController.metrics"
        })
        .state('job.execution.log',{
            url: '/log',
            templateUrl: "views/executions/log.html",
            controller: "ExecutionsController.log"
        });
}]);

blinkJobMasterApp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart',
                   function(event, toState, toParams, fromState, fromParams){
                       if ($rootScope.__interval != undefined) {
                           $rootScope.__interval.forEach(function(interval) {
                               clearInterval(interval);
                           })
                       }
                   });
}]);
