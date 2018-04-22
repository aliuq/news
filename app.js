var koa = require('koa');
var controller = require('koa-route');
var body = require('koa-body');
var mysql = require('./service/MySql');
var qs = require('querystring');
var app = koa();
var service = require('./service/ServiceInit');
var port = require('./service/config').port

var views = require('co-views');
var render = views('./view', {
    map: {html : 'ejs'}
});
var koa_static = require('koa-static-server');

app.use(koa_static({
    rootDir: './static/',
    rootPath: '/static/',
    maxage: 0
}))
app.use(body()); 

// 文章列表页
app.use( controller.get( '/', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('index', {title: '手机资讯'});
}));

// 文章列表搜索
app.use( controller.get( '/getSearNews', function *(){
    this.set('Cache-Control','no-cache');
    var data = qs.parse( this.req._parsedUrl.query );
    this.body = yield service.getSearNews(data);
}));

//	文章刷新
app.use( controller.get( '/update', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield service.GetUpdateTopics();
}));

// 文章列表页数据接口
app.use( controller.get( '/ajax/topics', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield service.GetTopics();
//  this.body = mysql.queryRe("select * from topics order by date desc; ");
}));

// 文章详情页数据接口
app.use( controller.get( '/ajax/detailss', function *(){
	this.set('Cache-Control','no-cache');
	var data = qs.parse( this.req._parsedUrl.query );
    this.body = yield service.getDetails(data);
}));

// 文章详情页
detail();
function detail(){
	var sql = "select details.id,topics.title,details.url,details.url_flag,details.contents,details.time,details.authors,details.comments from details,topics where topics.href = details.url order by details.id"
	mysql.query(sql, function(err, results){
		var arr = [];
		for(var i = 0; i < results.length; i++){
			arr.push(results[i].url_flag)
		}
		for(var i = 0; i < arr.length; i++){
			app.use( controller.get( '/details/'+arr[i], function *(){
			    this.set('Cache-Control','no-cache');
			    this.body = yield render('details', {title: '详情'});
			}));
		}
	});
}



//	手机产品页
app.use( controller.get( '/mobile', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('mobile', {title: '手机产品'});
}));

//	手机产品搜索
app.use( controller.get( '/getSearMo', function *(){
    this.set('Cache-Control','no-cache');
    var data = qs.parse( this.req._parsedUrl.query );
    this.body = yield service.getSearMo(data);
}));

//	手机产品信息接口
app.use( controller.get( '/ajax/mobile', function *(){
    this.set('Cache-Control','no-cache');
    var data = qs.parse( this.req._parsedUrl.query );
//  console.log( data )
    this.body = yield service.getMobileInfo(data);
}));



//	手机产品详情页
var mosql = "select href_flag from mobileInfo"
mysql.query(mosql, function(err, results){
//	console.log( results.length )
	for(var i = 0; i < results.length; i++){
		app.use( controller.get( '/mobile/'+ results[i].href_flag +'.html', function *(){
		    this.set('Cache-Control','no-cache');
		    this.body = yield render('mo-detail', {title: '详情'});
		}));
		//	手机产品详细信息接口
		app.use( controller.get( '/ajax/moparam/'+ results[i].href_flag , function *(){
			var flag = this.href.match(/(moparam\/)([\s\S]*)/)[2]
		    this.set('Cache-Control','no-cache');
		    this.body = yield service.getMobileParam( flag );
		}));
	}
});

//	接收评论传过来的数据
app.use( controller.post( '/test', function *(){
	this.set('Cache-Control', 'no-cache');
	var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
		this.body = yield service.addComment(data);
	}
//	console.log(data);
}));

//	手机 接收评论传过来的数据
app.use( controller.post( '/motest', function *(){
	this.set('Cache-Control', 'no-cache');
	var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
		this.body = yield service.moAddComment(data);
	}
//	console.log(data);
}));

//	检查点赞数
app.use( controller.get( '/checkOk', function *(){
	this.set('Cache-Control', 'no-cache');
//	var data = this.query;
	var data = qs.parse( this.req._parsedUrl.query );
//	console.log(data);
	this.body = yield service.checkOk(data);
}));

