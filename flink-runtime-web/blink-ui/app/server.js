var express = require('express');
var fs      = require('fs');
var app = express();

var web_root = '/api'
app.get(web_root+'/jobs/:jobid/plan',function(req,res){
        res.json(plan);
})

app.get(web_root+'/jobs/:job_id/checkpoints',function(req,res){
        res.json(checkpoints);
})

app.get(web_root+'/jobs/:job_id/master-log',function(req,res){
    res.json(master_log);
})

app.get(web_root+'/jobs/:job_id/failover-history',function(req,res){
    res.json(failover_history);
})

app.get(web_root+'/jobs/:jobid/vertices',function(req,res){
    res.json(job_vertices)
})

app.get(web_root+'/jobs/:job_id/about',function(req,res){
    res.json(job_about)
})

app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/execution_vertices',function(req,res){
    res.json(execution_vertices)
})

app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/info',function(req,res){
    res.json(execution_job_vertex_info)
})

app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/metrics',function(req,res){
    res.json(execution_job_vertex_metrics)
})

app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/metrics',function(req,res){
    res.json(execution_vertex_metrics)
})
app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions',function(req,res){
    executions.executions[0].metric_summary.metrics[0].value = Math.ceil(Math.random() * 250);
    res.json(executions)
})
app.get(web_root+'/jobs/:job_id/configuration',function(req,res){
    res.json(configure)
})




app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions/:execution_id/metrics',function(req,res){
    execution_metrics.metrics.splice(0,0,{
        "group": "system",
        "name": "aa",
        "description": "num_bytes_in",
        "value":  1034814599.0
    })
    execution_metrics.metrics.forEach(function(metric){
        if (metric.name == "TPS"){
            metric.value = Math.ceil(Math.random() * 250);
        }
    })
    res.json(execution_metrics)
})

app.get(web_root+'/jobs/:job_id/job_vertices/:execution_job_vertex_id/execution_vertices/:execution_vertex_id/executions/:execution_id/log',function(req,res){
    res.json(execution_log)
})

app.get(web_root+'/jobs',function(req,res){
    return res.json(jobs)
})

app.get(web_root+'/jobs/:jobid/summary',function(req,res){
    return res.json(job)
})


app.use('/', express.static(__dirname+"/../web/"));

console.log(__dirname)

app.listen(4730);



var jobs=
{
  "running": [
    {
      "jid": "bfb90baf01bfa2d51ef0258debcef535",
      "name": "Async I/O Example",
      "state": "FINISHED",
      "start-time": 1481080291029,
      "end-time": 1481080352689,
      "duration": 61660,
      "last-modification": 1481080352689,
      "tasks": {
        "total": 5,
        "pending": 0,
        "running": 0,
        "finished": 5,
        "canceling": 0,
        "canceled": 0,
        "failed": 0
      }
    }
  ]
}

var job=
{
  "id": "bfb90baf01bfa2d51ef0258debcef535",
  "name": "Async I/O Example",
  "status": "RUNNING",
  "start_time": 1450164790433,
  "stop_time": -1,
  "duration": 1116262,
  "vertices": 7,
  "executions": 11,
  "executors": 11,
  "created_task_num": 1,
  "scheduled_task_num": 1,
  "running_task_num": 1,
  "finished_task_num": 1,
  "canceled_task_num": 1,
  "failed_task_num": 1,
  "canceling_task_num": 2,
  "vcore_total": 99.999999123,
  "memory_total": 99
}


var job_about={
      "version": "0.1.0",
      "jdk": "1.7",
      "builder": "test"
}

var master_log= {
    "url": "http://hdp3.tbc.tbsite.net:8042/node/containerlogs/container_1450160119977_0011_01_000001/wenlong.lwl"
}

var failover_history =
{
  "mode": "EXACTLY_ONCE",
  "failoverHistoryRecords": [
    {
      "timestamp": 1,
      "vertexID": "123",
      "vertexName": "test",
      "executionAttemptID": "attempt_1",
      "state": "FAILED",
      "message": "Failure",
      "mode": "at_least_once"
    },
    {
      "timestamp": 1,
      "vertexID": "123",
      "vertexName": "test",
      "executionAttemptID": "attempt_1",
      "state": "FAILED",
      "message": "Failure",
      "mode": "at_least_once"
    },
    {
      "timestamp": 1,
      "vertexID": "123",
      "vertexName": "test",
      "executionAttemptID": "attempt_1",
      "state": "FAILED",
      "message": "Failure",
      "mode": "at_least_once"
    },
    {
      "timestamp": 1,
      "vertexID": "123",
      "vertexName": "test",
      "executionAttemptID": "attempt_1",
      "state": "FAILED",
      "message": "Failure",
      "mode": "at_least_once"
    }
  ]
}

var execution_log={
    "url": "http://hdp12.tbc.tbsite.net:8042/node/containerlogs/container_1450160119977_0011_01_000008/wenlong.lwl"
}

