/**
 * Created by guowei on 15/12/10.
 */
var job_name_service = angular.module("JobNameService",["JobService"]).constant('config',{web_root:'api'})

job_name_service.factory('JobName',['Job',function(Job){
    return {
        call: function($scope, $stateParam){

            Job.Summary.get({jobid: $stateParam.jobid}, function(result){
                $scope.job_name = result.name
            })
        }
    }
}])
