/*
 * 		爬取手机产品信息
 * 		http://detail.zol.com.cn/cell_phone_index/subcate57_0_list_1_0_1_2_0_1.html
 * 		http://detail.zol.com.cn/1161/1160028/video.shtml
 * 		http://detail.zol.com.cn/cell_phone/index1160028.shtml
 * 		http://detail.zol.com.cn/1161/1160011/param.shtml
 */

var http = require('./HttpGet');
var cheerio = require('cheerio');
var mysql = require('./mysql');

exports.InsertPageMo = InsertPageMo;


//getMobileInfo();
//	爬取数据
function getMobileInfo(pageNum, cb){
	var Obj = {
		url: 'http://detail.zol.com.cn/cell_phone_index/subcate57_0_list_1_0_1_2_0_' + pageNum + '.html',
		json: [],
/*
//		{
//			name:'',	//	品牌名
//			price:'',	//	价格
//			href:'',	//	详情链接
//			pic:'',		//	图片地址
//			point:'',	//	简介
//			star:'',	//	星级
//			parameters: [],	//	具体参数
//		},
*/
	};
	http.HttpGetGBK(Obj.url, function(html){
		var $ = cheerio.load(html);
//		console.log(html);
		var cont = $('#J_PicMode li');
		cont.each(function(item){
			var network = '';
			if( $(this).find('h3 a').text().toString().indexOf('（') != -1 && $(this).find('h3 a').text().toString().indexOf('）') != -1 ){
				network = $(this).find('h3 a').text().toString().match(/(（)(.*?)(）)/)[2];
			}
			var href = $(this).find('.pic').attr('href');
			var info = {
				name: $(this).find('h3 a').contents().eq(0).text(),	//	品牌名
				price: $(this).find('.price-row .price-type').text(),	//	价格
				href: href,	//	详情链接
				href_flag: href.match(/(cell_phone\/)(.*?)(.shtml)/)[2],
				pic : $(this).find('.pic img').attr('.src'),	//	图片地址
				point: $(this).find('h3 a span').text(),	//	简介
				star: $(this).find('.score').text(),	//	星级
				network: network ,	//	网络
			};
			Obj.json.push(info);
		})
		cb && cb(Obj.json);
//		console.log( Obj.json )
		
	})
}

