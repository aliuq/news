var serviceTopics = require('./ServiceStorage');
var mo = require('./mo-base');
var mysql = require('./MySql');
var bgadd = require('./addNew');

//	更新首页左侧文章和热文
exports.GetUpdateTopics = function(){
	return function(cb){
		serviceTopics.InsertDataCommon();
		serviceTopics.InsertDataHot();
	}
}

// 文章列表搜索标题
exports.getSearNews = function(data){
	return function(cb){
		var sql = "select * from topics where title like \'%" + data.s + "%\' order by date desc;"
		mysql.query(sql, function(error, results){
			if(!error){
				cb && cb(null, {
					msg:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					msg:'0',
					data:error,
				});
			}
		})
	}
}

//	即时更新
exports.GetUpdateCommonTopics = function(){
	serviceTopics.InsertDataCommon();
}

//	链接添加
exports.linkAdd = function(url){
	return function(cb){
		var sql = 'select * from test.details order by id desc;'
		bgadd.addNew(url, function(error, results){
			if(!error){
				cb && cb(null, {
					result:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					result:'0',
					data:error,
				});
			}
		});
	}
}

//	验证链接添加里的链接
exports.checkLink = function(url){
	return function(cb){
		var sql = 'select * from topics where href = \"' + url + '\";';
		mysql.query(sql, function(error, results){
			if(!error){ // 如果存在 则返回0
				if( results.length == 0 ){
					cb && cb(null, {
						msg:1
					});
				}else{
					cb && cb(null, {
						msg:0,
						data:"内容已存在！"
					});
				}
			}else{
				cb && cb(null, {
					msg:2,
					data:error
				});
			}
		});
	}
}

//	获取文章列表数据
exports.GetTopics = function(){
	return function(cb){
		var sql = "select * from topics order by date desc; "
		mysql.query(sql, function(error, results){
			if(!error){
				cb && cb(null, {
					msg:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					msg:'0',
					data:error,
				});
			}
		})
	}
}

//	获取文章详情页数据
exports.getDetails = function(data){
	return function(cb){
		var sql = "select details.id,topics.title,details.url,details.url_flag,details.contents,details.time,details.authors,details.comments from details,topics where topics.href = details.url && details.url_flag = \"" + data.href_flag + "\" order by details.id"
		mysql.query(sql, function(error, results){
			if(!error){
				cb && cb(null, {
					result:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					result:'0',
					data:error,
				});
			}
		})
	}
}

//	添加评论插入到数据库
exports.addComment = function(data){
	return function(cb){
		var start = data.url.lastIndexOf('/');
		var url_flag = data.url.substring(start+1);
//		console.log(data)
		var datas = JSON.stringify(data);
		var sqlyes = "update details set details.comments = concat(\'" + datas + "\'" + ",details.comments) where details.url_flag =\'" + url_flag + "\'";
		var sqlno = "update details set details.comments = \'" + datas + "\' where details.url_flag =\'" + url_flag + "\'";
		var sqlon = "select details.url_flag,details.comments from details where details.url_flag =\'" + url_flag + "\'";
		mysql.query(sqlon, function(error, results){
			if(!error){
				if( results[0].comments == null ){
					mysql.query(sqlno, function(erro, resul){
						if(!erro){
							cb && cb(null, {
								result:'评论成功！',
								data:results
							});
						}else{
							throw erro;
							cb && cb(null, {
								result:'评论失败',
								data:erro,
							});
						}
					})
				}else{
					mysql.query(sqlyes, function(err, resu){
						if(!err){
							cb && cb(null, {
								result:'评论成功！',
								data:results
							});
						}else{
							throw err;
							cb && cb(null, {
								result:'评论失败！',
								data:err,
							});
						}
					})
				}
			}else{
				throw error;
				cb && cb(null, {
					result:'评论失败！',
					data:error,
				});
			}
		})
//		console.log( sqlyes )
//		console.log( sqlno )
		
	}
}

//	检查点赞数，并更新点赞数
exports.checkOk = function(data){
	return function(cb){
		var sql = "select details.comments from details where details.url_flag = \'" + data.url_flag + ".html\';";
		mysql.query(sql, function(error, results){
			var str = results[0].comments;
			var reg = new RegExp( '("num":"' + data.floor + '")(.*?)("ok":")(.*?)(?="})' );
			str = str.replace(reg , '$1$2$3'+ data.ok);
			var updateSql = 'update details set details.comments = \'' + str + '\' where details.url_flag = \'' + data.url_flag + '.html\';';
			if(!error){
				mysql.query(updateSql, function(err, resultss){
					if(!err){
						cb && cb(null, {
							result:'点赞成功！',
							data:resultss
						});
					}else{
						throw err;
						cb && cb(null, {
							result:'点赞失败！',
							data:err,
						});
					}
				})
			}else{
				throw error;
				cb && cb(null, {
					result:'点赞失败！',
					data:error,
				});
			}
		})
	}
}

