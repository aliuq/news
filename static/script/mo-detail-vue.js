/*
 * 	手机页面	Vue代码
 */

var href_flag = location.href.match(/(mobile\/)(.*?)(.html)/)[2];
$.get('/ajax/moparam/' + href_flag ,function(d){
	var data = d.data[0];
	var evaluate = JSON.parse( data.evaluate )
	
	if( data.comments != '' && data.comments != null ){
		data.comments = data.comments.replace(/{:1_/g,"<img src='../static/img/face/");
		data.comments = data.comments.replace(/:}/g,".gif' alt='{:1_1:}' width='24' height='24' />");
		var newComments = data.comments.match(/{(.*?)"}/g);
		var newCommentsArr = [];
		for( var j = 0; j < newComments.length; j++ ){
			newCommentsArr.push( JSON.parse( newComments[j] ) )
		}
	}else{
		
	}
	
	new Vue({
		el: '#mo_param',
		data:{
			data: data,
			evaluates: evaluate,
			mocomments: newCommentsArr,
		},
		computed:{
			param: function(){
				return this.data;
			}
		},
		methods: {
			
		},
		watch:{
			
		}
	})
},'json');