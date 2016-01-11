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
		url: '/center/index',
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
				'tap .J-infomation->toPage': function(e) {
					
				},
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
	//签到领取红包
	_exprots.SignIn = PDW.createClass({
		name: 'signIn',
		title: '签到领红包',
		route: 'SignIn',
		nav: ['Top'],
		url: '/center/hassignin',
		view: {
			pageEvent: {
				//填写交友信息
				'tap .J-signIn->signIn': function(e) {
					var tar = $(e.target);
					PDW.ajax({
						url: '/center/signin',
						success: function(r) {
							if(r.data.go === 'ok') {
								PB.toast({
									message: '签到成功！',
									type: 'success',
									delay: 2500
								})
							}
						}
					});
				}
			}
		}
	});
	//查看个人信息
	_exprots.MyInformation = PDW.createClass({
		name: 'myInformation',
		title: '详细信息',
		route: 'MyInformation',
		nav: ['Top'],
		url: '/center/myInfo',
		view: {
			pageEvent: {
				//填写交友信息
				'tap .J-try->try': function(e) {
					router.myNavigate('MakeFriends', 'PublishPerson', function(){

					});
				},
				//修改交友信息
				'tap .J-editor->editor': function(e) {
					var id = $(e.target).data('id');
					router.myNavigate('MakeFriends', 'PublishPerson', function(){
						
					});
				}
			}
		}
	});
	//查看个人订单
	_exprots.MyOrder = PDW.createClass({
		name: 'myOrder',
		title: '我的订单',
		route: 'MyOrder',
		nav: ['Top'],
		url: '/center/myorder',
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
		url: '/center/checknews?page=1&count=15',
		view: {
			pageEvent: {
				//查看向我打招呼的人
				'tap .J-checksomebody->checkout': function(e) {
					var sender_id = $(e.target).data('sender');
					router.myNavigate('MakeFriends', 'Personel/'+sender_id, function(){});
					// router.myNavigate('MakeFriends', 'NoInfo/'+sender_id, function(){});
				},
				//接受打招呼
				'tap .J-accpect->accpect': function(e) {
					var tar = $(e.target);
					var id = tar.data('id');
					if(confirm('接受后对方可以查看您的微信号')) {
						PDW.ajax({
							url: '/center/accpect?id=' + id,
							success: function(r) {
								if(r.data.go == 'ok') {
									PB.toast({
										message: '接受成功！',
										type: 'success'
									});
									tar.remove();
								}
								
							}
						});
					}
				},
				//忽略该信息
				'tap .J-forget->forget': function(e) {
					var tar = $(e.target);
					var id = tar.data('id');
					PDW.ajax({
							url: '/center/forget?id=' + id,
							success: function(r) {
								if(r.data.go == 'ok') {
									tar.parents('.newsLi').eq(0).remove();
								}
								
							}
						});
				},
			}
		}
	});
	//建议个意见
	_exprots.Suggestion = PDW.createClass({
		name: 'suggestion',
		title: '建议和意见',
		route: 'Suggestion',
		nav: ['Top'],
		// url: 'http://'+IP+':8800/?way=suggestion',
		view: {
			pageEvent: {
				'tap .J-submit->go': function(e) {
					var question = this.$el.find('.question')[0].value;
					var contact = this.$el.find('.contact').val();
					if(!question) return alert('请填写您的建议！');
					PDW.ajax({
						type: 'POST',
						url: '/center/suggestion',
						data: {
							connection: contact,
							content: question
						},
						success: function(r) {
							PB.toast({
								message: '提交成功！',
								type: 'success'
							});
						}
					})
				}
			}
		}
	});
	//关于我们
	_exprots.AboutUs = PDW.createClass({
		name: 'aboutUs',
		title: '关于我们',
		route: 'AboutUs',
		nav: ['Top'],
		url: '/center/aboutus'
	});
	//更多功能
	_exprots.MoreFunction = PDW.createClass({
		name: 'moreFunction',
		title: '趣味多多',
		route: 'MoreFunction',
		nav: ['Top']
	});
	//注册成为师傅
	_exprots.Register = PDW.createClass({
		name : 'register',
		route: 'Register',
		title: '填写信息',
		nav: ['Top'],
		// url: 'http://'+IP+':8800/?way=fillOrder',
		view: {
			pageEvent: {
				'tap .J-submit->submitOrder': function(e) {
					var father = this.$el;
					var fd = new FormData();
					//称谓
					var name = father.find('.appellation').val();
					if (name == '' || name.length > 6) {
						return alert('昵称为1~6个字符')
					}
					fd.append('name', name);
					//性别
					var sex = father.find('.sex').val();
					fd.append('sex', sex);
					//行业
					var occupation = father.find('.occupation').val();
					fd.append('skill_id', occupation);
					//年龄
					var age = father.find('.age').val();
					fd.append('age', age);
					//技能
					var skill = father.find('.skill').val();
					fd.append('skill', skill);
					//经验
					var experience = father.find('.experience').val();
					fd.append('experience', experience);
					//自我介绍
					var interduce = father.find('.interduce').val();
					fd.append('introduction', interduce);
					//服务范围
					var area = father.find('.area').val();
					fd.append('area', area);
					//地址
					var adress = father.find('.adress').val();
					fd.append('adress', adress);
					//电话
					var phone = father.find('.phone').val();
					fd.append('phone', phone);
					$.ajax({
						url: "/center/register",
						type: "POST",
						data: fd,
						processData: false, // 告诉zepto不要去处理发送的数据
						contentType: false // 告诉zepto不要去设置Content-Type请求头
					});

					//router.myNavigate('Home','SubmitSuccess');
				}
			}
		}
	});

	return _exprots;
});