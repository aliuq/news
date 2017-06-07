

setTimeout(function(){
	
	$(function(){
		
		if( $('.video iframe').attr('href') == undefined && $('.video h3 a').text() == '' ){
			$('.video').replaceWith('<div class="video"><p class="videoNo">视频暂无</p></div>')
		}
		
		$('.param a').not("[href^='#']").mouseover(function(){
			//https://www.baidu.com/s?wd=%E5%88%98
			if( $(this).eq(0).text().indexOf('进入官网>>') == -1 ){
				$(this).eq(0).attr({
					'href': 'https://www.baidu.com/s?wd=' + $(this).eq(0).text(),
					'target': '_blank'
				})
			}
//			console.log( $(this).eq(0).attr('href') )
		})
		
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
		
		//	点击时间价格
		$('.navbox ul li').click(function(){
			$(this).addClass('active');
//			$(this).find('a').attr('href','')
			$(this).siblings().removeClass('active');
		})
		
		//	左侧滚动
		$(document).scroll(function(){
			if( $('a[name="s-0"]').offset().top - $('a[name="s-0"]').scrollTop() > 50 ){
				$('.param-nav').hide();
			}
			if( $('a[name="s-0"]').offset() != undefined && $('a[name="s-0"]').offset().top - $('a[name="s-0"]').scrollTop() <= 50 && $('a[name="s-0"]').offset().top - $('a[name="s-0"]').scrollTop() >= '-' + $('a[name="s-0"]').next().height()){
				$('.param-nav').show();
				$('a[href="#s-0"]').parent().parent().addClass('active');
				$('a[href="#s-0"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-1"]').offset() != undefined && $('a[name="s-1"]').offset().top - $('a[name="s-1"]').scrollTop() >= '-' + $('a[name="s-0"]').next().height() &&  $('a[name="s-1"]').offset().top - $('a[name="s-1"]').scrollTop() <= 50){
				$('a[href="#s-1"]').parent().parent().addClass('active');
				$('a[href="#s-1"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-2"]').offset() != undefined && $('a[name="s-2"]').offset().top - $('a[name="s-2"]').scrollTop() <= 50 && $('a[name="s-2"]').offset().top - $('a[name="s-2"]').scrollTop() >= '-' + $('a[name="s-1"]').next().height() ){
				$('a[href="#s-2"]').parent().parent().addClass('active');
				$('a[href="#s-2"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-3"]').offset() != undefined && $('a[name="s-3"]').offset().top - $('a[name="s-3"]').scrollTop() <= 50 && $('a[name="s-3"]').offset().top - $('a[name="s-3"]').scrollTop() >= '-' + $('a[name="s-2"]').next().height() ){
				$('a[href="#s-3"]').parent().parent().addClass('active');
				$('a[href="#s-3"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-4"]').offset() != undefined && $('a[name="s-4"]').offset().top - $('a[name="s-4"]').scrollTop() <= 50 && $('a[name="s-4"]').offset().top - $('a[name="s-4"]').scrollTop() >= '-' + $('a[name="s-3"]').next().height() ){
				$('a[href="#s-4"]').parent().parent().addClass('active');
				$('a[href="#s-4"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-5"]').offset() != undefined && $('a[name="s-5"]').offset().top - $('a[name="s-5"]').scrollTop() <= 50 && $('a[name="s-5"]').offset().top - $('a[name="s-5"]').scrollTop() >= '-' + $('a[name="s-4"]').next().height() ){
				$('a[href="#s-5"]').parent().parent().addClass('active');
				$('a[href="#s-5"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-6"]').offset() != undefined && $('a[name="s-6"]').offset().top - $('a[name="s-6"]').scrollTop() <= 50 && $('a[name="s-6"]').offset().top - $('a[name="s-6"]').scrollTop() >= '-' + $('a[name="s-5"]').next().height() ){
				$('a[href="#s-6"]').parent().parent().addClass('active');
				$('a[href="#s-6"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-7"]').offset() != undefined && $('a[name="s-7"]').offset().top - $('a[name="s-7"]').scrollTop() <= 50 && $('a[name="s-7"]').offset().top - $('a[name="s-7"]').scrollTop() >= '-' + $('a[name="s-6"]').next().height() ){
				$('a[href="#s-7"]').parent().parent().addClass('active');
				$('a[href="#s-7"]').parent().parent().siblings().removeClass('active');
			}
			if( $('a[name="s-8"]').offset() != undefined && $('a[name="s-8"]').offset().top - $('a[name="s-8"]').scrollTop() <= 50 && $('a[name="s-8"]').offset().top - $('a[name="s-8"]').scrollTop() >= '-' + $('a[name="s-7"]').next().height() ){
				$('a[href="#s-8"]').parent().parent().addClass('active');
				$('a[href="#s-8"]').parent().parent().siblings().removeClass('active');
			}
			
		})
		
		$('#func li').hover(function(){
			$(this).find('.func-tips').show();
		},function(){
			$(this).find('.func-tips').hide();
		})
		
	})
	
}, 1000)