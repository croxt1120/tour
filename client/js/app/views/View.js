define([
        'jquery',
        'underscore',
        'backbone',
        'text!views/view.html'
], function ( 
		$,
		_,
		Backbone,
		viewTpl
		) {
		    
		    var View = Backbone.View.extend({
		        initialize: function() {
		            this.render();
		        },
		        render: function() {
		            var tpl = _.template(viewTpl, {} );
		            this.$el.html(tpl);
		            return this;
		        },
		        events: {
		            "click #btn": "onClick"
		        },
		        onClick: function(evt) {
		            alert(1);
		            this.$('#d').hide();
		        }
		    });
		    return View;
} );