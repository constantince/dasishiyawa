/*
	登录或者关注公众号
 */
//查询模板
var Query = require('../sql/query');

// console.log('hello');
module.exports = function(app) {
	//进入公众号后 开始session回话
	app.get('/login', function(req, res, next) {
		Query('SELECT * FROM user LEFT JOIN wechat ON user.wechat_id = wechat.id WHERE wechat.openid = ' + req.query.openid, function(err, rows, filed) {
			if (err) return;

		})
	});
}

// module.exports = router;