/**
 * Created by guowei on 15/12/10.
 */
var plan_service = angular.module("PlanService",["JobService","MetricsService"]).constant( 'ac' , 1)

var random_number = function(o)
{
    return o;
}

var percent = function(o) {
    var f = o.toFixed(0);
    return f.toString().concat("%");
}

plan_service.factory("Plan",['Job','BlinkMetricsBuilder',
    function(Job,BlinkMetricsBuilder){
        return {
            draw: function(job_id){
                var plan_graph   = new PlanGraph(Job);
                plan_graph.get_plan_summary(job_id,BlinkMetricsBuilder);

                setInterval(function(){
                    plan_graph.get_plan_summary(job_id,BlinkMetricsBuilder);
                },5000)
            }
        }
    }
])


function PlanGraph(Job)
{
    this.svg            = d3.select("svg");
    this.inner          = this.svg.select("g")
    var _inner          = this.inner;
    this.zoom           = d3.behavior.zoom().on("zoom", function() {
        _inner.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
    });
    this.svg.call(this.zoom);
    this.render         =  new dagreD3.render();
    this.g              =  new dagreD3.graphlib.Graph();
    this.g.setGraph({
        nodesep: 200,
        ranksep: 20,
        rankdir: "LR",
        marginx: 20,
        marginy: 20
    })
    this.job            = Job;
}



PlanGraph.prototype.get_plan_summary = function(job_id,BlinkMetricsBuilder)
{
    var __job           = this.job;
    var ttt             = this
    this.job.Plan.get({jobid: job_id},function(plan){
        __job.ExecutionJobVertices.get({jobid:job_id},function(execution_job_vertices){
            var execution_job_vertices_summary = {}
            execution_job_vertices.job_vertices.forEach(function(execution_job_vertex){
                execution_job_vertices_summary[execution_job_vertex.id] = execution_job_vertex;
            })
            console.log(plan);
            plan.nodes.forEach(function(node){
                var blink_metrics   = BlinkMetricsBuilder.build(execution_job_vertices_summary[node.id].metric_summary.metrics)
                node.status     = execution_job_vertices_summary[node.id].status
                node.queue_in   = blink_metrics.in_queue("cnt_avg")
                node.queue_out  = blink_metrics.out_queue("cnt_avg")
                node.queue_in_usage   = blink_metrics.in_queue("per_avg")
                node.queue_out_usage  = blink_metrics.out_queue("per_avg")
                node.udf_qps    = blink_metrics.tps("avg")
                node.latency    = blink_metrics.latency("avg")
                node.delay      = blink_metrics.delay("avg")
            })
            ttt.draw_graph(plan,false)
        })
    })
}



PlanGraph.prototype.draw_graph =function(plan,isUpdate)
{
    var _g = this.g;

    var styleTooltip = function(id,description) {
        return "<p class='name'>ID: " + id + "</p>"+"<p class='description'>" + description + "</p>";
    };
    plan.nodes.forEach(function(node){

        var html = "<div>"
        html+="<span class='name'>"+node.topology_id+": ["+node.vcore+" vcore ,"+node.memory+" mb] x "+ node.parallelism +"</span>"
        html+="<span class='info'>"
        html+="<span class='queue_in'>"+percent(random_number(node.queue_in_usage))+"</span>"
        html+="<span class='udf'>"
        html+="<span class='qps'>"+random_number(node.udf_qps)+"/s</span>"
        html+="<span class='latency'>"+random_number(node.latency)+" ms</span>"
        html+="<span class='delay'>"+random_number(node.delay)+" ms</span>"
        html+="</span>"
        html+="<span class='queue_out'>"+percent(random_number(node.queue_out_usage))+"</span>"
        html+="</span>"
        html+="</div>"

        //var html  = "<div>"
        //html     +="<span class='name'>"+node.description+"</span>"
        //html     +="<span class='info'>"
        //html     +="<span class='item'><span class='key'>in_queue</span><span class='val'>"+random_number(node.in_queue)+"</span><span class='clear'></span></span>"
        //html     +="<span class='item'><span class='key'>out_queue</span><span class='val'>"+random_number(node.out_queue)+"</span><span class='clear'></span></span>"
        //html     +="<span class='item'><span class='key'>udf_qps</span><span class='val'>"+random_number(node.udf_qps)+"/s</span><span class='clear'></span></span>"
        //
        //html     +="</span>"
        //html     += "</div>"

        var className = "plan_draw"
        _g.setNode(node.id, {
            labelType: "html",
            label: html,
            rx: 5,
            ry: 5,
            padding: 0,
            class: className,
            description: node.description,
            topology_id: node.topology_id
        });
        if (node.inputs){
            node.inputs.forEach(function(input){
                _g.setEdge(input.id,node.id,{label:input.exchange,width: 50})
            })
        }


    })

    this.render(this.inner, this.g);

    //this.inner.call(this.render, this.g);

    this.inner.selectAll("g.node")
        .attr("title", function(v) {return styleTooltip(_g.node(v).topology_id, _g.node(v).description) })
        .each(function(v) { $(this).tipsy({ gravity: "s", opacity: 1, html: true }); });

    this.inner.selectAll("g.node").each(
        function(v){
            $(this).click(function(){
                $(document).scrollTop( $('tr#'+v).offset().top );

                $('tr#'+v).addClass('animated wobble').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $(this).removeClass();
                });

            })
        }
    )


    var graphWidth = this.g.graph().width + 80;
    var graphHeight = this.g.graph().height + 40;


    var width = parseInt(this.svg.style("width").replace(/px/, ""));
    var height = parseInt(this.svg.style("height").replace(/px/, ""));
    var zoomScale = Math.min(width / graphWidth, height / graphHeight);
    var translate = [(width/2) - ((graphWidth*zoomScale)/2), (height/2) - ((graphHeight*zoomScale)/2)];
    this.zoom.translate(translate);
    this.zoom.scale(zoomScale);
    this.zoom.event(isUpdate ? this.svg.transition().duration(500) : d3.select("svg"));
}




