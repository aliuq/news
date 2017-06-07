$(function(){
	$.get('http://ipinfo.io/json',function(data){
		$('.ip').html( data.ip )
	});
	var date = new Date();
	dateN = dateFormat( date );
	$('.date').html( dateN );
	
	//	时间格式化
	function dateFormat(date){
		var YY = date.getFullYear();		// 年  	
	    var MM = date.getMonth() + 1;  	// 月
	    MM = MM < 10 ? ('0' + MM) : MM;  
	    var DD = date.getDate();  		// 日
	    DD = DD < 10 ? ('0' + DD) : DD;  
	    var hh = date.getHours();  		// 时
	    hh = hh < 10 ? ('0' + hh) : hh;
	    var mm = date.getMinutes(); // 分
	    mm = mm < 10 ? ('0' + mm) : mm;
	    var ss = date.getSeconds();		// 秒
	    ss = ss < 10 ? ('0' + ss) : ss;
	    return YY + '-' + MM + '-' + DD +' &nbsp;'+ hh +' : '+ mm + ' : ' + ss; 
	}
})
