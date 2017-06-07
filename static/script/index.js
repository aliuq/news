//setTimeout(function(){

	$(function(){
		var vue = new Vue({
			el: '#app',
			data:{
				limitNum:10,
				items: '',
				topics: [],
				hottopics: [],
			},
			computed:{
				filterTopic: function(){
					return this.topics.slice(0, this.limitNum);
				}
			},
			methods: {
				getMore: function(){
					this.limitNum += 10;
				}
			},
			watch:{
				
			}
		})

		getTopics();
		function getTopics(){
			$.get('/ajax/topics',function(d){
				if(d.msg == 1){
					var da = d.data;
					vue.items = da;
					for(var i in da){
						if(da[i].s == 'hot'){
							vue.hottopics.push(da[i]);
						}
						if(da[i].t == 'common'){
							vue.topics.push(da[i]);
						}
					}
				}
			},'json');
		}
		
		
		$('.searNews').click(searchNew);
		$('.searInp').keyup(function(e){
			if( e.keyCode == 13 ){
				searchNew();
			}
		})
		
		function searchNew(){
			$.ajax({
				type:"get",
				url:"/getSearNews?s=" + $('.search input').val(),
				data: '',
				dataType: 'json',
				success: function(d){
					if(d.msg == 1){
						vue.topics.splice(0,vue.topics.length);
						vue.items = d.data;
						var reg = new RegExp('(.*)('+ $('.search input').val() +')(.*)')
						for(var i in d.data){
							if(d.data[i].t == 'common'){
								vue.topics.push(d.data[i]);
								vue.topics[i].title = vue.topics[i].title.replace( reg , '$1<span style="background-color:yellow">' + $('.search input').val() + '</span>$3')
							}
						}
						if( d.data.length == 0 ){
							alert("暂未搜索到，请换个关键词吧！");
							getTopics();
						}
					}
				},
				error: function(err){
					console.log( err );
				}
			});
		}
	
	})
//}, 1000)