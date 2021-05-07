function addProperty(o, property, value) {
	Reflect.defineProperty(o, property, {
		value
	});
}

module.exports = app => {
	addProperty(app, 'taskList', []);
	addProperty(app, 'cache', {});
	global.app = app;
	return app
}
