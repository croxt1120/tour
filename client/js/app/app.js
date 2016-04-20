require([
    'config'
], function () {
	require([
	    'jquery',
	    'backbone',
	    'select2',
	    'moment',
	    'common/Utils',
	    'router',
	    'datas/Tour'
	    ], function (
	        $,
	        Backbone,
	        select2,
	        moment,
	        Utils,
	        Router,
	        Tour
	        ) {
	        	//
	        	moment.locale('ko');

	        	/////////////////////////////
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
				
				/////////////////////////////
				Router.start();
				// Tour.loadCode().then(function() {
					
				// }).fail(function() {
				// 	alert('데이터 조회에 실패했습니다.');
				// });
	} );
} );