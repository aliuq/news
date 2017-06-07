/*
 * http://news.zol.com.cn/list.html
 */

var http = require('./httpGet');
var cheerio = require('cheerio');
var mysql = require('./mysql');

http.HttpGetGBK('http://news.zol.com.cn/list.html',function(html){
	var $ = cheerio.load(html);
	// 首页左部分内容
	var contents = $('.content ul .info-mod');
	var hotTopics = $('.sidebar .change-mod .pic-rank li');
	var t = $('.content .content-head h1').text();
	var s = 'hottopics';
	var json = {
		t: t,
		topics: [],
		weektopic_t: "",
		monthtopic_t:"",
		data:[],
		s:s,
	};
	json.weektopic_t = $('.side-rank h3').eq(0).text();
	json.monthtopic_t = $('.side-rank h3').eq(1).text();
	
	contents.each(function(item){
		var pic_src = $(this).find('.info-pic img').attr('src');
		var title = $(this).find('.info-head a').text();
		var content_src = $(this).find('.info-pic').attr('href');
		var date = $(this).find('.foot-mod .foot-date').text();

		
		if(typeof pic_src == 'undefined' ){
			pic_src = '../../static/img/nopic.jpg';
		}
		
		json.topics.push({
			pic_src: pic_src,
			title: title,
			content_src: content_src,
			date: date,
		})
	
			var sql = 'insert into topics(t, title, content_src, date, pic_src) values(\'' +  t + '\', \'' +  title + '\',\'' + content_src + '\',\'' + date + '\',\'' + pic_src + '\')';
			
			mysql.query(sql, function(err, results){
				console.log('文章爬取第' + (item+1) + '次正在执行!');
				console.log('文章爬取第' + (item+1) + '次执行完毕!');
			});
	})

	hotTopics.each(function(item){
		var hot_img_src = $(this).find('.pic img').attr('src');
		var hot_title = $(this).find('.head a').text();
		var hot_topic_src = $(this).find('.pic').attr('href');
		var pinglun = $(this).find('.foot').text();
		json.data.push({
			hot_img_src: hot_img_src,
			hot_title: hot_title,
			hot_topic_src: hot_topic_src,
			pinglun: pinglun
		})
		
		var sql = 'insert into topics(s,hot_title, hot_topic_src, hot_img_src, pinglun) values(\'' +  s + '\',\'' +  hot_title + '\',\'' + hot_topic_src + '\',\'' + hot_img_src + '\',\'' + pinglun + '\')';
		
		mysql.query(sql, function(err, results){
			console.log('热文爬取第' + (item+1) + '次正在执行!');
			console.log('热文爬取第' + (item+1) + '次执行完毕!');
		});
	})
})