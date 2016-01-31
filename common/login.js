var OAuth = require('wechat-oauth');
var client = new OAuth('wx0d23b7549ecbbbcf', 'f9fc3893223a2ff694e76d0df8228731');

//引入数据库模块
function Login(fn) {
	return function() {
		var req = arguments[0];
		var res = arguments[1];
		var next = arguments[2];
		var user = req.session['user'] || req.query._user;
		//未登录的情况或者登录失效
		if (user === undefined) {
			var url = client.getAuthorizeURL('http://yoli.ngrok.natapp.cn/login/getpagetokenkey', 'snsapi_userinfo');
			res.redirect(url)
			return;
		}
		fn.call(null, req, res, next);

	}
}
//导出模块
module.exports = Login;