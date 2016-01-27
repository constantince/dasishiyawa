define(['base'], function(_PRO_) {
	//全局依赖变量pdw:创建项目界面模块 e: 公共事件函数 router:路由模块
	var PDW = _PRO_.PDW,
		eve = _PRO_.Event,
		router = _PRO_.Router,
		_exprots = {};
	//将视图模块导入缓存中
	PDW.Observer.add('Home', function() {
		return _exprots;
	});
	//主页预约界面
	_exprots.Home = PDW.createClass({
		//视图名称 * 
		name: 'home',
		//界面标题 + 无需赘述
		title: '主页',
		//路由名称 +无需赘述，如果没有配置路由名称，则该界面没有加入路由规则当中去。一般是弹出界面无需配置此项
		route: 'Home',
		//界面的异步加载数据地址
		url: '/home/index?count=15&page=0',
		navInfo: {
			active: 'Home'
		},
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
				//查看师傅信息
				'tap li.cell->toInfo': function(e) {
					//params1:模块名称(B), params2:路由名称(B), params3: function.....:回掉函数。this上下文指向文件模块B
					var tar = $(e.target);
					tar = tar.hasClass('cell') ? tar : tar.parents('.cell').eq(0);
					var id = tar.data('id');
					router.myNavigate('Home', 'Information/' + id);
				},
				'tap .J-loadmore->loadData': function(e) {
					var index = ++this.index;
					index = index * 15;
					var _self = this;
					PDW.ajax({
						url: '/home/index?page=' + index + '&count=15',
						success: function(r) {
							if (r.data.infoList.length > 0) {
								var html = _.template($('#tplhometemplate').html())(r.data);
								_self.$el.find('.list > li').last().after(html);
							} else {
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
	//师傅详情界面
	_exprots.Information = PDW.createClass({
		name: 'information',
		route: 'Information(/:id)',
		title: '师傅信息',
		url: '/home/masterinfo?master=[0]',
		//该界面需要显示出来的导航
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .J-bookup->callMaster': function(e) {
					var tar = $(e.target);
					if(tar.hasClass('cannotclick')) {
						return alert('不能给自己下单！');
					}
					var json = this.model.toJSON().information;
					PDW.ajax({
						url: '/login/verify',
						success: function(r) {
							if (r.data.identificate.user_type == 0) {
								router.myNavigate('Login', 'Login', function() {
									this.addDataToModel({
										module: 'Home',
										router: 'FillOrder',
										conveyData: {
											masterInformation: {
												masterId: json.id,
												masterName: json.name,
												masterTel: json.phone
											}
										}
									});
								});
							} else {
								router.myNavigate('Home', 'FillOrder', function() {
									this.addDataToModel({
										masterInformation: {
											masterId: json.id,
											masterName: json.name,
											masterTel: json.phone
										}

									});
								})
							}
						}
					});
				},
				'tap .J-tab->tabChange': function(e) {
					var tar = $(e.target);
					var listName = tar.data('list');
					if (tar.hasClass('mui-active')) {
						return;
					} else {
						this.$el.find('a.mui-active').removeClass('mui-active');
						tar.addClass('mui-active');
					}
					this.$el.find('.list ul').addClass('g-d-n');
					this.$el.find('.list').find('ul.' + listName).removeClass('g-d-n');
				},
				//展开查看更多信息
				'tap .J-more->checkMore': function(e) {
					var fa = this.$el.find('header');
					if(fa.hasClass('showmore')) {
						fa.removeClass('showmore');
						return;
					}
					fa.addClass('showmore');
				}
			}
		}
	});
	//填写预约界面
	_exprots.FillOrder = PDW.createClass({
		name: 'fillOrder',
		route: 'FillOrder',
		title: '填写信息',
		nav: ['Top'],
		url: '/home/fillorder',
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
					if (!machineName) {
						return alert('请填写设备名称');
					}
					//地址校验
					if (!adress) {
						return alert('请填联系地址');
					}
					var submitData = {
							kind: machinePlate,
							apparatus: machineName,
							used_year: machineYear,
							master: json.masterInformation.masterId,
							bookup_time: date + ' ' + time,
							problem: content
						}
						//是否有地址存在
					if (fatherEl.find('.adress').val() != '') {
						submitData.adress = adress;
					}
					PDW.ajax({
						url: '/home/submitOrder',
						type: 'POST',
						data: submitData,
						success: function(r) {
							router.myNavigate('Home', 'SubmitSuccess', function() {
								this.addDataToModel({
									masterName: json.masterInformation.masterName,
									masterTel: json.masterInformation.masterTel,
									machineName: machineName,
									machinePlate: machinePlate,
									machineYear: machineYear,
									content: content || '无',
									orderNum: r.data.orderNum,
									orderDate: date + ' ' + time,
									adress: adress
								});
							});
						}
					})

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
	//订单提交成功
	_exprots.SubmitSuccess = PDW.createClass({
		name: 'submitSuccess',
		route: 'SubmitSuccess',
		title: '提交成功',
		nav: ['Top'],
		view: {
			pageEvent: {
				'tap .J-center->toCenter': function(e) {
					router.myNavigate('Center', 'Center');
				}
			}
		}
	});
	return _exprots;
});