//	爬取主要链接及内容
//getMainHref('http://detail.zol.com.cn/cell_phone/index1160011.shtml');
function getMainHref(url, cb){
	var json = [];
	http.HttpGetGBK( url, function(html){
		var $ = cheerio.load(html);
		
		//	获取主要链接
		var paramsUrl = 'http://detail.zol.com.cn';
		var evaluateUrl = 'http://detail.zol.com.cn' ;
		var videoUrl = 'http://detail.zol.com.cn';
		var list = $('.nav li');
		for( var i = 0; i < list.length; i++ ){
			var curr = $(list[i]);
			if( curr.text().indexOf('参数') != -1 ){
				//	参数链接
				paramsUrl += curr.find('a').attr('href');
			}else if( curr.text().indexOf('评测行情') != -1 ){
				//	评测行情
				evaluateUrl += curr.find('a').attr('href');
			}else if( curr.text().indexOf('视频') != -1 ){
				//	视频链接
				videoUrl +=  curr.find('a').attr('href');
			}
		}
		
		
		getVideo(videoUrl, function(data){
			getEvaluate(evaluateUrl, function(dataes){
				getParams(paramsUrl, function(datas){
					json.push({
						href_flag: url.match(/(cell_phone\/)(.*?)(.shtml)/)[2],
						video: data,
						evaluate: dataes,
						params: datas,
					})
					cb && cb(json[0]);
//					console.log(json[0])
				});
			});
		});
	})
}
//	爬取参数
//getParams('http://detail.zol.com.cn/1154/1153416/param.shtml');
function getParams(url, cb){
	var json = [];
	http.HttpGetGBK( url, function(html){
		var $ = cheerio.load(html);
		var list = $('.category-param-list li');
		var _date = null;
		var size = null;
		var ram = null;
		var rom = null;
		for( var i = 0; i < list.length; i++ ){
			var curr = $(list[i]).find('span');
			if( curr.text().indexOf('主屏尺寸') != -1 ){
				size = curr.eq(1).text();
			}else if( curr.text().indexOf('上市日期') != -1 ){
				_date = curr.eq(1).text();
			}else if( curr.text().indexOf('RAM容量') != -1 ){
				ram = curr.eq(1).text();
			}else if( curr.text().indexOf('ROM容量') != -1 ){
				rom = curr.eq(1).text();
			}
		}
		_html = html.toString();
		var strS = _html.indexOf('<div id="paramTable" class="section-param">');
		var strE = _html.indexOf('<table class="param-table-footer">');
		var str = _html.substring(strS, strE) + '</div>';
		json.push({
			date: _date,
			size: size,
			ram: ram,
			rom: rom,
			str: str,
		});
		cb && cb(json);
	})
}
//	爬取评测行情
function getEvaluate(url, cb){
	var json = [];
	http.HttpGetGBK( url, function(html){
		var $ = cheerio.load(html);
		var list = $('#evalDoc .content-list li');
		list.each(function(item){
			var evalHref = $(this).find('.pic').attr('href');
			var evalImg = $(this).find('.img img').attr('src');
			var evalTitle = $(this).find('.article-title a').text();
			var evalP = $(this).find('p').text().match(/(.*?)(\[)/)[1];
			var evalDate = $(this).find('.article-date').text();
			var evalAuthor = $(this).find('.article-author span').text() + ' ' + $(this).find('.article-author a').text()
			json.push({
				evalHref: evalHref,
				evalImg: evalImg,
				evalTitle: evalTitle,
				evalP: evalP,
				evalDate: evalDate,
				evalAuthor: evalAuthor,
			})
		})
		cb && cb(json);
	})
}
//	视频链接
function getVideo(url, cb){
	var json = [];
	http.HttpGetGBK( url, function(html){
		var $ = cheerio.load(html);
		var videoTitle = $('#video_title a').text();
		var videoMo = $('.module-video iframe').attr('src');
		var videoP = $('#video_digest').text();
		json.push({
			videoTitle: videoTitle,
			videoMo: videoMo,
			videoP: videoP,
		})
		cb && cb(json);
	})
}


//InsertPageMo();
//	接口
function InsertPageMo(){
	for( var num = 80; num < 81; num++ ){
		InsertMo(num);
	}
}

//	存数据
//InsertMo();
function InsertMo(pageNum, cb){
	getMobileInfo(pageNum, function(data){
//		console.log( data )
		
		var index = 1;
		var num = 1;
		for( var i = 0; i < data.length; i++ ){
//			console.log( data[i].name )
			var sql = "insert ignore into mobileInfo(name, price, href, href_flag, pic, point, star, network)"
					+	"values(\'"
				 	+	data[i].name + "\',\'"
					+	data[i].price + "\',\'"
					+	data[i].href + "\',\'"
					+	data[i].href_flag + "\',\'"
					+	data[i].pic + "\',\'" 
					+	data[i].point + "\',\'" 
					+	data[i].star + "\',\'"
					+	data[i].network + "\'" 
					+	");" ;
			mysql.query(sql, function(err, results){
				if( !err ){
					console.log( '第' + pageNum + '页' + data[index-1].href_flag + ' 手机产品信息爬取第' + index + '次正在执行!');
					console.log( '第' + pageNum + '页' + data[index-1].href_flag + ' 手机产品信息爬取第' + index + '次执行完毕!');
					index++;
				}else{
					cb && cb(err, results);
				}
			});
			
			getMainHref('http://detail.zol.com.cn/cell_phone/' + data[i].href_flag + '.shtml', function(datas){
				var eval = JSON.stringify( datas.evaluate );

				var sqlparam = 'insert ignore into params(href_flag, videoTitle, videoMo, videoP, paramDate, paramSize, paramRam, paramRom, paramStr, evaluate) values(?,?,?,?,?,?,?,?,?,?)';
				mysql.querySe(sqlparam,[
					datas.href_flag,
					datas.video[0].videoTitle,
					datas.video[0].videoMo,
					datas.video[0].videoP,
					datas.params[0].date,
					datas.params[0].size,
					datas.params[0].ram,
					datas.params[0].rom,
					datas.params[0].str,
					eval
				],function(error, results){
					if(!error){
						console.log(  '第' + pageNum + '页' + datas.href_flag + ' 手机相关信息爬取第' + num + '次正在执行!' );
						console.log(  '第' + pageNum + '页' + datas.href_flag + ' 手机相关信息爬取第' + num + '次执行完毕!' );
						num++;
						cb && cb(err, results);
					}else{
						console.log( error );
						cb && cb(err, results);
					}
				})
//				console.log( datas.params[0].date )
			});
			
		}
		mysql.InitId('mobileInfo');
//		mysql.InitId('params');
	//		console.log(sql);
	})
}
