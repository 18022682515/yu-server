const numCPUs = require('os').cpus().length;
const { getType } = require('yu-util');
const init = require('./init.js');
const runLog = require('../runLog.js');

module.exports = (root,cluster)=>{
    // init(root);
    const { loggerApp } = runLog(root,'主进程');
    loggerApp.info('启动');

    process.on('uncaughtException',err=>{
        loggerApp.error(err);
    });

    for (let i = 0; i < numCPUs; i++) {
        let worker = cluster.fork();
        if(i===0) worker.send({ taskBool:true });
    }
    cluster.on('message', (worker, message, handle)=>{
        if(getType(message)!=='Object') return;

        if(message.logger || message.cache || message.delete_id){
            Object.keys(cluster.workers).forEach(pid=>{
                cluster.workers[pid].send(message);
            });
        }
        Object.keys(message).forEach(key=>{
            if(!key.startsWith('sess_id')) return;
            Object.keys(cluster.workers).forEach(pid=>{
                cluster.workers[pid].send(message);
            });
        });
    });

    cluster.on('exit', (worker, code, signal) => {
        loggerApp.info(`工作进程 ${worker.process.pid} 已退出`);
        cluster.fork();
        Object.keys(cluster.workers).forEach((pid,i)=>{
            if(i===0){
                cluster.workers[pid].send({ taskBool:true });
            }else{
                cluster.workers[pid].send({ taskBool:false });
            }
        });
    });
}
    