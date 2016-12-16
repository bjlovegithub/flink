"use strict";function dirPaginateDirective(e,t,o){function r(r,l){var u=l.dirPaginate,d=u.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),_=/\|\s*itemsPerPage\s*:\s*(.*\(\s*\w*\)|([^\)]*?(?=\s+as\s+))|[^\)]*)/;if(null===d[2].match(_))throw"pagination directive: the 'itemsPerPage' filter must be set.";var g=d[2].replace(_,""),m=t(g);a(r);var v=l.paginationId||DEFAULT_ID;return o.registerInstance(v),function(r,a,l){var d=t(l.paginationId)(r)||l.paginationId||DEFAULT_ID;o.registerInstance(d);var _=n(u,d);i(a,l,_),s(a);var g=e(a),v=c(r,l,d);o.setCurrentPageParser(d,v,r),"undefined"!=typeof l.totalItems?(o.setAsyncModeTrue(d),r.$watch(function(){return t(l.totalItems)(r)},function(e){0<=e&&o.setCollectionLength(d,e)})):(o.setAsyncModeFalse(d),r.$watchCollection(function(){return m(r)},function(e){if(e){var t=e instanceof Array?e.length:Object.keys(e).length;o.setCollectionLength(d,t)}})),g(r)}}function n(e,t){var o,r=!!e.match(/(\|\s*itemsPerPage\s*:[^|]*:[^|]*)/);return o=t===DEFAULT_ID||r?e:e.replace(/(\|\s*itemsPerPage\s*:\s*[^|\s]*)/,"$1 : '"+t+"'")}function i(e,t,o){e[0].hasAttribute("dir-paginate-start")||e[0].hasAttribute("data-dir-paginate-start")?(t.$set("ngRepeatStart",o),e.eq(e.length-1).attr("ng-repeat-end",!0)):t.$set("ngRepeat",o)}function a(e){angular.forEach(e,function(e){1===e.nodeType&&angular.element(e).attr("dir-paginate-no-compile",!0)})}function s(e){angular.forEach(e,function(e){1===e.nodeType&&angular.element(e).removeAttr("dir-paginate-no-compile")}),e.eq(0).removeAttr("dir-paginate-start").removeAttr("dir-paginate").removeAttr("data-dir-paginate-start").removeAttr("data-dir-paginate"),e.eq(e.length-1).removeAttr("dir-paginate-end").removeAttr("data-dir-paginate-end")}function c(e,o,r){var n;if(o.currentPage)n=t(o.currentPage);else{var i=(r+"__currentPage").replace(/\W/g,"_");e[i]=1,n=t(i)}return n}return{terminal:!0,multiElement:!0,priority:100,compile:r}}function noCompileDirective(){return{priority:5e3,terminal:!0}}function dirPaginationControlsTemplateInstaller(e){e.put("angularUtils.directives.dirPagination.template",'<ul class="pagination" ng-if="1 < pages.length || !autoHide"><li ng-if="boundaryLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(1)">&laquo;</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == 1 }"><a href="" ng-click="setCurrent(pagination.current - 1)">&lsaquo;</a></li><li ng-repeat="pageNumber in pages track by tracker(pageNumber, $index)" ng-class="{ active : pagination.current == pageNumber, disabled : pageNumber == \'...\' || ( ! autoHide && pages.length === 1 ) }"><a href="" ng-click="setCurrent(pageNumber)">{{ pageNumber }}</a></li><li ng-if="directionLinks" ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.current + 1)">&rsaquo;</a></li><li ng-if="boundaryLinks"  ng-class="{ disabled : pagination.current == pagination.last }"><a href="" ng-click="setCurrent(pagination.last)">&raquo;</a></li></ul>')}function dirPaginationControlsDirective(e,t){function o(t,o,n){function a(o){if(e.isRegistered(d)&&l(o)){var n=t.pagination.current;t.pages=r(o,e.getCollectionLength(d),e.getItemsPerPage(d),g),t.pagination.current=o,c(),t.onPageChange&&t.onPageChange({newPageNumber:o,oldPageNumber:n})}}function s(){if(e.isRegistered(d)){var o=parseInt(e.getCurrentPage(d))||1;t.pages=r(o,e.getCollectionLength(d),e.getItemsPerPage(d),g),t.pagination.current=o,t.pagination.last=t.pages[t.pages.length-1],t.pagination.last<t.pagination.current?t.setCurrent(t.pagination.last):c()}}function c(){if(e.isRegistered(d)){var o=e.getCurrentPage(d),r=e.getItemsPerPage(d),n=e.getCollectionLength(d);t.range.lower=(o-1)*r+1,t.range.upper=Math.min(o*r,n),t.range.total=n}}function l(e){return i.test(e)&&0<e&&e<=t.pagination.last}var u=n.paginationId||DEFAULT_ID,d=t.paginationId||n.paginationId||DEFAULT_ID;if(!e.isRegistered(d)&&!e.isRegistered(u)){var _=d!==DEFAULT_ID?" (id: "+d+") ":" ";window.console&&console.warn("Pagination directive: the pagination controls"+_+"cannot be used without the corresponding pagination directive, which was not found at link time.")}t.maxSize||(t.maxSize=9),t.autoHide=void 0===t.autoHide||t.autoHide,t.directionLinks=!angular.isDefined(n.directionLinks)||t.$parent.$eval(n.directionLinks),t.boundaryLinks=!!angular.isDefined(n.boundaryLinks)&&t.$parent.$eval(n.boundaryLinks);var g=Math.max(t.maxSize,5);t.pages=[],t.pagination={last:1,current:1},t.range={lower:1,upper:1,total:1},t.$watch("maxSize",function(e){e&&(g=Math.max(t.maxSize,5),s())}),t.$watch(function(){if(e.isRegistered(d))return(e.getCollectionLength(d)+1)*e.getItemsPerPage(d)},function(e){0<e&&s()}),t.$watch(function(){if(e.isRegistered(d))return e.getItemsPerPage(d)},function(e,o){e!=o&&"undefined"!=typeof o&&a(t.pagination.current)}),t.$watch(function(){if(e.isRegistered(d))return e.getCurrentPage(d)},function(e,t){e!=t&&a(e)}),t.setCurrent=function(t){e.isRegistered(d)&&l(t)&&(t=parseInt(t,10),e.setCurrentPage(d,t))},t.tracker=function(e,t){return e+"_"+t}}function r(e,t,o,r){var i,a=[],s=Math.ceil(t/o),c=Math.ceil(r/2);i=e<=c?"start":s-c<e?"end":"middle";for(var l=r<s,u=1;u<=s&&u<=r;){var d=n(u,e,r,s),_=2===u&&("middle"===i||"end"===i),g=u===r-1&&("middle"===i||"start"===i);l&&(_||g)?a.push("..."):a.push(d),u++}return a}function n(e,t,o,r){var n=Math.ceil(o/2);return e===o?r:1===e?e:o<r?r-n<t?r-o+e:n<t?t-n+e:e:e}var i=/^\d+$/,a={restrict:"AE",scope:{maxSize:"=?",onPageChange:"&?",paginationId:"=?",autoHide:"=?"},link:o},s=t.getString();return void 0!==s?a.template=s:a.templateUrl=function(e,o){return o.templateUrl||t.getPath()},a}function itemsPerPageFilter(e){return function(t,o,r){if("undefined"==typeof r&&(r=DEFAULT_ID),!e.isRegistered(r))throw"pagination directive: the itemsPerPage id argument (id: "+r+") does not match a registered pagination-id.";var n,i;if(angular.isObject(t)){if(o=parseInt(o)||9999999999,i=e.isAsyncMode(r)?0:(e.getCurrentPage(r)-1)*o,n=i+o,e.setItemsPerPage(r,o),t instanceof Array)return t.slice(i,n);var a={};return angular.forEach(keys(t).slice(i,n),function(e){a[e]=t[e]}),a}return t}}function keys(e){if(Object.keys)return Object.keys(e);var t=[];for(var o in e)e.hasOwnProperty(o)&&t.push(o);return t}function paginationService(){var e,t={};this.registerInstance=function(o){"undefined"==typeof t[o]&&(t[o]={asyncMode:!1},e=o)},this.deregisterInstance=function(e){delete t[e]},this.isRegistered=function(e){return"undefined"!=typeof t[e]},this.getLastInstanceId=function(){return e},this.setCurrentPageParser=function(e,o,r){t[e].currentPageParser=o,t[e].context=r},this.setCurrentPage=function(e,o){t[e].currentPageParser.assign(t[e].context,o)},this.getCurrentPage=function(e){var o=t[e].currentPageParser;return o?o(t[e].context):1},this.setItemsPerPage=function(e,o){t[e].itemsPerPage=o},this.getItemsPerPage=function(e){return t[e].itemsPerPage},this.setCollectionLength=function(e,o){t[e].collectionLength=o},this.getCollectionLength=function(e){return t[e].collectionLength},this.setAsyncModeTrue=function(e){t[e].asyncMode=!0},this.setAsyncModeFalse=function(e){t[e].asyncMode=!1},this.isAsyncMode=function(e){return t[e].asyncMode}}function paginationTemplateProvider(){var e,t="angularUtils.directives.dirPagination.template";this.setPath=function(e){t=e},this.setString=function(t){e=t},this.$get=function(){return{getPath:function(){return t},getString:function(){return e}}}}function BlinkMetric(e){var t={};e.forEach(function(e){t[e.name]={value:e.value,description:e.description}}),this.metrics_dict=t,this.metrics_array=e}function PlanGraph(e){this.svg=d3.select("svg"),this.inner=this.svg.select("g");var t=this.inner;this.zoom=d3.behavior.zoom().on("zoom",function(){t.attr("transform","translate("+d3.event.translate+")scale("+d3.event.scale+")")}),this.svg.call(this.zoom),this.render=new dagreD3.render,this.g=new dagreD3.graphlib.Graph,this.g.setGraph({nodesep:200,ranksep:20,rankdir:"LR",marginx:20,marginy:20}),this.job=e}var blinkJobMasterApp=angular.module("blinkJobMasterApp",["ui.router","ui.bootstrap","JobsController","ExecutionJobVerticesController","ExecutionVerticesController","ExecutionsController","JobService","PlanService","smart-table","MetricsService","angularUtils.directives.dirPagination"]);blinkJobMasterApp.config(["$urlRouterProvider","$stateProvider",function(e,t){e.otherwise("main"),t.state("main",{url:"/main",templateUrl:"views/jobs/layout.html",controller:"JobsController.index"}).state("job",{url:"/jobs/:job_id",templateUrl:"views/jobs/layout.html",controller:"JobsController.show"}).state("job.overview",{"abstract":!0,templateUrl:"views/jobs/overview.html"}).state("job.overview.sub",{url:"/overview",views:{title:{templateUrl:"views/jobs/title.html",controller:"JobsController.title"},summary:{templateUrl:"views/jobs/summary.html",controller:"JobsController.summary"},ejvs:{templateUrl:"views/jobs/ejvs.html",controller:"JobsController.ejvs"},plan:{templateUrl:"views/jobs/plan.html",controller:"JobsController.plan"}}}).state("job.master",{url:"/master",templateUrl:"views/master/layout.html",controller:"JobsController.master_layout"}).state("job.master.overview",{url:"/log",templateUrl:"views/master/overview.html",controller:"JobsController.master_overview"}).state("job.master.failover_histories",{url:"/failover_histories",templateUrl:"views/master/failover_history.html",controller:"JobsController.failover_histories"}).state("job.about",{url:"/about",templateUrl:"views/jobs/about.html",controller:"JobsController.about"}).state("job.checkpoints",{url:"/checkpoints",templateUrl:"views/jobs/checkpoints.html",controller:"JobsController.checkpoints"}).state("job.configure",{url:"/configure",templateUrl:"views/jobs/configure.html",controller:"JobsController.configure"}).state("job.execution_job_vertex",{url:"/vertices/:vertex_id",params:{vertex_name:null,topology_id:null},templateUrl:"views/execution_job_vertices/layout.html",controller:"ExecutionJobVerticesController.layout"}).state("job.execution_job_vertex.overview",{url:"/overview",templateUrl:"views/execution_job_vertices/overview.html",controller:"ExecutionJobVerticesController.overview"}).state("job.execution_job_vertex.metrics",{url:"/metrics",templateUrl:"views/execution_job_vertices/metrics.html",controller:"ExecutionJobVerticesController.metrics"}).state("job.execution_job_vertex.accumulators",{url:"/accumulators",templateUrl:"views/execution_job_vertices/accumulators.html",controller:"ExecutionJobVerticesController.accumulators"}).state("job.execution_vertex",{url:"/vertices/:vertex_id/subtasks/:subtask_id",params:{vertex_name:null,topology_id:null},templateUrl:"views/execution_vertices/layout.html",controller:"ExecutionVerticesController.layout"}).state("job.execution_vertex.overview",{url:"/overview",templateUrl:"views/execution_vertices/overview.html",controller:"ExecutionVerticesController.overview"}).state("job.execution_vertex.metrics",{url:"/metrics",templateUrl:"views/execution_vertices/metrics.html",controller:"ExecutionVerticesController.metrics"}).state("job.execution_vertex.accumulators",{url:"/accumulators",templateUrl:"views/execution_vertices/accumulators.html",controller:"ExecutionVerticesController.accumulators"}).state("job.execution",{url:"/vertices/:vertex_id/subtasks/:subtask_id/attempts/:attempt_number",params:{vertex_name:null,topology_id:null},templateUrl:"views/executions/layout.html",controller:"ExecutionsController.layout"}).state("job.execution.metrics",{url:"/metrics",templateUrl:"views/executions/metrics.html",controller:"ExecutionsController.metrics"}).state("job.execution.accumulators",{url:"/accumulators",templateUrl:"views/executions/accumulators.html",controller:"ExecutionsController.accumulators"}).state("job.execution.log",{url:"/log",templateUrl:"views/executions/log.html",controller:"ExecutionsController.log"})}]),blinkJobMasterApp.run(["$rootScope","$state",function(e,t){e.$on("$stateChangeStart",function(t,o,r,n,i){void 0!=e.__interval&&e.__interval.forEach(function(e){clearInterval(e)})})}]);var executionJobVerticesController=angular.module("ExecutionJobVerticesController",[]);executionJobVerticesController.controller("ExecutionJobVerticesController.layout",["$scope","$stateParams","Job",function(e,t,o){o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.name}),e.job_id=t.job_id,e.topology_id=t.topology_id,e.job_vertex_id=t.vertex_id,e.job_vertex_name=t.vertex_name}]),executionJobVerticesController.controller("ExecutionJobVerticesController.overview",["$scope","$stateParams","Job","BlinkMetricsBuilder","$rootScope",function(e,t,o,r,n){e.refresh=function(){o.ExecutionJobVertexSubtasks.get({jobid:t.job_id,vertexid:t.vertex_id},function(t){e.execution_vertices=t.execution_vertices,void 0==e.execution_vertices_row_collection&&(e.execution_vertices_row_collection=[]),t.execution_vertices.forEach(function(t,o,n){t.blink_metric=r.build(t.metric_summary.metrics),t.id=parseInt(t.id),t.latency=t.blink_metric.latency("value"),t.delay=t.blink_metric.delay("value"),t.in_queue_per=t.blink_metric.in_queue("per_value"),t.in_queue_cnt=t.blink_metric.in_queue("cnt_value"),t.out_queue_per=t.blink_metric.out_queue("per_value"),t.out_queue_cnt=t.blink_metric.out_queue("cnt_value"),t.tps=t.blink_metric.tps("value"),t.recv_cnt=t.blink_metric.recv_cnt("value"),t.send_cnt=t.blink_metric.send_cnt("value"),t.retry=t.execution_summary.CANCELED+t.execution_summary.FAILED,e.execution_vertices_row_collection[o]=t}),void 0==e.execution_vertices_displayed_collection&&(e.execution_vertices_displayed_collection=[].concat(e.execution_vertices_row_collection))})},e.refresh(),void 0==n.__interval&&(n.__interval=[]),n.__interval.push(setInterval(e.refresh,1e4))}]),executionJobVerticesController.controller("ExecutionJobVerticesController.metrics",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.refresh=function(){o.ExecutionJobVertexMetrics.get({jobid:t.job_id,vertexid:t.vertex_id},function(t){var o={};t.metrics.forEach(function(e,t,r){void 0==o[e.group]&&(o[e.group]=[]),o[e.group].push(e)}),void 0==e.execution_job_vertex_metrics_row_collection&&(e.execution_job_vertex_metrics_row_collection=[]);var r=function(e,t){var o=e.name+"..."+e.group,r=t.name+"..."+t.group;return o>r?1:o<r?-1:0};for(var n in o)o[n].sort(r);e.group_map=o,e.itemsByPage=100})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]),executionJobVerticesController.controller("ExecutionJobVerticesController.accumulators",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.refresh=function(){o.ExecutionJobVertexAccumulators.get({jobid:t.job_id,vertexid:t.vertex_id},function(t){e.accumulators=t.accumulators})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]);var execution_vertices_controller=angular.module("ExecutionVerticesController",[]);execution_vertices_controller.controller("ExecutionVerticesController.layout",["$scope","$stateParams","Job",function(e,t,o){o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.job_name}),e.job_id=t.job_id,e.vertex_id=t.vertex_id,e.subtask_id=t.subtask_id,e.vertex_name=t.vertex_name,e.topology_id=t.topology_id,console.log(t)}]),execution_vertices_controller.controller("ExecutionVerticesController.overview",["$scope","$stateParams","Job","BlinkMetricsBuilder","$rootScope",function(e,t,o,r,n){e.refresh=function(){console.log("Get executions of execution vertex ("+t.job_id+", "+t.vertex_id+", "+t.subtask_id+")"),o.Executions.get({jobid:t.job_id,vertexid:t.vertex_id,subtaskid:t.subtask_id},function(t){void 0==e.executions_row_collection&&(e.executions_row_collection=[]),t.executions.forEach(function(t,o,r){e.executions_row_collection[o]=t,e.total+=1}),void 0==e.executions_displayed_collection&&(e.executions_displayed_collection=[].concat(e.executions_row_collection))})},e.refresh(),void 0==n.__interval&&(n.__interval=[]),n.__interval.push(setInterval(e.refresh,1e4))}]),execution_vertices_controller.controller("ExecutionVerticesController.metrics",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.itemsByPage=100,e.refresh=function(){o.ExecutionVertexMetrics.get({jobid:t.job_id,vertexid:t.vertex_id,subtaskid:t.subtask_id},function(t){var o={};t.metrics.forEach(function(e,t,r){void 0==o[e.group]&&(o[e.group]=[]),o[e.group].push(e)}),void 0==e.execution_job_vertex_metrics_row_collection&&(e.execution_job_vertex_metrics_row_collection=[]);var r=function(e,t){var o=e.name+"..."+e.group,r=t.name+"..."+t.group;return o>r?1:o<r?-1:0};for(var n in o)o[n].sort(r);e.group_map=o,e.itemsByPage=100})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]),execution_vertices_controller.controller("ExecutionVerticesController.accumulators",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.itemsByPage=100,e.refresh=function(){o.ExecutionVertexAccumulators.get({jobid:t.job_id,vertexid:t.vertex_id,subtaskid:t.subtask_id},function(t){e.result=t.accumulators,e.itemsByPage=100})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]);var executions_controller=angular.module("ExecutionsController",[]);executions_controller.controller("ExecutionsController.layout",["$scope","$stateParams","Job",function(e,t,o){o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.job_name}),e.job_id=t.job_id,e.topology_id=t.topology_id,e.vertex_id=t.vertex_id,e.vertex_name=t.vertex_name,e.subtask_id=t.subtask_id,e.attempt_number=t.attempt_number}]),executions_controller.controller("ExecutionsController.metrics",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.itemsByPage=100,e.refresh=function(){o.ExecutionMetrics.get({jobid:t.job_id,vertexid:t.vertex_id,subtaskid:t.subtask_id,attempt_number:t.attempt_number},function(t){var o={};t.metrics.forEach(function(e,t,r){void 0==o[e.group]&&(o[e.group]=[]),o[e.group].push(e)}),void 0==e.execution_job_vertex_metrics_row_collection&&(e.execution_job_vertex_metrics_row_collection=[]);var r=function(e,t){var o=e.name+"..."+e.group,r=t.name+"..."+t.group;return o>r?1:o<r?-1:0};for(var n in o)o[n].sort(r);e.group_map=o,e.itemsByPage=100})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]),executions_controller.controller("ExecutionsController.accumulators",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.itemsByPage=100,e.refresh=function(){o.ExecutionAccumulators.get({jobid:t.job_id,vertexid:t.vertex_id,subtaskid:t.subtask_id,attempt_number:t.attempt_number},function(t){e.result=t.accumulators,console.log(e.result),e.itemsByPage=100})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]),executions_controller.controller("ExecutionsController.log",["$scope","$stateParams","Job",function(e,t,o){o.ExecutionLog.get({jobid:t.job_id,vertexid:t.vertex_id,subtaskid:t.subtask_id,attempt_number:t.attempt_number},function(t){e.execution_log_url=t.url})}]);var jobsController=angular.module("JobsController",[]);jobsController.controller("JobsController.show",["$scope","$stateParams",function(e,t){e.job_id=t.job_id}]),jobsController.controller("JobsController.title",["$scope","$stateParams","Job",function(e,t,o){o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.name})}]),jobsController.controller("JobsController.ejvs",["$scope","$stateParams","Job","BlinkMetricsBuilder","$rootScope",function(e,t,o,r,n){e.timeAggs=["max","min","avg"],e.latencyAgg="max",e.delayAgg="max",e.inQueueAgg="max",e.outQueueAgg="max",e.countAggs=["max","min","avg","sum"],e.recvCntAgg="sum",e.sendCntAgg="sum",e.tpsAgg="sum",e.updateAgg=function(t,o){switch(t){case"inQueue":e.inQueueAgg=o;break;case"outQueue":e.outQueueAgg=o;break;case"latency":e.latencyAgg=o;break;case"delay":e.delayAgg=o;break;case"recvCnt":e.recvCntAgg=o;break;case"sendCnt":e.sendCntAgg=o;break;case"tps":e.tpsAgg=o}e.rowCollection.forEach(function(o){e.updateVertexAgg(o,t)})},e.updateVertexAgg=function(t,o){switch(o){case"inQueue":t.in_queue_per=t.blink_metric.in_queue("per_"+e.inQueueAgg),t.in_queue_cnt=t.blink_metric.in_queue("cnt_"+e.inQueueAgg);break;case"outQueue":t.out_queue_per=t.blink_metric.out_queue("per_"+e.outQueueAgg),t.out_queue_cnt=t.blink_metric.out_queue("cnt_"+e.outQueueAgg);break;case"latency":t.latency=t.blink_metric.latency(e.latencyAgg);break;case"delay":t.delay=t.blink_metric.delay(e.delayAgg);break;case"recvCnt":t.recv_cnt=t.blink_metric.recv_cnt(e.recvCntAgg);break;case"sendCnt":t.send_cnt=t.blink_metric.send_cnt(e.sendCntAgg);break;case"tps":t.tps=t.blink_metric.tps(e.tpsAgg)}},e.refresh=function(){o.ExecutionJobVertices.get({jobid:t.job_id},function(t){e.execution_job_vertices=t.job_vertices,void 0==e.rowCollection&&(e.rowCollection=[]),e.execution_job_vertices.forEach(function(t,o,n){void 0!==t.metric_summary&&(t.blink_metric=r.build(t.metric_summary.metrics),e.updateVertexAgg(t,"inQueue"),e.updateVertexAgg(t,"outQueue"),e.updateVertexAgg(t,"latency"),e.updateVertexAgg(t,"delay"),e.updateVertexAgg(t,"recvCnt"),e.updateVertexAgg(t,"sendCnt"),e.updateVertexAgg(t,"tps")),e.rowCollection[o]=t}),void 0==e.displayedCollection&&(e.displayedCollection=[].concat(e.rowCollection))})},e.refresh(),void 0==n.__interval&&(n.__interval=[]),n.__interval.push(setInterval(e.refresh,1e4))}]),jobsController.controller("JobsController.summary",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.refresh=function(){o.Summary.get({jobid:t.job_id},function(t){e.start_time=t.start_time,e.duration=Math.trunc(t.duration/1e3),e.created_task_num=t.CREATED,e.scheduled_task_num=t.SCHEDULED,e.running_task_num=t.RUNNING,e.finished_task_num=t.FINISHED,e.canceled_task_num=t.CANCELED,e.canceling_task_num=t.CANCELING,e.failed_task_num=t.FAILED,e.vcore_total=t.vcore_total,e.memory_total=t.memory_total})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]),jobsController.controller("JobsController.configure",["$scope","$stateParams","Job",function(e,t,o){e.configure_row_collection=[],o.Configure.get({jobid:t.job_id},function(t){t.configs.forEach(function(t){e.configure_row_collection.push(t)})}),e.configure_displayed_collection=[].concat(e.configure_row_collection),o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.name})}]),jobsController.controller("JobsController.master_layout",["$scope","$stateParams","Job",function(e,t,o){o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.name})}]),jobsController.controller("JobsController.master_overview",["$scope","$stateParams","Job",function(e,t,o){o.Master.get({jobid:t.job_id},function(t){e.master_host=t.host,e.master_port=t.port,e.master_container=t.container,e.master_log_url=t.log_url})}]),jobsController.controller("JobsController.failover_histories",["$scope","$stateParams","Job","$rootScope","$filter",function(e,t,o,r,n){e.refresh=function(){e.failover_row_collection=[],o.FailoverHistory.get({jobid:t.job_id},function(t){e.mode=t.mode,t.failoverHistoryRecords.forEach(function(t){e.failover_row_collection.push(t)})}),e.failover_displayed_collection=[].concat(e.failover_row_collection)},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,6e4))}]),jobsController.controller("JobsController.about",["$scope","$stateParams","Job",function(e,t,o){o.About.get({job_id:t.job_id},function(t){e.about=t}),o.Index.get(function(t){e.job_name=t.jobs[0].name})}]),jobsController.controller("JobsController.checkpoints",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){o.Summary.get({jobid:t.job_id},function(t){e.job_name=t.name}),e.refresh=function(){o.Checkpoints.get({jobid:t.job_id},function(t){e.checkpoints=t})},e.refresh(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.refresh,1e4))}]),jobsController.controller("JobsController.index",["$scope","$stateParams","Job","$state","$rootScope",function(e,t,o,r,n){o.Index.get(function(e){r.go("job.overview.sub",{job_id:e.running[0].jid})})}]),jobsController.controller("JobsController.plan",["$scope","$stateParams","Job","$rootScope",function(e,t,o,r){e.job_id=t.job_id,e.svg=d3.select("svg"),e.vis=e.svg.select("g").attr("class","plan").style("margin-left","auto").style("margin-right","auto"),e.render=new dagreD3.render,e.drawPlan=function(){console.log("Draw the plan for job "+e.job_id),o.Plan.get({jobid:e.job_id},function(t){e.graph=new dagreD3.graphlib.Graph,e.graph.setGraph({nodesep:50,ranksep:10,rankdir:"LR",marginx:10,marginy:10}),t.nodes.forEach(function(t){var o="n/a";void 0!==t.delay&&(o=t.delay.toFixed(0)+"ms");var r="n/a";void 0!==t.latency&&(r=t.latency.toFixed(2)+"ms");var n="n/a";void 0!==t.tps&&(n=t.tps.toFixed(0));var i="<div class='plan-vertex'><div class='plan-config'>"+t.parallelism+"<span style='padding-left: 2px'>X</span><img src='statics/cpu.png' style='width:30px;height:30px; padding-left: 2px; padding-right: 2px'/>"+t.vcore+"<img src='statics/dram.png' style='width:30px;height:30px; padding-left: 4px; padding-right: 2px'/>"+t.memory+"</div><div class='plan-icon'><img src='statics/engine.png' style='width:80px;height:60px;'/></div><div class='plan-id'>"+t.topology_id+"</div><div class='plan-metric'>DELAY: "+o+"<br/>TPS: "+n+"<br/>LATENCY: "+r+"</div></div>";e.graph.setNode(t.id,{labelType:"html",label:i,width:120,height:160,description:t.description,number:t.topology_id})}),t.nodes.forEach(function(t){void 0!==t.inputs&&t.inputs.forEach(function(o){e.graph.setEdge(o.id,t.id,{label:o.exchange,lineInterpolate:"basis"})})}),e.render(e.vis,e.graph);var o=e.graph.graph().width+40,r=e.graph.graph().height+40;r/o>2&&(e.graph.graph().rankdir="TB",e.render(e.vis,e.graph),o=e.graph.graph().width+40,r=e.graph.graph().height+40);var n=parseInt(e.svg.style("width").replace(/px/,"")),i=Math.min(.8,n/o),a=r*i;e.svg.attr("height",a);var s=[n/2-o*i/2,a/2-r*i/2];e.zoomFn=d3.behavior.zoom().on("zoom",function(){e.vis.attr("transform","translate("+d3.event.translate+")scale("+d3.event.scale+")")}),e.zoomFn.translate(s),e.zoomFn.scale(i),e.zoomFn.event(e.svg),e.vis.selectAll("g.node").each(function(e){$(this).click(function(){console.log($("tr#"+e)),console.log($("tr#8bc0ddca8b7dd222c2606be23e5f7769")),$(document).scrollTop($("tr").offset().top),$("tr#"+e).addClass("animated wobble").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){$(this).removeClass()})})})})},e.drawPlan(),void 0==r.__interval&&(r.__interval=[]),r.__interval.push(setInterval(e.drawPlan,1e4))}]);var moduleName="angularUtils.directives.dirPagination",DEFAULT_ID="__default";angular.module(moduleName,[]).directive("dirPaginate",["$compile","$parse","paginationService",dirPaginateDirective]).directive("dirPaginateNoCompile",noCompileDirective).directive("dirPaginationControls",["paginationService","paginationTemplate",dirPaginationControlsDirective]).filter("itemsPerPage",["paginationService",itemsPerPageFilter]).service("paginationService",paginationService).provider("paginationTemplate",paginationTemplateProvider).run(["$templateCache",dirPaginationControlsTemplateInstaller]);var execution_job_vertex_name_service=angular.module("ExecutionJobVertexNameService",["JobService","MetricsService"]).constant("config",{web_root:"api"});execution_job_vertex_name_service.factory("ExecutionJobVertexName",["Job","BlinkMetricsBuilder",function(e,t){return{call:function(o,r){console.log(r),e.ExecutionVertices.get({job_id:r.job_id,execution_job_vertex_id:r.execution_job_vertex_id},function(e){o.execution_vertices=e.execution_vertices,void 0==o.execution_vertices_row_collection&&(o.execution_vertices_row_collection=[]),e.execution_vertices.forEach(function(e,r,n){e.blink_metric=t.build(e.metric_summary.metrics),o.execution_vertices_row_collection[r]=e,o.execution_job_vertex_name=e.name,console.log(o.execution_job_vertex_name)})})}}}]);var job_name_service=angular.module("JobNameService",["JobService"]).constant("config",{web_root:"api"});job_name_service.factory("JobName",["Job",function(e){return{call:function(t,o){e.Summary.get({jobid:o.jobid},function(e){t.job_name=e.name})}}}]);var jobs_service=angular.module("JobService",["ngResource"]).constant("config",{web_root:"api"});jobs_service.factory("Job",["$resource","config",function(e,t){return{Index:e(t.web_root+"/jobs"),Summary:e(t.web_root+"/jobs/:jobid/summary"),Plan:e(t.web_root+"/jobs/:jobid/plan"),ExecutionJobVertices:e(t.web_root+"/jobs/:jobid/vertices"),ExecutionJobVertexSubtasks:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks"),ExecutionJobVertexMetrics:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/metrics"),ExecutionJobVertexAccumulators:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/accumulators"),Executions:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid"),ExecutionVertexMetrics:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/metrics"),ExecutionVertexAccumulators:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/accumulators"),ExecutionMetrics:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/metrics"),ExecutionAccumulators:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/accumulators"),ExecutionLog:e(t.web_root+"/jobs/:jobid/vertices/:vertexid/subtasks/:subtaskid/attempts/:attempt_number/log"),Master:e(t.web_root+"/jobs/:jobid/master"),FailoverHistory:e(t.web_root+"/jobs/:jobid/failover-history"),Configure:e(t.web_root+"/jobs/:jobid/configuration"),About:e(t.web_root+"/jobs/:jobid/about"),Checkpoints:e(t.web_root+"/jobs/:jobid/checkpoints")}}]),BlinkMetric.prototype.recv_cnt=function(e){var t=this.get_metric("num_records_in_"+e);return"undefined"==typeof t?"n/a":parseInt(t.value)},BlinkMetric.prototype.send_cnt=function(e){var t=this.get_metric("num_records_out_"+e);return"undefined"==typeof t?"n/a":parseInt(t.value)},BlinkMetric.prototype.tps=function(e){var t=this.get_metric("tps_"+e);return"undefined"==typeof t?"n/a":parseInt(t.value)},BlinkMetric.prototype.latency=function(e){var t=this.get_metric("latency_"+e);if("undefined"==typeof t)return"n/a";var o=parseFloat(t.value);return o},BlinkMetric.prototype.delay=function(e){var t=this.get_metric("lag_"+e);return"undefined"==typeof t&&(t=this.get_metric("delay_"+e)),"undefined"==typeof t?"n/a":parseFloat(t.value)},BlinkMetric.prototype.in_queue=function(e){var t=this.get_metric("queue_in_"+e);return"undefined"==typeof t?"n/a":"cnt"==e.substr(0,3)?parseInt(t.value):100*parseFloat(t.value)},BlinkMetric.prototype.out_queue=function(e){var t=this.get_metric("queue_out_"+e);return"undefined"==typeof t?"n/a":"cnt"==e.substr(0,3)?parseInt(t.value):100*parseFloat(t.value)},BlinkMetric.prototype.get_metric=function(e){return this.metrics_dict[e]};var metrics_service=angular.module("MetricsService",[]);metrics_service.factory("BlinkMetricsBuilder",[function(){return{build:function(e){return new BlinkMetric(e)}}}]);var plan_service=angular.module("PlanService",["JobService","MetricsService"]).constant("ac",1),random_number=function(e){return e},percent=function(e){var t=e.toFixed(0);return t.toString().concat("%")};plan_service.factory("Plan",["Job","BlinkMetricsBuilder",function(e,t){return{draw:function(o){var r=new PlanGraph(e);r.get_plan_summary(o,t),setInterval(function(){r.get_plan_summary(o,t)},5e3)}}}]),PlanGraph.prototype.get_plan_summary=function(e,t){var o=this.job,r=this;this.job.Plan.get({jobid:e},function(n){o.ExecutionJobVertices.get({jobid:e},function(e){var o={};e.job_vertices.forEach(function(e){o[e.id]=e}),console.log(n),n.nodes.forEach(function(e){var r=t.build(o[e.id].metric_summary.metrics);e.status=o[e.id].status,e.queue_in=r.in_queue("cnt_avg"),e.queue_out=r.out_queue("cnt_avg"),e.queue_in_usage=r.in_queue("per_avg"),e.queue_out_usage=r.out_queue("per_avg"),
e.udf_qps=r.tps("avg"),e.latency=r.latency("avg"),e.delay=r.delay("avg")}),r.draw_graph(n,!1)})})},PlanGraph.prototype.draw_graph=function(e,t){var o=this.g,r=function(e,t){return"<p class='name'>ID: "+e+"</p><p class='description'>"+t+"</p>"};e.nodes.forEach(function(e){var t="<div>";t+="<span class='name'>"+e.topology_id+": ["+e.vcore+" vcore ,"+e.memory+" mb] x "+e.parallelism+"</span>",t+="<span class='info'>",t+="<span class='queue_in'>"+percent(random_number(e.queue_in_usage))+"</span>",t+="<span class='udf'>",t+="<span class='qps'>"+random_number(e.udf_qps)+"/s</span>",t+="<span class='latency'>"+random_number(e.latency)+" ms</span>",t+="<span class='delay'>"+random_number(e.delay)+" ms</span>",t+="</span>",t+="<span class='queue_out'>"+percent(random_number(e.queue_out_usage))+"</span>",t+="</span>",t+="</div>";var r="plan_draw";o.setNode(e.id,{labelType:"html",label:t,rx:5,ry:5,padding:0,"class":r,description:e.description,topology_id:e.topology_id}),e.inputs&&e.inputs.forEach(function(t){o.setEdge(t.id,e.id,{label:t.exchange,width:50})})}),this.render(this.inner,this.g),this.inner.selectAll("g.node").attr("title",function(e){return r(o.node(e).topology_id,o.node(e).description)}).each(function(e){$(this).tipsy({gravity:"s",opacity:1,html:!0})}),this.inner.selectAll("g.node").each(function(e){$(this).click(function(){$(document).scrollTop($("tr#"+e).offset().top),$("tr#"+e).addClass("animated wobble").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){$(this).removeClass()})})});var n=this.g.graph().width+80,i=this.g.graph().height+40,a=parseInt(this.svg.style("width").replace(/px/,"")),s=parseInt(this.svg.style("height").replace(/px/,"")),c=Math.min(a/n,s/i),l=[a/2-n*c/2,s/2-i*c/2];this.zoom.translate(l),this.zoom.scale(c),this.zoom.event(t?this.svg.transition().duration(500):d3.select("svg"))};