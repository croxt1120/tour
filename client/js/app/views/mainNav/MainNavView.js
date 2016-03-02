define([
        'jquery',
        'underscore',
        'backbone',
        'text!views/mainNav/mainNavTpl.html'
], function ( 
		$,
		_,
		Backbone,
		mainNavTpl
		) {
		    
		    var MainNavView = Backbone.View.extend({
		        initialize: function() {
		        	this.setElement(this.el);
		            this.render();
		        },
		        
		        render: function() {
		            this.setElement(mainNavTpl);
		            return this;
		        },
		        
		        events: {
		            "click a": "_onClickMenu"
		        },
		        
		        _onClickMenu: function(evt) {
		        	 var hrefVal = this.$(evt.currentTarget).attr("href");
		            this.changeMenuActive(hrefVal);
		        },
		        
		        // 메뉴 상태 변경
		        changeMenuActive: function(hrefVal) {
		        	console.log(hrefVal);
		        	this.$('li').removeClass('active');
		        	this.$("a[href$='"+ hrefVal + "']").parent().addClass('active');
		        }
		        
		    });
		    return MainNavView;
} );