//	手机 检查点赞数
app.use( controller.get( '/mocheckOk', function *(){
	this.set('Cache-Control', 'no-cache');
//	var data = this.query;
	var data = qs.parse( this.req._parsedUrl.query );
//	console.log(data);
	this.body = yield service.moCheckOk(data);
}));


mysql.query('select * from topics', function(err, results){
	app.use( controller.get( '/test1', function *(){
		this.set('Cache-Control','no-cache');
	    this.body = results;
    }));
})

//	手机产品更新
app.use( controller.get( '/mobile/update', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield service.UpdateMobile();
}));

//	检查用户名是否被占用
app.use( controller.post( '/checkUser', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.checkUser(data);
	}
}));

//	注册用户
app.use( controller.post( '/addUser', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.addUser(data);
	}
}));

//	登录
app.use( controller.post( '/login', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.login(data);
	}
}));

//	管理员登陆验证
app.use( controller.get( '/adminlogin', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('adminlogin', {title: '后台管理登录'});
}));

//	后台
app.use( controller.get( '/admin', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('admin', {title: '后台管理登录'});
}));

//	后台管理 欢迎
app.use( controller.get( '/welcome', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('/bgview/welcome', {title: '后台管理 欢迎'});
}));

//	后台管理 手动添加
app.use( controller.get( '/handAdd', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('/bgview/handAdd', {title: '后台管理 手动添加'});
}));

//	后台管理 用户列表
app.use( controller.get( '/userlist', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('/bgview/userlist', {title: '后台管理 手动添加'});
}));

//	后台管理 咨讯列表
app.use( controller.get( '/newslist', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield render('/bgview/newslist', {title: '后台管理 手动添加'});
}));

//	后台管理 用户列表接口
app.use( controller.get( '/getUserlist', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield service.getUserlist();
}));

//	后台管理 咨讯列表接口
app.use( controller.get( '/getnewlist', function *(){
    this.set('Cache-Control','no-cache');
    this.body = yield service.getnewlist();
}));

//	后台管理 用户列表 删除用户
app.use( controller.post( '/deleteUser', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
    if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.deleteUser(data.username);
	}
}));

//	后台管理 用户列表 修改用户资料 
app.use( controller.post( '/UInfoUpdate', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
    if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.UInfoUpdate(data);
	}
}));

//	后台管理 用户列表 查找用户 
app.use( controller.get( '/uSearUser', function *(){
    this.set('Cache-Control','no-cache');
    var data = qs.parse( this.req._parsedUrl.query );
    this.body = yield service.uSearUser(data);
	
}));

//	后台管理 咨讯列表 删除咨讯
app.use( controller.post( '/deleteNews', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
    if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.deleteNews(data.title);
	}
    
}));

//	后台管理 手动添加接口
app.use( controller.post( '/handAddport', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
//  console.log( data )
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.handAddport(data);
	    addD();
	}
}));


//	验证管理员用户密码
app.use( controller.post( '/checkadmin', function *(){
    this.set('Cache-Control','no-cache');
    var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.checkadmin(data);
	}
}));

//	链接添加文章
app.use( controller.post('/addnew', function*(){
	this.set('Cache-Control','no-cache');
	var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.linkAdd(data.url);
	    addD();
	}
}))

//	验证链接添加里的链接
app.use( controller.post('/checkLink', function*(){
	this.set('Cache-Control','no-cache');
	var data = this.request.body;
	if( !data ){
		this.body = "数据传送失败！"
	}else{
	    this.body = yield service.checkLink(data.url);
	}
}))

function addD(){
	var sql = "select details.id,topics.title,details.url,details.url_flag,details.contents,details.time,details.authors,details.comments from details,topics where topics.href = details.url order by details.id desc limit 1";
	mysql.query(sql, function(err, results){
		app.use( controller.get( '/details/'+ results[0].url_flag , function *(){
		    this.set('Cache-Control','no-cache');
		    this.body = yield render('details', {title: '详情'});
		}));
	});
}

//	重置
app.use( controller.get('/reset', function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield service.reset();
}))

//	重置用户
app.use( controller.get('/resetUser', function*(){
	this.set('Cache-Control','no-cache');
	this.body = yield service.resetUser();
}))

app.listen(port);
console.log('Koa server is started in http://localhost:' + port);

