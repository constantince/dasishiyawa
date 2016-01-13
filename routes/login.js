/*
	登录或者关注公众号
 */
//查询模板
var Query = require('../sql/query');

// console.log('hello');
module.exports = function(app) {
	//进入公众号后 开始session回话
	app.get('/login', function(req, res, next) {
		var sql = 'SELECT wechat.nickname, wechat.headimgurl, wechat.id as wechat_id, user.* FROM wechat LEFT JOIN USER ON user.id = wechat.user WHERE wechat.openid = "' + req.query.openid+ '"';
		Query(sql, function(err, rows, filed) {
			if (err) {
				console.log(err);
				return;
			}
			req.session['user'] = rows[0].id;
			req.session['user_type'] = rows[0].identification;
			req.session['name'] = rows[0].nickname;
			req.session['chat'] = rows[0].wechat_id;
			req.session['open_id'] = req.query.opendid;
			res.json({
				status: 1,
				data: {
					nick: rows[0].nickname,
					sex: rows[0].sex,
					header: rows[0].headimgurl
				}
			});
			return;
		})
	});
}

// module.exports = router;