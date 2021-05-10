const path = require('path');
const CronJob = require('cron').CronJob;
const {
	getType
} = require('yu-util');


function clearSession(){
	let options = {
		timing: '0 0 3 * * *',
		callback: () => {
			Object.keys(app.context).forEach(key => {
				key.startsWith('sess_id') && Date.now() > app.context[key].maxAge && Reflect.deleteProperty(app.context, key);
			});
		}
	}
	setTask(options.timing, options.callback)
}

function setTask(timing, callback) {
	if (!getType(callback).includes('Function')) return;
	timing = getType(timing) === 'String' ? timing : '* * * * * *';
	return new CronJob(timing, callback, null, true);
}

module.exports = function(root) {
	clearSession();
	
	let tasks = require(path.join(root, './appTask/tasks.js'));
	tasks = Array.from(tasks || []);
	return tasks.map(task => {
		let {
			timing,
			callback
		} = task;
		return setTask(timing, callback);
	});
}