var checkpoints = {
    "pending_checkpoint_info": [
    {
        "id": 1,
        "start_time": 1,
        "ack_task_num": 1,
        "no_ack_task_num": 1,
        "no_ack_task_detail": "123\n\t123"
    },
    {
        "id": 2,
        "start_time": 1,
        "ack_task_num": 1,
        "no_ack_task_num": 1,
        "no_ack_task_detail": 2
     }],
     "completed_checkpoint_info": [
    {
         "id": 3,
         "start_time": 1,
         "duration": 1
    },
    {
         "id": 2,
         "start_time": 1,
         "duration": 1
    }]
}


var execution_metrics={
    "total": 24,
    "metrics": [
        {
            "group": "system",
            "name": "num_records_out",
            "description": "num_records_out",
            "value": 2966.0
        },
        {
            "group": "system",
            "name": "num_records_in",
            "description": "num_records_in",
            "value": 7385.0
        },
        {
            "group": "system",
            "name": "num_bytes_out",
            "description": "num_bytes_out",
            "value": 49526.0
        },
        {
            "group": "system",
            "name": "queue_in_usage",
            "description": "num_bytes_out",
            "value": 0.2
        },
        {
            "group": "system",
            "name": "latency_75",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_95",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_99",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_average",
            "description": "latency",
            "value": 0.008530805687203791
        },
        {
            "group": "system",
            "name": "latency_max",
            "description": "latency",
            "value": 3.0
        },
        {
            "group": "system",
            "name": "latency_median",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_min",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "TPS",
            "description": "TPS",
            "value": 4.0796890045061645
        },
        {
            "group": "system",
            "name": "num_bytes_in",
            "description": "num_bytes_in",
            "value":  1034814599.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "value": 1614.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "value": 21.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "value": 0.006636764356150898
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "value": 0.006636764356150898
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "value": 1.337233320668882
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-tps",
            "value": 0.8923906282396848
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-tps",
            "value": 0.009955135522578247
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test2-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test2-total-count",
            "value": 6.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-count",
            "value": 12.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-count",
            "value": 18.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-tps",
            "value": 0.38932045331500287
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test2-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test2-total-tps",
            "value": 0.003318160124453126
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-tps",
            "value": 0.011610407790694202
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-count",
            "value": 2418.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-count",
            "value": 704.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example-total-count",
            "value": 1614.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example-total-tps",
            "value": 0.892440958727094
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-count",
            "value": 12.0
        }
    ]
}
var executions={
    "total": 2,
    "executions": [
        {
            "id": "8df70e101cd465435de28c11ea849492",
            "status": "RUNNING",
            "start_time": 1.450164790481E12,
            "duration": 1764252.0,
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "group": "system",
                        "name": "num_bytes_out",
                        "description": "num_bytes_out",
                        "value": 535.0
                    },
                    {
                        "group": "system",
                        "name": "latency_75",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_95",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_99",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_average",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_max",
                        "description": "latency",
                        "value": 1.401298464324817E-45
                    },
                    {
                        "group": "system",
                        "name": "latency_median",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_min",
                        "description": "latency",
                        "value": 3.4028234663852886E38
                    },
                    {
                        "group": "system",
                        "name": "num_bytes_in",
                        "description": "num_bytes_in",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_out",
                        "description": "num_records_out",
                        "value": 10.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_in",
                        "description": "num_records_in",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "queue_in_usage",
                        "description": "latency",
                        "value": 0.2
                    },
                    {
                        "group": "system",
                        "name": "queue_out_usage",
                        "description": "latency",
                        "value": 0.2
                    },
                    {
                        "group": "system",
                        "name": "TPS",
                        "description": "TPS",
                        "value": 0.0
                    }
                ]
            }
        },
        {
            "id": "8df70e101cd465435de28c11ea849493",
            "status": "FAILED",
            "start_time": 1.450064890481E12,
            "duration": 1764252.0,
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "group": "system",
                        "name": "num_bytes_out",
                        "description": "num_bytes_out",
                        "value": 535.0
                    },
                    {
                        "group": "system",
                        "name": "latency_75",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_95",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_99",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_average",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_max",
                        "description": "latency",
                        "value": 1.401298464324817E-45
                    },
                    {
                        "group": "system",
                        "name": "latency_median",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_min",
                        "description": "latency",
                        "value": 3.4028234663852886E38
                    },
                    {
                        "group": "system",
                        "name": "num_bytes_in",
                        "description": "num_bytes_in",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_out",
                        "description": "num_records_out",
                        "value": 10.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_in",
                        "description": "num_records_in",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "queue_in_usage",
                        "description": "latency",
                        "value": 0.3
                    },
                    {
                        "group": "system",
                        "name": "queue_out_usage",
                        "description": "latency",
                        "value": 0.5
                    },
                    {
                        "group": "system",
                        "name": "TPS",
                        "description": "TPS",
                        "value": 0.0
                    }
                ]
            }
        }
    ]
}



