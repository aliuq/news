
var href_flag = location.href.match(/(details\/)(.*)/)[2];
$.get('/ajax/detailss?href_flag=' + href_flag,function(d){
	d = d.data[0];
	var title = $('head title');
	var ss = $('.article-cont');
	title.html(d.title);
	if( d.contents == '' || d.contents == '<p></p>' ){
		ss.html('文章暂无');
		ss.css({
			fontSize:'20px',
			textIndent:'2em',
		})
		setTimeout(function(){
			window.location.href = 'http://127.0.0.1:3030/';
		}, 3000)
	}else{
		ss.html(d.contents);
	}
	
//	console.log(contents[0].comments)
	if( d.comments != '' && d.comments != null ){
		d.comments = d.comments.replace(/{:1_/g,"<img src='../static/img/face/");
		d.comments = d.comments.replace(/:}/g,".gif' alt='{:1_1:}' width='24' height='24' />");
		var newComments = d.comments.match(/{(.*?)"}/g);
		var newCommentsArr = [];
		for( var j = 0; j < newComments.length; j++ ){
			newCommentsArr.push( JSON.parse( newComments[j] ) )
		}
	}else{
		
	}

	new Vue({
		el: '#content',
		data:{
			comms:newCommentsArr,
			cts: d,
			onOff: 'none',
		},
		methods: {
			tabShare: function(pos){
				if(pos == 0){
					this.onOff = 'block';
				}else{
					this.onOff = 'none';
				}
			}
		},
		watch:{
			
		}
	})

},'json');