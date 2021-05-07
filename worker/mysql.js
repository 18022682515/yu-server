const mysql = require('mysql');

module.exports = options => {
	var pool = mysql.createPool({
		...options
	});
	pool.query = function(sql) {
		return new Promise((res, rej) => {
			pool.getConnection((err, connection) => {
				if (err) {
					app.logger.error(err);
					rej(err);
					return;
				}
				connection.query(sql, (error, data) => {
					if (error) {
						rej(error);
					} else {
						res(data);
					}
					connection.release();
				});
			});
		});

	}
	return pool;
}
