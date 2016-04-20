define([
        'jquery',
        'underscore',
        'backbone',
        'html2canvas',
        'moment',
        'common/Utils',
        'text!views/print/tpls/printViewTpl.html',
        'text!views/print/tpls/freeTourTpl.html'
], function ( 
		$,
		_,
		Backbone,
		Html2canvas,
		moment,
		Utils,
		printViewTpl,
		freeTourTpl
		) {
		    var PrintTourInfoView = Backbone.View.extend({
		        initialize: function() {
		            this.render();
		        },
		        render: function() {
		            var tpl = _.template(printViewTpl, {} );
		            this.setElement(printViewTpl);
		            return this;
		        },
		        events: {
		            "click .btn-print": "onPrintClick"
		        },
		        
		        setData: function(data) {
		        	var freeInfo = data.freeInfo;
		        	var adminInfo = data.adminInfo;
		        	freeInfo.baseInfo.travelStartDate = moment(freeInfo.baseInfo.travelStartDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	freeInfo.baseInfo.travelEndDate = moment(freeInfo.baseInfo.travelEndDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	
		        	var viewData = {};
		        	viewData['freeInfo'] = freeInfo;
		        	viewData['adminInfo'] = adminInfo;
		        	
		        	var tpl = _.template(freeTourTpl)(viewData);
		        	this.$('.content').empty().append(tpl);
		        },
		        
		        onPrintClick: function(evt) {
		            var $print = this.$('.print-tour');
		            
		            $("#appView").hide();
		            $('#printArea').show().append($print);
		            
		            window.print();
		            $("#appView").show();
		            this.$('.content').append($print);
		        }
		    });
		    return PrintTourInfoView;
} );