define([
        'jquery',
        'underscore',
        'backbone',
        'text!views/codeManager/tpls/codeManagerTpl.html',
        'text!views/codeManager/tpls/foodRowTpl.html',
        'text!views/codeManager/tpls/hotelRowTpl.html',
        'text!views/codeManager/tpls/scheduleRowTpl.html'
], function ( 
		$,
		_,
		Backbone,
		codeManagerTpl,
		foodRowTpl,
		hotelRowTpl,
		scheduleRowTpl
		) {
		    
		    var View = Backbone.View.extend({
		        initialize: function() {
		            this.render();
		            this.loadData();
		        },
		        render: function() {
		            this.setElement(codeManagerTpl);
		            return this;
		        },
		        events: {
		            "change #category" : "_onChange",
		            "click .btn-add" : "_onAddRow",
		            "click .btn-remove" : "_onRemoveRow",
		            "click #save" : "saveData"
		        },
		        _onChange: function(evt) {
		        	this.loadData();
		        },
		        _onAddRow: function(evt) {
		        	if (!_.isUndefined(evt)) {
		        		$(evt.currentTarget).parent().parent().after(	
		        			this.getRowTpl()
		        		);
		        	}
		        },
		        _onRemoveRow: function(evt) {
		        	$(evt.currentTarget).parent().parent().remove();	
		        },
		        getRowTpl: function() {
		        	if(_.isUndefined($('#category')))
		        		return;
		        		
		        	var tpl;
		        	var category = this.$('#category').val();
		        	
		        	if(category == "food")
		        		tpl = foodRowTpl;
		        	else if(category == "hotel")
		        		tpl = hotelRowTpl;
		        	else if(category == "schedule")
		        		tpl = scheduleRowTpl;
		        	
		        	return $(_.template(tpl)( {} ));	
		        },
		        loadData: function() {
		        	if(_.isUndefined($('#category')))
		        		return;
		        	
		        	$("table").css('display','none');	// all table set visible false
		        	
		        	var view = this;
		        	var fileName = this.$('#category').val();	// get category item
		        	
		        	if(!_.isUndefined(fileName)) {		
		        		$.ajax({
			        		url: "/code/"+fileName,
			        		dataType: "json",
			        		type: "GET",
			            	success: function(result) {
			        			console.log("loadData file -> " + fileName + ", result -> " + result.isSuccess);
			        			
			        			if(result.isSuccess) {
			        				$("#"+fileName + " > tbody").empty();	// init table row
			        				
									$.each(result.data, function(key, val) {
										var row = view.getRowTpl();
				        				var colValues = _.values(val);
				        				
				        				for(var i=0; i<colValues.length; i++) {
				        					row.find('td:eq('+i+')').html(colValues[i]);
				        				}
				        				
				        				$("#"+fileName+" tbody").append(row);
			        				});			        				
			        			}

			        			$("#"+fileName).css('display','block');
			        		}
		        		});
		        	}
		        },
		        saveData: function(evt) {
		        	var view = this;
		        	var fileName = this.$('#category').val();
		        	
		        	$.ajax({
			        		url: "/code/"+fileName,
			        		dataType: "json",
			        		type: "POST",
			        		data: {saveData: view.tableToJson(fileName)},
			            	success: function(result) {
			      				view.loadData();
			        		}
		        		});
		        },
		        tableToJson: function(table) { 
		  			var tableData = [];
		  			
		  			$("#"+table+" tr").each(function (row, tr) {
	  					console.log("row index"+row);	
	  					
	  					if(row > 0) {
			  				var rowObj = {};
			  				
			  				var colCount = $(tr).find("td").length;
			  				for(var i=0; i<colCount-1; i++) {	// ignore last column
			  					var headerName = $("#"+table+" th").eq(i).text();
			  					var columnValue = $(tr).find("td:eq("+i+")").html();
			  					
			  					rowObj[headerName.toLowerCase()] = columnValue;
			  				}
			  				
			  				tableData.push(rowObj);	
	  					}
		  			});
		  			
		  			return JSON.stringify(tableData);
				}
		        
		    });
		    return View;
} );