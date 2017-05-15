define([
    'backbone',
    'jquery',
    'underscore',
    "common/TourData",
    "views/tour/TourView",
    "views/list/ListView",
    'views/print/PrintView',
    'views/admin/AdminInfoView',
], function (
	Backbone,
	$,
	_,
	TourData,
	TourView,
	ListView,
	PrintView,
	AdminInfoView
) {
	var currentView = _.noop();
	var views = {
		"package-tour" : new TourView(),
		"list" : new ListView(),
		"print-package" : new PrintView(),
		admin : new AdminInfoView()
	};
	
	_.each(views, function(view){
		view.$el.hide();
	});
	
	var Router = Backbone.Router.extend({
		routes:{
			"" : "_onShowPackageTourView",
			"package-tour" : "_onShowPackageTourView",
			"list" :  "_onShowListView",
			"print-package" : "_onShowPrintView", 
			"admin" : "_onShowAdmin",
	    },
	    _onShowPrintView : function(){
	    	this.changeView("print-package");
	    },
	    _onShowListView : function(){
	    	this.changeView("list");
	    },
     	_onShowPackageTourView : function() {
     		this.changeView("package-tour");
     	},
     	_onShowAdmin : function(){
     		this.changeView("admin");	
     	},
     	
     	_loadData : function(){
     		views.print.setData();
     		views.tour.setData();
     	},
     	
     	changeView : function(key){
     		if(!_.isUndefined(currentView)){
     			currentView.$el.hide();
     		}
     		
     		currentView = views[key];
     		views[key].$el.show();
     		
     		try{
     			views[key].setData();
     		}catch(e){
     			console.log(e);
     		}
     		var li = $('a[href="#'+key+'"]').parents("li").eq(0);
     		li.siblings("li").removeClass("active");
     		li.addClass("active");
     	}
	});
		
	var router = new Router();
	Backbone.history.start();
	
	return router;
} );