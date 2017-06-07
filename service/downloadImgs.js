/*
 * 	图片下载
 * 	URL: 地址
 * 	IMG: 图片组
 * 	DIR: 保存路径文件夹
 *  CALLBACK: 回调函数
 * 	startStr: 开始字符
 * 	endStr: 结束字符
 * 
 * 	downloadImg({
 * 		url:url,
 * 		img:img,
 * 		dir:dir,
 * 		callback:callback,
 * 		startStr:startStr,
 * 		endStr:endStr
 * 	})
 */

exports.downloadImg = downloadImg;

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
var mkdirp = require('mkdirp');


function downloadImg(obj){
	var url = obj.url;
	var img = obj.img;
	var dir = obj.dir;
	var callback = obj.callback;
	var startStr = obj.startStr || '/';
	var endStr = obj.endStr || '.html';
	var _dir = dir + GetBetweenString(url, startStr, endStr);
	
	// 创建目录
	mkdirp(_dir, function(err) {
		if(err){
			console.log(err);
		}
	});
	
	URLRequest(url, _dir, img, callback );
}

// 访问地址( 地址，保存路径， 图片组 )
var URLRequest = function(url, dir, img, callback){
	var arr = [];
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
	  	}
		var imgs = $(img);
		imgs.each(function(item){
			var _src = $(this).attr('src');
			var _filename = item + '-' + Math.floor(Math.random()*10000000000) + _src.substr(-4,4);
			console.log('正在下载' + _src);
			fs.exists(dir + '/' + _filename, function(result){
				if(result){
					download(_src, dir, item + '-' + Math.floor(Math.random()*10000000000) + _src.substr(-4,4));
				}else{
					download(_src, dir, _filename);
				}
			})
			console.log(_filename + '下载完成');
			var imgGroup = dir + '/' + _filename;
			arr.push(imgGroup);
		})
//		console.log(arr);
		callback && callback(arr);
		
	})
	
}

//图片下载方法(图片链接， 保存路径， 文件名)
var download = function(url, dir, filename){
	request.head(url, function(err, res, body){
		request(url).pipe(fs.createWriteStream(dir + "/" + filename));
	});
};

// 截取指定字符串之间的子串
var GetBetweenString = function(str, startstr, endstr){
	var start = str.lastIndexOf(startstr);
	var end = str.lastIndexOf(endstr);
	return str.slice(start + startstr.length , end);
}

downloadImg({
	url:'http://news.zol.com.cn/list.html',
//	url: 'http://news.zol.com.cn/633/6338032.html',
	img: '.info-pic img',
	dir: '../static/img/photos/',
});
