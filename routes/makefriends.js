/*
	广场主页数据查询模块
 */
//查询模板
var Query = require('../sql/query');
//引入文件查询
var fs = require('fs');
//
var formidable = require("formidable");
// console.log('hello');
module.exports = function(app) {
		//如果中间件为最后一个执行，next可以不需要执行
		//主页查询接口
		app.get('/makefriends/index', function(req, res, next) {
			Query('SELECT * FROM user WHERE is_show = 1 LIMIT ' + req.query.index + ',' + req.query.count, function(err, rows, filed) {
				if (err) return;
				res.json({
					status: 1,
					data: {
						list: rows
					}
				});
			})
		});
		//打招呼
		app.get('/makefriends/sayHello', function(req, res, next) {
			var user_id = req.session['user'];
			var who = req.query.user;
			var sql = 'INSERT INTO `relactionship` (user, sender, status) VALUES(' + who + ', ' + user_id + ', 0)';
			Query(sql, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				updateNewsStatus({
					user: who,
					type: 1,
					sender: user_id,
					status: 0,
					handle: 'insert',
					content: '有人向你打招呼了，去看看吧！'
				})
				res.json({
					status: 1,
					data: {
						go: 'ok'
					}
				});
			})
		});
		//赞
		app.get('/makefriends/likeIt', function(req, res, next) {
			var user_id = req.session['user'];
			var sql = 'INSERT INTO likes (user, send) VALUES(' + req.query.user + ',' + user_id + ')';
			Query(sql, function(err, rows, filed) {
				if (err) return;
				updateNewsStatus({
					user: req.query.user,
					type: 3,
					sender: user_id,
					status: 0,
					handle: 'insert',
					content: '您收到了别人的赞哦'
				});
				res.json({
					status: 1,
					data: {
						go: 'ok'
					}
				});
			})
		});
		//发布个人信息接口
		app.post('/makefriends/publish', function(req, res, next) {
			var form = new formidable.IncomingForm();
			form.encoding = 'utf-8'; //设置编辑
			form.uploadDir = './public/publish/upload/images/'; //设置上传目录
			form.keepExtensions = true; //保留后缀
			form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
			//处理图片
			form.parse(req, function(err, fields, files) {
				if (err) {
					res.locals.error = err;
					res.render(index, {
						title: TITLE
					});
					return;
				}
				if (files.show_img === undefined) return;
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
				if (extName.length == 0) {
					res.json({
						status: 1,
						data: {
							info: 'jpg, png'
						}
					});
					return;
				}

				var avatarName = Math.random() + '.' + extName;
				var newPath = './publish/upload/images/' + avatarName;
				var filesName = ['show_img="' + newPath + '"', 'is_show=1'];
				for (var i in fields) {
					if (typeof fields[i] !== 'object') {
						filesName.push(i + '="' + fields[i] + '"');
					}

				}
				var sql = 'UPDATE user SET ' + filesName.join(',') + ' WHERE id = 1';
				Query(sql, function(err, rows, filed) {
					if (err) {
						console.log(err);
						return;
					}
					res.json({
						status: 1,
						data: {}
					});
				});
			});
			//处理其他信息
		});
		//查看别人资料
		app.get('/makefriends/personel', function(req, res, next) {
			var user_id = req.session['user'];
			var personel = req.query.personel;
			var clickable = (user_id != personel);
			if (!personel) {
				res.json({
					status: 1,
					data: {
						list: {}
					}
				});
				return;
			}

			Query('SELECT * FROM user LEFT JOIN wechat ON user.id = wechat.user WHERE user.id = ' + req.query.personel, function(err, rows, filed) {
				if (err) return;
				var sql = 'SELECT * FROM `relactionship` WHERE user = ' + personel + ' AND sender = ' + user_id;
				var result = rows[0];
				Query(sql, function(err, rows, filed) {
					if (err) return;
					var rela = 4;
					if(!!rows.length) {
						var rela = rows[0].status === undefined ? 4 : rows[0].status;
					}
					
					res.json({
						status: 1,
						data: {
							relaction: rela,
							list: result,
							clickable: clickable
						}
					});
				});

			})
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