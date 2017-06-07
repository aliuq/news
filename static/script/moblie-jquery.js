4/*
 * 	手机页面 JQuery代码
 */
setTimeout(function(){
	
	$(function(){
		
		var vue = new Vue({
			el: '#Mobile',
			data:{
				limitNumS: 0,
				limitNumE: 45,
				filterlist: [],
				length: 0,
				noresult: '',
				pageNum: 1,
			},
			computed: {
				filter: function(){
					return this.filterlist.slice(this.limitNumS, this.limitNumE);
				}
			},
			methods:{
				prev: function(){
					if( this.limitNumS >= 45 ){
						this.pageNum--;
						this.limitNumS -= 45;
						this.limitNumE -= 45;
					}
					if( this.pageNum <= 1 ){
						$('.small-page-prev').css('backgroundPosition', '0 -46px')
					}
				},
				next: function(){
					if( this.limitNumE <= this.length ){
						$('.small-page-prev').css('backgroundPosition', '-26px -46px')
						this.pageNum++
						this.limitNumS += 45;
						this.limitNumE += 45;
					}
				},
			}
		})
		
		//	按下enter键
		
		
		// 搜索手机
		$('.searMo').click(searMobile);
		$('.searInp').keyup(function(e){
			if( e.keyCode == 13 ){
				searMobile();
			}
		})
		
		function searMobile(){
			$.ajax({
				type:"get",
				url:"/getSearMo?s=" + $('.search input').val(),
				data:'',
				dataType: 'json',
				success: function(d){
//					console.log(d.data)
					vue.pageNum = 1;
					if( d.data.length == 0 ){
						$('.no-result-box').show();
					}else{
						$('.no-result-box').hide();
					}
					vue.filterlist = d.data;
					vue.length = d.data.length;
					var reg = new RegExp('(.*)('+ $('.search input').val() +')(.*)')
					for(var i in d.data){
							vue.filterlist[i].name = vue.filterlist[i].name.replace( reg , '$1<span style="background-color:yellow">' + $('.search input').val() + '</span>$3')
							vue.filterlist[i].point = vue.filterlist[i].point.replace( reg , '$1<span style="background-color:yellow">' + $('.search input').val() + '</span>$3')
							vue.filterlist[i].network = vue.filterlist[i].network.replace( reg , '$1<span style="background-color:yellow">' + $('.search input').val() + '</span>$3')
							vue.filterlist[i].price = vue.filterlist[i].price.replace( reg , '$1<span style="background-color:yellow">' + $('.search input').val() + '</span>$3')
					}
				},
				error: function(err){
					console.log(err)
				}
			});
		}
		
		$.get('/ajax/mobile',function(d){
			vue.filterlist = d.data;
			vue.length = d.data.length;
		})
		//	点击时间价格
		$('.sort').children().click(function(){
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
		})
		
		
		var brand = 0;
		var price = 0;
		var size = 0;
		var net = 0;
		var ram = 0;
		var rom = 0;
		//	品牌
		$('.mo-brand-list').children().click(function(){
			brand = $(this).text();
			$(this).addClass('mo-active');
			$(this).siblings().removeClass('mo-active');
		})
		
		//	价格
		$('.mo-price-list').children().click(function(){
			price = $(this).text();
			$(this).addClass('mo-active');
			$(this).siblings().removeClass('mo-active');
		})
		
		//	主屏尺寸
		$('.mo-size-list').children().click(function(){
			size = $(this).text();
			$(this).addClass('mo-active');
			$(this).siblings().removeClass('mo-active');
		})
		
		//	网络
		$('.mo-net-list').children().click(function(){
			net = $(this).text();
			$(this).addClass('mo-active');
			$(this).siblings().removeClass('mo-active');
		})		
		//	RAM容量
		$('.mo-ram-list').children().click(function(){
			ram = $(this).text();
			$(this).addClass('mo-active');
			$(this).siblings().removeClass('mo-active');
		})
		
		//	ROM容量
		$('.mo-rom-list').children().click(function(){
			rom = $(this).text();
			$(this).addClass('mo-active');
			$(this).siblings().removeClass('mo-active');
		})
		
		$('.params').click(function(e){
			var e = e || window.event;
			if( e.target.nodeName.toLowerCase() == 'a' || e.target.nodeName.toLowerCase() == 'span' ){
				$.ajax({
					type:"get",
					url:"/ajax/mobile?brand=" + brand + "&price=" + price + "&size=" + size + "&net=" + net + "&ram=" + ram + "&rom=" + rom,
					data:'',
					dateType: 'json',
					success: function(d){
						vue.pageNum = 1;
						if( d.data.length == 0 ){
							$('.no-result-box').show();
						}else{
							$('.no-result-box').hide();
						}
						console.log( d );
						vue.filterlist = d.data;
						vue.length = d.data.length;
					},
					error: function(err){
						console.log( err );
					}
				});	
			}
		})
		
		
		//	热门排序
		$('.sort-hot').click(function(){
			vue.filterlist.sort(function(a,b){
				return a.id - b.id;
			})
		})
		
		//	时间排序
		$('.sort-time').click(function(){
			Sort( vue.filterlist );
//			console.log( vue.filterlist )
		})
		
		//	价格排序
		$('.sort-price').click(function(){
			if( $(this).find('i').hasClass('down') ){
				$(this).attr('title', '价格由低到高');
				$(this).find('i').removeClass('down');
				$(this).find('i').addClass('up');
				vue.filterlist.sort(function(a,b){
					if( a.price.toString().indexOf('万') != -1 ){
						a.price = parseInt( parseFloat(a.price) * 10000 );
					}
					if( b.price.toString().indexOf('万') != -1 ){
						b.price = parseInt( parseFloat(b.price) * 10000 );
					}
					return a.price - b.price;
				})
			}else{
				$(this).attr('title', '价格由高到低');
				$(this).find('i').removeClass('up');
				$(this).find('i').addClass('down');
				vue.filterlist.sort(function(a,b){
					if( a.price.toString().indexOf('万') != -1 ){
						a.price = parseInt( parseFloat(a.price) * 10000 );
					}
					if( b.price.toString().indexOf('万') != -1 ){
						b.price = parseInt( parseFloat(b.price) * 10000 );
					}
					return b.price - a.price;
				})
			}
		})
		
		function Sort(arr){
			return arr.sort(function(a, b){
				if( a.paramDate == null ) a.paramDate = '';
				if( b.paramDate == null ) b.paramDate = '';
				var aa = Date.parse(new Date(a.paramDate.replace(/(年|月)/g,'')));
				var bb = Date.parse(new Date(b.paramDate.replace(/(年|月)/g,'')));
//				return aa - bb;	//	从小到大 升序
				return bb - aa;	//	从大到小 降序
			});
		}
	})
	
}, 1000)
