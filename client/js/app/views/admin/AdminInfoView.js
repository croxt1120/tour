define([
	'jquery',
	'underscore',
	'backbone',
	'custom/View',
	'common/TourData',
	'text!views/admin/tpls/adminInfoTpl.html'
], function(
	$,
	_,
	Backbone,
	View,
	TourData,
	adminInfoTpl
) {

	var AdminInfoView = View.extend({
		initialize: function() {
			this.render();
		},

		render: function() {
			$("body").append(adminInfoTpl);
			this.setElement($("#adminView"));
			return this;
		},

		events: {
			"change input" : "getData",
			"change textarea" : "getData"
		},

		getData: function() {
			var data = {
				depositor: this.$('#depositor').val(),
				bankName: this.$('#bankName').val(),
				accountNumber: this.$('#accountNumber').val(),
				packagePrintMsg: this.$('#packagePrintMsg').val()
			};
			
			TourData.setData("admin", data);
		},

		setData: function() {
			var data = TourData.getData("admin");
			
			this.$('#depositor').val(data.depositor);
			this.$('#bankName').val(data.bankName);
			this.$('#accountNumber').val(data.accountNumber);
			this.$('#packagePrintMsg').val(data.packagePrintMsg);
		}
	});

	return AdminInfoView;
});