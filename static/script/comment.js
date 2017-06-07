/*
 * 	详情页js代码
 */

setTimeout(function(){
	$(function(){
		
		//	评论区域
		var comment = $('#comment_content');
		
		//	点击表情
		$('#face-img').click(function(e){
			var txt_comment = $('#comment_content');
			var txt_comment_html = txt_comment.val();
			if( e.target && e.target.nodeName == 'IMG' ){
				$('.face-main-box').hide();
				var txt_alt = e.target.alt;
				txt_comment_html += txt_alt;
				txt_comment.val(txt_comment_html);
			}
		})
		
		//	共有几条评论
		$('.comment-num').html( $('.comment-item').length );
		$('.func-comment em').html( $('.comment-item').length );
		
		//	提交评论
		$('#sub').click(function(){
			//	如果文章不存在，则不允许评论
			if( $('.article-cont').html() == '文章暂无' ){
				alert('暂不支持评论！');
				comment.val('');
				return;
			}
			//	之前的评论
			var oldComment = $('#comment_list').html();
			//	当前时间
			var currentDate = new Date().format( new Date() );
			//	当前楼层
			var num = parseInt($('.comment-item').length) + 1;
			//	当前评论内容
			var cont = comment.val();
			//	判断是否回复
			if(cont.indexOf('@') != '-1' ){
				cont = cont.replace(/(@)(.*?)(楼 )/g, "<span><a href=#$2>$1$2$3</a></span>");
			}else{
				
			}
			
			var cont_test = cont.match(/({:1_).*?(:})/g);
//			<img src="../static/img/face/1.gif" alt="{:1_1:}" width="24" height="24" />
			var _cont = cont;
			_cont = _cont.replace(/{:1_/g,"<img src='../static/img/face/");
			_cont = _cont.replace(/:}/g,".gif' alt='{:1_1:}' width='24' height='24' />");
//			
			var html = '<div class="comment-item" id=\"' + num + '\">' + 
							'<div class="comment-cont">'+
								'<div class="comment-bar">'+
									'<span class="published-time">' + currentDate + '</span>'+
									'<span class="floor">[<em>' + num + '</em>楼]</span>' +
								'</div>'+
								'<p class="comment-content">'+ _cont +'</p>'+
								'<div class="comment-vote">'+
									'<a class="ok-btn" href="javascript:void(0)">赞(<span>0</span>)</a>'+
									'<a class="reply-btn" href="javascript:void(0)">回复</a>'+
								'</div>'+
							'</div>'+
						'</div>'
			
//			console.log($('#comment_content').val());
			//	提交ajax
			var data = { 
				url:window.location.href,
				num: num,
				currentDate:currentDate,
				cont:cont,
				ok:0,
			}
			
			if( cont.trim() == '' ){ 
				alert('请输入评论内容！')
			}else{
				$.ajax({
					url: '/test',
					type: 'post',
					data:data,
					dateType:'json',
					success:function(data){
						$('#comment_list').prepend(html);
						comment.val('');
						checkOk();
						replyMd();
						if( data.result ){
							$('.func-comment em').html( $('.comment-item').length );
							$('.comment-num').html( $('.comment-item').length );
						}
						console.log('返回结果: '+ data.result);
					},
					error:function(err){
						console.log('返回结果: '+err.result);
					}
				})
			}
			
		})
		
		
		//	点赞数
		checkOk();
		function checkOk(){
			$('.ok-btn').click(function(e){
				var floor_num = 0;
				var floor_len = parseInt($('.comment-item').length);
				var currTarget = e.target.parentNode.parentNode.parentNode;
				if( currTarget.className == 'comment-item'){
					floor_num =  $(currTarget).index();
				}else if(currTarget.className == 'comment-cont'){
					floor_num =  $(currTarget.parentNode).index();
				}
				//	当前楼层
				var rel_floor = floor_len - floor_num;
				var start = location.href.lastIndexOf('/');
				var end = location.href.lastIndexOf('.');
				var url_flag = location.href.substring(start+1, end);
				var currentPosi = $(this).find('span');
				var currentOk = parseInt( currentPosi.text() );
				if(isNaN(currentOk)){
					currentOk = 0;
				}
				currentOk ++;
	//			$(this).find('span').text(currentOk);
				var url = "/checkOk?url_flag=" + url_flag + "&floor=" + rel_floor + "&ok=" + currentOk;
				$.ajax({
					type:"get",
					url: url,
					data: '',
					dateType: 'json',
					success: function(data){
						currentPosi.text(currentOk);
						console.log('返回结果: '+ data.result);
					},
					error: function(error){
						console.log('返回结果: '+ error.result);
					}
				});
			})
		}


		//	回复
		replyMd();
		function replyMd(){
			$('.reply-btn').click(function(){
				$(comment).focus();
				var oldCommentRe = comment.val();
				var reply_floor = parseInt( $(this).parent().parent().find('.floor em').text() );
				var reply_md = '@' + reply_floor + '楼 ';
				if( oldCommentRe.indexOf( reply_md ) != '-1' ){
					return reply_md;
				}else{
					reply_md = oldCommentRe + reply_md;
				}
				comment.val(reply_md);
			})
		}
		
		//	正文部分点击评论
		$('.func-comment').click(function(){
			$(comment).focus();
		})

		
		//	时间格式化
		Date.prototype.format = function(date){
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
		    return YY + '-' + MM + '-' + DD +' '+ hh +':'+ mm + ':' + ss; 
		}
	})
},1000)