//	更新手机产品信息
exports.UpdateMobile = function(){
	return function(cb){
		mo.InsertPageMo(function(error, results){
			if(!error){
				cb && cb(null, {
					result:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					result:'0',
					data:error,
				});
			}
		})
	}
}

//	搜索手机产品
exports.getSearMo = function(data){
	return function(cb){
		var sql = "select * from mobileinfo where name like \'%" + data.s + "%\' || network like \'%" + data.s + "%\' || price like \'%" + data.s + "%\' || point like '%" + data.s + "%';"
		mysql.query(sql, function(error, results){
			if(!error){
				cb && cb(null, {
					msg:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					msg:'0',
					data:error,
				});
			}
		})
	}
}

//	获取手机产品信息
exports.getMobileInfo = function(data){
	var brand = '';
	var price = '';
	var size = '';
	var net = '';
	var ram = '';
	var rom = '';
	if( data.brand != undefined && data.brand != '不限' && data.brand != 0){
		brand = " && mobileinfo.name like '%" + data.brand + "%'"
	}
	if( data.price != undefined && data.price != '不限' && data.price != 0 ){
		switch(data.price){
			case '500元以下':
				price = " && mobileinfo.price <= 500";
				break;
			case '500-1000元':
				price = " && mobileinfo.price > 500 && mobileinfo.price <= 1000";
				break;
			case '1000-1500元':
				price = " && mobileinfo.price > 1000 && mobileinfo.price <= 1500";
				break;
			case '1500-2000元':
				price = " && mobileinfo.price > 1500 && mobileinfo.price <= 2000";
				break;
			case '2000-3000元':
				price = " && mobileinfo.price > 2000 && mobileinfo.price <= 3000";
				break;
			case '3000-4000元':
				price = " && mobileinfo.price > 3000 && mobileinfo.price <= 4000";
				break;
			case '4000元以上':
				price = " && mobileinfo.price > 4000";
				break;
		}
	}
	if( data.size != undefined && data.size != '不限' && data.size != 0 ){
		switch(data.size){
			case '6.0英寸以上':
				size = " && params.paramSize > 6.0";
				break;
			case '5.6-6.0英寸':
				size = " && params.paramSize >= 5.6 && params.paramSize <= 6.0";
				break;
			case '5.1-5.5英寸':
				size = " && params.paramSize >= 5.1 && params.paramSize <= 5.5";
				break;
			case '5.0英寸':
				size = " && params.paramSize = 5.0";
				break;
			case '4.5-4.9英寸':
				size = " && params.paramSize >= 4.5 && params.paramSize <= 4.9";
				break;
			case '4.0-4.4英寸':
				size = " && params.paramSize >= 4.0 && params.paramSize <= 4.4";
				break;
			case '4.0英寸以下':
				size = " && params.paramSize < 4.0";
				break;
		}
	}
	if( data.net != undefined && data.net != '不限' && data.net != 0 ){
		net = " && mobileinfo.network like '%" + data.net + "%'";
	}
	if( data.ram != undefined && data.ram != '不限' && data.ram != 0 ){
		ram = " && params.paramRam like '%" + data.ram + "%'";
	}
	if( data.rom != undefined && data.rom != '不限' && data.rom != 0 ){
		rom = " && params.paramRom like '%" + data.rom + "%'";
	}
	
	return function(cb){
//		var sql = "select * from mobileInfo";

		var sql = "select mobileinfo.*, params.paramSize, params.paramRam, params.paramRom, params.paramDate from mobileinfo,params where mobileinfo.href_flag = params.href_flag" + brand + price + size + net + ram + rom;
//		console.log( sql )
		mysql.query(sql, function(error, results){
			if(!error){
				cb && cb(null, {
					result:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					result:'0',
					data:error,
				});
			}
		})
	}
}

//	获取产品详细信息
exports.getMobileParam = function( href_flag ){
	return function(cb){
		var sql = "select params.*, mobileinfo.name, mobileinfo.network from mobileinfo, params where params.href_flag = \'" + href_flag + "\' && mobileinfo.href_flag = \'" + href_flag + "\';"
		mysql.query(sql, function(error, results){
			if(!error){
				cb && cb(null, {
					result:'1',
					data:results
				});
			}else{
				throw error;
				cb && cb(null, {
					result:'0',
					data:error,
				});
			}
		})
	}
}

