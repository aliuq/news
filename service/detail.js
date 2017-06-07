/*
 * 获取文章详情
 * http://news.zol.com.cn/633/6334772.html
 * http://news.zol.com.cn/633/6338135.html
 * http://news.zol.com.cn/633/6337105.html
 */

var http = require('./HttpGet');
var cheerio = require('cheerio');
var mysql = require('./mysql');

// 获取文章详情
//GetArticleDetails('http://news.zol.com.cn/634/6345321.html');
function GetArticleDetails(url,callback, cb){
	if(typeof url == 'string'){
		_init(url, callback, cb);
	}else if(typeof url == 'object'){
		for(var i = 0; i < url.length; i++){
			_init(url[i], callback, cb);
		}
	}
	
}
function _init(_url, callback, cb){
	http.HttpGetGBK(_url,function(html){
		var $ = cheerio.load(html);
		html = html.toString();
		var start = _url.lastIndexOf('/');
		var url_flag = _url.substring(start+1);
	//	var article = $('.article-content .article-cont');
		var time = $('.article-aboute #pubtime_baidu').text();
		var author = $('.article-aboute #source_baidu').text();
		var author_start = author.lastIndexOf('作者：');
		var _author = author.substring(author_start+3);
		
		var start = html.indexOf('<div id="article-content">');
		var end = html.indexOf('<div class="article-operation clearfix">');
		var str = html.substring(start, end);
		
		var newstart = str.indexOf('<p');
		var newend = str.lastIndexOf('</p>');
		var newstr = str.substring(newstart, newend + 4);
		newstr = newstr.replace(/'/g,'\"');
		var bug = '<div id="article-content"><div class="article-cont clearfix" itemprop="articleBody"><div class="ad-box article-cont-ad"><div class="ad_in_content" style="display:none;"><script>write_ad("news_article_ad");</script></div></div>';
		newstr = newstr.replace(bug, '');
		var p = $('#article-content .article-cont p');
		var json = {
			data: []
		}
		if( !p.first().prev() == 'false' && p.first().prev().get(0).tagName.toLowerCase() == 'img' ){
			var imgS = str.indexOf('<img');
			var imgE = str.indexOf('<p>');
			var imgC = str.substring(imgS, imgE);
			newstr = imgC + newstr;
		}else{
			
		}
		json.data.push({
			url: _url,	// 地址
			url_flag: url_flag,	// 地址
			contents: newstr,	// 文章
			time: time,	// 时间
			authors: _author,	// 作者
		})
		callback && callback(json);
		
		
		var title = $('.article-header h1').text();
		var time = $('#pubtime_baidu').text();
		var newtime = time.replace(/(.*?)(-)(.*?)(-)(.*?)( )/g, '$1年$3月$5日 ');
		var imgSrc = $('#article-content p').find('img').eq(0).attr('src');
		var des = $('#article-content p').text().substr(0, 53).trim() + '...';
		var jsonjs = {
			data: []
		}
		jsonjs.data.push({
			t:'common',
			title: title,
			href: _url,
			href_flag: url_flag.match(/(.*?)(?=.html)/g)[0],
			date: newtime,
			imgsrc: imgSrc,
			info: des,
		})
		cb && cb(jsonjs);
	})
}

exports.GetArticleDetails = GetArticleDetails;

