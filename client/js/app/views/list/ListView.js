define([
	'jquery',
	'underscore',
	'backbone',
	'common/TourData',
	'text!views/list/tpls/listTpl.html',
], function(
	$,
	_,
	Backbone,
	TourData,
	listTpl
) {
	var ListView = Backbone.View.extend({
		initialize: function() {
			this.timer = null;
			this.render();
		},
		render: function() {
			$("body").append(listTpl);
			this.setElement($("#listView"));
			return this;
		},
		events: {
			"click .btn-load": "_onClickLoad",
			"click .btn-remove": "_onClickRemove",
			"click .list-group-item": "_onClickItem",
			"keyup .search" : "_onChangeText"
		},
		setData : function(){
			var _this = this;
			// 데이터 리스트 조회 
			$.get('/tour', function(data) {
				var $group = _this.$('.list-group');
				$group.empty();

				if (data.isSuccess) {
					var list = data.list;
					_this.$('.count').text(list.length);
					
					// var string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
					// for(var i=0; i<50; i++){
					// 	var text = "";
					// 	for(var j=0; j<4; j++){
					// 		var index = Math.round(Math.random()*25);
					// 		var item= string.charAt(index);
					// 		text += item;
					// 	}
					// 	var tpl = '<a class="list-group-item">' + text + '</a>';
					// 	$group.append(tpl);
						
					// }
					_.each(list, function(item) {
						var tpl = '<a class="list-group-item">' + item + '</a>';
						
						$group.append(tpl);
					});
				}
				else {
					alert(data.msg);
				}

			}).fail(function(data) {
				alert('error');
			}).always(function(data) {});
		},
		_onClickItem: function(evt) {
			this.$('.list-group-item').removeClass('active');
			$(evt.target).addClass('active');
		},

		_onClickLoad: function() {
			var $selItem = this.$('.list-group .active');
			if ($selItem.length == 1) {

				var tourName = $selItem.text();
				var url = '/tour/' + tourName;
				$.get(url, function(data) {

					if (data.isSuccess) {
						alert('데이터를 조회 하였습니다.');
						TourData.setData(data.tourInfo);
						require(["router"], function(router){
							router.navigate('package-tour', { trigger: true });	
						});
					}
					else {
						alert('데이터 조회에 실패 했습니다. ' + data.msg);
					}

				}).fail(function(data) {
					alert("데이터 조회에 실패 했습니다.");
				}).always(function(data) {

				});
			}
			else {
				alert("데이터를 선택해주시기 바랍니다.");
			}
		},

		_onClickRemove: function() {
			var _this = this;
			if (confirm("선택한 데이터를 삭제하시겠습니까?")) {
				var $selItem = this.$('.list-group .active');
				if ($selItem.length == 1) {
					var tourName = $selItem.text();
					var url = '/tour/' + tourName;

					$.ajax({
						url: url,
						type: 'delete',
						success: function(data) {
							if (data.isSuccess) {
								alert('데이터가 삭제 되었습니다.');
								//$selItem.remove();
								_this.setData();
							}
							else {
								alert('데이터 삭제에 실패 했습니다. ' + data.msg);
							}
						}
					}).fail(function(data) {
						alert("데이터 삭제에 실패 했습니다.");
					}).always(function(data) {});

				}
				else {
					alert("데이터를 선택해주시기 바랍니다.");
				}
			}
		},
		_onChangeText : function(evt){
			var input = evt.currentTarget;
			var _this = this;
			clearTimeout(this.timer);
			this.timer = setTimeout(function(){
				var searchKey = $(input).val().toUpperCase();
				var items = _this.$('.list-group a');
				_.each(items, function(v, i){
					var text = $(v).text().toUpperCase();
					var search = text.search(searchKey);
					if(search > -1){
						$(v).show();
					}else{
						$(v).hide();
					}
				});
				_this.timer = null;
			}, 300);
		}
	});
	return ListView;
});