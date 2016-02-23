require([
    'config'
], function () {
	require([
	    'jquery',
	    'select2',
	    'views/accommodation/AccommodationView'
	    ], function (
	        $,
	        select2,
	        AccommodationView
	        ) {

		var appView = new AccommodationView();
		$('#appBox').append(appView.el);
		
		$('#day').change(function(e) {
			appView.changeDay(this.value);
		});
		
		
		$('#loadBtn').click(function(evt) {
			var data = $('#dataArea').val();
			data = JSON.parse(data);
			appView.setData(data);
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