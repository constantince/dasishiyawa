define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('Nav', function() {
		return _exprots;
	});
	//底部导航
	_exprots.Bottom = PDW.createClass({
		//视图名称 * 
		name: 'bottom',
		//界面类型
		type: 'navigate',
		applayChange: true,
		view: {
			//渲染界面前的回掉
			beforeRender: function() {
				var activePageModule = PDW.getActiveRoute();
				var info = activePageModule.getOptions().navInfo;
				this.model.set(info);
			},
			//注册界面事件
			pageEvent: {
				'tap .mui-tab-item->routeNavigate': function(e) {
					var tar = $(e.target);
					tar = tar[0].nodeName === 'A'? tar : tar.parent();
					var propeites = tar.data('n');
					var path = propeites.split('-');
					//params1:模块名称(A), params2:路由名称(C), params3: function.....:回掉函数。this上下文指向模块A
					router.myNavigate(path[0], path[1], function(){
						// var title = this.options.title;
						// _exprots.Top.reloadView({name: title});
						// tar.parent().find('a.mui-active').removeClass('mui-active');
						// tar.addClass('mui-active');
					});
				}
			}
		},
		//界面默认的数据
		model: {
			defaults: {
				List:[{Module:'Center', Route:'Center', Name:'我的', icon:'contact' }],
				active: 'Home',
				defaultPage: 0
			}
		}
	});
	//顶部导航
	_exprots.Top = PDW.createClass({
		//视图名称 * 
		name: 'top',
		//界面类型
		type: 'navigate',
		applayChange: true,
		view: {
			//渲染界面后的回掉
			beforeRender: function() {
				//向模型中输入新的数据
				var activePageModule = PDW.getActiveRoute();
				var title = activePageModule.getOptions().title;
				this.model.set({name: title});
				//console.log(PDW.getActiveRoute());
			},
			//注册界面事件
			pageEvent: {
				'tap a->back': function(e) {
					window.history.go(-1);
				}
			}
		},
		//界面默认的数据
		model: {
			defaults: {
				name: '首页'
			}
		}
	});
	return _exprots;
});