/*
	登录或者关注公众号
 */
//查询模板
var Query = require('../sql/query');
//映入请求模块
var request = require('request');

// console.log('hello');
module.exports = function(app) {
	//进入公众号后 开始session回话
	app.get('/login', function(req, res, next) {
		var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN USER ON user.id = wechat.user WHERE wechat.openid = "' + req.query.openid + '"';
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
			req.session['open_id'] = req.query.opendid;
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
			return;
		});
	});
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
		var signature = req.query.signature;//微信加密签名signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
		var timestamp = req.query.timestamp;//时间戳
		var nonce = req.query.nonce;//随机数
		var echostr = req.query.echostr;//随机字符串
		res.end(echostr);
		// console.log(echostr);
		// res.json({echostr: echostr});
		//发起请求
		// request('http://www.baidu.com', function(error, response, body) {
		// 	if (!error && response.statusCode == 200) {
		// 		console.log(body);
		// 	}
		// })
	});
	//获取微信返回的网页TOKEN
	app.get('/login/getpagetokenkey', function(req, res, next) {
		var code = req.query.code;//微信返回的值，作为下一步的票券
		var state = req.query.state;//时间戳
		console.log('start to request  http');
		console.log('code is :' + code + '&state is :' + state);
		//发起请求通过code获取本次网页的access_token
		request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx0d23b7549ecbbbcf&secret=f9fc3893223a2ff694e76d0df8228731&code='+code+'&grant_type=authorization_code', function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var body = JSON.parse(body);
				console.log(body);
				//本次用户获取的凭证
				var access_token = body.access_token;
				//用户的openid
				var openid = body.openid;
				//需要刷新的tokenkey
				var refresh_token = body.refresh_token;
				//再次发起请求获取用户的信息
				request('https://api.weixin.qq.com/sns/userinfo?access_token='+ access_token +'&openid='+openid+'&lang=zh_CN', function(error, response, body) {
					var body = JSON.parse(body);
					console.log(body.errcode);
					console.log(body.errcode);
					if(body.errcode == 40001) {
						//刷新acces_token
						console.log('start fresh');
						request('https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=wx0d23b7549ecbbbcf&grant_type=refresh_token&refresh_token=' + refresh_token, function(error, response, body) {
								console.log('start freshed..........');
								//本次用户获取的凭证
								var access_token = body.access_token;
								//用户的openid
								var openid = body.openid;
							request('https://api.weixin.qq.com/sns/userinfo?access_token='+ access_token +'&openid='+openid+'&lang=zh_CN', function(error, response, body) {
								console.log(body)
							});
						});
					}else{
						console.log(body);
					}
				});

			}
		})
	});
}

// module.exports = router;