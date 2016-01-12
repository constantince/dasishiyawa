//查询模板
var Query = require('../sql/query');
module.exports = function(app) {
		//如果中间件为最后一个执行，next可以不需要执行
		//主页查询接口
		app.get('/home/index', function(req, res, next) {
			Query('SELECT * FROM master LIMIT ' + req.query.page + ', ' + req.query.count, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				res.json({
					status: 1,
					data: {
						infoList: rows
					}
				});
			})
		});

		//师傅信息查询
		app.get('/home/masterinfo', function(req, res, next) {
			var master = req.query.master;
			Query('SELECT * FROM `master` WHERE `user` = ' + master, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				//个人信息
				var infomation = rows[0];
				Query('SELECT * FROM `comment` WHERE `master` = ' + master + ' LIMIT 3', function(err, rows, filed) {
					if (err) {
						console.log(err);
						return;
					}
					//个人信息
					var judeList = rows;
					Query('SELECT * FROM `order` WHERE `master` = ' + master + ' LIMIT 3', function(err, rows, filed) {
						if (err) {
							console.log(err);
							return;
						}
						//个人信息
						var orderList = rows;
						res.json({
							status: 1,
							data: {
								information: infomation,
								orderList: orderList,
								judeList: judeList
							}
						});
					})

				})
			})
		});
	}
	// module.exports = router;