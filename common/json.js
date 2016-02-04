var JSON = {
	//公众号相关
	app: {
		url: 'http://yoli.ngrok.natapp.cn',//服务器地址
		prot: '80',//监听端口
		webDebug: false,//是否开启网页调试
		token: 'yolimie'

	},
	//数据库配置相关
	db: {
		host: 'localhost',
		user: 'root',
		password: '123456',
		port: '3306',
		database: 'dasishiyawa'
	},
	//微信相关
	wechat: {
		appId: 'wx0d23b7549ecbbbcf',//微信授权的id
		appSecret: 'f9fc3893223a2ff694e76d0df8228731',//授权密钥
		callbackUrl: '/login/getpagetokenkey',//微信回掉服务器接口
		refreshUrl: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx0d23b7549ecbbbcf&secret=f9fc3893223a2ff694e76d0df8228731',
		refreshTime: 7000//微信accessstoken刷新频率 单位s
	}
}
function get(name) {
	return JSON[name];
}
module.exports = get;