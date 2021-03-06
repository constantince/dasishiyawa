/*
  路由模块，负责到处界面和处理其他路由规则
 */

//引入文件模板
var fs = require('fs');
//主页查询业务模板
var home = require('./home');
//广场查询业务
var makefriends = require('./makefriends');
//个人中心界面查询
var center = require('./center');
// 登录中心
var login = require('./login');
//公共登录模块
var Login = require('../common/login')
module.exports = function(app) {
    /* GET home page. */
    app.get('/page',Login(function(req, res, next) {
      //输出文件静态html
      fs.readFile('./public/page_main.html', 'utf-8', function(err, data) {//读取内容
            if(err) throw err;
            res.writeHead(200, {"Content-Type":"text/html"});
            res.write(data);
            res.end();
        });
      // next();
    }));
    login(app);
    home(app);
    makefriends(app);
    center(app);
    

}
// module.exports = router;