define([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone',
    'views/nav/save/SavePopupView',
    'text!views/nav/navTpl.html'
], function ( 
	$,
	bootstrap,
	_,
	Backbone,
	SavePopupView,
	mainNavTpl
) {
    var views = {
        save : new SavePopupView(),
    };
    
    var NavView = Backbone.View.extend({
        initialize: function() {
        	this.setElement($("#navBox"));
            this.render();
        },
        
        render: function() {
        	this.$el.append(mainNavTpl);
        	this.$('.dropdown-toggle').dropdown();
            return this;
        },
        
        events: {
            "click .nav  li > a": "_onClickMenu"
        },
        
        _onClickMenu: function(evt) {
            if($(event.target).parents('.dropdown-menu').length > 0){
                var name = $(event.target).attr("name");
                switch(name){
                    case "new" :
                        window.location.href='/';
                        break;
                    case "save" :
                        views[name].open();	
                        break;
                }
            } else {
        	    this.$("li").removeClass("active");
        	    $(evt.target).parents("li").addClass("active");
            }
        },
    });
    return new NavView();
} );