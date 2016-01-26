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
		var sql = 'SELECT wechat.headimgurl, wechat.nickname, (SELECT COUNT(*) FROM `news` WHERE  news.`user` = ' + user_id + ' AND news.status = 0) AS ncount,(SELECT COUNT(*) FROM `order` WHERE `user` = ' + user_id + ' AND status = 0) AS ordercount FROM `wechat` WHERE id = ' + chat_id;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
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
		var sql = 'SELECT * FROM news WHERE user = ' + user_id + ' ORDER BY id DESC LIMIT ' + req.query.page + ',' + req.query.count;
		Query(sql, function(err, rows, filed) {
			if (err) return;
			var data = rows;
			var clearSql = 'UPDATE news SET status = 1 WHERE user = ' + user_id + ' AND status = 0';
			Query(clearSql, function(err, rows, filed) {
				if (err) return;
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
				data: {
					hasInfo: 0,
					info: ''
				},
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
		var sql = 'SELECT `master`.id AS master_id, `master`.name, `order`.* FROM `order` LEFT JOIN `master` ON (order.master = master.id) WHERE order.user = ' + user_id + ' ORDER BY `order`.id DESC';
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			var data = rows;
			var clearSql = 'UPDATE `order` SET status = 1 WHERE user = ' + user_id + ' AND status = 0';
			Query(clearSql, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
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
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
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
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
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
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			//重置消息状态
			updateNewsStatus({
				id: id,
				handle: 'update',
				status: 3
			});
			//发送回执消息
			updateNewsStatus({
				user: sender,
				type: 1,
				sender: user_id,
				status: 3,
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
	//忽略招呼
	app.get('/center/forget', function(req, res, next) {
		// var user_id = req.session['user'];
		var id = req.query.id;
		var sql = 'UPDATE news SET status = 2 WHERE type = 1 AND user = ' + id;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
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
		form.uploadDir = 'C:/tmp/master'; //设置上传目录
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
				newPath = files.show_img.path.replace(/\\/gi, '/');
			}
			
			var body = fields;
			//var newPath = files.show_img.path.replace(/\\/gi, '/');
			// fs.renameSync(files.show_img.path, "./publish/upload/images/master/hkd.png"); 
			//var newPath = "./publish/upload/images/master/123." + extName;
			// var readStream = fs.createReadStream(files.show_img.path)
			// var writeStream = fs.createWriteStream(newPath);
			// readStream.pipe(writeStream);
			// readStream.on('end', function(){
			// 	fs.unlinkSync(files.show_img.path);
			// });
			//
			// util.pipe(readStream, writeStream, function() {
			//     fs.unlinkSync(files.show_img.path);
			// });

			//window
			//fs.renameSync(files.show_img.path, newPath);
			//加载一次数据判断是修改还是插入
			var loadDataSql = 'SELECT * FROM master WHERE user = ' + user_id;
			Query(loadDataSql, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
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
					Query(sql, function(err, rows, filed) {
						if (err) {
							console.log(err);
							return;
						}
						//更新用户的类别身份
						var sql = 'UPDATE `user` SET identification = 2 WHERE id = ' + user_id;
						Query(sql, function() {
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
					Query(sql, function(err, rows, filed) {
						if (err) {
							console.log(err);
							return;
						}
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
	//接订单
	app.get('/center/takeorder', function(req, res, next) {
		// var user_id = req.session['user'];
		var master_id = req.session['master_id'];
		var sql = 'SELECT `user`.id AS user_id, `user`.phone, `user`.nick, `user`.sex, `user`.adress, `order`.* FROM `user` LEFT JOIN `order` ON `order`.user = `user`.id WHERE `order`.master = ' + master_id + ' ORDER BY `order`.id DESC';
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
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
		//var master_id = req.session['master_id'];
		var order_id = req.query.orderid;
		var way = req.query.action;
		//下单人
		var userOrder = req.query.userid;
		var sql = 'UPDATE `order` SET status = ' + way + ' WHERE id = ' + order_id;
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}

			//给下单人发消息
			updateNewsStatus({
				user: userOrder,
				type: 2,
				sender: user_id,
				status: 0,
				handle: 'insert',
				content: '师傅已经处理了您的订单啦!'
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
		var sql = 'UPDATE `order` SET review = "' + req.body.content + '", star = ' + req.body.star + ', review_time = "' + req.body.submitTime + '", status = 3 WHERE `order`.id = ' + req.body.orderId;
		Query(sql, function(err) {
			if (err) {
				console.log(err);
				return;
			}
			updateNewsStatus({
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
		Query(sql, function(err, rows) {
			if (err) {
				console.log(err);
				return;
			}
			res.json({
				status: 1,
				data: {
					functionList: rows
				}
			});
		});
	});
	// 查看身份
	app.get('/center/checkIdentity', function(req, res, next) {
		var user_id = req.session['user'];
		var sql = 'SELECT * FROM `master` WHERE user = ' + user_id;
		Query(sql, function(err, rows) {
			if (err) {
				console.log(err);
				return;
			}
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
function updateNewsStatus(option) {
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
	Query(sql, function(err) {
		if (err) {
			console.log(err);
			return;
		}
	});
}
// module.exports = router;