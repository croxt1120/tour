require([
    'config'
], function () {
	require([
	    'jquery',
	    'views/tour/TourView'
	    ], function (
	        $,
	        TourView
	        ) {
	        	
	        	var appView = new TourView();
				$('#appBox').append(appView.el);
		
				$('#loadBtn').click(function(evt) {
					var data = $('#dataArea').val();
					data = JSON.parse(data);
					//flexRowView.setData(data);
					appView.setData(data);
				});
				
				$('#saveBtn').click(function(evt) {
					var data = JSON.stringify( appView.getData() );
					$('#dataArea').val(data);
				});
		
				$('#destroyBtn').click(function(evt) {
					appView.destroy();
				});		
	} );
} );