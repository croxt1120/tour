require([
    'config'
], function () {
	require([
		'jquery',
		'bootstrap',
	    'router',
	    'moment',
	    'datetimepicker',
	    'common/Utils',
	    'views/nav/NavView'
    ], function (
    	$,
    	bootstrap,
        Router,
        moment,
        datetimepicker,
        Utils,
        MainNavView
    ){
    	moment.locale('ko');
    	
    	$("body").on( "change", "input.price", function(evt){
    	    var money = $(evt.currentTarget).val();
	        money = Utils.numberWithoutCommas(money);
	        if (!Utils.isNumber(money)) {
	            alert("입력 값이 잘 못 되었습니다.");
	            money = 0;
	        }else if (money.toString().length > 8) {
	            alert("천만원 단위까지만 입력 가능합니다.");
	            money = 0;
	        } else {
	            if(money < 0){
        	        money = "-" + (Utils.numberWithCommas(Math.abs(money)));
        	    }else{
                    money = Utils.numberWithCommas(money);        	        
        	    }
	        }
	        $(evt.currentTarget).val(money);
    	});
    	
    	$('body').on('change', 'input.time', function(evt) {
			var time = $(evt.currentTarget).val();
			var isValid = Utils.checkTimeFormat(time);
	        
	        if (!isValid) {
	        	alert("입력 형식이 잘 못 되었습니다. : 예)23:59");
	        	$(evt.currentTarget).val('00:00');
	        }
		});
    	
	} );
} );