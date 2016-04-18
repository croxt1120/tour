define([
        'jquery',
        'underscore',
        'backbone',
        'datas/Events',
        'text!views/mainNav/mainNavTpl.html'
], function ( 
		$,
		_,
		Backbone,
		Events,
		mainNavTpl
		) {
		    
		    var MainNavView = Backbone.View.extend({
		        initialize: function() {
		        	this.setElement(this.el);
		            this.render();
		            
		            this.$('li').removeClass('active');
		            this.$('.dropdown-toggle').dropdown();
		        },
		        
		        render: function() {
		            this.setElement(mainNavTpl);
		            return this;
		        },
		        
		        events: {
		            "click a": "_onClickMenu"
		        },
		        
		        _onClickMenu: function(evt) {
		        	 var dataKey = this.$(evt.currentTarget).data('menu');
		        	 if (!_.isUndefined(dataKey)) {
		        	 	console.log(dataKey);
		        	 	this.trigger(Events.CLICK_DROP_DOWN_MENU, dataKey);
		        	 } else {
		        	 	var hrefVal = this.$(evt.currentTarget).attr("href");
		        	 	this.changeMenuActive(hrefVal);
		        	 }
		        },
		        
		        // 메뉴 상태 변경
		        changeMenuActive: function(hrefVal) {
		        	this.$('li').removeClass('active');
		        	this.$("a[href$='"+ hrefVal + "']").parent().addClass('active');
		        }
		        
		    });
		    return MainNavView;
} );