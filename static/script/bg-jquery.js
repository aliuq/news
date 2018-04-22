/*
 * 
 */
$(function(){
	//	新增
	$('.nav').hover(function(){
		$('.navlist').show();
	}, function(){
		$('.navlist').hide();
	})
	$('.admin_login strong').html( localStorage.getItem('admuser') ? localStorage.getItem('admuser') : '登录' );
	//	登录
	$('.admlogin').hover(function(){
		$('.navquit').show();
	}, function(){
		$('.navquit').hide();
	})
	
	if( $('.admin_login strong').html() == '登录' ){
		window.location.href = "/adminlogin";
	}
	// 退出
	$('.admquit').click(function(){
		if( $('.admin_login strong').html() != '登录' ){
			localStorage.removeItem('admuser');
			$('.admin_login strong').html( '登录' );
			window.location.href = "/adminlogin";
		}
	})
	//	新增新闻
	$('.adnews').click(function(){
		handAdd();
		var html = '<li class=\"active\"><span title=\"手动添加\">手动添加</span><i class="fa fa-close"></i></li>';
		if( $('.tabnav ul span').text().indexOf( '手动添加' ) == -1 ){
			$('.tabnav ul li').removeClass('active');
			$('.tabnav ul').append( html );
		}else{
			$('.tabnav ul li span[title="手动添加"]').parent().addClass('active');
			$('.tabnav ul li span[title="手动添加"]').parent().siblings().removeClass('active');
		}
	});
	
	//	新增用户
	$('.adus').click(function(){
		uslist();
		var html = '<li class=\"active\"><span title=\"用户列表\">用户列表</span><i class="fa fa-close"></i></li>';
		if( $('.tabnav ul span').text().indexOf( '用户列表' ) == -1 ){
			$('.tabnav ul li').removeClass('active');
			$('.tabnav ul').append( html );
		}else{
			$('.tabnav ul li span[title="用户列表"]').parent().addClass('active');
			$('.tabnav ul li span[title="用户列表"]').parent().siblings().removeClass('active');
		}
	});
	
	//	重置
	$('.reset').click(function(e){
		e.stopPropagation();
		$('.screen').animate({
			opacity: '0.3'
		}).show();
		$('.refre').animate({
			opacity: '1'
		}).show();
		$.ajax({
			type:"get",
			url:"/reset",
			data: '',
			dataType: 'json',
			success: function(d){
				console.log(d)
				if( d.msg == '1' ){
					$('.screen').animate({
						opacity: '0'
					}).hide();
					$('.refre').animate({
						opacity: '0'
					}).hide();
//					alert("重置成功！");
				}else{
					console.log( '重置失败');
				}
			},
			error : function(err){
				console.log( '重置失败----' + err);
			}
		});
	})
	
	//	左侧h3颜色变换
	$('.asideL h3').on('mouseover', function(){
		$(this).find('span').css('color','#148cf1');
	})
	$('.asideL h3').on('mouseout', function(){
		$(this).find('span').css('color','#333333');
	})
	
	//	点击左侧h3显示隐藏
	$('.menu h3').click(function(){
		if( $(this).next().css('display') == 'none' ){
			$(this).next().show();
			$(this).find('i:last-child').removeClass('fa-chevron-down').addClass('fa-chevron-up')
		}else{
			$(this).next().hide();
			$(this).find('i:last-child').removeClass('fa-chevron-up').addClass('fa-chevron-down');
		}
	})
	
	//	隐藏左侧
	$('.pngfix').click(function(){
		if( parseInt( $('.asideL').css('width') ) == 199 ){
			$('.asideL').animate({
				width: '0px',
			})
			$('.article-box').animate({
				left: '0px',
			})
			$('.asideL h3').hide();
			$('.asideL ul').hide();
			$('.dislpayArrow').animate({
				left: '0',
			})
		}else{
			$('.asideL').animate({
				width: '199px',
			})
			$('.article-box').animate({
				left: '199px',
			})
			$('.asideL h3').show();
			$('.dislpayArrow').animate({
				left: '200px',
			})
		}
	})
	
	//	添加tab
	$('.menu li').on('click', function(){
		var html = '<li class=\"active\"><span title=\"'+ $(this).text() +'\">'+ $(this).text() +'</span><i class="fa fa-close"></i></li>';
		if( $('.tabnav ul span').text().indexOf( $(this).text() ) == -1 ){
			$('.tabnav ul li').removeClass('active');
			$('.tabnav ul').append( html );
		}else{
			$('.tabnav ul li span[title='+$(this).text()+']').parent().addClass('active');
			$('.tabnav ul li span[title='+$(this).text()+']').parent().siblings().removeClass('active');
		}
	})
		
	//	链接添加
	$('.linkadd').click(function(){
		$('.screen').animate({
			opacity: '0.3'
		}).show();
		$('.linkaddUrl').animate({
			opacity: '1',
		}).show();
		$('.addurl').focus();
	})
	
	$('.addurl').keyup(function(e){
		if( e.keyCode == 27 ){
			closeLinkAdd();
		}else if( e.keyCode == 13 ){
			checkLink( $('.addurl').val() );
		}
	})
	
	$('.linkaddUrl i').click(closeLinkAdd);
	function closeLinkAdd(){
		$('.tabnav ul li span[title=链接添加]').parent().remove();
		$('.screen').animate({
			opacity: '0'
		}).hide();
		$('.linkaddUrl').animate({
			opacity: '0',
		}).hide();
	}
	
	$('.linkaddnew').click(function(){
		checkLink( $('.addurl').val() );
	})
	function linkaddnew(){
		var url = $('.addurl').val().trim().match(/(http:\/\/news.zol.com.cn\/)(.*?)(.html)/g)[0];
		$.ajax({
			type:"post",
			url:"/addnew",
			data:{
				url: url,
			},
			success: function(d){
				if( d.result == 1 ){
					alert('添加成功');
					$('.addurl').val('');
				}else{
					console.log( d );
					alert('添加失败');
				}
			},
			error: function(err){
				console.log(err);
				alert('添加失败');
			}
		});
	}
	
	function checkLink(url){
		var addUrl = $('.addurl').val();
		if( addUrl.trim() == '' ){
			alert("链接不能为空！");
			$('.addurl').focus();
		}else if( addUrl.trim().match(/(http:\/\/news.zol.com.cn\/)(.*?)(.html)/g) == null ){
			alert("链接格式错误，请重新输入！");
			$('.addurl').focus();
		}else{
			$.ajax({
				type:"post",
				url:"/checkLink",
				data: {
					url: url,
				},
				dataType: 'json',
				success: function(d){
					if( d.msg == 0 ){
						alert(d.data);
					}else if( d.msg == 1 ){
						linkaddnew();
					}else if( d.msg == 2 ){
						console.log( d.data );
					}
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	}
	
	//	手动添加
	$('.handadd').click(handAdd);
	function handAdd(){
		var html = '<div class="show_iframe" name="手动添加"><iframe scrolling="yes" frameborder="0" src="/handAdd"></iframe></div>'
		$('.show_iframe').hide();
		if( $('.iframe_box .show_iframe[name=手动添加]').length == 0 ){
			$('.iframe_box').append(html);
		}else{
			$('.iframe_box .show_iframe[name=手动添加]').show();
		}
	}
	
	//	用户列表
	$('.userlist').click(uslist);
	function uslist(){
		var html = '<div class="show_iframe" name="用户列表"><iframe scrolling="yes" frameborder="0" src="/userlist"></iframe></div>';
		$('.show_iframe').hide();
		if( $('.iframe_box .show_iframe[name=用户列表]').length == 0 ){
			$('.iframe_box').append(html);
		}else{
			$('.iframe_box .show_iframe[name=用户列表]').show();
		}
	}
	
	//	咨讯列表
	$('.newlist').click(function(){
		var html = '<div class="show_iframe" name="咨讯列表"><iframe scrolling="yes" frameborder="0" src="/newslist"></iframe></div>';
		$('.show_iframe').hide();
		if( $('.iframe_box .show_iframe[name=咨讯列表]').length == 0 ){
			$('.iframe_box').append(html);
		}else{
			$('.iframe_box .show_iframe[name=咨讯列表]').show();
		}
	})
	
	//	iframe切换
	//	选中tab 删除tab
	$('.tabnav ul').on('click', function(e){
		var index = $(e.target);
		if(e.target.nodeName.toLowerCase() == 'li'){
			$(index).addClass('active');
			$(index).siblings().removeClass('active');
			$('.show_iframe[name='+$(index).text()+']').show();
			$('.show_iframe[name='+$(index).text()+']').siblings().hide();
		}else if( e.target.nodeName.toLowerCase() == 'span' ){
			$(index).parent().addClass('active');
			$(index).parent().siblings().removeClass('active');
			$('.show_iframe[name='+$(index).parent().text()+']').show();
			$('.show_iframe[name='+$(index).parent().text()+']').siblings().hide();
		}else if( e.target.nodeName.toLowerCase() == 'i' ){
			$(index).parent().remove();
			$('.show_iframe[name='+$(index).parent().text()+']').remove();
		}
	})
	
//	$('.iframe_box iframe').
//	console.log( $('.handaddnew') )
})
