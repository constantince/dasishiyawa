define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW,
		eve = _PRO_.Event,
		router = _PRO_.Router,
		_exprots = {};
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
		navInfo: {
			active: 'Center'
		},
		nav: ['Bottom', 'Top'],
		url: '/center/index',
		view: {
			pageEvent: {
				//查看个人详细信息
				'tap .J-tobeMaster->tobeMaster': function(e) {
					// var json = this.model.toJSON();
					// router.myNavigate('Center', 'Register', function(){
					// 	this.addDataToModel({
					// 		type: json.userType
					// 	});
					// });

				},
				// //信息消息通知
				'tap .J-infomation->toPage': function(e) {

				}
			}
		}
	});
	//签到领取红包
	_exprots.SignIn = PDW.createClass({
		name: 'signIn',
		title: '签到领红包',
		route: 'SignIn',
		nav: ['Top'],
		// url: '/center/hassignin',
		view: {
			pageEvent: {
				//填写交友信息
				'tap .J-signIn->signIn': function(e) {
					router.myNavigate('Login', 'Login');
					/*
					var tar = $(e.target);
					if(tar.hasClass('untaptable')) return;
					PDW.ajax({
						url: '/center/signin',
						success: function(r) {
							if(r.data.go === 'ok') {
								PB.toast({
									message: '签到成功！',
									type: 'success',
									delay: 2500
								});
								tar.addClass('untaptable').html('签到成功！');
							}
						}
					});
					*/
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
					router.myNavigate('MakeFriends', 'PublishPerson', function() {

					});
				},
				//修改交友信息
				'tap .J-editor->editor': function(e) {
					var id = $(e.target).data('id');
					router.myNavigate('MakeFriends', 'PublishPerson', function() {

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
		view: {
			pageEvent: {
				//展开收起订单
				'tap a.mui-navigate-right->showMoreList': function(e) {
					var tar = $(e.target);
					var tar = tar.hasClass('mui-navigate-right') ? tar : tar.parent();
					var li = tar.parent();
					if (li.hasClass('mui-active')) {
						li.removeClass('mui-active');
					} else {
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
					var user = tar.parent().data('user');
					liBox.removeClass('mui-active');
					liBox.find('.mui-navigate-right em').html('已评价');
					var submitData = {
						orderId: orderId,
						star: star,
						user: user,
						content: content,
						submitTime: PB.now()
					}
					PDW.ajax({
						url: '/center/submitComment',
						type: 'POST',
						data: submitData,
						success: function(r) {
							if (r.data.go === 'ok') {
								var html = '<p><em>评价：</em><em>' + content + '</em></p>';
								liBox.find('.infoBox').append(html);
								form.remove();
							}
						}
					});
				},
				'tap .J-callagain->callagain': function(e) {
					var i = $(e.target).parent().data('i');
					var json = this.model.toJSON().orderList[i];
					router.myNavigate('Home', 'FillOrder', function() {
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
		url: '/center/checknews?page=0&count=15',
		view: {
			pageEvent: {
				//查看向我打招呼的人
				'tap .J-checksomebody->checkout': function(e) {
					var tar = $(e.target);
					var sender_id = tar.data('sender');
					var id = tar.data('id');
					router.myNavigate('MakeFriends', 'Personel/' + sender_id, function() {});
					PDW.ajax({
						url: '/center/checkout?id=' + id
					});
				},
				//接受打招呼
				'tap .J-accpect->accpect': function(e) {
					var tar = $(e.target);
					var sender = tar.data('sender');
					var id = tar.data('id');
					if (confirm('接受后对方可以查看您的微信号')) {
						PDW.ajax({
							url: '/center/accpect?sender=' + sender + '&id=' + id,
							success: function(r) {
								if (r.data.go == 'ok') {
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
							if (r.data.go == 'ok') {
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
					if (!question) return alert('请填写您的建议！');
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
	//版本说明指南
	_exprots.Version = PDW.createClass({
		name: 'version',
		title: '版本说明',
		route: 'Version',
		nav: ['Top'],
		url: '/center/version'
	});
	//更多功能
	_exprots.MoreFunction = PDW.createClass({
		name: 'moreFunction',
		title: '趣味多多',
		route: 'MoreFunction',
		url: '/navigate/index',
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap li a->selectFunction': function(e) {
					var tar = $(e.target);
					tar = tar[0].nodeName === 'A' ? tar : tar.parents('a').eq(0);
					var module = tar.data('module');
					var route = tar.data('route');
					var status = tar.data('status');
					if(status == 0) {
						PB.toast({
							message: '即将开通',
							type: 'unconnectable'
						})
						return;
					}
					router.myNavigate(module, route);
				}
			}
		}
	});
	//查看师傅身份
	_exprots.CheckIdentity = PDW.createClass({
		name: 'checkIdentity',
		title: '注册身份',
		route: 'CheckIdentity',
		url: '/center/checkIdentity',
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .J-editor->editor': function(e) {
					router.myNavigate('Center', 'Register', function() {});
				},
				'tap .J-try->try': function(e) {
					router.myNavigate('Center', 'Register', function() {});
				}
			}
		}
	});
	//注册成为师傅
	_exprots.Register = PDW.createClass({
		name: 'register',
		route: 'Register',
		title: '填写信息',
		nav: ['Top'],
		//url: '/checkidentity/?way=fillOrder',
		view: {
			pageEvent: {
				'tap .J-submit->submitOrder': function(e) {
					var father = this.$el;
					var fd = new FormData();
					//称谓
					var name = father.find('.appellation').val();

					//性别
					var sex = father.find('.sex').val();

					//行业
					var occupation = father.find('.occupation').val();

					//年龄
					var age = father.find('.age').val();

					//照片
					var img = father.find('.img')[0].files[0];

					//技能
					var skill = father.find('.skill').val();

					//经验
					var experience = father.find('.experience').val();

					//自我介绍
					var interduce = father.find('.interduce').val();

					//服务范围
					var area = father.find('.area').val();

					//地址
					var adress = father.find('.adress').val();

					//电话
					var phone = father.find('.phone').val();

					//开始验证
					var canPass = PDW.verifly();
					var message = canPass([{
						value: name,
						rules: [{
							veriflyType: 'text',
							errorMessgag: '请填写姓名！'
						}, {
							veriflyType: 'maxLength:6',
							errorMessgag: '最大长度为6'
						}]
					}, {
						value: img,
						rules: [{
							veriflyType: 'img',
							errorMessgag: '图片不符合要求, 2M以下的png或者jpg图片'
						}]
					}, {
						value: interduce,
						rules: [{
							veriflyType: 'maxLength:50',
							errorMessgag: '最大长度为50个字符'
						}]
					}, {
						value: area,
						rules: [{
							veriflyType: 'text',
							errorMessgag: '请填写服务范围！'
						}, {
							veriflyType: 'maxLength:30',
							errorMessgag: '最大长度为30个字符'
						}]
					}, {
						value: phone,
						rules: [{
							veriflyType: 'phone',
							errorMessgag: '请输入正确的电话号码'
						}]
					}, ]);
					if (message !== undefined) {
						return alert(message);
					}
					//开始装载数据
					fd.append('name', name);
					fd.append('sex', sex);
					fd.append('show_img', img);
					fd.append('skill_id', occupation);
					fd.append('age', age);
					fd.append('skill', skill);
					fd.append('experience', experience);
					fd.append('introduction', interduce);
					fd.append('area', area);
					fd.append('adress', adress);
					fd.append('phone', phone);
					$.ajax({
						url: "/center/register",
						type: "POST",
						data: fd,
						processData: false, // 告诉zepto不要去处理发送的数据
						contentType: false, // 告诉zepto不要去设置Content-Type请求头
						success: function(r) {
							if (r.data.go == 'ok') {
								PB.toast({
									message: '提交成功！',
									type: 'success'
								});
								history.go(-1);
							}
						}
					});

					//router.myNavigate('Home','SubmitSuccess');
				},
				'change .img->change': function(e) {
					var tar = $(e.target);
					var src = tar.val();
					tar.parent().addClass('upload_finish');
					tar.next().html('路径:' + src);
				}
			}
		}
	});

	//接收到的订单
	_exprots.TakeOrder = PDW.createClass({
		name: 'takeOrder',
		title: '收到的单',
		route: 'TakeOrder',
		url: '/center/takeorder',
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .J-handle->handleOrder': function(e) {
					var tar = $(e.target);
					if (tar.hasClass('untaptable')) return;
					var orderId = tar.data('orderid');
					var userId = tar.data('user');
					var handleWay = tar.data('way');
					if (handleWay == 4) {
						var txt = prompt('请填写您的拒绝原因');
						if (txt === null) {
							return;
						}
					}
					PDW.ajax({
						url: '/center/handleorder?userid=' + userId + '&orderid=' + orderId + '&action=' + handleWay,
						success: function(e) {
							if (e.data.go == 'ok') {
								//接受订单
								if (handleWay == 1) {
									tar.addClass('accomplish').html('结束订单');
									PB.toast({
											message: '接单成功！',
											type: 'success',
											delay: 2500
										})
										//拒绝订单
								} else if (handleWay == 4) {
									tar.addClass('untaptable').html('已拒绝');
								} else if (handleWay == 2) {
									PB.toast({
										message: '完成订单！',
										type: 'success',
										delay: 2500
									})
									tar.addClass('untaptable').html('已完成');
								}
							}
						}
					})
				}
			}
		}
	});

	return _exprots;
});