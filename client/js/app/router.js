define([
    'backbone',
    'jquery',
    'underscore',
    "common/TourData",
    "views/tour/TourView",
    'views/print/PrintView',
    'views/admin/AdminInfoView',
], function (
	Backbone,
	$,
	_,
	TourData,
	TourView,
	PrintView,
	AdminInfoView
) {
	var currentView = _.noop();
	var views = {
		tour : new TourView(),
		print : new PrintView(),
		admin : new AdminInfoView()
	};
	
	_.each(views, function(view){
		view.$el.hide();
	});
	
	var Router = Backbone.Router.extend({
		routes:{
			"" : "_onShowPackageTourView",
			"package-tour" : "_onShowPackageTourView",
			"print-package" : "_onShowPrintView", 
			"admin" : "_onShowAdmin",
	    },
	    _onShowPrintView : function(){
	    	this.changeView("print");
	    },
     	_onShowPackageTourView : function() {
     		this.changeView("tour");
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
     		
     		views[key].setData();
     	}
	});
		
	var router = new Router();
	Backbone.history.start();
	
	return router;
} );