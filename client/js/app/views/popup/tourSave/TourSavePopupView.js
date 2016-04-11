define([
        'jquery',
        'underscore',
        'bootstrap',
        'backbone',
        'custom/View',
        'text!popup/tourSave/tpls/tourSaveTpl.html'
], function ( 
		$,
		_,
		bootstrap,
		Backbone,
		View,
		tourSaveTpl
		) {

		    var TourSavePopupView = View.extend({
		        initialize: function() {
		            this.render();
		            this._saveData = {};
		        },
		        
		        render: function() {
		        	this.$el.html(tourSaveTpl);
		        	//this.setElement(tourSaveTpl);

		            return this;
		        },
		        
		        open: function(data) {
		        	this._saveData = data.saveData;
		        	
		        	var _this = this;
		        	$('body').append(this.el);
		        	this.$('#tourSavePopup').modal({backdrop: 'static', keyboard: false});
		        	this.$('#tourSavePopup').on('hidden.bs.modal', function(evt) {
		        		_this._close();
		        	});
		        },
		        
		        // 팝업창 보이지 않게
		        close: function() {
		        	this.$('#tourSavePopup').modal('hide');
		        },
		        
		        // 팝업창이 화면상에 보여지지 않은 후 발생 이벤트 
		        _close: function() {
		        	this.$('#tourSavePopup').data( 'bs.modal', null );
	        		this.destroy();
		        },
		        
		        events: {
		        	"click .btn-save": "_onClickSave"
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
	        				_this.close();
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
		        }
		    });
		    
		    return TourSavePopupView;
} );