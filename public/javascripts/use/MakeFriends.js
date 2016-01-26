define(['base', 'core/underscore'], function(_PRO_, _) {
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
		url: '/makefriends/index?index=0&count=15',
		//该界面需要显示出来的导航
		nav: ['Bottom', 'Top'],
		view: {
			//渲染界面后的回掉
			afterRender: function() {
				this.index = 0;
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
					},
					'tap .J-loadmore->loadData': function(e) {
						var index = ++this.index;
						index = index * 15;
						var _self = this;
						PDW.ajax({
							url: '/makefriends/index?index='+index+'&count=15',
							success: function(r) {
								if(r.data.list.length > 0) {
									var html = _.template($('#tplmakeFriendsTemplate').html())(r.data);
									_self.$el.find('.my-css-cbox > li').last().after(html);
								}else{
									PB.tip({
										tipTxt: '没有更多数据了.....'
									});
									_self.index--;
								}
						
							}
						}) 
					}
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
					if(tar.hasClass('cannotclick')) {
						return alert('不可以给自己打招呼！');
					}
					// var id = this.model.toJSON().list.id;
					var user_id = this.model.toJSON().list.user;
					PDW.ajax({
						url: '/makefriends/sayHello?user=' + user_id,
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
					if(tar.hasClass('cannotclick')) {
						return alert('不可以给自己点赞！');
					}
					var id = this.model.toJSON().list.id;
					PDW.ajax({
						url: '/makefriends/likeIt?user='+id,
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
					
					//性别
					var sex = father.find('[name="radio"]:checked').val();
					
					//微信号
					var wechat = father.find('.wechat').val();

					//是否公开微信号
					var needShowWechat = father.find('.needShowWecaht').prop('checked') ? 1 : 0;

					//照片
					var img = father.find('.img')[0].files[0];

					//年龄
					var age = father.find('.age').val();
					
					//出生地
					var birthPlace = father.find('.birthplace').val();
					
					//现居地
					var livePlace = father.find('.liveplace').val();
					
					//职业
					var profession = father.find('.profession').val();
					
					//特长
					var goodAt = father.find('.goodat').val();
					
					//爱好
					var hobby = father.find('.hobby').val();
					
					//身高
					var tall = father.find('.tall').val();
					
					//体重
					var weight = father.find('.weight').val();
					
					//其他社交账号
					var contact = father.find('.contact').val();
					
					//婚礼状态
					var marriageable = father.find('.marriageable')[0].selectedIndex;
					
					//交友宣言
					var question = father.find('.question').val();
					
					//开始验证
					var canPass = PDW.verifly();
					var message = canPass([
							{value: name, rules: [{veriflyType: 'text', errorMessgag: '昵称为1~6个字符'},{veriflyType: 'maxLength:6', errorMessgag: '昵称为1~6个字符'}]},
							{value: wechat, rules: [{veriflyType: 'text', errorMessgag: '请填写微信号'}]},
							{value: img, rules: [{veriflyType: 'img', errorMessgag: '图片不符合要求, 2M以下的png或者jpg图片'}]},
							{value: birthPlace, rules: [{veriflyType: 'maxLength:20', errorMessgag: '出生地：20个字符以内'}]},
							{value: livePlace, rules: [{veriflyType: 'maxLength:20', errorMessgag: '居住地：20个字符以内'}]},
							{value: tall, rules: [{veriflyType: 'tall', errorMessgag: '请填写有效三位数字，单位cm'}]},
							{value: weight, rules: [{veriflyType: 'weight', errorMessgag: '请填写有效两位数字，单位kg'}]},
							{value: question, rules: [{veriflyType: 'maxLength:30', errorMessgag: '交友宣言：30个字符以内'}]},
						]);
					if(message!==undefined) {
					    return alert(message);
					}
					//开始装载数据
					fd.append('nick', name); 
					fd.append('sex', sex);
					fd.append('chat', wechat);
					fd.append('show_img', img);
					fd.append('age', age);
					fd.append('birthplace', birthPlace);
					fd.append('liveplace', livePlace);
					fd.append('profession', profession);
					fd.append('speciality', goodAt);
					fd.append('tall', tall);
					fd.append('hobby', hobby);
					fd.append('weight', weight);
					fd.append('need_hiddenwx', needShowWechat);
					fd.append('socialaccount', contact);
					fd.append('marriageable', marriageable);
					fd.append('introduction', question);
					$.ajax({
						url: "/makefriends/publish",
						type: "POST",
						data: fd,
						processData: false, // 告诉zepto不要去处理发送的数据
						contentType: false, // 告诉zepto不要去设置Content-Type请求头
						success: function(r) {
							if(r.data.go == 'ok') {
								PB.toast({
									message:'注册成功！',
									type: 'success'
								});
								history.go(-1);
							}
						}

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
				'change .img->change': function(e) {
					var tar = $(e.target);
					var src = tar.val();
					tar.parent().addClass('upload_finish');
					tar.next().html('路径:' + src);
				}
			}
		}
	});
	return _exprots;
});