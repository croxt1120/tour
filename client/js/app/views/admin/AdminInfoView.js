define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'text!views/admin/tpls/adminInfoTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		adminInfoTpl
		) {

		    var AdminInfoView = View.extend({
		        initialize: function() {
		            this.render();
		        },
		        
		        render: function() {
		        	this.setElement(adminInfoTpl);

		            return this;
		        },
		        
		        events: {
		        },
		        
		        getData: function() {
		        	var data = {
		        		depositor: this.$('#depositor').val(),
		        		bankName: this.$('#bankName').val(),
		        		accountNumber: this.$('#accountNumber').val(),
		        		packagePrintMsg: this.$('#packagePrintMsg').val().replace(/\n/g, '<br>')
		        	}

				  return data;
		        },
		        
		        setData: function(data) {
		        	
		        }
		    });
		    
		    return AdminInfoView;
} );