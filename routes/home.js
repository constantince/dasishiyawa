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
			var user_id = req.session['user'];
			var master = req.query.master;
			Query('SELECT `skill`.skill_name, `master`.* FROM `master` LEFT JOIN `skill` ON `master`.skill_id = `skill`.id WHERE master.`id` = ' + master, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				//个人信息
				var infomation = rows[0];
				//判断是不是自己喊自己
				var clickable = user_id == infomation.user ? false: true;
				Query('SELECT * FROM `comment` WHERE `master` = ' + master + ' LIMIT 3', function(err, rows, filed) {
					if (err) {
						console.log(err);
						return;
					}
					//个人信息
					var judeList = rows;
					Query('SELECT * FROM `order` WHERE `master` = ' + master + ' ORDER BY id DESC LIMIT 3', function(err, rows, filed) {
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
								clickable: clickable
							}
						});
					})

				})
			})
		});

		//填写信息
		app.get('/home/fillorder', function(req, res, next) {
			var user_id = req.session['user'];
			Query('SELECT * FROM user WHERE id = ' + user_id, function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				res.json({
					status: 1,
					data: {
						myInformation: rows[0]
					}
				});
			})
		});

		//提交故障信息界面接口
		app.post('/home/submitOrder', function(req, res, next) {
			var user_id = req.session['user'];
			var result = req.body;
			var adress = result.adress;
			delete result.adress;
			var nameArr = ['user'];
			var valueArr = [user_id];
			for(var i in result) {
				nameArr.push(i);
				valueArr.push('"' + result[i] + '"');
			}
			Query('INSERT INTO `order` ('+ nameArr.join(',') +') VALUES ('+ valueArr.join(',') +')', function(err, rows, filed) {
				if (err) {
					console.log(err);
					return;
				}
				var sql = 'UPDATE `user` SET adress = "' + adress + '" WHERE id = ' + user_id;
				//插入更新用户的地址
				if(adress) {
					Query(sql);
				}
				res.json({
					status: 1,
					data: {
						orderNum: rows.insertId
					}
				});
			})
		});
		
	}
	// module.exports = router;