require([
    'config'
], function () {
	require([
	    'jquery',
	    'datas/Events',
	    'views/packageTour/baseInfo/BaseInfoView',
	    'popup/tourList/TourListPopupView',
	    'popup/tourSave/TourSavePopupView'
	    ], function (
	        $,
	        Events,
	        PackageInfoView,
	        TourListPopupView,
	        TourSavePopupView
	        ) {

		var baseInfoView = new PackageInfoView();
		$('#baseInfoBox').append(baseInfoView.el);
		
		$('#loadBtn').click(function(evt) {

			var tourListPopupView = new TourListPopupView();
			// 기타 요금 변경
			tourListPopupView.on(Events.CLOSE_POPUP, function(tourInfo) {
				console.log('close_popup');
				console.log(tourInfo.packageTour.baseInfo);
				baseInfoView.setData(tourInfo.packageTour.baseInfo);
			});				
			
			tourListPopupView.open();
			
		});
		
		$('#saveBtn').click(function(evt) {
			var a = {aa: 1};
			//var data = JSON.stringify( flexRowView.getData() );
			var data = JSON.stringify( baseInfoView.getData() );
			$('#dataArea').val(data);
		});

		$('#destroyBtn').click(function(evt) {
			baseInfoView.destroy();
		});		
	} );
} );