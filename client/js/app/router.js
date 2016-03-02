define([
    'jquery',
    'backbone',
    'select2',
    'common/Utils',
    'datas/Tour',
    'views/mainNav/MainNavView',
    'views/packageTour/PackageTourView',
    'views/print/PrintTourInfoView',
    'views/freeTour/FreeTourView',
    'views/print/PrintFreeInfoView',
    'views/print/PrintNoticeView',
    'views/codeManager/CodeManagerView'
    ], function (
        $,
        Backbone,
        select2,
        Utils,
        Tour,
        MainNavView,
        PackageTourView,
        PrintTourInfoView,
        FreeTourView,
        PrintFreeInfoView,
        PrintNoticeView,
        CodeManagerView
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
				
				///////////////////////////////////////
				var Router = Backbone.Router.extend({
					routes:{
						"":"onShowPackageTourView",
				     	"print-package": "onShowPrintPackage",
				     	"print-package-notice": "onShowPrintPackageNotice",
				     	"free-tour": "onShowFreeTour",
				     	"print-free-tour": "onShowPrintFreeTour",
				     	"print-free-notice": "onShowPrintFreeNotice",
				     	"code-mgr": "onShowCodeManager"
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
				     	
			     	onShowPackageTourView:function() {
			     		packageTourView.$el.show();
			     	},
			     	
			     	onShowPrintPackage:function() {
			     		var data = packageTourView.getData();
			     		console.log(data);
			     		printTourInfoView.setData(data);
			     		printTourInfoView.$el.show();
			     	},
			     	
			     	onShowPrintPackageNotice: function() {
			     		var data = packageTourView.getData();
			     		console.log(data);
			     		printNoticeView.setData(data);
			     		printNoticeView.$el.show();			     		
			     	},
			     	
			     	onShowFreeTour: function() {
			     		freeTourView.$el.show();
			     	},
			     	
			     	onShowPrintFreeTour: function() {
			     		var data = freeTourView.getData();
			     		console.log(data);
			     		printFreeInfoView.setData(data);
			     		printFreeInfoView.$el.show();
			     	},
			     	
			     	onShowPrintFreeNotice: function() {
			     		var data = freeTourView.getData();
			     		console.log(data);
			     		printNoticeView.setData(data);
			     		printNoticeView.$el.show();
			     	},
			     	
			     	onShowCodeManager: function() {
			     		codeManagerView.$el.show();
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