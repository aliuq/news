/*
 * 	详情页js代码
 */

//setTimeout(function(){
	$(function(){
		
		//	右侧边栏移入移出效果
		$('.toolbar li').hover(function(){
			$(this).addClass('hover');
		}, function(){
			$(this).removeClass('hover');
		})
		
		//	网友评论
		$('.toolbar-comment').click(function(){
			$('#comment_content').focus();
		})
		
		//	回到顶部
		 $(".toolbar-top").click(function(){
		   	var sc=$(window).scrollTop();
		   	$('body,html').animate({scrollTop:0},500);
		})
		 
		//	表情打开关闭
		$('.faces-btn').click(function(){	
			$('.face-main-box').show();
		})
		$('.faces-close').click(function(){
			$('.face-main-box').hide();
		})
		
//		//	点击表情 
//		$('#face-img').click(function(e){
//			var txt_comment = $('#comment_content');
//			var txt_comment_html = txt_comment.val();
//			if( e.target && e.target.nodeName == 'IMG' ){
//				$('.face-main-box').hide();
//				var txt_alt = e.target.alt;
//				txt_comment_html += txt_alt;
//				txt_comment.val(txt_comment_html);
//			}
//		})

				
		//	验证码
		$.extend({
			identifyCode: identifyCode,
		})
		function identifyCode(obj){
			// 验证码组成库
		   	var arrays=new Array( 
		       '1','2','3','4','5','6','7','8','9','0',
		       'a','b','c','d','e','f','g','h','i','j', 
		       'k','l','m','n','o','p','q','r','s','t', 
		       'u','v','w','x','y','z', 
		       'A','B','C','D','E','F','G','H','I','J', 
		       'K','L','M','N','O','P','Q','R','S','T', 
		       'U','V','W','X','Y','Z'        
	       	); 
		    codes='';// 重新初始化验证码
		    for(var i = 0; i<4; i++){
			   	// 随机获取一个数组的下标
			   	var r = parseInt(Math.random()*arrays.length);
			   	codes += arrays[r];
			}
		    // 验证码添加到input里
//		    	return codes;
			obj.val(codes) || obj.html(codes);
		}
		
	})
//},1000)