//	手机产品 添加评论插入到数据库
exports.moAddComment = function(data){
	return function(cb){
		var href_flag = data.url.match(/(mobile\/)(.*?)(.html)/)[2];
//		console.log(href_flag)
		var datas = JSON.stringify(data);
		var sqlyes = "update params set params.comments = concat(\'" + datas + "\'" + ",params.comments) where params.href_flag =\'" + href_flag + "\'";
		var sqlno = "update params set params.comments = \'" + datas + "\' where params.href_flag =\'" + href_flag + "\'";
		var sqlon = "select params.href_flag,params.comments from params where params.href_flag =\'" + href_flag + "\'";
		mysql.query(sqlon, function(error, results){
			if(!error){
				if( results[0].comments == null ){
					mysql.query(sqlno, function(erro, resul){
						if(!erro){
							cb && cb(null, {
								result:'评论成功！',
								data:results
							});
						}else{
							throw erro;
							cb && cb(null, {
								result:'评论失败',
								data:erro,
							});
						}
					})
				}else{
					mysql.query(sqlyes, function(err, resu){
						if(!err){
							cb && cb(null, {
								result:'评论成功！',
								data:results
							});
						}else{
							throw err;
							cb && cb(null, {
								result:'评论失败！',
								data:err,
							});
						}
					})
				}
			}else{
				throw error;
				cb && cb(null, {
					result:'评论失败！',
					data:error,
				});
			}
		})
//		console.log( sqlyes )
//		console.log( sqlno )
		
	}
}

//	检查点赞数，并更新点赞数
exports.moCheckOk = function(data){
//	console.log( data )
	return function(cb){
		var sql = "select params.comments from params where params.href_flag = \'" + data.url_flag + "\';";
		mysql.query(sql, function(error, results){
			var str = results[0].comments;
			var reg = new RegExp( '("num":"' + data.floor + '")(.*?)("ok":")(.*?)(?="})' );
			str = str.replace(reg , '$1$2$3'+ data.ok);
			var updateSql = 'update params set params.comments = \'' + str + '\' where params.href_flag = \'' + data.url_flag + '\';';
			if(!error){
				mysql.query(updateSql, function(err, resultss){
					if(!err){
						cb && cb(null, {
							result:'点赞成功！',
							data:resultss
						});
					}else{
						throw err;
						cb && cb(null, {
							result:'点赞失败！',
							data:err,
						});
					}
				})
			}else{
				throw error;
				cb && cb(null, {
					result:'点赞失败！',
					data:error,
				});
			}
		})
	}
}

//	检查用户名是否被占用
exports.checkUser = function(data){
//	console.log( data );
	return function(cb){
		var sql = 'select username from user where username = ?';
		mysql.querySe(sql, [
			data.name,
		], function(err, results){
			if(!err){
				if( results.length != 0 ){
					cb && cb(null, {
						msg:'0',
					});
				}else{
					cb && cb(null, {
						msg:'1',
					});
				}
			}else{
				throw err;
				cb && cb(null, {
					msg:'err',
				});
			}
			
		})
	}
}

//	注册用户
exports.addUser = function(data){
//	console.log( data );
	return function(cb){
		var sql = 'insert into user(username, password, ques, ans, email, birth, ps ) values(?,?,?,?,?,?,?)';
		mysql.querySe(sql, [
			data.name,
			data.pass,
			data.ques,
			data.ans,
			data.email,
			data.birth,
			data.ps
		], function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
				});
			}else{
				cb && cb(null, {
					msg: '0',
				});
			}
		})
		mysql.InitId('user');
	}
}

//	登录
exports.login = function(data){
	return function(cb){
		var sql = 'select * from user where username = ? && password = ?;';
		mysql.querySe(sql, [
			data.name,
			data.pass
		], function(err, results){
			if(!err){
				if( results.length != 0 ){
					cb && cb(null, {
						msg:'1',
						data: results,
					});
				}else{
					cb && cb(null, {
						msg:'0',
						data: results,
					});
				}
			}else{
				throw err;
				cb && cb(null, {
					msg:'0',
					data: error,
				});
			}
		})
	}
}

