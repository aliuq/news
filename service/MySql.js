/*
 * 	连接数据库
 * 	操作数据库
 */
var mysql = require('mysql');  
 
var option = {
  host     : '192.168.0.103',
  user     : 'root',
  password : 'root',
  port	   : '3306',
  database : 'graduation',
  multipleStatements:true
};

var pool  = mysql.createPool(option);


var content;
exports.queryRe = function(sql){
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results, fields){
			if (error) throw error;
			content = results;
			connection.release();
		})
	});
	return content;
}
exports.query = function(sql, callback){
	return pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results, fields){
			if (error) throw error;
			callback && callback(error, results);
			connection.release();
		})
	})
}

exports.querySe = function(sql, obj, callback){
	return pool.getConnection(function(err, connection) {
		connection.query(sql, obj, function(error, results, fields){
			if (error) throw error;
			callback && callback(error, results);
			connection.release();
		})
	})
}

//	初始化id，并重新排序
exports.InitId = function(tablename, callback){
	var sql = "alter table " + tablename + " drop " + tablename + ".id;"  
			+	"alter table " + tablename + " add column id int not null primary key auto_increment first;"
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(error, results, fields){
			if (error) throw error;
			callback && callback(error, results);
			connection.release();
		})
	})
	
}

