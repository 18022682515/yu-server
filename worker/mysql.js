const mysql = require('mysql');

module.exports = options => {
	//创建mysql连接池，连接释放后缓存在连接池中，释放后的连接可复用
	var pool = mysql.createPool({
		...options
	});
	pool.query = function(...args) {
		return new Promise((res, rej) => {
			//创建一个连接
			pool.getConnection((err, connection) => {
				if (err) {
					app.logger.error(err);
					rej(err);
					return;
				}
				//操作数据库
				connection.query(...args, (error, data) => {
					//释放本连接
					connection.release();
					if (error) {
						rej(error);
					} else {
						res(data);
					}
				});
			});
		});

	}
	return pool;
}
