/**
 * Created by shixiaogang on 16/10/28.
 */
jobsController.controller('JobsController.plan',['$scope','$stateParams','Job', '$rootScope',
    function($scope,$stateParams,$Job, $rootScope){
        $scope.jobid = $stateParams.jobid;

        $scope.svg = d3.select("svg");

        $scope.vis = $scope.svg.select("g")
            .attr("class", "plan")
            .style("margin-left", "auto")
            .style("margin-right", "auto");

        $scope.render = new dagreD3.render();

        $scope.drawPlan = function() {
            //get the plan from job master
            console.log("Draw the plan for job " + $scope.jobid);

            $Job.Plan.get({
            jobid: $scope.jobid
            }, function (plan) {
                $scope.graph = new dagreD3.graphlib.Graph();

                $scope.graph.setGraph({
                    nodesep: 50,
                    ranksep: 10,
                    rankdir: "LR",
                    marginx: 10,
                    marginy: 10
                });

                plan.nodes.forEach(function (node) {
                    var delayLabel = "n/a";
                    if (node.delay !== undefined) {
                        delayLabel = node.delay.toFixed(0) + "ms";
                    }

                    var latencyLabel = "n/a";
                    if (node.latency !== undefined) {
                        latencyLabel = node.latency.toFixed(2) + "ms";
                    }

                    var tpsLabel = "n/a";
                    if (node.tps !== undefined) {
                        tpsLabel = node.tps.toFixed(0);
                    }

                    var label =
                        "<div class='plan-vertex'>" +
                        "<div class='plan-config'>" +
                        node.parallelism + "<span style='padding-left: 2px'>X</span>" +
                        "<img src='statics/cpu.png' style='width:30px;height:30px; padding-left: 2px; padding-right: 2px'/>" + node.vcore +
                        "<img src='statics/dram.png' style='width:30px;height:30px; padding-left: 4px; padding-right: 2px'/>" + node.memory +
                        "</div>" +
                        "<div class='plan-icon'>" +
                        "<img src='statics/engine.png' style='width:80px;height:60px;'/>" +
                        "</div>" +
                        "<div class='plan-id'>" +
                        node.topology_id +
                        "</div>" +
                        "<div class='plan-metric'>" +
                        "DELAY: " + delayLabel + "<br/>" +
                        "TPS: " + tpsLabel + "<br/>" +
                        "LATENCY: " + latencyLabel +
                        "</div>" +
                        "</div>";

                    $scope.graph.setNode(node.id, {
                        labelType: "html",
                        label: label,
                        width: 120,
                        height: 160,
                        description: node.description,
                        number: node.topology_id
                    });
                });

                plan.nodes.forEach(function (output) {
                    if (output.inputs !== undefined) {
                        output.inputs.forEach(function (input) {
                            $scope.graph.setEdge(input.id, output.id, {
                                label: input.exchange,
                                lineInterpolate: "basis"
                            });
                        });
                    }
                });

                $scope.render($scope.vis, $scope.graph);

                var graphWidth = $scope.graph.graph().width + 40;
                var graphHeight = $scope.graph.graph().height + 40;

                if (graphHeight / graphWidth > 2) {
                    $scope.graph.graph().rankdir = "TB";
                    $scope.render($scope.vis, $scope.graph);

                    graphWidth = $scope.graph.graph().width + 40;
                    graphHeight = $scope.graph.graph().height + 40;
                }

                var width = parseInt($scope.svg.style("width").replace(/px/, ""));

                // scale according to the width
                var zoomScale = Math.min(0.8, width / graphWidth);
                // update the height
                var height = graphHeight * zoomScale;
                $scope.svg.attr("height", height);

                var translate = [(width / 2) - ((graphWidth * zoomScale) / 2), (height / 2) - ((graphHeight * zoomScale) / 2)];

                $scope.zoomFn = d3.behavior.zoom().on("zoom", function () {
                    $scope.vis.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
                });
                $scope.zoomFn.translate(translate);
                $scope.zoomFn.scale(zoomScale);
                $scope.zoomFn.event($scope.svg);

                $scope.vis.selectAll("g.node").each(
                    function (v) {
                        $(this).click(function () {
                            console.log($('tr#'+v));
                            console.log($('tr#8bc0ddca8b7dd222c2606be23e5f7769'));
                            $(document).scrollTop($('tr').offset().top);

                            $('tr#' + v).addClass('animated wobble').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                                $(this).removeClass();
                            });
                        });
                    }
                );
            });
        };

        $scope.drawPlan();

        if ($rootScope.__interval == undefined) {
            $rootScope.__interval = [];
        }
        $rootScope.__interval.push(setInterval($scope.drawPlan, 10000));
    }]
);
