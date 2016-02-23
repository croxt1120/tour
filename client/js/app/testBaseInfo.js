require([
    'config'
], function () {
	require([
	    'jquery',
	    'views/baseInfo/BaseInfoView'
	    ], function (
	        $,
	        PackageInfoView
	        ) {

		var baseInfoView = new PackageInfoView();
		$('#baseInfoBox').append(baseInfoView.el);
		
		$('#loadBtn').click(function(evt) {
			var data = $('#dataArea').val();
			data = JSON.parse(data);
			//flexRowView.setData(data);
			baseInfoView.setData(data);
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