define(function(){
	//配置文件
	return {
		//各个模块的路由，可以不配置，在需要刷新加载多情况下需要配置。
		ROUTE: {
			routes: {
				'A': 'A',
				'B': 'B'
			},
			A: function() {
				this.myNavigate('A', 'A');
			},
			B: function() {
				this.myNavigate('B', 'B');
			}
		},
		//模块跳转规则，在需要跳到下一个模块的默认方法需要配置
		PAGERULES: {
			Home: ['home', 'fillorder'],
			Center: ['center'],
			Nav: ['bottom', 'top'],
			MakeFriends: ['makefriends', 'personel', 'publishperson']
		}
	}
});