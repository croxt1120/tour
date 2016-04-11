define([
        'jquery',
        'underscore',
        'bootstrap',
        'backbone',
        'datas/Events',
        'custom/View',
        'text!popup/tourList/tpls/tourListPopupTpl.html'
], function ( 
		$,
		_,
		bootstrap,
		Backbone,
		Events,
		View,
		tourListPopupTpl
		) {

		    var TourListPopupView = View.extend({
		        initialize: function() {
		            this.render();
		            this._saveData = {};
		        },
		        
		        render: function() {
		        	this.$el.html(tourListPopupTpl);
		            return this;
		        },
		        
		        events: {
		        	"click .btn-load": "_onClickLoad",
		        	"click .btn-save": "_onClickSave",
		        	"click .btn-remove": "_onClickRemove",
		        	"click .list-group-item": "_onClickItem"
		        },
		        
		        open: function(data) {
		        	var _this = this;
		        	
		        	// 데이터 저장
		        	this._saveData = data.saveData;		        	
		        	
		        	// 다이얼로그 이벤트 및 초기화
		        	$('body').append(this.el);
		        	this.$('#tourListPopup').modal({backdrop: 'static', keyboard: false});
		        	this.$('#tourListPopup').on('hidden.bs.modal', function(evt) {
		        		_this._close();
		        	});
		        	
		        	// 데이터 조회
		        	this._reqLoad();
		        },
		        
		        // 팝업창 보이지 않게 1
		        close: function(tourInfo) {
		        	this.trigger(Events.CLOSE_POPUP, tourInfo);
		        	this.$('#tourListPopup').modal('hide');
		        },
		        
		        // 팝업창이 화면상에 보여지지 않은 후 발생 이벤트 2
		        _close: function() {
		        	this.$('#tourListPopup').data( 'bs.modal', null );
	        		this.destroy();
		        },
		        
		        _onClickSave: function() {
		        	this._reqSave(false);
		        },
		        
		        _reqSave:function(isOverWrite) {
		        	var _this = this;
		        	var tourName = this.$('#tourName').val();
		        	var url = '/tour/' + tourName;
		        	var data = {};
		        	data['saveData'] = JSON.stringify( this._saveData );
		        	data['isOverWrite'] = isOverWrite;
		        	
	        		$.post(url, data, function(res){
	        			if(res.isSuccess) {
	        				alert('데이터를 저장하였습니다.');
	        				_this._reqLoad();
	        				//_this.close();
		      			} else {
		      				if (res.isExisted) {
		      					if ( confirm("같은 이름의 데이터가 존재합니다. \n 덮어 쓰시겠습니까?") ) {
		      						_this._reqSave(true);
		      					}
		      				} else {
		      					alert('데이터 저장에 실패 했습니다.');
		      				}
		      			}
	        			
	        		}).fail(function(res) {
	        			alert('데이터 저장에 실패 했습니다.');
	        		}).always(function(res) {
	        		});		        	
		        },
		        
		        _reqLoad: function() {
		        	var _this = this;
		        	// 데이터 리스트 조회 
		        	$.get('/tour', function(data) {
		        		var $group =  _this.$('.list-group');
		        		$group.empty();
		        		
		        		if (data.isSuccess) {
		        			var list = data.list;
		        			_this.$('.count').text(list.length);
		        			_.each(list, function(item) {
		        				var tpl = '<a class="list-group-item">' + item + '</a>';
		        				$group.append(tpl);
		        			});
		        		} else {
		        			alert(data.msg);
		        		}
		        		
		        	}).fail(function(data) {
		        		alert('error');
		        	}).always(function(data) {
		        	});
		        },
		        
		        _onClickItem: function(evt) {
		        	this.$('.list-group-item').removeClass('active');
		        	$(evt.target).addClass('active');
		        },
		        
		        _onClickLoad: function() {
		        	var _this = this;
		        	var $selItem = this.$('.list-group .active');
		        	if ($selItem.length == 1) {
		        		
		        		var tourName = $selItem.text();
		        		var url = '/tour/' + tourName;
		        		$.get(url, function(data){
		        			
		        			if (data.isSuccess) {
		        				alert('데이터를 조회 하였습니다.');
		        				_this.close(data.tourInfo);
		        			} else {
		        				alert('데이터 조회에 실패 했습니다. ' + data.msg);
		        			}
		        			
		        		}).fail(function(data) {
		        			alert("데이터 조회에 실패 했습니다.");
		        		}).always(function(data) {
		        			
		        		});
		        	} else {
		        		alert("데이터를 선택해주시기 바랍니다.");
		        	}
		        },
		        
		        _onClickRemove: function() {
		        	var $selItem = this.$('.list-group .active');
		        	if ($selItem.length == 1) {
		        		var tourName = $selItem.text();
		        		var url = '/tour/' + tourName;

						$.ajax({
						   url: url,
						   type: 'delete',
						   success: function(data) {
			        			if (data.isSuccess) {
			        				$selItem.remove();
			        				alert('데이터가 삭제 되었습니다.');
			        			} else {
			        				alert('데이터 삭제에 실패 했습니다. ' + data.msg);
			        			}						     
						   }
						}).fail(function(data) {
		        			alert("데이터 삭제에 실패 했습니다.");
		        		}).always(function(data) {
		        		});
		        		
		        	} else {
		        		alert("데이터를 선택해주시기 바랍니다.");
		        	}
		        }
		    });
		    
		    return TourListPopupView;
} );