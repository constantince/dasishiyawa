/*
	登录或者关注公众号
 */
//查询模板
var Query = require('../sql/query');

// console.log('hello');
module.exports = function(app) {
	//进入公众号后 开始session回话
	app.get('/login', function(req, res, next) {
		var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN USER ON user.id = wechat.user WHERE wechat.openid = "' + req.query.openid + '"';
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			var result = rows[0];
			req.session['user'] = result.id;
			req.session['user_type'] = result.identification;
			req.session['name'] = result.nickname;
			req.session['chat'] = result.wechat_id;
			req.session['open_id'] = req.query.opendid;
			req.session['master_id'] = 0;
			var masterSql = 'SELECT * FROM master WHERE user = ' + result.id;
			if (result.identification == 2) {
				Query(masterSql, function(err, rows, filed) {
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
		})
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
	app.get('/login/setphone', function(req, res, next){
		var phone = req.query.phone;
		var user_id = req.session['user'];
		var sql = 'UPDATE `user` SET identification = 1, phone = "'+phone+'" WHERE id = ' + user_id;
		Query(sql, function(err, rows, filed){
			if (err) {
				console.log(err);
				return;
			}
			req.session['user_type'] = 1;
			res.json({
				status: 1,
				data: {go: 'ok'}
			});
		});
	});
}

// module.exports = router;