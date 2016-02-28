define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('Navigate', function() {
		return _exprots;
	});

	//个人中心
	_exprots.Navigate = PDW.createClass({
		//视图名称 * 
		name: 'navigate',
		//界面标题 + 无需赘述
		title: '功能导航',
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'Navigate',
		nav: ['Top'],
		url: '/navigate/index',
		view: {
			pageEvent: {
				'tap li a->selectFunction': function(e) {
					var tar = $(e.target);
					tar = tar[0].nodeName === 'A' ? tar : tar.parents('a').eq(0);
					var module = tar.data('module');
					var route = tar.data('route');
					var status = tar.data('status');
					if(status == 0) {
						PB.tip({
							tipTxt: '联系我们，一起来建设公众号吧！',
							delay: 3500
						});
						return;
					}
					router.myNavigate(module, route);
				}
			}
		}
	});

	return _exprots;
});