var execution_vertex_metrics ={
    "total": 24,
    "metrics": [
        {
            "group": "system",
            "name": "num_bytes_out",
            "description": "num_bytes_out",
            "value": 49526.0
        },
        {
            "group": "system",
            "name": "latency_75",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_95",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_99",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_average",
            "description": "latency",
            "value": 0.008530805687203791
        },
        {
            "group": "system",
            "name": "latency_max",
            "description": "latency",
            "value": 3.0
        },
        {
            "group": "system",
            "name": "latency_median",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "latency_min",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "num_bytes_in",
            "description": "num_bytes_in",
            "value": 348145.0
        },
        {
            "group": "system",
            "name": "num_records_out",
            "description": "num_records_out",
            "value": 966.0
        },
        {
            "group": "system",
            "name": "num_records_in",
            "description": "num_records_in",
            "value": 7385.0
        },
        {
            "group": "system",
            "name": "TPS",
            "description": "TPS",
            "value": 4.352058874487447
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "value": 1614.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "value": 21.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "value": 0.00708039374069592
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "value": 0.00708039374069592
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "value": 1.4266151637745947
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-tps",
            "value": 0.9520242311991435
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-tps",
            "value": 0.01062057807806479
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test2-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test2-total-count",
            "value": 6.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-count",
            "value": 12.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-count",
            "value": 18.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-tps",
            "value": 0.4153416834317607
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test2-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test2-total-tps",
            "value": 0.003539944139681476
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-tps",
            "value": 0.012386216382481642
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example-total-count",
            "value": 1614.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-count",
            "value": 704.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-count",
            "value": 2418.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-count",
            "value": 12.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example-total-tps",
            "value": 0.9520809516562316
        }
    ]
}

var configure = {
    "total": 2,
    "configs": [
        {
            "name": "dfs.datanode.data.dir",
            "value": "file:///dump/2/dfs/data,file:///dump/3/dfs/data,file:///dump/4/dfs/data,file:///dump/5/dfs/data,file:///dump/6/dfs/data,file:///dump/7/dfs/data,file:///dump/8/dfs/data,file:///dump/9/dfs/data,[SSD]file:///dump/10/dfs/data,[SSD]file:///dump/11/dfs/data,[SSD]file:///dump/1/dfs/data"
        },
        {
            "name": "dfs.namenode.checkpoint.txns",
            "value": "40000000"
        }
    ]
}

