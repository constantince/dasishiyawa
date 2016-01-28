/*
	个人中心
 */
//查询模板
var Query = require('../sql/query');
//引入文件查询
var fs = require('fs');
var util = require('util');
var formidable = require("formidable");
module.exports = function(app) {
	//个人资料主界面
	app.get('/center/index', function(req, res, next) {
		var user_id = req.session['user'];
		var chat_id = req.session['chat'];
		var user_type = req.session['user_type'];
		var master_id = req.session['master_id'];
		//对于师傅，显示未开始处理的订单，对于用户，显示未读的订单 和未读的消息
		var sql = 'SELECT wechat.headimgurl, wechat.nickname, (SELECT COUNT(*) FROM `order` WHERE  `order`.master = ' + master_id + ' AND `order`.status = 0) AS mcount, (SELECT COUNT(*) FROM `news` WHERE  news.`user` = ' + user_id + ' AND news.readed = 0) AS ncount,(SELECT COUNT(*) FROM `order` WHERE `user` = ' + user_id + ' AND readed = 0) AS ordercount FROM `wechat` WHERE id = ' + chat_id;
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {
					chat: rows[0],
					userType: user_type
				}
			});
		})
	});
	//查看个人消息
	app.get('/center/checknews', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM news WHERE user = ' + user_id + ' ORDER BY create_time DESC LIMIT ' + req.query.page + ',' + req.query.count;
		Query.call(res, sql, function(err, rows, filed) {
			var data = rows;
			var clearSql = 'UPDATE news SET readed = 1 WHERE user = ' + user_id;
			Query.call(res, clearSql, function(err, rows, filed) {
				res.json({
					status: 1,
					data: {
						newslist: data
					}
				});
			});
		})
	});
	//建议
	app.post('/center/suggestion', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'INSERT INTO suggestion (user, connection, content) VALUES(' + user_id + ',"' + req.body.connection + '", "' + req.body.content + '")';
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: 'success'
			});
		})
	});
	//关于我们
	app.get('/center/aboutus', function(req, res, next) {
		var sql = "SELECT * FROM aboutus LEFT JOIN `version` ON `aboutus`.version = `version`.id";
		Query.call(res, sql, function(err, rows, filed) {
			rows[0].create_time = rows[0].create_time.toISOString().replace(/T/, ' ').replace(/\..+/, '');
			res.json({
				status: 1,
				data: rows[0]
			});
		});
	});
	//版本说明
	app.get('/center/version', function(req, res, next) {
		var sql = "SELECT * FROM version";
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {versionList: rows}
			});
		});
	});
	//我的交友信息
	app.get('/center/myinfo', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM `socialinfo` WHERE user = ' + user_id;
		Query.call(res, sql, function(err, rows, filed) {
			//已经填写过交友信息
			var returnInfo = {
				status: 1,
				data: {
					hasInfo: 0,
					info: ''
				},
				hasInfo: 0
			};
			//判断用户是否有交友信息
			if (!!rows.length) {
				returnInfo.data.info = rows[0];
				returnInfo.data.hasInfo = 1;
			}
			res.json(returnInfo);
		});
	});
	//我的订单
	app.get('/center/myorder', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT `master`.id AS master_id, `master`.name, `order`.* FROM `order` LEFT JOIN `master` ON (order.master = master.id) WHERE order.user = ' + user_id + ' ORDER BY `order`.bookup_time DESC';
		Query.call(res, sql, function(err, rows, filed) {
			var data = rows;
			var clearSql = 'UPDATE `order` SET readed = 1 WHERE user = ' + user_id;
			Query.call(res, clearSql, function(err, rows, filed) {
				res.json({
					status: 1,
					data: {
						orderList: data
					}
				});
			});
		});
	});
	//查询是否签到
	app.get('/center/hassignin', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT count(*) as num FROM signin WHERE user = ' + user_id;
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {
					hasSignin: rows[0]
				}
			});
		});
	});
	//签到
	app.get('/center/signin', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'UPDATE signin SET num = num + 1 WHERE user = ' + user_id;
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});
	//接受别人的招呼
	app.get('/center/accpect', function(req, res, next) {
		//接受者
		var user_id = req.session['user'];
		//发送者
		var sender = req.query.sender;
		var id = req.query.id;
		var sql = 'UPDATE `relactionship` SET status = 1 WHERE user = ' + user_id + ' AND sender = ' + sender;
		Query.call(res, sql, function(err, rows, filed) {
			//重置消息状态
			updateNewsStatus(res, {
				id: id,
				handle: 'update',
				status: 1
			});
			//发送回执消息
			updateNewsStatus(res, {
				user: sender,
				type: 1,
				sender: user_id,
				status: 0,
				handle: 'insert',
				content: '你的招呼得到了回应。可以查看TA的微信号了！'
			})
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});
	//查看发消息人
	app.get('/center/checkout', function(req, res, next) {
		var id = req.query.id;
		var sql = 'UPDATE `news` SET status = 1 WHERE id = ' + id;
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});
	//忽略招呼
	app.get('/center/forget', function(req, res, next) {
		// var user_id = req.session['user'];
		var id = req.query.id;
		var sql = 'UPDATE news SET status = 1 WHERE type = 1 AND user = ' + id;
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});
	//注册成为师傅
	app.post('/center/register', function(req, res, next) {
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8'; //设置编辑
		form.uploadDir = './public/publish/upload/images/master'; //设置上传目录
		form.keepExtensions = true; //保留后缀
		form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
		var user_id = req.session['user'];
		form.parse(req, function(err, fields, files) {
			if (err) {
				res.locals.error = err;
				res.render(index, {
					title: TITLE
				});
				return;
			}
			var sexImage = fields.sex == 0 ? 'master_man.png' : 'master_feminine.png'
			newPath = './images/head_default/' + sexImage;
			if (files.show_img !== undefined){
				var extName = ''; //后缀名
				switch (files.show_img.type) {
					case 'image/pjpeg':
						extName = 'jpg';
						break;
					case 'image/jpeg':
						extName = 'jpg';
						break;
					case 'image/png':
						extName = 'png';
						break;
					case 'image/x-png':
						extName = 'png';
						break;
				}
				newPath = './' + files.show_img.path.replace(/public\\/, '').replace(/\\/gi, '/');
			}
			
			var body = fields;
			//加载一次数据判断是修改还是插入
			var loadDataSql = 'SELECT * FROM master WHERE user = ' + user_id;
			Query.call(res, loadDataSql, function(err, rows, filed) {
				//插入数据
				if (rows[0] === undefined) {
					var filedName = ['user', 'head_img'];
					var valueName = ['"' + user_id + '", "' + newPath + '"'];
					for (var i in body) {
						if (typeof body[i] !== 'object') {
							filedName.push(i);
							valueName.push('"' + body[i] + '"');
						}
					}
					var sql = 'INSERT INTO master (' + filedName.join(',') + ') VALUES(' + valueName.join(',') + ')';
					Query.call(res, sql, function(err, rows, filed) {
						if (err) {
							console.log(err);
							return;
						}
						//更新用户的类别身份
						var sql = 'UPDATE `user` SET identification = 2, phone = "'+ fields['phone'] +'"" WHERE id = ' + user_id;
						Query.call(res, sql, function() {
							req.session['user_type'] = 2;
						});
						res.json({
							status: 1,
							data: {
								go: 'ok'
							}
						});
					});
					//修改数据
				} else {
					var filesName = ['head_img="' + newPath + '"', 'user=' + user_id];
					for (var i in fields) {
						if (typeof fields[i] !== 'object' && fields[i] !== '' && fields[i] !== 'undefined') {
							filesName.push(i + '="' + fields[i] + '"');
						}

					}
					var sql = 'UPDATE `master` SET ' + filesName.join(',') + ' WHERE user = ' + user_id;
					Query.call(res, sql, function(err, rows, filed) {
						res.json({
							status: 1,
							data: {
								go: 'ok'
							}
						});
					});
				}
			});

		});
	});
	//接收到订单
	app.get('/center/takeorder', function(req, res, next) {
		// var user_id = req.session['user'];
		var master_id = req.session['master_id'];
		var sql = 'SELECT `user`.id AS user_id, `user`.phone, `user`.name, `user`.sex, `user`.adress, `order`.* FROM `user` LEFT JOIN `order` ON `order`.user = `user`.id WHERE `order`.master = ' + master_id + ' ORDER BY `order`.bookup_time DESC';
		Query.call(res, sql, function(err, rows, filed) {
			res.json({
				status: 1,
				data: {
					orderList: rows
				}
			});
		});
	});
	//开始处理订单
	app.get('/center/handleorder', function(req, res, next) {
		var user_id = req.session['user'];
		var order_id = req.query.orderid;
		var way = req.query.action;
		var refuseReason = req.query.refusereason;
		//下单人
		var userOrder = req.query.userid;
		var sql = 'UPDATE `order` SET status = ' + way + ' WHERE id = ' + order_id;
		Query.call(res, sql, function(err, rows, filed) {
			var content = '师傅已经处理了您的订单啦!';
			if(way == 4) {
				content = '订单遭到拒绝:' + refuseReason; 
			}
			//给下单人发消息
			updateNewsStatus(res, {
				user: userOrder,
				type: 2,
				sender: user_id,
				status: 0,
				handle: 'insert',
				content: content
			})
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});
	// 提交评论
	app.post('/center/submitComment', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'UPDATE `order` SET review = "' + req.body.content + '", star = ' + req.body.star + ', review_time = "' + now() + '", status = 3 WHERE `order`.id = ' + req.body.orderId;
		Query.call(res, sql, function(err) {
			updateNewsStatus(res, {
				user: req.body.user,
				type: 0,
				sender: user_id,
				status: 0,
				handle: 'insert',
				content: '您的订单已经被评价了'
			});
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});

	// 功能导航
	app.get('/navigate/index', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM `function`';
		Query.call(res, sql, function(err, rows) {
			res.json({
				status: 1,
				data: {
					functionList: rows
				}
			});
		});
	});
	// 删除交友资料
	app.get('/center/deletemakefriendsInfo', function(req, res, next) {
		var id = req.query.id;
		var deleteSql = 'DELETE FROM `socialinfo` WHERE id =' + id;
		Query.call(res, deleteSql, function(err, rows) {
			res.json({
				status: 1,
				data: {
					go: 'ok'
				}
			});
		});
	});
	// 查看身份
	app.get('/center/checkIdentity', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM `master` WHERE user = ' + user_id;
		Query.call(res, sql, function(err, rows) {
			var result = rows[0];
			if (!result) {
				result = 0;
			}
			res.json({
				status: 1,
				data: {
					info: result
				}
			});
		});
	});
}



//处理消息状态
function updateNewsStatus(res, option) {
	var filedName = [];
	var value = [];
	var sql = '';
	if (option.handle === 'insert') {
		delete option.handle;
		for (var i in option) {
			filedName.push(i);
			value.push('"' + option[i] + '"');
		}
		sql = 'INSERT INTO `news` (' + filedName.join(',') + ') VALUES(' + value.join(',') + ')';
	} else if (option.handle == 'update') {
		sql = 'UPDATE `news` SET status = ' + option.status + ' WHERE id = ' + option.id;
	}
	Query.call(res, sql, function(err) {});
}
//获取当前时间
function now() {
	function add0(e) {
		if (e < 10) {
			e = '0' + e;
		}
		return e;
	}
	var D = new Date();
	var year = D.getFullYear();
	var mouth = D.getMonth() + 1;
	mouth = add0(mouth);
	var day = add0(D.getDate());
	var hour = add0(D.getHours());
	var minute = add0(D.getMinutes());
	var second = add0(D.getSeconds());
	return year + '-' + mouth + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
//设置某个表的阅读状态
// module.exports = router;