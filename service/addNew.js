var getDetail = require('./detail')
var mysql = require('./MySql');


function addNew(url, cb){
	getDetail.GetArticleDetails(url, function(json){
		var sql = "insert ignore into details(url, url_flag, contents, time, authors)"
				+	"values(\'"
				+	json.data[0].url + "\',\'"
				+	json.data[0].url_flag + "\',\'"
				+	json.data[0].contents + "\',\'"
				+	json.data[0].time + "\',\'"
				+	json.data[0].authors + "\'"
				+	");"
		mysql.query(sql, function(err, results){
			console.log('正文爬取正在执行!');
			console.log('正文爬取执行完毕!');
		});
//		mysql.InitId('details');
	}, function(jsons){
		var sql = "insert ignore into topics(t, title, href, href_flag, imgsrc, info, date) values(?,?,?,?,?,?,?);" ;	
		mysql.querySe(sql,[
			jsons.data[0].t,
			jsons.data[0].title,
			jsons.data[0].href,
			jsons.data[0].href_flag,
			jsons.data[0].imgsrc,
			jsons.data[0].info,
			jsons.data[0].date,
		], function(error, results){
			if(!error){
				console.log('文章爬取正在执行!');
				console.log('文章爬取执行完毕!');
			}
			cb && cb(error, results);
		});
//		mysql.InitId('topics');
	})
}
exports.addNew = addNew;