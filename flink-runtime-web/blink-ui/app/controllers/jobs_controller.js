'use strict';

var jobsController = angular.module('JobsController', []);

jobsController.controller('JobsController.show',['$scope','$stateParams',function($scope,$stateParams){
    $scope.job_id = $stateParams.job_id
}]);


jobsController.controller('JobsController.title',['$scope','$stateParams','Job',function($scope,$stateParams,Job){
    Job.Summary.get({
        jobid: $stateParams.job_id
    }, function(result) {
        $scope.job_name = result.name;
    });
}]);

jobsController.controller('JobsController.ejvs',['$scope','$stateParams','Job','BlinkMetricsBuilder','$rootScope',
    function($scope,$stateParams,Job,BlinkMetricsBuilder,$rootScope){
        $scope.timeAggs = ["max", "min", "avg"];
        $scope.latencyAgg = "max";
        $scope.delayAgg = "max";
        $scope.inQueueAgg = "max";
        $scope.outQueueAgg = "max";

        $scope.countAggs = ["max", "min", "avg", "sum"];
        $scope.recvCntAgg = "sum";
        $scope.sendCntAgg = "sum";
        $scope.tpsAgg = "sum";

        $scope.updateAgg = function(metric_name, metric_type) {
            switch (metric_name) {
                case "inQueue":
                    $scope.inQueueAgg = metric_type;
                    break;
                case "outQueue":
                    $scope.outQueueAgg = metric_type;
                    break;
                case "latency":
                    $scope.latencyAgg = metric_type;
                    break;
                case "delay":
                    $scope.delayAgg = metric_type;
                    break;
                case "recvCnt":
                    $scope.recvCntAgg = metric_type;
                    break;
                case "sendCnt":
                    $scope.sendCntAgg = metric_type;
                    break;
                case "tps":
                    $scope.tpsAgg = metric_type;
                    break;
            }

            $scope.rowCollection.forEach(function(job_vertex) {
                $scope.updateVertexAgg(job_vertex, metric_name);
            });
        };

        $scope.updateVertexAgg = function(job_vertex, metric_name) {
            switch(metric_name) {
                case "inQueue":
                    job_vertex.in_queue_per = job_vertex.blink_metric.in_queue("per_" + $scope.inQueueAgg);
                    job_vertex.in_queue_cnt = job_vertex.blink_metric.in_queue("cnt_" + $scope.inQueueAgg);
                    break;
                case "outQueue":
                    job_vertex.out_queue_per = job_vertex.blink_metric.out_queue("per_" + $scope.outQueueAgg);
                    job_vertex.out_queue_cnt = job_vertex.blink_metric.out_queue("cnt_" + $scope.outQueueAgg);
                    break;
                case "latency":
                    job_vertex.latency = job_vertex.blink_metric.latency($scope.latencyAgg);
                    break;
                case "delay":
                    job_vertex.delay = job_vertex.blink_metric.delay($scope.delayAgg);
                    break;
                case "recvCnt":
                    job_vertex.recv_cnt = job_vertex.blink_metric.recv_cnt($scope.recvCntAgg);
                    break;
                case "sendCnt":
                    job_vertex.send_cnt = job_vertex.blink_metric.send_cnt($scope.sendCntAgg);
                    break;
                case "tps":
                    job_vertex.tps = job_vertex.blink_metric.tps($scope.tpsAgg);
                    break;
            }
        };

        $scope.refresh = function(){
            Job.ExecutionJobVertices.get({jobid: $stateParams.job_id}, function(ejvs){
                $scope.execution_job_vertices = ejvs.job_vertices;
                if ($scope.rowCollection == undefined) {
                    $scope.rowCollection = [];
                }

                $scope.execution_job_vertices.forEach(function(execution_job_vertex,index,array){
                    if (execution_job_vertex.metric_summary !== undefined) {
                        execution_job_vertex.blink_metric = BlinkMetricsBuilder.build(execution_job_vertex.metric_summary.metrics);

                        $scope.updateVertexAgg(execution_job_vertex, 'inQueue');
                        $scope.updateVertexAgg(execution_job_vertex, 'outQueue');
                        $scope.updateVertexAgg(execution_job_vertex, 'latency');
                        $scope.updateVertexAgg(execution_job_vertex, 'delay');
                        $scope.updateVertexAgg(execution_job_vertex, 'recvCnt');
                        $scope.updateVertexAgg(execution_job_vertex, 'sendCnt');
                        $scope.updateVertexAgg(execution_job_vertex, 'tps');
                    }

                    $scope.rowCollection[index] = execution_job_vertex;
                });

                if ($scope.displayedCollection == undefined) {
                    $scope.displayedCollection = [].concat($scope.rowCollection);
                }
            });
        };

        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));
    }]);

