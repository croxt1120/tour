require([
    'config'
], function () {
	require([
	    'jquery',
	    'backbone',
	    'select2',
	    'common/Utils',
	    'views/packageTour/PackageTourView',
	    'views/print/PrintTourInfoView',
	    'views/codeManager/CodeManagerView'
	    ], function (
	        $,
	        Backbone,
	        select2,
	        Utils,
	        PackageTourView,
	        PrintTourInfoView,
	        CodeManagerView
	        ) {
			////////////////////////////////////
			$('body').on('change', '.input-money', function(evt) {
				var money = $(evt.currentTarget).val();
		        money = Utils.numberWithoutCommas(money);
		        
		        if (!Utils.isNumber(money)) {
		            alert("입력 값이 잘 못 되었습니다.");
		            money = 0;
		        }else if (money.toString().length > 9) {
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
			
			


			//////////////////////////////////////////
			var packageTourView = new PackageTourView();
			$('#viewBox').append(packageTourView.el);

			var printTourInfoView = new PrintTourInfoView();
			$('#viewBox').append(printTourInfoView.el);

			var codeManagerView = new CodeManagerView();
			$('#viewBox').append(codeManagerView.el);
			

			///////////////////////////////////////
			var Router = Backbone.Router.extend({
				routes:{
					"":"onShowPackageTourView",
			     	"print-base":"onShowPrintBase", // Backbone은 첫번째 router를 match시켜볼것이다.about
			     	"code-mgr": "onShowCodeManager"
			     	},
			     	onShowPackageTourView:function(id) {
			     		$('.sub-view').hide();
			     		packageTourView.$el.show();
			     	},
			     	onShowPrintBase:function(actions) {
			     		$('.sub-view').hide();
			     		var data = packageTourView.getData();
			     		console.log(data);
			     		printTourInfoView.setData(data);
			     		printTourInfoView.$el.show();
			     	},
			     	onShowCodeManager: function() {
			     		$('.sub-view').hide();
			     		codeManagerView.$el.show();
			     	},
			});
			new Router();
			Backbone.history.start();
	} );
} );