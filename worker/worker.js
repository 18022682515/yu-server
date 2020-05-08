const path = require('path');
const runLog = require('../runLog.js');
const runServer = require('./server.js');
const runMysql = require('./mysql.js');
const { startAllTask,clearAllTask } = require('./timedTask.js');


module.exports = function(root){
    const { loggerApp,loggerRequest } = runLog(root,'工作进程');
    
    loggerApp.info('启动');

    const config = require(path.join(root,'config.js'));
    const servers = runServer(root,config,loggerApp,loggerRequest);
    app.mysql = runMysql(config.mysql);
    
    const entry = require(path.join(root,'worker','entry.js'));
    Object.keys(servers).forEach(key=>{
        entry(servers[key]);
    });
    startAllTask(root);

}




