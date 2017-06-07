/*
 * 	获取文章列表
 * 	http://news.zol.com.cn/list.html
 *  获取文章详情
 * 	http://news.zol.com.cn/633/6334772.html
 * 	http://news.zol.com.cn/633/6338135.html
 * 	http://news.zol.com.cn/633/6337105.html
 * 	http://news.zol.com.cn/637/6374584.html
 */

var http = require('./HttpGet.js');
var cheerio = require('cheerio');
var mysql = require('./mysql');


exports.GetArticleList = GetArticleList;
exports.GetArticleCommon = GetArticleCommon;
exports.GetArticleHot = GetArticleHot;


var Obj = {
	json:{
		t: 'common',
		topics: [],
		hot:[],
		details:[],
		s:'hot',
	},
	url: 'http://news.zol.com.cn/list.html',
	articleTitleArr: [],
	articleHrefArr: []
}

function GetArticleList(callback){
	callback && callback(Obj.articleTitleArr, Obj.articleHrefArr, Obj.json);
}

//GetArticleList()
//	文章	左侧内容
//GetArticleCommon();
function GetArticleCommon(callback){
	http.HttpGetGBK(Obj.url, function(html){
		var $ = cheerio.load(html);
		var contents = $('.content ul .info-mod');
		contents.each(function(item){
			var pic_src = $(this).find('.info-pic img').attr('src') || $(this).find('.info-pic img').attr('.src')
			var title = $(this).find('.info-head a').text();
			var content_src = $(this).find('.info-pic').attr('href');
			var date = $(this).find('.foot-mod .foot-date').text();
			var start = content_src.lastIndexOf('/');
			var end = content_src.lastIndexOf('.html');
			var url_flag = content_src.substring(start+1, end);
			var info = $(this).find('p').text();
			info = info.replace('[详情]','');
			
			Obj.articleTitleArr.push(title);
			Obj.articleHrefArr.push(content_src);
			
			if(typeof pic_src == 'undefined' ){
				pic_src = '../../static/img/nopic.jpg';
			}
			Obj.json.topics.push({
				imgsrc: pic_src,	//	文章图片地址
				title: title,	//	文章标题
				href: content_src,	//	文章地址
				href_flag:url_flag,	//	网址后缀
				info:info,
				date: date,		//	发布时间
			})
		})
//		console.log(Obj.json.topics.length)
		callback && callback(Obj.articleTitleArr, Obj.articleHrefArr, Obj.json);
	})
}
//	热文	右侧内容
//GetArticleHot();
function GetArticleHot(callback){
	http.HttpGetGBK(Obj.url, function(html){
		var $ = cheerio.load(html);
		var hotTopics = $('.sidebar .change-mod .pic-rank li');
		hotTopics.each(function(item){
			var hot_img_src = $(this).find('.pic img').attr('src');
			var hot_title = $(this).find('.head a').text();
			var hot_topic_src = $(this).find('.pic').attr('href');
			var pinglun = $(this).find('.foot').text();
			var start = hot_topic_src.lastIndexOf('/');
			var end = hot_topic_src.lastIndexOf('.html');
			var url_flag = hot_topic_src.substring(start+1, end);
			
			Obj.articleTitleArr.push(hot_title);
			Obj.articleHrefArr.push(hot_topic_src);
			
			Obj.json.hot.push({
				imgsrc: hot_img_src,	//	图片地址
				title: hot_title,		//	热文标题
				href: hot_topic_src,	//	热文链接
				href_flag:url_flag,	//	网址后缀
				pinglun: pinglun,	//	评论
			})
		})
//		console.log(Obj.json.topics.length)
		callback && callback(Obj.articleTitleArr, Obj.articleHrefArr, Obj.json);
	})
}