var execution_job_vertex_metrics = {
    "total": 24,
    "metrics": [
        {
            "group": "system",
            "name": "num_bytes_out",
            "description": "num_bytes_out",
            "value": 204635.0
        },
        {
            "group": "system",
            "name": "latency_max",
            "description": "latency",
            "value": 3.0
        },
        {
            "group": "system",
            "name": "latency_min",
            "description": "latency",
            "value": 0.0
        },
        {
            "group": "system",
            "name": "num_bytes_in",
            "description": "num_bytes_in",
            "value": 1371229.0
        },
        {
            "group": "system",
            "name": "num_records_out",
            "description": "num_records_out",
            "value": 4001.0
        },
        {
            "group": "system",
            "name": "num_records_in",
            "description": "num_records_in",
            "value": 28894.0
        },
        {
            "group": "system",
            "name": "TPS",
            "description": "TPS",
            "value": 13.999387229098975
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-count",
            "value": 7061.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-count",
            "value": 158.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-tps",
            "value": 0.015641239496602122
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-tps",
            "value": 0.015641239496602122
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-tps",
            "value": 3.025732191362966
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example4-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example4-total-tps",
            "value": 3.5487280879224876
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-tps",
            "value": 0.14402959083450373
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test2-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test2-total-count",
            "value": 36.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test3-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test3-total-count",
            "value": 36.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/hardcopy.7-total-count",
            "value": 239.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-tps",
            "value": 1.6297767445700022
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test2-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/test2-total-tps",
            "value": 0.019550186697770883
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/blink-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/blink-total-tps",
            "value": 0.0892515579220289
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example3-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example3-total-count",
            "value": 7061.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/stream_checkpointing.html-total-count",
            "value": 3205.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/example-total-count",
            "value": 7061.0
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/example-total-tps",
            "description": "hdfs://hdp/user/wenlong.lwl/example-total-tps",
            "value": 3.5489777175774524
        },
        {
            "group": "user",
            "name": "hdfs://hdp/user/wenlong.lwl/test-total-count",
            "description": "hdfs://hdp/user/wenlong.lwl/test-total-count",
            "value": 36.0
        }
    ]
}
var execution_vertices = {
    "total": 4,
    "execution_vertices": [
        {
            "id": "0",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "CANCELING",
            "start_time": 0,
            "duration": 1652446.0,
            "stop_time": 0,
            "execution_summary": {
                "CREATED": 0,
                "SCHEDULED": 0,
                "DEPLOYING": 0,
                "RUNNING": 1,
                "FINISHED": 0,
                "CANCELING": 2,
                "CANCELED": 1,
                "FAILED": 0
            },
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "group": "system",
                        "name": "num_bytes_out",
                        "description": "num_bytes_out",
                        "value": 49526.0
                    },
                    {
                        "group": "system",
                        "name": "latency_75",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_95",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_99",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_average",
                        "description": "latency",
                        "value": 0.008530805687203791
                    },
                    {
                        "group": "system",
                        "name": "latency_max",
                        "description": "latency",
                        "value": 3.0
                    },
                    {
                        "group": "system",
                        "name": "latency_median",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_min",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "num_bytes_in",
                        "description": "num_bytes_in",
                        "value": 348145.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_out",
                        "description": "num_records_out",
                        "value": 966.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_in",
                        "description": "num_records_in",
                        "value": 7385.0
                    },
                    {
                        "group": "system",
                        "name": "TPS",
                        "description": "TPS",
                        "value": 4.53995529511861
                    },
                    {
                        "group": "system",
                        "name": "queue_in_usage",
                        "description": "latency",
                        "value": 0.2
                    },
                    {
                        "group": "system",
                        "name": "queue_out_usage",
                        "description": "latency",
                        "value": 0.2
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1011"
        },
        {
            "id": "1",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "RUNNING",
            "start_time": 1.450154790481E12,
            "duration": 1652446.0,
            "stop_time": 1.45016481626E12,
            "execution_summary": {
                "CREATED": 0,
                "SCHEDULED": 0,
                "DEPLOYING": 0,
                "RUNNING": 1,
                "FINISHED": 0,
                "CANCELING": 0,
                "CANCELED": 0,
                "FAILED": 0
            },
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "group": "system",
                        "name": "num_bytes_out",
                        "description": "num_bytes_out",
                        "value": 52321.0
                    },
                    {
                        "group": "system",
                        "name": "latency_75",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_95",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_99",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_average",
                        "description": "latency",
                        "value": 0.008413624643777989
                    },
                    {
                        "group": "system",
                        "name": "latency_max",
                        "description": "latency",
                        "value": 1.0
                    },
                    {
                        "group": "system",
                        "name": "latency_median",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_min",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "num_bytes_in",
                        "description": "num_bytes_in",
                        "value": 348280.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_out",
                        "description": "num_records_out",
                        "value": 1021.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_in",
                        "description": "num_records_in",
                        "value": 7369.0
                    },
                    {
                        "group": "system",
                        "name": "TPS",
                        "description": "TPS",
                        "value": 4.529782288913928
                    },
                    {
                        "group": "system",
                        "name": "queue_in_usage",
                        "description": "latency",
                        "value": 0.3
                    },
                    {
                        "group": "system",
                        "name": "queue_out_usage",
                        "description": "latency",
                        "value": 0.7
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1012"
        },
        {
            "id": "12",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "RUNNING",
            "start_time": 1.450164790481E12,
            "duration": 1652447.0,
            "stop_time": 1.450164816534E12,
            "execution_summary": {
                "CREATED": 0,
                "SCHEDULED": 0,
                "DEPLOYING": 0,
                "RUNNING": 1,
                "FINISHED": 0,
                "CANCELING": 0,
                "CANCELED": 0,
                "FAILED": 0
            },
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "group": "system",
                        "name": "num_bytes_out",
                        "description": "num_bytes_out",
                        "value": 52624.0
                    },
                    {
                        "group": "system",
                        "name": "latency_75",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_95",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_99",
                        "description": "latency",
                        "value": 1.0
                    },
                    {
                        "group": "system",
                        "name": "latency_average",
                        "description": "latency",
                        "value": 0.013241937996572676
                    },
                    {
                        "group": "system",
                        "name": "latency_max",
                        "description": "latency",
                        "value": 1.0
                    },
                    {
                        "group": "system",
                        "name": "latency_median",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_min",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "num_bytes_in",
                        "description": "num_bytes_in",
                        "value": 308564.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_out",
                        "description": "num_records_out",
                        "value": 1029.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_in",
                        "description": "num_records_in",
                        "value": 6419.0
                    },
                    {
                        "group": "system",
                        "name": "queue_in_usage",
                        "description": "latency",
                        "value": 0.1
                    },
                    {
                        "group": "system",
                        "name": "queue_out_usage",
                        "description": "latency",
                        "value": 0.9
                    },
                    {
                        "group": "system",
                        "name": "TPS",
                        "description": "TPS",
                        "value": 3.946469664934335
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1013"
        },
        {
            "id": "3",
            "name": "Fast TumblingTimeWindows(60000) of Reduce at main(FileLineCountAndWordCountWithCounter.java:120)",
            "status": "RUNNING",
            "start_time": 1.450164790481E12,
            "duration": 1652447.0,
            "stop_time": 1.450164816526E12,
            "execution_summary": {
                "CREATED": 0,
                "SCHEDULED": 0,
                "DEPLOYING": 0,
                "RUNNING": 1,
                "FINISHED": 0,
                "CANCELING": 0,
                "CANCELED": 0,
                "FAILED": 0
            },
            "metric_summary": {
                "total": 6,
                "metrics": [
                    {
                        "group": "system",
                        "name": "num_bytes_out",
                        "description": "num_bytes_out",
                        "value": 50164.0
                    },
                    {
                        "group": "system",
                        "name": "latency_75",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_95",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_99",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_average",
                        "description": "latency",
                        "value": 0.009843284548633596
                    },
                    {
                        "group": "system",
                        "name": "latency_max",
                        "description": "latency",
                        "value": 1.0
                    },
                    {
                        "group": "system",
                        "name": "latency_median",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "latency_min",
                        "description": "latency",
                        "value": 0.0
                    },
                    {
                        "group": "system",
                        "name": "num_bytes_in",
                        "description": "num_bytes_in",
                        "value": 366240.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_out",
                        "description": "num_records_out",
                        "value": 985.0
                    },
                    {
                        "group": "system",
                        "name": "num_records_in",
                        "description": "num_records_in",
                        "value": 7721.0
                    },
                    {
                        "group": "system",
                        "name": "queue_in_usage",
                        "description": "latency",
                        "value": 0.111
                    },
                    {
                        "group": "system",
                        "name": "queue_out_usage",
                        "description": "latency",
                        "value": 0.2222
                    },
                    {
                        "group": "system",
                        "name": "TPS",
                        "description": "TPS",
                        "value": 4.7469298043374675
                    }
                ]
            },
            "host": "1.2.3.4",
            "port": "1014"
        }
    ]
}
var job_vertices= {
    "total":7,
    "job_vertices":[{
        "id":"51079cf65c9a38dac3086c2aa0596b48",
        "topology_id":0,
        "name":"Source: PayTTTableSource -> PayTTTableParse -> PayTTTableSelect -> OrderTableFilter -> OrderTableShuffle",
        "status":"RUNNING",
        "start_time":1.477561990327E12,
        "duration":4413765.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":40,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":31.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":31.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":31.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":31.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":31.0},
                {"name":"lag_avg","value":1305.8462},
                {"name":"lag_cnt","value":13.0},
                {"name":"lag_max","value":1666.0},
                {"name":"lag_min","value":1055.0},
                {"name":"lag_sum","value":16976.0},
                {"name":"latency_avg","value":0.2772},
                {"name":"latency_cnt","value":13.0},
                {"name":"latency_max","value":0.3652},
                {"name":"latency_min","value":0.1346},
                {"name":"latency_sum","value":3.603},
                {"name":"num_records_out_avg","value":1.1077770375E7},
                {"name":"num_records_out_cnt","value":32.0},
                {"name":"num_records_out_max","value":1.1157816E7},
                {"name":"num_records_out_min","value":1.1015872E7},
                {"name":"num_records_out_sum","value":3.54488652E8},
                {"name":"tps_avg","value":0.0271},
                {"name":"tps_cnt","value":32.0},
                {"name":"tps_max","value":0.1333},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":0.8667}
            ]
        },
        "parallelism":32,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"061abcbfd3f5323cef8be00e311a9796",
        "topology_id":1,
        "name":"OrderTableReduce -> OrderTableSelect",
        "status":"RUNNING","start_time":1.47756199133E12,
        "duration":4412764.0,"stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":31.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":31.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":31.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":31.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":31.0},
                {"name":"latency_avg","value":0.2962},
                {"name":"latency_cnt","value":14.0},
                {"name":"latency_max","value":0.3341},
                {"name":"latency_min","value":0.202},
                {"name":"latency_sum","value":4.1467},
                {"name":"delay_avg","value":62.1429},
                {"name":"delay_cnt","value":14.0},
                {"name":"delay_max","value":92.0},
                {"name":"delay_min","value":0.0},
                {"name":"delay_sum","value":870.0},
                {"name":"num_records_in_avg","value":1.15279309688E7},
                {"name":"num_records_in_cnt","value":32.0},
                {"name":"num_records_in_max","value":1.2103076E7},
                {"name":"num_records_in_min","value":1.0950114E7},
                {"name":"num_records_in_sum","value":3.68893791E8},
                {"name":"num_records_out_avg","value":1.1525119625E7},
                {"name":"num_records_out_cnt","value":32.0},
                {"name":"num_records_out_max","value":1.2100214E7},
                {"name":"num_records_out_min","value":1.0947316E7},
                {"name":"num_records_out_sum","value":3.68803828E8},
                {"name":"tps_avg","value":0.0292},
                {"name":"tps_cnt","value":32.0},
                {"name":"tps_max","value":0.5333},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":0.9333}
            ]
        },
        "parallelism":32,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"e51e9f749310276ab9703f7fee060428",
        "topology_id":2,
        "name":"OrderTableUnique -> (KeyedOrderTableSelect, AllSellerTableD1021Shuffle, AllItemTableD1022Shuffle)",
        "status":"RUNNING",
        "start_time":1.477561992982E12,
        "duration":4411115.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":31.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":31.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":31.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":31.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":31.0},
                {"name":"latency_avg","value":0.185},
                {"name":"latency_cnt","value":3969.0},
                {"name":"latency_max","value":12.4724},
                {"name":"latency_min","value":0.0571},
                {"name":"latency_sum","value":734.1043},
                {"name":"delay_avg","value":54.7072},
                {"name":"delay_cnt","value":3969.0},
                {"name":"delay_max","value":155.0},
                {"name":"delay_min","value":1.0},
                {"name":"delay_sum","value":217133.0},
                {"name":"num_records_in_avg","value":1.1525119625E7},
                {"name":"num_records_in_cnt","value":32.0},
                {"name":"num_records_in_max","value":1.2100254E7},
                {"name":"num_records_in_min","value":1.0947292E7},
                {"name":"num_records_in_sum","value":3.68803828E8},
                {"name":"num_records_out_avg","value":3.38171765938E7},
                {"name":"num_records_out_cnt","value":32.0},
                {"name":"num_records_out_max","value":3.5480204E7},
                {"name":"num_records_out_min","value":3.2139113E7},
                {"name":"num_records_out_sum","value":1.082149651E9},
                {"name":"tps_avg","value":8.2689},
                {"name":"tps_cnt","value":32.0},
                {"name":"tps_max","value":81.4667},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":264.6052}
            ]
        },
        "parallelism":32,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":32,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"95fde309623c534a1d310b5e692cc788",
        "topology_id":3,
        "name":"TypedOrderTableCrossApply -> TypedOrderTableSelect -> (Type5OrderTableFilter -> (BuyerTableD1011Shuffle, ResultTableD1012Filter -> ResultTableD1012Select), Type2OrderTableFilter -> (TypedSellerTableD1021Shuffle, TypedItemTableD1022Shuffle, ResultTableD1023Filter -> ResultTableD1023Select))",
        "status":"RUNNING",
        "start_time":1.477561993353E12,
        "duration":4410746.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":159.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":159.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":159.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":159.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":159.0},
                {"name":"latency_avg","value":0.5885},
                {"name":"latency_cnt","value":13701.0},
                {"name":"latency_max","value":311.4605},
                {"name":"latency_min","value":0.1431},
                {"name":"latency_sum","value":8063.0442},
                {"name":"delay_avg","value":47.2507},
                {"name":"delay_cnt","value":13701.0},
                {"name":"delay_max","value":463.0},
                {"name":"delay_min","value":-1.0},
                {"name":"delay_sum","value":647382.0},
                {"name":"num_records_in_avg","value":2331645.9063},
                {"name":"num_records_in_cnt","value":160.0},
                {"name":"num_records_in_max","value":2331663.0},
                {"name":"num_records_in_min","value":2331631.0},
                {"name":"num_records_in_sum","value":3.73063345E8},
                {"name":"num_records_out_avg","value":770792.9125},
                {"name":"num_records_out_cnt","value":160.0},
                {"name":"num_records_out_max","value":775311.0},
                {"name":"num_records_out_min","value":765643.0},
                {"name":"num_records_out_sum","value":1.23326866E8},
                {"name":"tps_avg","value":5.7092},
                {"name":"tps_cnt","value":160.0},
                {"name":"tps_max","value":14.3333},
                {"name":"tps_min","value":0.0},
                {"name":"tps_sum","value":913.4649}
            ]
        },
        "parallelism":160,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":160,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"44214664264953a481526820a1ff81df",
        "topology_id":4,
        "name":"BuyerTableD1011Reduce -> BuyerTableD1011Select -> FilterBuyerTableD1011Filter -> FilterBuyerTableD1011Select",
        "status":"RUNNING",
        "start_time":1.477561996951E12,
        "duration":4407157.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":1.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":1.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":1.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":1.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":1.0},
                {"name":"latency_avg","value":0.1689},
                {"name":"latency_cnt","value":397.0},
                {"name":"latency_max","value":0.8277},
                {"name":"latency_min","value":0.0228},
                {"name":"latency_sum","value":67.0639},
                {"name":"delay_avg","value":51.0856},
                {"name":"delay_cnt","value":397.0},
                {"name":"delay_max","value":101.0},
                {"name":"delay_min","value":0.0},
                {"name":"delay_sum","value":20281.0},
                {"name":"num_records_in_avg","value":7637931.0},
                {"name":"num_records_in_cnt","value":2.0},
                {"name":"num_records_in_max","value":7713089.0},
                {"name":"num_records_in_min","value":7562773.0},
                {"name":"num_records_in_sum","value":1.5275862E7},
                {"name":"num_records_out_avg","value":346595.5},
                {"name":"num_records_out_cnt","value":2.0},
                {"name":"num_records_out_max","value":414516.0},
                {"name":"num_records_out_min","value":278675.0},
                {"name":"num_records_out_sum","value":693191.0},
                {"name":"tps_avg","value":13.2333},
                {"name":"tps_cnt","value":2.0},
                {"name":"tps_max","value":14.3333},
                {"name":"tps_min","value":12.1333},
                {"name":"tps_sum","value":26.4667}
            ]
        },
        "parallelism":2,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":2,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"d1204a822419eac4c32821608aee8141",
        "topology_id":5,
        "name":"FilterBuyerTableD1011Unique",
        "status":"RUNNING",
        "start_time":1.477561998274E12,
        "duration":4405834.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":45,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":1.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":1.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":1.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":1.0},
                {"name":"queue_out_per_cnt","value":1.0},
                {"name":"queue_out_per_max","value":1.0},
                {"name":"queue_out_per_min","value":1.0},
                {"name":"queue_out_per_sum","value":1.0},
                {"name":"latency_avg","value":0.1057},
                {"name":"latency_cnt","value":5.0},
                {"name":"latency_max","value":0.1675},
                {"name":"latency_min","value":0.0269},
                {"name":"latency_sum","value":0.5286},
                {"name":"delay_avg","value":63.4},
                {"name":"delay_cnt","value":5.0},
                {"name":"delay_max","value":91.0},
                {"name":"delay_min","value":25.0},
                {"name":"delay_sum","value":317.0},
                {"name":"num_records_in_avg","value":693191.0},
                {"name":"num_records_in_cnt","value":1.0},
                {"name":"num_records_in_max","value":693191.0},
                {"name":"num_records_in_min","value":693191.0},
                {"name":"num_records_in_sum","value":693191.0},
                {"name":"num_records_out_avg","value":68505.0},
                {"name":"num_records_out_cnt","value":1.0},
                {"name":"num_records_out_max","value":68505.0},
                {"name":"num_records_out_min","value":68505.0},
                {"name":"num_records_out_sum","value":68505.0},
                {"name":"tps_avg","value":0.3334},{"name":"tps_cnt","value":1.0},
                {"name":"tps_max","value":0.3334},{"name":"tps_min","value":0.3334},
                {"name":"tps_sum","value":0.3334}
            ]
        },
        "parallelism":1,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":1,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    },{
        "id":"2400d839e54ec466ff6126c42d9f24ec",
        "topology_id":6,
        "name":"ResultTableD1011Join -> ResultTableD1011TTAssembler -> Sink: ResultTableD1011TTSink",
        "status":"RUNNING",
        "start_time":1.477561998388E12,
        "duration":4405721.0,
        "stop_time":-1.0,
        "metric_summary":{
            "total":40,
            "metrics":[
                {"name":"queue_in_cnt_avg","value":0.0},
                {"name":"queue_in_cnt_cnt","value":7.0},
                {"name":"queue_in_cnt_max","value":0.0},
                {"name":"queue_in_cnt_min","value":0.0},
                {"name":"queue_in_cnt_sum","value":0.0},
                {"name":"queue_out_cnt_avg","value":0.0},
                {"name":"queue_out_cnt_cnt","value":7.0},
                {"name":"queue_out_cnt_max","value":0.0},
                {"name":"queue_out_cnt_min","value":0.0},
                {"name":"queue_out_cnt_sum","value":0.0},
                {"name":"queue_in_per_avg","value":0.0},
                {"name":"queue_in_per_cnt","value":7.0},
                {"name":"queue_in_per_max","value":0.0},
                {"name":"queue_in_per_min","value":0.0},
                {"name":"queue_in_per_sum","value":0.0},
                {"name":"queue_out_per_avg","value":0.0},
                {"name":"queue_out_per_cnt","value":7.0},
                {"name":"queue_out_per_max","value":0.0},
                {"name":"queue_out_per_min","value":0.0},
                {"name":"queue_out_per_sum","value":0.0},
                {"name":"latency_avg","value":0.323},
                {"name":"latency_cnt","value":380.0},
                {"name":"latency_max","value":1.8307},
                {"name":"latency_min","value":0.0495},
                {"name":"latency_sum","value":122.7489},
                {"name":"delay_avg","value":52.1895},
                {"name":"delay_cnt","value":380.0},
                {"name":"delay_max","value":122.0},
                {"name":"delay_min","value":1.0},
                {"name":"delay_sum","value":19832.0},
                {"name":"num_records_in_avg","value":2459599.875},
                {"name":"num_records_in_cnt","value":8.0},
                {"name":"num_records_in_max","value":2567739.0},
                {"name":"num_records_in_min","value":2418941.0},
                {"name":"num_records_in_sum","value":1.9676799E7},
                {"name":"tps_avg","value":3.1666},
                {"name":"tps_cnt","value":8.0},
                {"name":"tps_max","value":5.133},
                {"name":"tps_min","value":2.1333},
                {"name":"tps_sum","value":25.3328}
            ]
        },
        "parallelism":8,
        "execution_summary":{"CREATED":0,"SCHEDULED":0,"DEPLOYING":0,"RUNNING":8,"FINISHED":0,"CANCELING":0,"CANCELED":0,"FAILED":0}
    }
    ]
};

