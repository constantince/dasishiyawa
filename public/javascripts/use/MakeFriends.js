define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW, eve = _PRO_.Event, router = _PRO_.Router, _exprots = {};
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
			List: [
				{Module:'MakeFriends', Route:'MakeFriends', Name:'广场', icon:'image'}, 
				{Module:'MakeFriends', Route:'PublishPerson', Name:'发布', icon:'compose' },
				{Module:'Center', Route:'Center', Name:'我的', icon:'contact' }],
			active: 'MakeFriends'
		},
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'MakeFriends',
		//界面的异步加载数据地址
		url: '/makefriends/index?index=0&count=5',
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
				//查看师傅信息
				'tap li.cell->toInfo': function(e) {
					//params1:模块名称(B), params2:路由名称(B), params3: function.....:回掉函数。this上下文指向文件模块B
					var tar = $(e.target);
					tar = tar.hasClass('cell') ? tar : tar.parents('.cell').eq(0);
					var id = tar.data('id');
					router.myNavigate('Home','Information/'+id);
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
		route: 'Personel(/:id)',
		title: '个人信息',
		//url: 'http://'+IP+':8800/?way=Personel',
		//该界面需要显示出来的导航
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .J-bookup->callMaster': function(e) {
					var json = this.model.toJSON().information;
					router.myNavigate('Home','FillOrder', function(){
						this.addDataToModel({
							masterInformation: {
								masterId: json.id,
								masterName: json.name,
								masterTel: json.tel
							}
							
						});
					});
				},
				'tap .J-tab->tabChange': function(e) {
					var tar = $(e.target);
					var listName = tar.data('list');
					if(tar.hasClass('mui-active')) {
						return;
					}else{
						this.$el.find('a.mui-active').removeClass('mui-active');
						tar.addClass('mui-active');
					}
					this.$el.find('.list ul').addClass('g-d-n');
					this.$el.find('.list').find('ul.'+listName).removeClass('g-d-n');
				}
			}
		}
	});
	//发布个人信息
	_exprots.PublishPerson = PDW.createClass({
		name : 'publishPerson',
		route: 'PublishPerson',
		title: '填写信息',
		nav: ['Top'],
		// url: 'http://'+IP+':8800/?way=publishPerson',
		view: {
			pageEvent: {
				'tap .J-submit->submitOrder': function(e) {
					var json = this.model.toJSON();
					var fatherEl = this.$el.find('.machine');
					//设备信息已经表单提交内容
					var machineName = fatherEl.find('.machineName').val(),
						machineYear = fatherEl.find('.machineYear').val(),
						machinePlate = fatherEl.find('.machinePlate').val(),
						adress = fatherEl.find('.adress').val() || json.myInformation.adress,
						date = fatherEl.find('.date').val(),
						time = fatherEl.find('.time').val(),
						content = $('#discriptionTextarea')[0].value;
					//设备名称校验
					if(!machineName) {
						return alert('请填写设备名称');
					}
					//地址校验
					if(!adress) {
						return alert('请填联系地址');
					}
					/*
					PDW.ajax({
						url: 'http://'+IP+':8800/?way=fillOrder',
						type: 'POST',
						data: {
							machineName: machineName,
							machineYear: machineYear,
							adress: adress,
							dateTime: date + time,
							content: content
						},
						success: function(e) {
							router.myNavigate('Home','SubmitSuccess');
						}
					})*/
					router.myNavigate('Home', 'SubmitSuccess', function(){
						this.addDataToModel({
							masterName: json.masterInformation.masterName,
							masterTel: json.masterInformation.masterTel,
							machineName: machineName,
							machinePlate: machinePlate,
							machineYear: machineYear,
							content: content || '无',
							orderNum: 007,
							orderDate: '2015-09-04 15:16:17',
							adress: adress

						});
					});
				},
				'change .J-adressSelect->changeAdress': function(e) {
					var tar = $(e.target);
					var adress = this.$el.find('.adress');
					if(tar.prop('checked')) {
						adress.parent().addClass('g-d-n');
					}else{
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