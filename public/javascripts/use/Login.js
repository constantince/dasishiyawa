define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('Login', function() {
		return _exprots;
	});
	//登录界面
	_exprots.Login = PDW.createClass({
		name: 'login',
		route: 'Login',
		title: '登入账号',
		//该界面需要显示出来的导航
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .J-login->login': function(e) {
					router.myNavigate('Center','Center');
				}
			}
		}
	});
	

	
	//忘记密码
	_exprots.ForgetPassword = PDW.createClass({
		name : 'forgetPassword',
		route: 'ForgetPassword',
		title: '提交成功',
		nav: ['Top'],
		//url: 'http://'+IP+':8800/?way=submitSuccess',
		view: {
			pageEvent: {
				'tap .J-center->toCenter': function(e) {
					router.myNavigate('Center','Center');
				}
			}
		}
	});
/**/
	return _exprots;
});