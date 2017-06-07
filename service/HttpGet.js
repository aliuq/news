/*
 * 	http请求
 * 	url: 地址
 * 	callback: 回调函数
 */

var request = require('request');
var iconv = require('iconv-lite');

exports.HttpGet = function(url, callback){
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback && callback(body);
	  	}
	})
}
exports.HttpGetGBK = function(url, callback){
	request({
		url:url,
		encoding: null
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var html = iconv.decode(body, 'gbk').toString();
			callback && callback(html);
	  	}
	})
}









