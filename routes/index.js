var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/page', function(req, res, next) {
	//输出模板 jade
  	//res.render('index', { title: 'Express' });
  	//输出文件静态html
 	fs.readFile('./public/page_main.html', 'utf-8', function(err, data) {//读取内容
        if(err) throw err;
        res.writeHead(200, {"Content-Type":"text/html"});
        res.write(data);
        res.end();
    });
});
router.get('/web', function(req, res, next) {
	//输出模板 jade
  	//res.render('index', { title: 'Express' });
  	//输出文件静态html
 	// fs.readFile('./public/page_main.html', 'utf-8', function(err, data) {//读取内容
  //       if(err) throw err;
  //       res.writeHead(200, {"Content-Type":"text/html"});
  //       res.write(data);
  //       res.end();
  //   });
  res.json({json: 'hello'});
});

module.exports = router;