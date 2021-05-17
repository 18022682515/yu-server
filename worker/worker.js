const path = require('path');
const runLog = require('../runLog.js');
const runServer = require('./server.js');
const runMysql = require('./mysql.js');
const runTasks = require('./timedTask.js');
const addAppProperty = require('./addAppProperty.js');


module.exports = function(root) {
	return new Promise(res=>{
		const { appLogger,requestLogger } = runLog(root, '工作进程');
		
		appLogger.info('启动');
		
		const config = require(path.join(root, 'config.js'));
		const servers = runServer(root, config, appLogger,requestLogger);
		const mysql = config.mysql ? runMysql(config.mysql) :null;
		const tasks = runTasks(root);
		addAppProperty({ servers,mysql,tasks,'cache':{} });
		
		res();
	})
}
