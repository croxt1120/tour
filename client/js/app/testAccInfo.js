require([
    'config'
], function () {
	require([
	    'jquery',
	    'select2',
	    'datas/Events',
	    'datas/Tour',
	    'components/accommodation/AccommodationView',
	    'popup/tourList/TourListPopupView',
	    'popup/tourSave/TourSavePopupView'
	    ], function (
	        $,
	        select2,
	        Events,
	        Tour,
	        AccommodationView,
	        TourListPopupView,
	        TourSavePopupView
	        ) {



				var appView;
				/////////////////////////////
				Tour.loadCode().then(function() {
					
					appView= new AccommodationView();
					$('#appBox').append(appView.el);
					
					$('#day').change(function(e) {
						appView.changeDay(this.value);
					});					

				}).fail(function() {
					alert('데이터 조회에 실패했습니다.');
				});



		
		

		
		
			$('#loadBtn').click(function(evt) {

			var tourListPopupView = new TourListPopupView();
			// 기타 요금 변경
			tourListPopupView.on(Events.CLOSE_POPUP, function(tourInfo) {
				console.log('close_popup');
				console.log(tourInfo.packageTour.accInfos);
				appView.setData(tourInfo.packageTour.accInfos);
			});				
			
			tourListPopupView.open();
			
		});
		
		$('#saveBtn').click(function(evt) {
			var a = {aa: 1};
			//var data = JSON.stringify( flexRowView.getData() );
			var data = JSON.stringify( appView.getData() );
			$('#dataArea').val(data);
		});

		$('#destroyBtn').click(function(evt) {
			appView.destroy();
		});	
	} );
} );