jobsController.controller('JobsController.summary',['$scope','$stateParams','Job','$rootScope',
    function($scope,$stateParams,Job,$rootScope){

        $scope.refresh = function() {
          Job.Summary.get({jobid: $stateParams.job_id}, function(result) {
            $scope.start_time = result.start_time
            $scope.duration = Math.trunc(result.duration/1000)
            $scope.created_task_num = result.CREATED
            $scope.scheduled_task_num = result.SCHEDULED
            $scope.running_task_num = result.RUNNING
            $scope.finished_task_num = result.FINISHED
            $scope.canceled_task_num = result.CANCELED
            $scope.canceling_task_num = result.CANCELING
            $scope.failed_task_num = result.FAILED
            $scope.vcore_total = result.vcore_total
            $scope.memory_total = result.memory_total
          });
        };

        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));
}]);


jobsController.controller('JobsController.configure',['$scope','$stateParams','Job',
    function($scope,$stateParams,Job){
        $scope.configure_row_collection = []
        Job.Configure.get({job_id: $stateParams.job_id},function(result){
            result.configs.forEach(function(config){
                $scope.configure_row_collection.push(config)
            })
        });
        $scope.configure_displayed_collection = [].concat($scope.configure_row_collection)

        Job.Index.get(function(result){
            $scope.job_name = result.jobs[0].name
        })
    }]);

jobsController.controller('JobsController.master_layout',['$scope','$stateParams','Job',
    function($scope,$stateParams,Job){
        Job.Index.get(function(result){
            $scope.job_name = result.jobs[0].name;
        })
    }]);

jobsController.controller('JobsController.master_overview',['$scope','$stateParams','Job',
    function($scope,$stateParams,Job){
        Job.Master.get({job_id: $stateParams.job_id},function(result){
            $scope.master_host = result.host;
            $scope.master_port = result.port;
            $scope.master_container = result.container;
            $scope.master_log_url = result.log_url;
        });
    }]);

jobsController.controller('JobsController.failover_histories',['$scope','$stateParams','Job','$rootScope','$filter',
    function($scope,$stateParams,Job,$rootScope,$filter){
        $scope.refresh = function () {
            $scope.failover_row_collection = [];
            Job.FailoverHistory.get({job_id: $stateParams.job_id}, function (result) {
                $scope.mode = result.mode;

                result.failoverHistoryRecords.forEach(function (failover) {
                    $scope.failover_row_collection.push(failover)
                });
            });
            $scope.failover_displayed_collection = [].concat($scope.failover_row_collection)
        };

        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 60000));
    }]);

jobsController.controller('JobsController.about',
    ['$scope','$stateParams','Job',function($scope,$stateParams,Job){
        Job.About.get({job_id: $stateParams.job_id},function(result){
            $scope.about = result
        })
        Job.Index.get(function(result){
            $scope.job_name = result.jobs[0].name
        })
    }]
);

jobsController.controller('JobsController.checkpoints',
    ['$scope','$stateParams','Job','$rootScope',function($scope,$stateParams,Job,$rootScope){
        Job.Index.get(function(result){
            $scope.job_name = result.jobs[0].name
        });

        $scope.refresh = function() {
            Job.Checkpoints.get({job_id: $stateParams.job_id},function(result){
                $scope.checkpoints = result
            })
        };

        $scope.refresh();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.refresh, 10000));
    }]
);

jobsController.controller('JobsController.index',
    ['$scope','$stateParams','Job','$state','$rootScope',function($scope,$stateParams,Job,$state,$rootScope){
        Job.Index.get(function(result){
			$state.go('job.overview.sub', {job_id: result.running[0].jid});
        })
    }]
);
