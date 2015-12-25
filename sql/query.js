//引入数据库模块
var mysql = require('mysql');
//建立数据库连接
var connection = mysql.createConnection({
	host: 'localhost',
	user : 'root',
	password: '123456',
	port: '3306',
	database: 'dasishiyawa'
});

var Query = function(sql, callback) {
	connection.query(sql, callback);
}
//导出sql模块
module.exports = Query;