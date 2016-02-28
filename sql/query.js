//引入数据库模块
var mysql = require('mysql');
var config = require('../common/json');
var dbconfig = config('db');
//建立数据库连接
// console.log(JSON.stringify(dbconfig));
var connection = mysql.createConnection(dbconfig);

var Query = function(sql, callback) {
	//验证是否登录
	var _self = this;
	callback = callback || function() {};
	connection.query(sql, function(err, rows, filed) {
		var message;
		var type;
		if (err) {
			if (!_self.json) {
				console.log(err.message);
				return;
			}
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
			if (message) {
				connection.query('INSERT INTO `errormessage` (type, message) VALUES (' + type + ', "' + message + '")', function() {});
			}
		}

	});
}
	//导出sql模块
module.exports = Query;