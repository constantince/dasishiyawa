/*
	广场主页数据查询模块
 */
//查询模板
var Query = require('../sql/query');
//引入文件查询
var fs = require('fs');
//
var formidable = require("formidable");
// console.log('hello');
module.exports = function(app) {
	//如果中间件为最后一个执行，next可以不需要执行
	//主页查询接口
	app.get('/makefriends/index', function(req, res, next) {
		Query('SELECT * FROM user LIMIT ' + req.query.index + ',' + req.query.count, function(err, rows, filed) {
			if (err) return;
			res.json({
				status: 1,
				data: {
					list: rows
				}
			});
		})
	});
	//发布个人信息接口
	app.post('/makefriends/publish', function(req, res, next) {
		var form = new formidable.IncomingForm();
		form.encoding = 'utf-8'; //设置编辑
		form.uploadDir = './publish/upload/images/'; //设置上传目录
		form.keepExtensions = true; //保留后缀
		form.maxFieldsSize = 1 * 1024 * 1024; //文件大小
		form.parse(req, function(err, fields, files) {

			if (err) {
				res.locals.error = err;
				res.render(index, {
					title: TITLE
				});
				return;
			}

			var extName = ''; //后缀名
			switch (files.pic.type) {
				case 'image/pjpeg':
					extName = 'jpg';
					break;
				case 'image/jpeg':
					extName = 'jpg';
					break;
				case 'image/png':
					extName = 'png';
					break;
				case 'image/x-png':
					extName = 'png';
					break;
			}

			if (extName.length == 0) {
				res.locals.error = '只支持png和jpg格式图片';
				res.render(index, {
					title: TITLE
				});
				return;
			}

			var avatarName = Math.random() + '.' + extName;
			var newPath = form.uploadDir + avatarName;

			console.log(newPath);
			fs.renameSync(files.pic.path, newPath); //重命名
			res.end();
		});

		// res.locals.success = '上传成功';
		//res.render(index, { title: TITLE });      

	});
}

// module.exports = router;