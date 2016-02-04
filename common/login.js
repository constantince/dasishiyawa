var config = require('../common/json');
var OAuth = require('wechat-oauth');
var request = require('request');
//引入数据库模块
function Login(fn) {
	return function(req, res, next) {
		var user = req.session['user'] || req.query._user;
		//未登录的情况或者登录失效 网页调试无需走微信通道
		if (user === undefined && !config('app').webDebug) {
			var wxconfig = config('wechat');
			var client = new OAuth(wxconfig.appId, wxconfig.appSecret);
			var url = client.getAuthorizeURL(config('app').url + wxconfig.callbackUrl, 'snsapi_userinfo');
			res.redirect(url);
			return;
		}
		fn.call(null, req, res, next);

	}
}
//导出模块
module.exports = Login;