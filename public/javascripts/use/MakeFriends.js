define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW,
		eve = _PRO_.Event,
		router = _PRO_.Router,
		_exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('MakeFriends', function() {
		return _exprots;
	});
	//交友广场
	_exprots.MakeFriends = PDW.createClass({
		//视图名称 * 
		name: 'makeFriends',
		//界面标题 + 无需赘述
		title: '广场',
		//传入底部界面的信息，控制底部导航的变化
		navInfo: {
			List: [{
				Module: 'MakeFriends',
				Route: 'MakeFriends',
				Name: '广场',
				icon: 'image'
			},
			{
				Module: 'Center',
				Route: 'Center',
				Name: '我的',
				icon: 'contact'
			}],
			active: 'MakeFriends'
		},
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'MakeFriends',
		//界面的异步加载数据地址
		url: '/makefriends/index?index=0&count=20',
		//该界面需要显示出来的导航
		nav: ['Bottom', 'Top'],
		view: {
			//渲染界面后的回掉
			afterRender: function() {
				//console.log('page html elements has reloaded!');
			},
			//渲染之前的回调函数
			beforeRender: function() {
				//console.log('page html elements has not reloaded! you can not find any elements!');
			},
			//注册界面事件
			pageEvent: {
				//查看个人交友信息
				'tap li.list->toInfo': function(e) {
						//params1:模块名称(B), params2:路由名称(B), params3: function.....:回掉函数。this上下文指向文件模块B
						var tar = $(e.target);
						tar = tar.hasClass('list') ? tar : tar.parents('.list').eq(0);
						var i = tar.data('i');
						var json = this.model.toJSON().list[i];
						router.myNavigate('MakeFriends', 'Personel/'+json.id, function(){
							//this.addDataToModel(json);
						});
					}
					// 'tap .J-refresh->refreshPage': function() {
					// 	_exprots.A.refresh('testname', {
					// 		List: 'a ha, good afternoon'
					// 	});
					// },
					// 'tap .J-changeNav->changeNavA': function() {
					// 	PDW.getModule('Nav').Bottom.reloadView({
					// 		defaultPage: 0
					// 	});
					// }
			}
		}
	});
	//个人资料
	_exprots.Personel = PDW.createClass({
		name: 'personel',
		route: 'Personel/:id',
		title: '个人信息',
		url: '/makefriends/personel?personel=[0]',
		//该界面需要显示出来的导航
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .say-hello->sayHello': function(e) {
					var tar = $(e.target);
					var id = this.model.toJSON().list.id;
					PDW.ajax({
						url: '/makefriends/sayHello?user='+id+'&sender=1',
						success: function(r) {
							if(r.data.go == 'ok') {
								tar.addClass('untaptable').html('已打招呼');
								PB.toast({
									message: '已发送！',
									type: 'success',
									delay: 2500
								});
							}
						}
					})
				},
				'tap .like-it->likeIt': function(e) {
					var tar = $(e.target);
					var id = this.model.toJSON().list.id;
					PDW.ajax({
						url: '/makefriends/likeIt?user='+id+'&sender=1',
						success: function(r) {
							if(r.data.go == 'ok') {
								tar.addClass('untaptable').html('已点赞');
								PB.toast({
									message: '点赞成功！',
									type: 'success',
									delay: 2500
								});
							}
						}
					})
				}
			}
		}
	});
	//发布个人信息
	_exprots.PublishPerson = PDW.createClass({
		name: 'publishPerson',
		route: 'PublishPerson',
		title: '填写信息',
		nav: ['Top'],
		// url: 'http://'+IP+':8800/?way=publishPerson',
		view: {
			pageEvent: {
				'tap .J-submit->submitInfo': function(e) {
					var father = this.$el;
					var fd = new FormData();
					//昵称
					var name = father.find('.nickname').val();
					if (name == '' || name.length > 6) {
						return alert('昵称为1~6个字符')
					}
					fd.append('nick', name);
					//性别
					var sex = father.find('[name="radio"]:checked').val();
					fd.append('sex', sex);
					//微信号
					var wechat = father.find('.wechat').val();
					fd.append('chat', wechat);
					if (wechat == '') {
						return alert('请填写微信号');
					}
					//照片
					var img = father.find('.img')[0].files[0];
					fd.append('show_img', img);
					if (img && img.size / 1024 / 1024 > 2) {
						return alert('图片尺寸太大，不符合要求！');
					}
					//年龄
					var age = father.find('.age').val();
					fd.append('age', age);
					//出生地
					var birthPlace = father.find('.birthplace').val();
					fd.append('birthplace', birthPlace);
					//现居地
					var livePlace = father.find('.liveplace').val();
					fd.append('liveplace', livePlace);
					//职业
					var profession = father.find('.profession').val();
					fd.append('profession', profession);
					//特长
					var goodAt = father.find('.goodat').val();
					fd.append('speciality', goodAt);
					//爱好
					var hobby = father.find('.hobby').val();
					fd.append('hobby', hobby);
					//身高
					var tall = father.find('.tall').val();
					if(tall !='' && ! (/^\d{3}$/.test(tall))) return alert('身高为三位数数字！')
					fd.append('tall', tall);
					//体重
					var weight = father.find('.weight').val();
					if(weight !='' && !(/^\d{2}$/.test(weight))) return alert('体重为两位数数字！')
					fd.append('weight', weight);
					//其他社交账号
					var contact = father.find('.contact').val();
					fd.append('socialaccount', contact);
					//婚礼状态
					var marriageable = father.find('.marriageable')[0].selectedIndex;
					fd.append('marriageable', marriageable);
					//交友宣言
					var question = father.find('.question').val();
					fd.append('introduction', question);
					$.ajax({
						url: "/makefriends/publish",
						type: "POST",
						data: fd,
						processData: false, // 告诉zepto不要去处理发送的数据
						contentType: false // 告诉zepto不要去设置Content-Type请求头
					});


					// var json = this.model.toJSON();
					// var fatherEl = this.$el.find('.machine');
					// //设备信息已经表单提交内容
					// var machineName = fatherEl.find('.machineName').val(),
					// 	machineYear = fatherEl.find('.machineYear').val(),
					// 	machinePlate = fatherEl.find('.machinePlate').val(),
					// 	adress = fatherEl.find('.adress').val() || json.myInformation.adress,
					// 	date = fatherEl.find('.date').val(),
					// 	time = fatherEl.find('.time').val(),
					// 	content = $('#discriptionTextarea')[0].value;
					// //设备名称校验
					// if(!machineName) {
					// 	return alert('请填写设备名称');
					// }
					// //地址校验
					// if(!adress) {
					// 	return alert('请填联系地址');
					// }

					// PDW.ajax({
					// 	url: 'http://'+IP+':8800/?way=fillOrder',
					// 	type: 'POST',
					// 	data: {
					// 		machineName: machineName,
					// 		machineYear: machineYear,
					// 		adress: adress,
					// 		dateTime: date + time,
					// 		content: content
					// 	},
					// 	success: function(e) {
					// 		router.myNavigate('Home','SubmitSuccess');
					// 	}
					// })
					// router.myNavigate('Home', 'SubmitSuccess', function(){
					// 	this.addDataToModel({
					// 		masterName: json.masterInformation.masterName,
					// 		masterTel: json.masterInformation.masterTel,
					// 		machineName: machineName,
					// 		machinePlate: machinePlate,
					// 		machineYear: machineYear,
					// 		content: content || '无',
					// 		orderNum: 007,
					// 		orderDate: '2015-09-04 15:16:17',
					// 		adress: adress

					// 	});
					// });
				},
				'change .J-adressSelect->changeAdress': function(e) {
					var tar = $(e.target);
					var adress = this.$el.find('.adress');
					if (tar.prop('checked')) {
						adress.parent().addClass('g-d-n');
					} else {
						adress.parent().removeClass('g-d-n');
					}
				}
			}
		}
	});
	// ////订单提交成功
	// _exprots.SubmitSuccess = PDW.createClass({
	// 	name : 'submitSuccess',
	// 	route: 'SubmitSuccess',
	// 	title: '提交成功',
	// 	nav: ['Top'],
	// 	view: {
	// 		pageEvent: {
	// 			'tap .J-center->toCenter': function(e) {
	// 				router.myNavigate('Center','Center');
	// 			}
	// 		}
	// 	}
	// });
	return _exprots;
});