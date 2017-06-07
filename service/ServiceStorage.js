/*
 * 	数据交互接口
 * 	执行爬取数据 存入数据库
 * 	标题，图片地址，文章地址，文章地址后缀，日期， 时间，评论， t, s
 * 	@param t 代表普通文章
 * 	@param s 代表热文
 * 	
 */

//	数据接口
exports.InsertDataCommon = InsertDataCommon;
exports.InsertDataHot = InsertDataHot;


var ArtiList = require('./articlelist');
var mysql = require('./mysql');
var Detail = require('./detail');

// 文章	左侧内容
//InsertDataCommon();
function InsertDataCommon(){
	ArtiList.GetArticleCommon(function(titles, hrefs, json){
		var index = 1;
		for(var i in json.topics){
			var sql = "insert ignore into topics(t, title, href, href_flag, imgsrc, info, date)"
					+	"values(\'"
				 	+	json.t + "\',\'"
					+	json.topics[i].title + "\',\'"
					+	json.topics[i].href + "\',\'"
					+	json.topics[i].href_flag + "\',\'"
					+	json.topics[i].imgsrc + "\',\'" 
					+	json.topics[i].info + "\',\'" 
					+	json.topics[i].date + "\'" 
					+	");" ;
			
	//INSERT IGNORE INTO topics (href) VALUES ('MySQL Mea-l');
	
			mysql.query(sql, function(err, results){
				console.log('文章爬取第' + index + '次正在执行!');
				console.log('文章爬取第' + index + '次执行完毕!');
				index++;
			});
		}
		
		// 文章详情
		var num = 1;
		Detail.GetArticleDetails(hrefs, function(json){
			var sql = "insert ignore into details(url, url_flag, contents, time, authors)"
					+	"values(\'"
					+	json.data[0].url + "\',\'"
					+	json.data[0].url_flag + "\',\'"
					+	json.data[0].contents + "\',\'"
					+	json.data[0].time + "\',\'"
					+	json.data[0].authors + "\'"
					+	");"
			mysql.query(sql, function(err, results){
				console.log('正文爬取第' + num + '次正在执行!');
				console.log('正文爬取第' + num + '次执行完毕!');
				num++;
			});
		})
		mysql.InitId('topics');
		mysql.InitId('details');
	});
	
	
}

//	热文
function InsertDataHot(){
	ArtiList.GetArticleHot(function(titles, hrefs, json){
		var index = 1;
		for(var i in json.hot){
			var sql = "insert ignore into topics(s, title, href, href_flag, imgsrc, pinglun)"
					+	"values(\'"
					+	json.s + "\',\'"
					+	json.hot[i].title + "\',\'"
					+	json.hot[i].href + "\',\'"
					+	json.hot[i].href_flag + "\',\'"
					+	json.hot[i].imgsrc + "\',\'"
					+	json.hot[i].pinglun + "\'"
					+	");"
				
			mysql.query(sql, function(err, results){
				console.log('热文爬取第' + index + '次正在执行!');
				console.log('热文爬取第' + index + '次执行完毕!');
				index++;
			})
		}
	})
}

