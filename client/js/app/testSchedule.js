require([
    'config'
], function () {
	require([
	    'jquery',
	    'select2',
	    'views/schedule/ScheduleView'
	    ], function (
	        $,
	        select2,
	        ScheduleView
	        ) {

	        	var appView = new ScheduleView();
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
					var data = JSON.stringify( appView.getData() );
					$('#dataArea').val(data);
				});
		
				$('#destroyBtn').click(function(evt) {
					appView.destroy();
				});		
	} );
} );