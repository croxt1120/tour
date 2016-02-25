require([
    'config'
], function () {
	require([
	    'jquery',
	    'select2',
	    'common/Utils',
	    'views/freeTour/FreeTourView'
	    ], function (
	        $,
	        select2,
	        Utils,
	        FreeTourView
	        ) {

			$('body').on('change', '.input-money', function(evt) {
				var money = $(evt.currentTarget).val();
		        money = Utils.numberWithoutCommas(money);
		        
		        if (!Utils.isNumber(money)) {
		            alert("입력 값이 잘 못 되었습니다.");
		            money = 0;
		        }else if (money.toString().length > 8) {
		            alert("천만원 단위까지만 입력 가능합니다.");
		            money = 0;
		        } else {
		            money = Utils.numberWithCommas(money);
		        }
		        
	        	$(evt.currentTarget).val(money);
			});
			
			$('body').on('change', '.input-time', function(evt) {
				var time = $(evt.currentTarget).val();
				var isValid = Utils.checkTimeFormat(time);
		        
		        if (!isValid) {
		        	alert("입력 형식이 잘 못 되었습니다. : 예)23:59");
		        	$(evt.currentTarget).val('00:00');
		        }
			});
	        	
	        	var appView = new FreeTourView();
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