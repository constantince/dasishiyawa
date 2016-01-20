define(['config', 'core/underscore', 'core/backbone'],
	function(C, _, Backbone) {
		var PDW = (function(UDF) {
			var BKStorage = {},
				BackbonePage = {},
				BackboneDataOnPage = {},
				books = -1,
				viewOrder = [],
				needShow = true,
				NavPage = [],
				BackboneViewStorage = {},
				BackboneCollection = new Backbone.Collection(),
				ActiveRoute,
				_addViewOrder = function(n) {
					viewOrder.push(n)
				},
				_addNavPage = function(n) {
					if (NavPage.indexOf(n) > -1) return;
					NavPage.push(n)
				},
				_getViewOrder = function(i) {
					if (i === UDF) return viewOrder;
					return viewOrder[i]
				},
				_getPreView = function() {
					return viewOrder[viewOrder.length - 2]
				},
				_getThisView = function() {
					return viewOrder[viewOrder.length - 1]
				},
				_getProject = function(n, t) {
					if (BKProject[n] && BKProject[n][t]) return BKProject[n][t]
				},
				_refreshModel = function(n, d) {
					BackboneDataOnPage[n] = BackboneDataOnPage[n] || {};
					return $.extend(BackboneDataOnPage[n], d)
				},
				_updateModel = function(n, d) {
					var cid = BKStorage[n].cid;
					BackboneCollection.get(cid).set(d)
				},
				_loadNavigate = function(navArr) {
					for (var i = 0,
							l = navArr.length; i < l; i++) {}
				},
				_loadPage = function(options) {
					options = options || {};
					var defaults = options;
					var n = defaults.name;
					var _callback = function() {
						_show(n, defaults.type);
						if (defaults.type !== 'normal') return;
						if (defaults.nav.length > 0) {
							var navigateModuel = navigateModuel = _observer.aply('Nav');
							var navArr = defaults.nav;
							$('body > .navigate').addClass('fixednav');
							if (!navigateModuel) {
								require(['use/Nav'],
									function(M) {
										for (var i = 0,
												l = navArr.length; i < l; i++) {
											var module = M[navArr[i]];
											module.show()
										}
									})
							} else {
								for (var i = 0,
										l = navArr.length; i < l; i++) {
									var module = navigateModuel[navArr[i]];
									module.show()
								}
							}
							return
						} else {
							$('body > .navigate').addClass('fixednav')
						}
					}
					if (!$.isEmptyObject(BackbonePage[n])) {
						if (defaults.applyChange === false) {
							_callback();
							return
						}
						if (defaults.url) {
							_ajax({
								url: defaults.url,
								success: function(r) {
									var _modeldata = _refreshModel(n, r.data);
									var cid = BKStorage[n].cid;
									BackboneCollection.get(cid).set(BackboneDataOnPage[n] || {});
									_callback()
								},
								error: function(xhr) {
									console.error('ajax repsonse wrong:' + xhr)
								}
							})
						} else {
							var cid = BKStorage[n].cid;
							var modelData = BackboneDataOnPage[n];
							if (defaults.applyChange === true) {
								$.extend(modelData, {
									timeStr: +new Date()
								})
							}
							BackboneCollection.get(cid).set(modelData || {});
							_callback()
						}
					} else {
						BackbonePage[n] = {};
						BKStorage[n] = {};
						BackboneDataOnPage[n] = BackboneDataOnPage[n] || {};
						if (!defaults.url) {
							var _modeldata = _refreshModel(n);
							var _model = new(_getBackboneModel(defaults.model))(_modeldata);
							BKStorage[n].cid = _model.cid;
							BackboneCollection.add(_model);
							BackbonePage[n] = new(_getBackboneView(n, defaults.view))({
								model: _model
							});
							_callback()
						} else {
							_ajax({
								url: defaults.url,
								success: function(r) {
									var _modeldata = _refreshModel(n, r.data);
									var _model = new(_getBackboneModel(defaults.model))(_modeldata);
									BKStorage[n].cid = _model.cid;
									BackboneCollection.add(_model);
									BackbonePage[n] = new(_getBackboneView(n, defaults.view))({
										model: _model
									});
									_callback()
								},
								error: function(xhr) {
									console.error('ajax repsonse wrong:' + xhr)
								}
							})
						}
					}
					return BackbonePage[n]
				},
				_getBackboneModel = function(d) {
					var defaults = $.extend({},
						d);
					var model = Backbone.Model.extend(defaults);
					return model
				},
				_implement = function(list) {
					if (list.length > 0) {
						var type = list.attr('type');
						var cls = list.attr('swiper');
						require(['core/Swiper'],
							function(S) {
								var options;
								if (type == 'banner') {
									options = {
										pagination: '.swiper-pagination',
										loop: true,
										grabCursor: true,
										paginationClickable: true
									}
								} else {
									options = {
										freeMode: true,
										slidesPerView: 'auto',
										freeModeFluid: true,
										direction: 'vertical',
									}
								}
								var tempSwipeVar = new S(cls, options);
								setTimeout(function() {
										tempSwipeVar.update()
									},
									100)
							})
					}
				},
				_getBackboneView = function(n, d) {
					var view;
					var defaults = $.extend({
							el: '#' + n,
							initialize: function() {
								this.render_bak();
								this.model.bind('change', this.render, this)
							},
							render: function(u) {
								this.beforeRender && this.beforeRender.call(this);
								this.$el.html(this.template(this.model.toJSON()));
								var list = this.$el.find('div.swiper');
								_implement(list);
								this.afterRender && this.afterRender.call(this)
							},
							template: function(json) {
								if ($('#tpl' + n).length == 0) return;
								return _.template($('#tpl' + n).html())(json)
							},
							render_bak: function() {
								var _self = this;
								if ($('#tpl' + n).length != 0) {
									this.render();
									return
								}
								PDW.ajax({
									url: 'javascripts/tpl/tpl' + _loadHtml(n) + '.html?version=0.1',
									async: false,
									headers: {
										Accept: 'text/html'
									},
									dataType: 'html',
									success: function(x) {
										$('body').append(x);
										_self.render()
									}
								})
							}
						},
						d);
					view = Backbone.View.extend(defaults);
					return view
				},
				_getClass = function(n, t) {
					if (BKStorage[n] && BKStorage[n][t]) return BKStorage[n][t];
					else return BKStorage[n]
				},
				_deleteClass = function(books) {
					[].slice($.inArray(n, BKStorage), 1)
				},
				_setData = function(n, d) {
					BKData[n] = BKData[n] || {};
					if (d.url) {
						BKData[n].changed = !!(BKData[n].url != d.url);
						BKData[n].url = d.url;
						return BKData[n].datas
					}
					BKData[n].datas = d;
					BKData[n].changed = true;
					return BKData[n]
				},
				_getData = function(n) {
					return BKData[n] || {}
				},
				getParams = function(name) {
					var spa = location.search.replace(/^\?/, '').split('&');
					var r;
					for (var i = 0,
							l = spa.length; i < l; i++) {
						var temp = spa[i].split('=');
						if (name === temp[0]) r = temp[1]
					}
					return r
				},
				animation = function(obj) {
					var defaults = $.extend({}, {
							el: '',
							direction: 'right->100%',
							callback: function() {},
							delay: 0.3
						},
						obj);
					var direction = defaults.direction.split('->')[0];
					var remote = defaults.direction.split('->')[1] || 100;
					var el = defaults.el;
					var translate = '';
					switch (direction) {
						case 'left':
							el[0].style.cssText = 'transform: translateX(100%);';
							translate = 'translateX(-' + remote + ')';
							break;
						case 'right':
							el[0].style.cssText = 'transform: translateX(-100%);';
							translate = 'translateX(' + remote + ')';
							break;
						case 'top':
							el[0].style.cssText = 'transform: translateY(100%);';
							translate = 'translateY(-' + remote + ')';
							break;
						case 'bottom':
							el[0].style.cssText = 'transform: translateY(-100%);';
							translate = 'translateY(' + remote + ')';
							break
					}
					el.addClass('page_show');
					setTimeout(function() {
							var css = 'transition:transform ' + defaults.delay + 's;transform: ' + translate + '; z-index:900;';
							el[0].style.cssText = css
						},
						17);
					var t = setTimeout(function() {
							el[0].style.cssText = '';
							defaults.callback.call(null);
							clearTimeout(t)
						},
						defaults.delay * 1000 + 50)
				},
				_ajax = function(o) {
					if (typeof o.url === 'undefined') {
						return alert('请输入请求地址！')
					}
					var tempSuccess = o.success;
					o.success = function(r) {
						if (r.status == 0) {
							(o.wrong && o.wrong(r)) || alert(r.data);
							return
						} else if (r.status == 3) {
							Router.myNavigate('Login', 'Login', true)
						} else {
							tempSuccess(r)
						}
					}
					var tempComplete = o.complete;
					o.complete = function(r) {
						tempComplete !== UDF && tempComplete.call(null, r);
						o.modal === undefined && _createCssLoding('hide')
					}
					$.ajax($.extend({
							url: '',
							type: 'GET',
							dataType: 'json',
							beforeSend: function() {
								o.modal === undefined && _createCssLoding('show')
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								PB.tip({
									tipTxt: '网络连接失败，错误状态码:' + XMLHttpRequest.status
								})
							}
						},
						o || {}))
				},
				_show = function(n, type) {
					if (type === undefined || type === 'normal') {
						_addViewOrder(n);
						ActiveRoute = n;
						$('#pageWindow+.background').addClass('g-d-n');
						$('#pageWindow>.mask').hide().removeClass('move');
						animation({
							el: $('#' + n),
							direction: 'top->0px',
							delay: 0.3,
							callback: function() {
								$('#pageWindow>.page_show').filter(function() {
									if (this.id != n) $(this).removeClass('page_show')
								})
							}
						})
					} else if (type === 'mask') {
						return
					} else if (type === 'navigate') {
						$('#' + n).removeClass('fixednav');
						return
					} else {}
				},
				_loadHtml = function(hash) {
					var config = C.PAGERULES;
					if (hash.indexOf('/')) {
						hash = hash.split('/')[0].toLocaleLowerCase()
					}
					for (var i in config) {
						if (config[i].indexOf(hash) > -1) hash = i
					}
					return hash
				},
				_createCssLoding = function(c) {
					if ($('#cssloading').length == 0) {
						var html = '<div id="cssloading"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><div class="Loadbackground"></div></div>';
						$('body').append(html)
					}
					if (c == 'hide') {
						$('#cssloading').hide()
					} else {
						$('#cssloading').show()
					}
				},
				_orderChange = function(n, p) {
					var m = [];
					var go = 'slideleftin'
					if (m.indexOf(n) >= m.indexOf(p)) {
						go = 'sliderightin'
					}
					return go
				},
				_getModule = function(n) {
					return _observer.aply(n)
				},
				_getActiveRoute = function() {
					return _observer.pageModule(ActiveRoute)
				},
				_baseClass = {
					_init: function(obj) {
						this.options = $.extend({
								name: 'pageNull',
								applyChange: true,
								type: 'normal',
								model: {},
								view: {},
								nav: [],
								title: ''
							},
							obj);
						this._createdom.call(this);
						this._createPage()
					},
					_createdom: function() {
						var cls = this.options.type;
						if (this.html) {
							$('#pageWindow').append(this.html);
							return
						}
						if (this.options.type == 'navigate') {
							switch (this.options.name) {
								case 'top':
									$('#pageWindow').before('<header class="mui-bar mui-bar-nav fixednav ' + cls + '" id="' + this.options.name + '"></header>'.trim());
									break;
								case 'bottom':
									$('#pageWindow').after('<footer class="mui-bar mui-bar-tab fixednav ' + cls + '" id="' + this.options.name + '"></footer>'.trim());
									break;
								case 'left':
									break;
								case 'right':
									break;
								default:
									$('#pageWindow').append('<div class="page ' + cls + '" id="' + this.options.name + '"></div>'.trim());
									break
							}
						} else {
							for (var i = 0; i < this.options.nav.length; i++) {
								cls += ' hasnav-' + this.options.nav[i].toLocaleLowerCase()
							}
							$('#pageWindow').append('<div class="page ' + cls + '" id="' + this.options.name + '"></div>'.trim())
						}
					},
					getOptions: function() {
						return this.options
					},
					_createPage: function() {
						this._MyEventToBackbone()
					},
					refreshView: function() {
						this._normal()
					},
					_MyEventToBackbone: function() {
						var myEvents = this.options.view.pageEvent;
						if (this.options.view === undefined) return;
						var backboneEvent = (this.options.view.events = {});
						var backboneView = this.options.view;
						for (var e in myEvents) {
							var eventArr = e.split('->');
							var eventName = eventArr[0].replace(/^\s+|\s+$/gi, '');
							var eventFun = eventArr[1].replace(/^\s+|\s+$/gi, '');
							backboneEvent[eventName] = eventFun;
							this.options.view[eventFun] = myEvents[e]
						}
						this.options.view.pageEvent = null
					},
					reloadView: function(d) {
						_updateModel(this.options.name, d)
					},
					addDataToModel: function(d) {
						_refreshModel(this.options.name, d)
					},
					show: function() {
						this._normal();
						return this
					},
					hide: function() {
						$('#' + this.options.name).addClass('hide')
					},
					_normal: function(p) {
						var defaults = this.options;
						var s = (defaults.models ||
							function() {})() || {};
						if (defaults.url) {
							url = (typeof defaults.url === 'function') ? defaults.url() : defaults.url;
							var u = url.replace(/\[\d?\]/g,
								function() {
									var ag = arguments[0].split('')[1];
									return p[~~ag]
								});
							u = u || url;
							s = {
								url: u
							}
						}
						_loadPage($.extend({}, this.options, s));
					},
					refresh: function(n, d) {
						var html = _.template($('#tpl' + this.options.name + '-refresh-' + n).html())(d);
						$('#' + this.options.name).find('[refresh="' + n + '"]').html(html)
					},
					loadPageModel: function(s) {
						_setData(this.n, s || {})
					},
					loadPageView: function(s) {
						s = $.extend({}, {
								name: this.n
							},
							s);
						_createProject(s)
					},
					_Route: function() {
						this.title && PB.setPageTitle(this.title);
						this._normal([].slice.call(arguments, 0))
					}
				},
				_Class = function(obj) {
					obj = obj || {};
					var F = function() {
						var func = _.bind(this._Route, this);
						this._init.call(this, obj);
						obj.route && Router.route(obj.route, this.n, func)
					};
					$.extend(F.prototype, _baseClass, obj.fn || {});
					return new F()
				};
			var _observer = (function() {
				var obser = [],
					q = 0;

				function add(n, f) {
					var m = q++,
						tpo = obser[m] ? obser[m] : (obser[m] = {});
					tpo.callback = f;
					tpo.name = n
				}

				function aply(n, p) {
					var u = 0;
					for (var i = 0,
							l = obser.length; i < l; i++) {
						if (obser[i]['name'] == n) {
							u = obser[i].callback.apply({},
								p)
						}
					}
					return u
				}

				function pageModule(n) {
					var m = [];
					for (var i = 0, l = obser.length; i < l; i++) {
						var temp = obser[i].callback.apply({});
						for (var p in temp) {
							if (p.toLocaleLowerCase() === n.toLocaleLowerCase()) {
								m.push(temp[p])
							}
						}
					}
					if (m.length === 1) m = m[0];
					return m
				}

				function get() {
					return obser
				}
				return {
					add: add,
					aply: aply,
					pageModule: pageModule,
					list: get
				}
			})();
			return {
				Extensions: {
					get: _getClass
				},
				Projections: {
					get: _getProject
				},
				Data: {
					create: _setData,
					get: _getData
				},
				getAllBooks: function() {
					var arr = new Array;
					for (var i = 0; i < books + 1; i++) arr.push(i.toString());
					return arr
				},
				Observer: _observer,
				getViewOrder: _getViewOrder,
				getPreView: _getPreView,
				getLastView: _getThisView,
				pushThisView: _addViewOrder,
				ajax: _ajax,
				getActiveRoute: _getActiveRoute,
				getModule: _getModule,
				createClass: _Class,
				getParams: getParams
			}
		})();
		var Event = (function(UDF) {
			function a() {}
			var pro = a.prototype;

			function bind(n, c) {
				var c = c || {};
				if (n == 'common') {
					$.extend(a.prototype, c);
					return this
				} else {
					(a.prototype[n] || (a.prototype[n] = {}));
					$.extend(a.prototype[n], c);
					return this[n]
				}
			}
			var Events = {}
			$.extend(pro, Events, {
				bind: bind
			});
			return new a()
		})();
		var Router = new(Backbone.Router.extend({
			myNavigate: function(bigmodule, route, callback) {
				var getModule = PDW.Observer.aply(bigmodule);
				if (getModule) {
					callback && callback.call(getModule[route]);
					this.navigate(route, true)
				} else {
					var _self = this;
					var m = require(['use/' + bigmodule],
						function(exports) {
							callback && callback.call(exports[route]);
							_self.navigate('#' + route, true)
						})
				}
			}
		}));
		var PB = (function(root, UDF) {
			var exports = {};
			exports.publicVar = {};
			exports.get = function(n) {
				return this.publicVar[n] || UDF
			}
			exports.set = function(n, v) {
				this.publicVar[n] = v
			}
			exports.setPageTitle = function(title) {
				document.title = title;
				var u = navigator.userAgent.toLowerCase();
				if (u.match(/iphone/i) == "iphone") {
					var $body = $('body');
					var $iframe = $('<iframe style="display:none;" src="/favicon.ico"></iframe>').on('load',
						function() {
							setTimeout(function() {
									$iframe.off('load').remove()
								},
								0)
						}).appendTo($body)
				}
			}
			exports.message = function(obj) {
				var defaults = $.extend({
						type: 'alert',
						title: '你确认要这样做吗？',
						height: $(window).height()
					},
					obj);
				var tobj = $('.J-message'),
					target = $('.J-message .J-' + defaults.type),
					OBtn = tobj.find('.J-' + defaults.type + ' .J-ok'),
					CBtn = tobj.find('.J-' + defaults.type + ' .J-cancel');
				tobj.height(defaults.height);
				$('.J-message .J-box').addClass('g-d-n').removeClass('g-d-b');
				target.addClass('g-d-b').removeClass('g-d-n');
				target.find('.J-word').text(defaults.title);
				tobj.addClass('g-d-b').removeClass('g-d-n');
				OBtn.off();
				OBtn.on('tap',
					function() {
						if (typeof defaults.ok == 'function') defaults.ok();
						tobj.addClass('g-d-n').removeClass('g-d-b')
					});
				if (CBtn.length == 0) return;
				CBtn.off();
				CBtn.on('tap',
					function() {
						if (typeof defaults.cancel == 'function') defaults.cancel();
						tobj.addClass('g-d-n').removeClass('g-d-b')
					})
			}
			exports.tip = function(options) {
				if ($('.J-tip').attr('showed') == '1') return;
				$('.J-tip').attr('showed', '1');
				var paramObj = {
					tipTxt: "this is tip text!!",
					delay: 2000,
					callBack: function() {},
					callBackPram: ""
				};
				$.extend(paramObj, options || {});
				$(".J-tip").find(".J-tipWp").html(paramObj.tipTxt);
				setTimeout(function() {
						var t = 0 - $(".J-tip").height() / 2;
						$(".J-tip").find(".J-tipWp").css({
							top: t
						});
						$(".J-tip").addClass("_tipBx-show")
					},
					100);
				setTimeout(function() {
						$(".J-tip").removeClass("_tipBx-show");
						$('.J-tip').attr('showed', '0');
						if (paramObj.callBack && typeof(paramObj.callBack) == "function") {
							paramObj.callBack(paramObj.callBackPram)
						}
					},
					paramObj.delay)
			}
			exports.formateTime = function(string) {
					if (Object.prototype.toString.call(string) !== '[object String]') return;
					return string.replace(/T/, ' ').replace(/[A-Z]|\.\d*/gi, '');
				}
				//插件，toast提示
			exports.toast = function(opt, show) {
				//强行停止加载toast
				if (show === 'hide') {
					clearTimeout(exports.publicVar['toast-meter']);
					$('.J-toast').addClass('g-d-n');
					exports.publicVar['toast-key'] = undefined;
					return;
				}
				//防止重复点击
				if (exports.publicVar['toast-key'] !== undefined) {
					return;
				}
				exports.publicVar['toast-key'] = 1;
				var defaults = $.extend({
					message: 'loading',
					delay: 2000, //
					type: 'loading', //loading, success, faile, unconnectable;
					callback: function() {

					}
				}, opt);
				var height = $(window).height();
				var width = $(window).width();
				var w = width / 2 - 40;
				var h = height / 2 - 60;
				var htmlstring = '<div class="am-toast-text J-toast" style="top:' + h + 'px; left:' + w + 'px;">' +
					'<span class="am-icon" am-mode="' + defaults.type + '"></span><em>' + defaults.message + '</em>' +
					'</div>';
				if ($('.J-toast').length) {
					var el = $('.J-toast').removeClass('g-d-n');
				} else {
					var el = $('body').append(htmlstring).find('.J-toast');
				}
				exports.publicVar['toast-meter'] = setTimeout(function() {
					exports.publicVar['toast-key'] = undefined;
					el.addClass('g-d-n');
					defaults.callback();
				}, defaults.delay);
			}
			exports.loadCss = function(g) {
					switch (g) {
						case 1:
						case 3:
						case 4:
							return "class='status_cfmt'";
						default:
							return "class='status_ct'"
					}
				}
				//输出当前时间
			exports.now = function() {
				function add0(e) {
					if (e < 10) {
						e = '0' + e;
					}
					return e;
				}
				var D = new Date();
				var year = D.getFullYear();
				var mouth = D.getMonth() + 1;
				mouth = add0(mouth);
				var day = add0(D.getDate());
				var hour = add0(D.getHours());
				var minute = add0(D.getMinutes());
				var second = add0(D.getSeconds());
				return year + '-' + mouth + '-' + day + ' ' + hour + ':' + minute + ':' + second;
			}
			return (root.PB = exports)
		})(window);
		var _PRO_ = {
			PDW: PDW,
			Router: Router,
			Event: Event
		}
		return _PRO_
	});