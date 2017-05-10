define([
    'jquery',
    'bootstrap',
    'underscore',
    'backbone',
    'views/nav/save/SavePopupView',
    'views/nav/load/LoadPopupView',
    'text!views/nav/navTpl.html'
], function ( 
	$,
	bootstrap,
	_,
	Backbone,
	SavePopupView,
	LoadPopupView,
	mainNavTpl
) {
    var views = {
        save : new SavePopupView(),
		load : new LoadPopupView(),
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
                    case "load" :
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