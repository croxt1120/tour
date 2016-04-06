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
		        	data.baseInfo.travelStartDate = moment(data.baseInfo.travelStartDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	data.baseInfo.travelEndDate = moment(data.baseInfo.travelEndDate, "YYYY-MM-DD").format('YYYY년 MM월 DD일 ddd요일');
		        	
		        	var tpl = _.template(freeTourTpl)(data);
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