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
				var packageTourView = new PackageTourView();
				packageTourView.$el.show();
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

				//////////////////////////////////////////
				var mainNavView = new MainNavView();
	     		mainNavView.on(Events.CLICK_DROP_DOWN_MENU, function(menu) {
	     			switch (menu) {
	     				case 'new':
	     					window.location.href='/';
	     					break;
	     				case 'save':
	     					_onSaveTour();
	     					break;
	     				case 'load':
	     					_onLoadTour();
	     					break;
	     				default:
	     					// code
	     			}
	     		});				
				
				$('#navBox').append(mainNavView.el);
				
				
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
						"admin" : "_onShowAdminView"
				    },
				    route: function(route, name, callback) {
			     		var router = this;
			     		if (!callback) callback = this[name];
			     		var f = function() {
			     			
			     			console.log('route before', route);
			     			// if (route !== 'save' && route !== 'load'){
			     			if (route !== ''){
			     				$('.sub-view').hide();
			     				callback.apply(router, arguments);
			     				console.log('route after', route);
			     			}
			     			
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
			     	// 	var w = 900;
			     	// 	var h = 1000;
			     	// 	var top = 10;
			     	// 	var left = 10;
			     	// 	var popup = null;
			     		
			     	// 	window['printTourData'] = printTourInfoView.$el.find('.content').html();
			     	// 	popup = window.open("package_popup.html", "", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
					    // popup.focus();
					    
					    
					    // $(popup).load(function() {
					    // 	var html = printTourInfoView.$el.html();
					    //     popup.appendHTML(html);
					    // })

					    
					    // popup.onbeforeunload  = function(){

					    // };
						
			     		
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
			     		//var data = freeTourView.getData();

			     		var data = {
			     			freeInfo: freeTourView.getData(),
			     			adminInfo: adminInfoView.getData()
			     		};			     		
			     		
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
			     	
			     	// _onSaveTour: function() {
			     	// 	var tourSavePopupView = new TourSavePopupView();
			     		
			     	// 	var freeTour = freeTourView.getData();
			     	// 	var packageTour = packageTourView.getData();
			     		
			     	// 	var saveData = {
			     	// 		freeTour: freeTour,
			     	// 		packageTour: packageTour
			     	// 	};
			     		
			     	// 	tourSavePopupView.open({saveData: saveData});
			     	// },
			     	
			     	// _onLoadTour: function() {
			     	// 	var tourListPopupView = new TourListPopupView();
			     	// 	tourListPopupView.on(Events.CLOSE_POPUP, function(tourInfo) {
			     	// 		packageTourView.setData(tourInfo.packageTour);
			     	// 		freeTourView.setData(tourInfo.freeTour);
			     	// 	});
			     		
			     	// 	var freeTour = freeTourView.getData();
			     	// 	var packageTour = packageTourView.getData();
			     	// 	var saveData = {
			     	// 		freeTour: freeTour,
			     	// 		packageTour: packageTour
			     	// 	};


			     	// 	tourListPopupView.open({saveData: saveData});
			     	// }
				});
				var router = new Router();
				Backbone.history.start();
				var dUrl = "";
				
				// 화면 초기 셋팅
				if (Backbone.history.fragment !== '') {
					dUrl = Backbone.history.fragment;
				} else {
					dUrl="package-tour";
					$('.sub-view').hide();
					packageTourView.$el.show();
				}
				mainNavView.changeMenuActive("#" + dUrl);
				
			    function _onSaveTour() {
		     		var tourSavePopupView = new TourSavePopupView();
		     		
		     		var freeTour = freeTourView.getData();
		     		var packageTour = packageTourView.getData();
		     		
		     		var saveData = {
		     			freeTour: freeTour,
		     			packageTour: packageTour
		     		};
		     		
		     		tourSavePopupView.open({saveData: saveData});
			    }				
				
				function _onLoadTour() {
		     		var tourListPopupView = new TourListPopupView();
		     		tourListPopupView.on(Events.CLOSE_POPUP, function(tourInfo) {
		     			packageTourView.setData(tourInfo.packageTour);
		     			freeTourView.setData(tourInfo.freeTour);
		     			
		     			// 데이터 로드 후 패키지 여행 선택
						router.navigate('package-tour', { trigger: true });
						mainNavView.changeMenuActive("#package-tour");
		     		});
		     		
		     		var freeTour = freeTourView.getData();
		     		var packageTour = packageTourView.getData();
		     		var saveData = {
		     			freeTour: freeTour,
		     			packageTour: packageTour
		     		};
	
	
		     		tourListPopupView.open({saveData: saveData});				
				}
			
        	};
			
			return {
				start: _start
			};
} );