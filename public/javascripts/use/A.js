define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('A', function() {
		return _exprots;
	});
	//课程选择
	_exprots.A = PDW.createClass({
		//视图名称 * 
		name: 'a',
		//界面标题 + 无需赘述
		title: 'a界面',
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'A',
		url: 'http://172.16.0.189:8800/?way=a',
		nav: ['Bottom'],
		view: {
			//渲染界面后的回掉
			afterRender: function() {
				//console.log(this.$el);
			},
			//注册界面事件
			pageEvent: {
				'tap h1->toPage': function(e) {
					//A:模块名称 C:路由名称 function.....:回掉函数。this上下文指向模块A
					router.myNavigate('B','B', function(){
						this.B.addDataToModel({
							other: 'I AM OTERHS INFOMATION FORM PAGE A'
						});
					});
				},
				'tap .J-refresh->refreshPage': function() {
					_exprots.A.refresh('testname', {
						List: 'a ha good afternoon'
					});
				},
				'tap .J-changeNav->changeNavA': function() {
					PDW.getModule('Nav').Bottom.reloadView({
						defaultPage: 0
					});
				}
			}
		},
		model: {
			defaults: {
				say: 'hello',
				List: 'a ha good morning',
				other: ''
			}
		}
	});

	//课程选择
	_exprots.C = PDW.createClass({
		//视图名称 * 
		name: 'c',
		//界面标题 + 无需赘述
		title: 'c界面',
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'C',
		url: 'http://172.16.0.189:8800/?way=c',
		view: {
			pageEvent: {
				'tap h1->toPage': function(e) {
					router.myNavigate('B','D', function() {
						this.D.addDataToModel({
							other: 'ALL INFROMATION FOR PAGE D FROM PAGE C'
						})
					});
				}
			}
		},
		model: {
			defaults: {
				say: 'hello',
				name: 'C',
				other: 'ccccccc'
			}
		}
	});

	return _exprots;
});