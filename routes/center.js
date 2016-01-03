/*
	个人中心
 */
//查询模板
var Query = require('../sql/query');
//引入文件查询
var fs = require('fs');

// console.log('hello');
module.exports = function(app) {
	//个人资料主界面
	app.get('/center/index', function(req, res, next) {
		Query('SELECT * FROM wechat WHERE id = 1 ', function(err, rows, filed) {
			if (err) return;
			res.json({
				status: 1,
				data: {
					chat: rows[0]
				}
			});
		})
	});
	//查看个人消息
	app.get('/center/checknews', function(req, res, next) {
		var sql = 'SELECT * FROM news WHERE user = 1 LIMIT ' + req.query.page + ',' + req.query.count;
		Query(sql, function(err, rows, filed) {
			if (err) return;
			res.json({
				status: 1,
				data: {
					newslist: rows
				}
			});
		})
	});
	//建议
	app.post('/center/suggestion', function(req, res, next) {
		var sql = 'INSERT INTO suggestion (user, connection, content) VALUES(1,"' + req.body.connection + '", "' + req.body.content + '")';
		Query(sql, function(err, rows, filed) {
			if (err) return;
			res.json({
				status: 1,
				data: 'success'
			});
		})
	});
	//关于我们
	app.get('/center/aboutus', function(req, res, next) {
		var sql = 'SELECT * FROM aboutus';
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				status: 1,
				data: rows[0]
			});
		});
	});
	//关于我们
	app.get('/center/myinfo', function(req, res, next) {
		var sql = 'SELECT * FROM user WHERE id = 2';
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			//已经填写过交友信息
			var returnInfo = {
				status: 1,
				data: {hasInfo: 0, info: ''},
				hasInfo: 0
			};
			//通过师傅填写了微信号判断用户是否有交友信息
			if (rows[0].chat) {
				returnInfo.data.info = rows[0];
				returnInfo.data.hasInfo = 1; 
			}
			res.json(returnInfo);
		});
	});
}

// module.exports = router;