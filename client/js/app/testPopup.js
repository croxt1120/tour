require([
    'config'
], function () {
	require([
	    'jquery',
	    'popup/tourList/TourListPopupView',
	    'popup/tourSave/TourSavePopupView'
	    ], function (
	        $,
	        TourListPopupView,
	        TourSavePopupView
	        ) {
	        	
	        	
	        	
	        	

				$('#btnSave').click(function(evt) {
					var tourSavePopupView = new TourSavePopupView();
					tourSavePopupView.open();
				});
				
				$('#btnLoad').click(function(evt) {
					var tourListPopupView = new TourListPopupView();
					tourListPopupView.open();
				});
	} );
} );