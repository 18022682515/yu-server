const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const koaRouter = require('koa-router');
const static = require('yu-koa-static');
const render = require('koa-ejs');
const koaBody = require('koa-body');
const { getType } = require('yu-util');
const session = require('./middleware/session.js');
const setCsrf = require('./middleware/setCsrf.js');
const rewriteRender = require('./middleware/rewriteRender.js');
const catchError = require('./middleware/catchError.js');
const log = require('./middleware/log.js');

module.exports = function(root, config, appLogger,requestLogger) {
	global.app = new Koa();
	const router = new koaRouter();
	app.logger = appLogger;
	app.keys = config.keys || ['ab1234cd1xsdfgf22qe3eg31fg'];
	app.use(log(requestLogger));
	app.use(catchError());
	if (getType(config.redis) === 'Object') {
		const redis = require("redis").createClient(config.redis);
		app.use(session(null, redis));
	} else {
		app.use(session());
	}
	app.use(setCsrf());
	app.use(rewriteRender());

	const options = {
		multipart: true, // 支持文件上传
		// encoding:'utf8',
		formidable: {
			// uploadDir: path.join(root, 'upload'), // 设置文件上传目录
			// keepExtensions: true, // 保持文件的后缀
			maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
			// onFileBegin:(name,file) => {}, // 文件上传前的设置
		}
	}
	app.use(koaBody(options));

	const middlewares = config.middlewares;
	middlewares.forEach(key => {
		let middleware = require(path.join(root, 'middleware', `${key}.js`));
		if (!/function/i.test(getType(middleware))) return;
		app.use(middleware);
	});

	app.use(static(path.join(root, config.static), {
		index: false,
		path: path.resolve(root, config.static)
	}));
	
	const setRouter = require(path.join(root, 'router/router.js'))
	setRouter(router);
	
	app.use(router.routes()).use(router.allowedMethods());

	render(app, {
		root: path.join(root, config.view),
		layout: false,
		viewExt: "html",
		cache: false,
		debug: false
	});

	config.https = getType(config.https) === "Object" ? config.https : {};
	let keyPath = config.https.key || path.resolve(__dirname, '../server.key');
	let certPath = config.https.cert || path.resolve(__dirname, '../server.cer');
	let optionsHttps = {
		key: fs.readFileSync(keyPath),
		cert: fs.readFileSync(certPath)
	}
	
	const servers = {}
	if (config.http && config.http.port) servers.http = http.createServer(app.callback()).listen(config.http.port, () => {
		console.log(`开启http://localhost:${config.http.port}端口`);
	});
	if (config.https.port) servers.https = https.createServer(optionsHttps, app.callback()).listen(config.https.port, () => {
		console.log(`开启https://127.0.0.1:${config.https.port}端口`);
	});
	
	return servers;
}
