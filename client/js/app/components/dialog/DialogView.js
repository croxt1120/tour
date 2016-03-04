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

		    var DialogView = View.extend({
		        initialize: function() {
		            this.render();
		        },
		        
		        render: function() {
		        	this.setElement(tourSaveTpl);

		            return this;
		        },
		        
		        open: function() {
		        	$('body').append(this.el);
		        	$('#tourSavePopup').modal({backdrop: 'static', keyboard: false});
		        },
		        
		        events: {
		        	"click .btn-save": "_onClickSave"
		        },
		        
		        _onClickSave: function(evt) {
		        	var tourName = this.$('#tourName').val();
		        	var url = '/tour/' + tourName;
		        	var data = {};
		        	data['saveData'] = JSON.stringify( {'freeTour': '2232323'} );
		        	
	        		$.post(url, data, function(res){
	        			if(res.isSuccess) {
	        				alert('성공');
		      			} else {
		      					alert('데이터 저장에 실패 했습니다.');
		      			}
	        			
	        		}).fail(function(res) {
	        			alert('데이터 저장에 실패 했습니다.');
	        		}).always(function(res) {
	        			
	        		});
		        	
		        }
		    });
		    
		    return DialogView;
} );