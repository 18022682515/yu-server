const crypto = require('crypto');
const getSession = require('./session/getSession.js');
const getRedisSession = require('./session/getRedisSession.js');

module.exports = (options,redis) => {
	options = options || {};
	
	return async (ctx, next) => {
		let keyName = 'session_id';
		let session_id = ctx.cookies.get(keyName);
		if (!session_id) {
			let hash = crypto.createHash('md5');
			hash.update(`${Date.now()}`);
			session_id = 'sess_id' + hash.digest('hex');
			if(!redis){
				app.context[session_id] = {
					//服务器自动清理过期session_id对象，以下是session_id对象的有效期
					maxAge: options.maxAge ? Date.now()+options.maxAge : Date.now()+8*60*60*1000
				};
			}
		}
		ctx.session = redis ? getRedisSession(redis,session_id): getSession(app.context,session_id);
		setCookies(ctx, keyName, session_id, options);
		return next();
	}
}


function setCookies(ctx, keyName, session_id, options) {
	options.maxAge = options.maxAge || 8 * 60 * 60 * 1000; // cookie有效时长
	options.path = options.path || '/'; // 该cookie所在的路径
	options.httpOnly = options.httpOnly || false; // 前端js是否可以访问cookie
	options.overwrite = options.overwrite || true; // 如果设置两个相同的key名，是否后者覆盖前者
	options.signed = false; //是否使用签名
	options.encrypt = options.encrypt || false; //是否对cookie加密

	ctx.cookies.set(keyName, session_id, options);
}
