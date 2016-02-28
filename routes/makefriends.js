/*
	广场主页数据查询模块
 */
//查询模板
var Query = require('../sql/query');
//引入文件查询
var fs = require('fs');
//缩略图
var gm = require('gm').subClass({
	imageMagick: true
});
var formidable = require("formidable");
module.exports = function(app) {
		//如果中间件为最后一个执行，next可以不需要执行
		//主页查询接口
		app.get('/makefriends/index', function(req, res, next) {
			Query.call(res, 'SELECT * FROM `socialinfo` WHERE passed = 1  ORDER BY update_time DESC LIMIT ' + req.query.index + ',' + req.query.count, function(err, rows, filed) {
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
			Query.call(res, sql, function(err, rows, filed) {
				updateNewsStatus(res, {
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
			Query.call(res, sql, function(err, rows, filed) {
				updateNewsStatus(res, {
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
			var user_id = req.session['user'] || 1;
			var form = new formidable.IncomingForm();
			form.encoding = 'utf-8'; //设置编辑
			form.uploadDir = './public/publish/upload/images/user'; //设置上传目录
			form.keepExtensions = true; //保留后缀
			form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
			//处理图片
			form.parse(req, function(err, fields, files) {
				if (err) {
					console.log(err);
					return;
				}
				var sexImage = fields.sex == 0 ? 'user_man.png' : 'user_feminine.png'
				var newPath = './images/head_default/' + sexImage;
				var newMinPath = './images/head_default/' + sexImage;
				if (files.show_img !== undefined) {
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

					var oldPath = './' + files.show_img.path; //值为：./public/publish/upload/images/user 可以操作
					var minPath = './public/publish/upload/images/min-user/min_user_' + user_id + '.png'; //可以操作
					//压缩图片
					gm(oldPath).resize(100, 100).write(minPath, function(err) {
						if (err) console.log(err);
					});
					newPath = oldPath.replace(/public\//gi, ''); //值为./publish/upload/images/user 可以存入
					newMinPath = minPath.replace(/public\//gi, ''); //指为./publish/upload/images/min-user 可以存入

				}
				//查询数据让后判断是修改还是增加交友信息
				var selectSql = 'SELECT * FROM `socialinfo` WHERE user = ' + user_id;
				Query.call(res, selectSql, function(err, rows, filed) {
					//没查到数据，插入信息
					if (!rows.length) {
						var filesName = ['show_img', 'min_show_img', 'user'];
						var valueName = ['"' + newPath + '"', '"' + newMinPath + '"', user_id];
						for (var i in fields) {
							if (typeof fields[i] !== 'object' && fields[i] !== '' && fields[i] !== 'undefined') {
								filesName.push(i);
								valueName.push('"' + fields[i] + '"');
							}

						}
						var sql = 'INSERT INTO `socialinfo` (' + filesName.join(',') + ') VALUES(' + valueName.join(',') + ')';
					} else {
						var filesName = ['show_img="' + newPath + '", min_show_img="' + newMinPath + '"'];
						for (var i in fields) {
							if (typeof fields[i] !== 'object' && fields[i] !== '' && fields[i] !== 'undefined') {
								filesName.push(i + '="' + fields[i] + '"');
							}

						}
						var sql = 'UPDATE `socialinfo` SET ' + filesName.join(',') + ' WHERE user = ' + user_id;
					}
					Query.call(res, sql, function(err, rows, filed) {
						res.json({
							status: 1,
							data: {
								go: 'ok'
							}
						});
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
			var selectWAndSSql = 'SELECT wechat.nickname AS wechat_name, wechat.sex AS wechat_sex, wechat.city, wechat.province, wechat.country, wechat.headimgurl, `socialinfo`.* FROM `socialinfo` LEFT JOIN wechat ON `socialinfo`.user = wechat.user WHERE `socialinfo`.user = ' + req.query.personel
			Query.call(res, selectWAndSSql, function(err, rows, filed) {
				var sql = 'SELECT * FROM `relactionship` WHERE user = ' + personel + ' AND sender = ' + user_id;
				var result = rows[0];
				Query.call(res, sql, function(err, rows, filed) {
					//用户之间的关系，0 带处理 1好友 2拒绝 4未建立关系
					var rela = 4;
					var needSayHelloButton = true;
					//有交友的资料
					if (result !== undefined) {
						//开通了功能
						if (result.need_hiddenwx == 1) {
							//有打招呼的记录
							if (!!rows.length) {
								rela = rows[0].status;
								needSayHelloButton = rows[0].status !== undefined ? false : true;
							}
						} else {
							needSayHelloButton = false;
						}
						res.json({
							status: 1,
							data: {
								relaction: rela,
								needSayHelloButton: needSayHelloButton,
								list: result,
								clickable: clickable,
								hasResult: 1
							}
						});
					} else {
						var selectWAndSSql = 'SELECT * FROM wechat WHERE user = ' + req.query.personel;
						Query.call(res, selectWAndSSql, function(err, rows, filed) {
							res.json({
								status: 1,
								data: {
									list: rows[0],
									hasResult: 0
								}
							});
						});
					}
				});

			})
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
// module.exports = router;