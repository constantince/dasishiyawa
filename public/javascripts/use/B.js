define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('B', function() {
		return _exprots;
	});
	//课程选择
	_exprots.B = PDW.createClass({
		//视图名称 * 
		name: 'b',
		url: 'http://192.168.1.102:8800/?way=b',
		//界面标题 + 无需赘述
		title: 'b界面',
		nav: ['Bottom', 'Top'],
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'B',
		view: {
			pageEvent: {
				'tap h1->toPage': function() {
					router.myNavigate('A', 'C', function() {
						this.C.addDataToModel({
							other: 'ALL INFROMATION FOR PAGE D FROM PAGE C'
						});
					});
				}
			}
		}
	});

	_exprots.D = PDW.createClass({
		//视图名称 * 
		name: 'd',
		//界面标题 + 无需赘述
		title: 'd界面',
		url: 'http://192.168.1.102:8800/?way=d',
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'D',
		view: {
			pageEvent: {
				'tap h1->toPage': function() {
					router.myNavigate('A', 'A', function() {
						this.A.addDataToModel({
							other: 'ALL INFROMATION FOR PAGE D FROM PAGE C'
						});
					});
				}
			}
		},
		model: {
			defaults: {
				other: ''
			}
		}
	});

	return _exprots;
});