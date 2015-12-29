define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('Center', function() {
		return _exprots;
	});

	//个人中心
	_exprots.Center = PDW.createClass({
		//视图名称 * 
		name: 'center',
		//界面标题 + 无需赘述
		title: '个人中心',
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'Center',
		navInfo: {active: 'Center'},
		nav: ['Bottom', 'Top'],
		// url: 'http://'+IP+':8800/?way=center',
		view: {
			pageEvent: {
				//查看个人详细信息
				'tap .J-information->myInformation': function(e) {
					// router.myNavigate('Center', 'MyInformation');
				},
				//查看我的订单
				// 'tap .J-infomation->toPage': function(e) {
					
				// },
				// //信息消息通知
				// 'tap .J-infomation->toPage': function(e) {
					
				// },
				// //建议和意见
				// 'tap .J-infomation->toPage': function(e) {
					
				// },
				// //关于我们
				// 'tap .J-infomation->toPage': function(e) {
					
				// },
				// //退出
				// 'tap .J-infomation->toPage': function(e) {
					
				// },
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
	//查看个人信息
	_exprots.MyInformation = PDW.createClass({
		name: 'myInformation',
		title: '详细信息',
		route: 'MyInformation',
		nav: ['Top'],
		url: 'http://'+IP+':8800/?way=myInformation',
	});
	//查看个人订单
	_exprots.MyOrder = PDW.createClass({
		name: 'myOrder',
		title: '我的订单',
		route: 'MyOrder',
		nav: ['Top'],
		url: 'http://'+IP+':8800/?way=myOrder',
		view:{
			pageEvent:{
				//展开收起订单
				'tap a.mui-navigate-right->showMoreList': function(e) {
					var tar = $(e.target);
					var tar = tar.hasClass('mui-navigate-right') ? tar : tar.parent();
					var li = tar.parent();
					if(li.hasClass('mui-active')) {
						li.removeClass('mui-active');
					}else{
						li.parent().find('li.mui-active').removeClass('mui-active');
						li.addClass('mui-active');
					}
				},
				'tap .J-submit->submitJudement': function(e) {
					var tar = $(e.target);
					var orderId = tar.parent().data('orderid');
					var form = tar.parents('form').eq(0);
					var star = form.find('select').val();
					var content = form.find('.judeContent').val();
					var liBox = tar.parents('li.mui-collapse').eq(0);
					liBox.removeClass('mui-active');
					liBox.find('.mui-navigate-right em').html('已评价');
					var html = '<p><em>评价：</em><em>'+content+'</em></p>';
					liBox.find('.infoBox').append(html);
					form.remove();
				},
				'tap .J-callagain->callagain': function(e) {
					var i = $(e.target).parent().data('i');
					var json = this.model.toJSON().list[i];
					router.myNavigate('Home', 'FillOrder', function(){
						this.addDataToModel({
							masterInformation: {
								masterId: json.masterId,
								masterName: json.masterName,
								masterTel: json.masterTel
							}
							
						});
					});
				}
			}
		}
	});
	//消息
	_exprots.News = PDW.createClass({
		name: 'news',
		title: '我的消息',
		route: 'News',
		nav: ['Top'],
		url: 'http://'+IP+':8800/?way=news',
		view: {
			pageEvent: {
				'tap .checkout->go': function(e) {
					var id = $(e.target).data('id');
					router.myNavigate('MakeFriends', 'Personel/'+id, function(){});
				}
			}
		}
	});
	//建议个意见
	_exprots.Suggestion = PDW.createClass({
		name: 'suggestion',
		title: '建议和意见',
		route: 'Suggestion',
		nav: ['Top'],
		url: 'http://'+IP+':8800/?way=suggestion'
	});
	//关于我们
	_exprots.AboutUs = PDW.createClass({
		name: 'aboutUs',
		title: '关于我们',
		route: 'AboutUs',
		nav: ['Top'],
		url: 'http://'+IP+':8800/?way=aboutUs'
	});
	//更多功能
	_exprots.MoreFunction = PDW.createClass({
		name: 'moreFunction',
		title: '趣味多多',
		route: 'MoreFunction',
		nav: ['Top']
	});

	return _exprots;
});