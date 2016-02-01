/*
	登录或者关注公众号
 */
//查询模板
var Query = require('../sql/query');
//映入请求模块
var request = require('request');
// console.log('hello');
var OAuth = require('wechat-oauth');
//引入配置文件
var config = require('../common/json');
var wxconfig = config('wechat');
var client = new OAuth(wxconfig.appId, wxconfig.appSecret);
module.exports = function(app) {
	//网页登录用户
	app.get('/login', function(req, res, next) {
		var openid = req.query.openid;
		var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN USER ON user.id = wechat.user WHERE wechat.openid = "' + openid + '"';
		Query.call(res, sql, function(err, rows, filed) {
			var result = rows[0];
			if (!result) {
				res.json({
					status: 0,
					data: 'undefined'
				});
				return;
			}
			req.session['user'] = result.id;
			req.session['user_type'] = result.identification;
			req.session['name'] = result.nickname;
			req.session['chat'] = result.wechat_id;
			req.session['open_id'] = openid;
			req.session['master_id'] = 0;
			var masterSql = 'SELECT * FROM master WHERE user = ' + result.id;
			if (result.identification == 2) {
				Query.call(res, masterSql, function(err, rows, filed) {
					if (err) {
						console.log(err);
						return;
					}
					req.session['master_id'] = rows[0].id;
					res.json({
						status: 1,
						data: {
							nick: result.nickname,
							sex: result.sex,
							header: result.headimgurl
						}
					});
				});
			} else {
				res.json({
					status: 1,
					data: {
						nick: result.nickname,
						sex: result.sex,
						header: result.headimgurl
					}
				});
			}
		});
	})
	//验证用户身份
	app.get('/login/verify', function(req, res, next) {
		res.json({
			status: 1,
			data: {
				identificate: req.session
			}
		});
	});
	//设置手机，注册正式会员
	app.get('/login/setphone', function(req, res, next) {
		var phone = req.query.phone;
		var user_id = req.session['user'];
		var checkSql = 'SELECT * FROM `user` WHERE id = ' + user_id;
		Query.call(res, checkSql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			//只有是非认证用户的情况下才需要更新身份
			if (!!rows.length && rows[0].identification == 2) {
				var sql = 'UPDATE `user` SET identification = 1, phone = "' + phone + '" WHERE id = ' + user_id;
				Query.call(res, sql, function(err, rows, filed) {
					if (err) {
						console.log(err);
						return;
					}
					req.session['user_type'] = 1;
					res.json({
						status: 1,
						data: {
							go: 'ok'
						}
					});
				});
			} else {
				res.json({
					status: 1,
					data: {
						go: 'ok'
					}
				});

			}
		});
	});
	//获取微信的 access_token
	app.get('/login/gettoken', function(req, res, next) {
		console.log('gettoken');
		var signature = req.query.signature; //微信加密签名signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
		var timestamp = req.query.timestamp; //时间戳
		var nonce = req.query.nonce; //随机数
		var echostr = req.query.echostr; //随机字符串
		res.end(echostr);
	});
	//获取微信返回的网页TOKEN
	app.get('/login/getpagetokenkey', function(req, res, next) {
		var code = req.query.code; //微信返回的值，作为下一步的票券
		//获取票券
		client.getAccessToken(code, function(err, result) {
			var accessToken = result.data.access_token;
			var openid = result.data.openid;
			//查询数据库有没有该用户
			var sql = 'SELECT * FROM `wechat` WHERE openid= "' + openid + '"';
			Query.call(res, sql, function(err, rows, filed) {
				if (!rows.length) {
					client.getUser(openid, function(err, result) {
						//掺入数据 更新session
						getUserInfo.call(res, result, req);
					});
				} else {
					//更新session
					setSession(openid, res, req)
				}
			});
		});
	});
}
	//获取用户的信息 并且插入数据
function getUserInfo(body, req) {
	var _self = this;
	//此处获取用户的信息
	var fileName = [],
		valueName = [];
	for (var i in body) {
		fileName.push(i);
		valueName.push('"' + body[i] + '"');
	}
	//生成对应一条用户信息
	var insertSql = 'INSERT INTO `user` (name, verify_status, sex, identification) VALUES("' + body.nickname + '", 0, ' + (body.sex - 1) + ', 0)';
	Query.call(_self, insertSql, function(err, rows) {
		var id = rows.insertId;
		fileName.push('user');
		valueName.push(id);
		//生成微信信息表
		var insertWxSql = 'INSERT INTO `wechat` (' + fileName.join(',') + ') VALUES(' + valueName.join(',') + ')';
		Query.call(_self, insertWxSql, function() {
			//发出一条系统消息
			var insertMessageSql = 'INSERT INTO `news` (user, content) VALUES (' + id + ', "欢迎您关注公众号，新用户请阅读版本指南。")';
			Query.call(_self, insertMessageSql);
			setSession(body.openid, _self, req);
		});
	});

}
//进入公众号后 开始session回话
function setSession(openid, res, req) {
	var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN USER ON user.id = wechat.user WHERE wechat.openid = "' + openid + '"';
	Query.call(res, sql, function(err, rows, filed) {
		var result = rows[0];
		if (!result) {
			res.json({
				status: 0,
				data: 'undefined'
			});
			return;
		}
		req.session['user'] = result.id;
		req.session['user_type'] = result.identification;
		req.session['name'] = result.nickname;
		req.session['chat'] = result.wechat_id;
		req.session['open_id'] = openid;
		req.session['master_id'] = 0;
		//如果是师傅的话
		if (result.identification == 2) {
			var masterSql = 'SELECT * FROM master WHERE user = ' + result.id;
			Query.call(res, masterSql, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				req.session['master_id'] = rows[0].id;
			});
		}
		res.redirect('/page?openid=' + openid);
	});

};
// module.exports = router;