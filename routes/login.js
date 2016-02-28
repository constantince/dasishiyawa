/*
	登录或者关注公众号
 */
//查询模板
var Query = require('../sql/query');
//映入请求模块
var fs = require('fs');
var OAuth = require('wechat-oauth');
//引入配置文件
var config = require('../common/json');
var appConfig = config('app');
var wxConfig = config('wechat');
var XMLJS = require('xml2js')
var parser = new XMLJS.Parser();
var builder = new XMLJS.Builder(); 
var client = new OAuth(wxConfig.appId, wxConfig.appSecret);
module.exports = function(app) {
	//网页登录用户
	app.get('/login', function(req, res, next) {
		var openid = req.query.openid;
		var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN `user` ON user.id = wechat.user WHERE wechat.openid = "' + openid + '"';
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
			res.json({
				status: 0,
				data : {
					go: 'success'
				}
			})
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
		console.log(checkSql);
		Query.call(res, checkSql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			//只有是非认证用户的情况下才需要更新身份
			if (!!rows.length && rows[0].identification == 0) {
				var sql = 'UPDATE `user` SET identification = 1, phone = "' + phone + '" WHERE id = ' + user_id;
				console.log(sql);
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
	app.post('/login/gettoken', function(req, res, next) {
	    var query = req.query;  
	    var signature = query.signature;  
	    var echostr = query.echostr;  
	    var timestamp = query['timestamp'];  
	    var nonce = query.nonce;  
	    var oriArray = new Array();  
	    oriArray[0] = nonce;  
	    oriArray[1] = timestamp;  
	    oriArray[2] = appConfig.token;//这里填写你的token  
	    oriArray.sort();  
	    var original = oriArray[0]+oriArray[1]+oriArray[2];  
	    var scyptoString = sha1(original); 
	    if (signature == scyptoString) { 
			req.on("data", function(data) {
				//将xml解析
				parser.parseString(data.toString(), function(err, result) {
					var body = result.xml;
					var messageType = body.MsgType[0];
					//用户点击菜单响应时间
					if(messageType === 'event') {
						// var openid = body.FromUserName[0];
						var eventName = body.Event[0];
						(EventFunction[eventName]||function(){})(body, req, res);
					//自动回复消息
					}else if(messageType === 'text') {
						EventFunction.responseNews(body, res);
					}else {
						res.send(echostr);
					}
				});
			});
		} else {  
	        res.send("Bad Token!");  
	    }
		
	});
	//获取微信返回的网页TOKEN
	app.get('/login/getpagetokenkey', function(req, res, next) {
		var code = req.query.code; //微信返回的值，作为下一步的票券
		//获取票券
		client.getAccessToken(code, function(err, result) {
			var openid = result.data.openid;
			//查询数据库有没有该用户
			var sql = 'SELECT * FROM `wechat` WHERE openid= "' + openid + '"';
			Query.call(res, sql, function(err, rows, filed) {
				if(rows.length) {
					setSession(openid, res, req);
				}
				
			});
		});
	return;
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
			//setSession(body.openid, _self, req);
		});
	});

}
//进入公众号后 开始session回话
function setSession(openid, res, req) {
	var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN `user` ON user.id = wechat.user WHERE wechat.openid = "' + openid + '"';
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
				res.redirect('/page');
			});
		}else{
			res.redirect('/page');
		}
		
	});
};
var crypto = require('crypto');
function sha1(str) {  
    var md5sum = crypto.createHash('sha1');  
    md5sum.update(str);  
    str = md5sum.digest('hex');  
    return str;  
} 
//微信客户端各类回调用接口
var EventFunction = {
		subscribe: function(result, req, res) {
			var openid = result.FromUserName[0];
			var sql = 'SELECT * FROM `wechat` WHERE openid= "' + openid + '"';
				Query.call(res, sql, function(err, rows, filed) {
					//第一次进入的用户
					if (!rows.length) {
						 Query.call(res, 'SELECT * FROM `access_token` ORDER BY create_time DESC LIMIT 1', function(err, rows, filed) {
							client.myFunUserInfo(rows[0].token, openid, function(err, body){
								getUserInfo.call(res, body.data, req);
							})
						});
					} else {
						setSession(openid, res, req);
					}
				});
			var xml  = {xml: {
				ToUserName: openid,
				FromUserName: result.ToUserName,
				CreateTime: 123456587,
				MsgType: 'text',
				Content: '感谢关注服务萍乡，新用户请查看个人中心->不完全指南。'
			}};
			xml = builder.buildObject(xml);
			res.send(xml);
		},
		//注销
		unsubscribe: function(openid, req, res) {

		},
		VIEW: function() {

		},
		//自动回复
		responseNews: function(body, res) {
			var xml  = {xml: {
				ToUserName: body.FromUserName,
				FromUserName: body.ToUserName,
				CreateTime: 123,
				MsgType: 'text',
				Content: '编辑@+您想说的话，我们可以收到'
			}};
			var reciviMessage = body.Content[0]
			if(/^\@.*/.test(reciviMessage)) {
				xml.xml.Content = '已经收到您的建议，会及时处理！'
			}
			xml = builder.buildObject(xml);
			res.send(xml);
		}
}