//查询模板
var Query = require('../sql/query');
// console.log('hello');
module.exports = function(app) {
	//如果中间件为最后一个执行，next可以不需要执行
	//主页查询接口
	app.get('/home/home', function(req, res, next) {
		Query('SELECT * FROM user where id = 1', function(err, rows, filed) {
			res.json(rows);
		})
	});
}
// module.exports = router;