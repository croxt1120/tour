define([
        'jquery',
        'underscore',
        'backbone',
        'text!views/codeManager/tpls/codeManagerTpl.html'
], function ( 
		$,
		_,
		Backbone,
		codeManagerTpl
		) {
		    
		    var View = Backbone.View.extend({
		        initialize: function() {
		            this.render();
		        },
		        render: function() {
		            this.setElement(codeManagerTpl);
		            return this;
		        },
		        events: {
		            "click #btn": "onClick",
		            "change #category": "onChange"
		        },
		        onChange: function(evt) {
		        	console.log($('#category option:selected').val());
		        	
		        	if($('#category option:selected').val() == "Foods") {
		        		$('#foodTable').css('display','block');
		        		
		        		// TODO : get data
		        		$("#foodTable tbody").append("<tr>"+
		        		"<td><button name='edit'/><button name='delete'/></td>" +
		        		"<td>name</td>"+
		        		"<td>price</td>"+
		        		"<td>expain</td>"+"</tr>");
		        	}
		        },
		        onClick: function(evt) {
		            alert(1);
		            this.$('#d').hide();
		        }
		    });
		    return View;
} );