var execution_job_vertex_info = {
    "job_id":"a61190fce96b021d63107a1c4c3b7c4e",
    "job_vertex_id":"717c7b8afebbfb7137f6f0f99beb2a94",
    "job_name":"TaobaoAntiSpamD101",
    "job_vertex_index":0,
    "job_vertex_name":"Source: PayTTTableSource -> PayTTTableParse -> PayTTTableSelect -> OrderTableFilter -> OrderTableShuffle"
};

var plan = {
    "jid":"6679a5480e8c496f3c6a4a87edaae2e2",
    "name":"pora-ML-592",
    "nodes":[{
        "id":"51079cf65c9a38dac3086c2aa0596b48",
        "parallelism":26,
        "description":"Source: Source_search_pay_log_press -> Parse_search_pay_log_press -> MarkPartitionId_search_pay_log_press",
        "vcore":1.0,"memory":2702.0,"topology_id":"0",
        "inputs":[],
        "delay":561.5820072393678,
        "latency":0.040978552755917816,
        "tps":1635.6623624722365
    },{
        "id":"061abcbfd3f5323cef8be00e311a9796",
        "parallelism":1024,
        "description":"Source: Source_wireless_search_item_pv_413 -> Parse_wireless_search_item_pv_413 -> MarkPartitionId_wireless_search_item_pv_413",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"1",
        "inputs":[],
        "delay":1476.2328656790578,
        "latency":0.09595755705477767,
        "tps":2229.9211421469063
    },{
        "id":"e51e9f749310276ab9703f7fee060428",
        "parallelism":16,
        "description":"Source: Source_member_cart_571 -> Parse_member_cart_571 -> MarkPartitionId_member_cart_571",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"2",
        "inputs":[],
        "delay":543.154579539551,
        "latency":0.03552229369454256,
        "tps":7315.654362099118
    },{
        "id":"7a36df305393ff3b14bd89202b4bc183",
        "parallelism":42,
        "description":"Source: Source_aplus_293 -> Parse_aplus_293 -> MarkPartitionId_aplus_293",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"3",
        "inputs":[],
        "delay":547.7930303893829,
        "latency":0.06861035255877446,
        "tps":3212.1075949580304
    },{
        "id":"2ee7a39ec2512c9d64ab5037764195a7",
        "parallelism":32,
        "description":"Source: Source_pre_antispam_merge -> Parse_pre_antispam_merge -> MarkPartitionId_pre_antispam_merge",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"4",
        "inputs":[],
        "delay":605.8416038710653,
        "latency":0.03499716287826755,
        "tps":8431.086962674863
    },{
        "id":"44214664264953a481526820a1ff81df",
        "parallelism":52,
        "description":"Source: Source_dwd_tb_trd_pay_ri_247 -> Parse_dwd_tb_trd_pay_ri_247 -> MarkPartitionId_dwd_tb_trd_pay_ri_247",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"5",
        "inputs":[],
        "delay":619.7676654554822,
        "latency":0.06856083069539724,
        "tps":5215.650628055518
    },{
        "id":"d1204a822419eac4c32821608aee8141",
        "parallelism":512,
        "description":"Source: Source_app_taobao_page_sys_246 -> Parse_app_taobao_page_sys_246 -> MarkPartitionId_app_taobao_page_sys_246",
        "vcore":1.0,
        "memory":2702.0,
        "topology_id":"6",
        "inputs":[],
        "delay":749.2987332120526,
        "latency":0.04740494354064629,
        "tps":2107.65350018741
    },{
        "id":"2400d839e54ec466ff6126c42d9f24ec",
        "parallelism":3001,
        "description":"FilterEmptyShuffleKey -> JoinData -> future wait operator -> AccumulateItemFeature -> CombineRequests_HBaseSink -> Sink: HBaseSink",
        "vcore":2.0,
        "memory":11003.0,
        "topology_id":"7",
        "inputs":[
            {"num":"0","id":"51079cf65c9a38dac3086c2aa0596b48","exchange":"pipelined"},{"num":"1","id":"061abcbfd3f5323cef8be00e311a9796","exchange":"pipelined"},{"num":"2","id":"e51e9f749310276ab9703f7fee060428","exchange":"pipelined"},{"num":"3","id":"7a36df305393ff3b14bd89202b4bc183","exchange":"pipelined"},{"num":"4","id":"2ee7a39ec2512c9d64ab5037764195a7","exchange":"pipelined"},{"num":"5","id":"44214664264953a481526820a1ff81df","exchange":"pipelined"},{"num":"6","id":"d1204a822419eac4c32821608aee8141","exchange":"pipelined"}
        ],
        "delay":53.599054383080436,
        "latency":0.07500380808887504,
        "tps":1301.1116685507332
    }
    ]
};

var plan =
{
	"jid": "227a6c336c3addfba5b38892c83d3d3c",
	"name": "Async I/O Example",
	"nodes": [{
		"id": "e0c2ef4b6dbb44ed9c33c168f57be73d",
		"parallelism": 1,
		"operator": "",
		"operator_strategy": "",
		"description": "Keyed Aggregation -&gt; Sink: Unnamed",
		"inputs": [{
			"num": 0,
			"id": "1d0d2e8d48049291d53be1107285639d",
			"ship_strategy": "HASH",
			"exchange": "pipelined"
		}],
		"optimizer_properties": {},
		"vcore": 0.0,
		"memory": 0.0,
		"delay": 0.0,
		"latency": 0.0,
		"tps": 1.0,
        "topology_id":"0"
	}, {
		"id": "1d0d2e8d48049291d53be1107285639d",
		"parallelism": 1,
		"operator": "",
		"operator_strategy": "",
		"description": "Source: Custom Source -&gt; async wait operator -&gt; Flat Map",
		"inputs:":[],
		"optimizer_properties": {},
		"vcore": 0.0,
		"memory": 0.0,
		"delay": 0.0,
		"latency": 0.0,
		"tps": 1.0,
        "topology_id":"1"
	}]
}
