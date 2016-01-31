//引入数据库模块
var mysql = require('mysql');
//建立数据库连接
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	port: '3306',
	database: 'dasishiyawa'
});

var Query = function(sql, callback) {
	//验证是否登录
	var _self = this;
	connection.query(sql, function(err, rows, filed) {
		var message;
		var type;
		if (err) {
			if (!_self.json) {
				console.log(err);
				return;
			}
			_self.json({
				status: 0,
				data: {
					errorMessage: 'SQL ERROR!'
				}
			});
			message = err.message;
			type = 0;
			if (message) {
				connection.query('INSERT INTO `errormessage` (type, message) VALUES (' + type + ', "' + message + '")', function() {});
			}
			return;
		}
		try {
			callback.apply(_self || null, [err, rows, filed]);
		} catch (ex) {
			message = ex.message;
			type = 1;
			_self.json({
				status: 0,
				data: {
					errorMessage: 'PROGRAM ERROR!'
				}
			});

			if (message) {
				connection.query('INSERT INTO `errormessage` (type, message) VALUES (' + type + ', "' + message + '")', function() {});
			}
		}

	});
}
	//导出sql模块
module.exports = Query;