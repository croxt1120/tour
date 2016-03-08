define([
    'jquery',
    'backbone',
    'select2',
    'common/Utils',
    'datas/Events',
    'views/mainNav/MainNavView',
    'views/packageTour/PackageTourView',
    'views/print/PrintTourInfoView',
    'views/freeTour/FreeTourView',
    'views/print/PrintFreeInfoView',
    'views/print/PrintNoticeView',
    'views/codeManager/CodeManagerView',
    'views/admin/AdminInfoView',
    'popup/tourList/TourListPopupView',
	'popup/tourSave/TourSavePopupView'
    ], function (
        $,
        Backbone,
        select2,
        Utils,
        Events,
        MainNavView,
        PackageTourView,
        PrintTourInfoView,
        FreeTourView,
        PrintFreeInfoView,
        PrintNoticeView,
        CodeManagerView,
        AdminInfoView,
        TourListPopupView,
	    TourSavePopupView
        ) {
        	
        	var _start = function() {
				//////////////////////////////////////////
				var mainNavView = new MainNavView();
				$('#navBox').append(mainNavView.el);
	
				//////////////////////////////////////////
				var packageTourView = new PackageTourView();
				$('#viewBox').append(packageTourView.el);
	
				var printTourInfoView = new PrintTourInfoView();
				$('#viewBox').append(printTourInfoView.el);
				
				var freeTourView = new FreeTourView();
				$('#viewBox').append(freeTourView.el);
				
				var printFreeInfoView = new PrintFreeInfoView();
				$('#viewBox').append(printFreeInfoView.el);
				
				var printNoticeView = new PrintNoticeView();
				$('#viewBox').append(printNoticeView.el);
	
				var codeManagerView = new CodeManagerView();
				$('#viewBox').append(codeManagerView.el);
				
				var adminInfoView = new AdminInfoView();
				$('#viewBox').append(adminInfoView.el);
				
				
				///////////////////////////////////////
				var Router = Backbone.Router.extend({
					routes:{
						"" : "_onShowPackageTourView",
						"package-tour" : "_onShowPackageTourView",
				     	"print-package" : "_onShowPrintPackage",
				     	"print-package-notice" : "_onShowPrintPackageNotice",
				     	"free-tour" : "_onShowFreeTour",
				     	"print-free-tour" : "_onShowPrintFreeTour",
				     	"print-free-notice" : "_onShowPrintFreeNotice",
				     	"code-mgr" : "_onShowCodeManager",
						"admin" : "_onShowAdminView",
						"save" : "_onSaveTour",
						"load" : "_onLoadTour"
				    },
				    route: function(route, name, callback) {
			     		var router = this;
			     		if (!callback) callback = this[name];
			     		var f = function() {
			     			$('.sub-view').hide();
			     			console.log('route before', route);
			     			callback.apply(router, arguments);
			     			console.log('route after', route);
			     		};
			     			
			     		return Backbone.Router.prototype.route.call(this, route, name, f);
			     	},			     	
				     	
			     	_onShowPackageTourView:function() {
			     		packageTourView.$el.show();
			     	},
			     	
			     	_onShowPrintPackage:function() {
			     		var data = {
			     			packageInfo: packageTourView.getData(),
			     			adminInfo: adminInfoView.getData()
			     		};
			     		
			     		console.log(data);
			     		
			     		printTourInfoView.setData(data);
			     		printTourInfoView.$el.show();
			     	},
			     	
			     	_onShowPrintPackageNotice: function() {
			     		var data = packageTourView.getData();
			     		console.log(data);
			     		printNoticeView.setData(data);
			     		printNoticeView.$el.show();			     		
			     	},
			     	
			     	_onShowFreeTour: function() {
			     		freeTourView.$el.show();
			     	},
			     	
			     	_onShowPrintFreeTour: function() {
			     		var data = freeTourView.getData();
			     		console.log(data);
			     		printFreeInfoView.setData(data);
			     		printFreeInfoView.$el.show();
			     	},
			     	
			     	_onShowPrintFreeNotice: function() {
			     		var data = freeTourView.getData();
			     		console.log(data);
			     		printNoticeView.setData(data);
			     		printNoticeView.$el.show();
			     	},
			     	
			     	_onShowCodeManager: function() {
			     		codeManagerView.$el.show();
			     	},
			     	
			     	_onShowAdminView: function() {
			     		adminInfoView.$el.show();
			     	},
			     	
			     	_onSaveTour: function() {
			     		var tourSavePopupView = new TourSavePopupView();
			     		
			     		var freeTour = freeTourView.getData();
			     		var packageTour = packageTourView.getData();
			     		
			     		var saveData = {
			     			freeTour: freeTour,
			     			packageTour: packageTour
			     		};
			     		
			     		tourSavePopupView.open({saveData: saveData});
			     	},
			     	
			     	_onLoadTour: function() {
			     		var tourListPopupView = new TourListPopupView();
			     		tourListPopupView.on(Events.CLOSE_POPUP, function(tourInfo) {
			     			packageTourView.setData(tourInfo.packageTour);
			     			freeTourView.setData(tourInfo.freeTour);
			     		});				     		

			     		tourListPopupView.open();
			     	}
				});
				new Router();
				Backbone.history.start();
				mainNavView.changeMenuActive("#" + Backbone.history.fragment);
        	};
			
			
			return {
				start: _start
			};
} );