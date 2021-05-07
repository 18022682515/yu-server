const path = require('path');
const CronJob = require('cron').CronJob;
const {
	getType
} = require('yu-util');
const {
	getTasks
} = require('./getAll.js');

function setTask(timing, callback) {
	if (!getType(callback).includes('Function')) return;
	timing = getType(timing) === 'String' ? timing : '* * * * * *';
	return new CronJob(timing, callback, null, true);
}

function addTaskList(root) {
	let tasks = getTasks(path.join(root, 'appTask'));
	Object.keys(tasks).forEach(key => {
		let taskArr = tasks[key];
		if (getType(taskArr) !== 'Array') return;
		app.taskList.push(...taskArr);
	});
	app.taskList.push({
		timing: '0 0 3 * * *',
		callback: () => {
			Object.keys(app.context).forEach(key => {
				if (key.startsWith('sess_id')) {
					if (Date.now() > app.context[key].maxAge) {
						Reflect.deleteProperty(app.context, key);
					}
				}
			});
		},
	});
}

exports.startAllTask = function(root) {
	if (app.taskList.length > 0) return;
	addTaskList(root);

	app.taskList = app.taskList.map(task => {
		let {
			timing,
			callback
		} = task;
		return setTask(timing, callback);
	});
}

exports.clearAllTask = function() {
	if (app.taskList.length < 1) return;
	app.taskList.forEach(job => {
		job.stop();
	});
	app.taskList.splice(0);
}