//	验证管理员用户密码
exports.checkadmin = function(data){
	return function(cb){
		var sql = 'select * from admin where adminuser = ? && adminpass = ?;';
		mysql.querySe(sql, [
			data.name,
			data.pass
		], function(err, results){
			if(!err){
				if( results.length != 0 ){
					cb && cb(null, {
						msg:'1',
						data: results,
					});
				}else{
					cb && cb(null, {
						msg:'0',
						data: results,
					});
				}
			}else{
				throw err;
				cb && cb(null, {
					msg:'0',
					data: error,
				});
			}
		})
	}
}

//	手动添加
exports.handAddport = function(data){
	return function(cb){
		var sql = 'insert ignore into topics(t, title,href, href_flag, imgsrc, info, date) values(?,?,?,?,?,?,?);insert ignore into details(url, url_flag, contents, time, authors) values(?,?,?,?,?);';
		mysql.querySe(sql, [
			data.topics[0].t,
			data.topics[0].title,
			data.topics[0].href,
			data.topics[0].href_flag,
			data.topics[0].imgsrc,
			data.topics[0].info,
			data.topics[0].date,
			data.details[0].url,
			data.details[0].url_flag,
			data.details[0].contents,
			data.details[0].time,
			data.details[0].authors
		], function(err, results){
			if(!err){
				cb && cb(null, {
					msg:'1',
					data: results,
				});
			}else{
				throw err;
				cb && cb(null, {
					msg:'0',
					data: error,
				});
			}
		})
//		mysql.InitId('topics');
//		mysql.InitId('details');
	}
}

//	获取用户列表
exports.getUserlist = function(){
	return function(cb){
		var sql = 'select id,username,email,birth from user';
		mysql.query(sql, function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
					data: results,
				})
			}else{
				cb && cb(null, {
					msg: '0',
					data: err,
				})
			}
		})
	}
}

//	用户列表 删除用户
exports.deleteUser = function(username){
	return function(cb){
		var sql = 'delete from user where username = ?';
		mysql.querySe(sql, [ username ], function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
					data: results,
				})
			}else{
				cb && cb(null, {
					msg: '0',
					data: err,
				})
			}
		})
//		mysql.InitId('user');
	}
}

//	查找用户

exports.uSearUser = function(data){
	return function(cb){
		var sql = 'select * from user where username like \"%' + data.s + '%\";';
		mysql.query(sql, function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
					data: results,
				})
			}else{
				cb && cb(null, {
					msg: '0',
					data: err,
				})
			}
		})
//		mysql.InitId('user');
	}
}

//	用户列表 修改用户资料
exports.UInfoUpdate = function(data){
	return function(cb){
		var sql = 'update user set username = ? , email = ?, birth = ? where id = ?';
		mysql.querySe(sql, [ 
			data.uName,
			data.uEmail,
			data.uBirth,
			data.id
		], function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
					data: results,
				})
			}else{
				cb && cb(null, {
					msg: '0',
					data: err,
				})
			}
		})
	}
}

//	获取咨讯列表
exports.getnewlist = function(){
	return function(cb){
		var sql = 'select topics.id,topics.title,details.time,details.authors from topics, details where topics.href = details.url order by topics.id;';
		mysql.query(sql, function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
					data: results,
				})
			}else{
				cb && cb(null, {
					msg: '0',
					data: err,
				})
			}
		})
//		mysql.InitId('topics');
//		mysql.InitId('details');
	}
}

//	咨讯列表 删除咨讯
exports.deleteNews = function(title){
	return function(cb){
		var sql = 'delete from details where details.url = any ( select topics.href from topics where topics.title = ? );delete from topics where topics.title = ?;';
		mysql.querySe(sql, [ title, title ], function(err, results){
			if(!err){
				cb && cb(null, {
					msg: '1',
					data: results,
				})
			}else{
				cb && cb(null, {
					msg: '0',
					data: err,
				})
			}
		})
//		mysql.InitId('topics');
//		mysql.InitId('details');
//		console.log(1)
	}
}

//	重置
exports.reset = function(){
	return function(cb){
		mysql.InitId('topics',function(error, results){
			if( !error ){
				mysql.InitId('details', function(err, result){
					if( !err ){
						cb && cb(null, {
							msg: '1',
							t: 'details',
						})
					}else{
						cb && cb(null, {
							msg: '0',
							t: 'details',
						})
					}
				});
			}else{
				cb && cb(null, {
					msg: '0',
					t: 'topics',
				})
			}
		});
	}
}

//	重置用户
exports.resetUser = function(){
	return function(cb){
		mysql.InitId('user',function(error, results){
			if( !error ){
				cb && cb(null, {
					msg: '1',
				})
			}else{
				cb && cb(null, {
					msg: '0',
				})
			}
		});
	}
}