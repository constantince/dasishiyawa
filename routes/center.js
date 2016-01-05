/*
	个人中心
 */
//查询模板
var Query = require('../sql/query');
//引入文件查询
var fs = require('fs');

module.exports = function(app) {
	//个人资料主界面
	app.get('/center/index', function(req, res, next) {
		var user_id = req.session['user'];
		var chat_id = req.session['chat'];
		var sql = 'SELECT wechat.headimgurl, wechat.nickname, (SELECT COUNT(*) FROM `news` WHERE  news.`user` = '+ user_id +') AS ncount FROM `wechat` WHERE id = ' + chat_id;
		Query(sql, function(err, rows, filed) {
			if (err){
				console.log(sql);
				console.log(err);
				return;	
			} 
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
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM news WHERE user = '+user_id+' LIMIT ' + req.query.page + ',' + req.query.count;
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
		var user_id = req.session['user'];
		var sql = 'INSERT INTO suggestion (user, connection, content) VALUES('+user_id+',"' + req.body.connection + '", "' + req.body.content + '")';
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
		var sql = "SELECT * FROM aboutus";
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			rows[0].create_time = rows[0].create_time.toISOString().replace(/T/, ' ').replace(/\..+/, '');
			res.json({
				status: 1,
				data: rows[0]
			});
		});
	});
	//我的交友信息
	app.get('/center/myinfo', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM user WHERE id = ' + user_id;
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
	//我的订单
	app.get('/center/myorder', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM `order` LEFT JOIN `master` ON (order.master = master.id) WHERE order.user = ' + user_id;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			//输出我的订单
			res.json({
				status: 1,
				data: {orderList: rows}
			});
		});
	});
	//查询是否签到
	app.get('/center/hassignin', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT count(*) as num FROM signin WHERE user = '+ user_id;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				status: 1,
				data: {hasSignin: rows[0]}
			});
		});
	});
	//签到
	app.get('/center/signin', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'UPDATE signin SET num = num + 1 WHERE user = '+ user_id;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				status: 1,
				data: {go: 'ok'}
			});
		});
	});
	//接受别人的招呼
	app.get('/center/accpect', function(req, res, next) {
		var user_id = req.session['user'];
		var sender = req.query.sender;
		var sql = 'UPDATE relactionshop SET status = 1 WHERE user = '+ user_id + ' AND sender = '+ sender;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				status: 1,
				data: {go: 'ok'}
			});
		});
	});
}

// module.exports = router;