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
		        	if(_.isUndefined(this.$('#category')))
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
		        loadData: function(loadFileName) {
		        	var _this = this;
		        	if(_.isUndefined(_this.$('#category')))
		        		return;
		        	
		        	_this.$("table").css('display','none');	// all table set visible false
		        	
		        	var view = this;
		        	var fileName = loadFileName;
		        	
		        	// var fileName = this.$('#category').val();	// get category item
		        	if(_.isUndefined(fileName))
		        		fileName = this.$('#category').val();	// get category item
		        	
		        	if(!_.isUndefined(fileName)) {		
		        		$.ajax({
			        		url: "/code/"+fileName,
			        		dataType: "json",
			        		type: "GET",
			            	success: function(result) {
			        			if(result.isSuccess) {
			        				_this.$("#"+fileName + " > tbody").empty();	// init table row
			        				
									$.each(result.data, function(key, val) {
										var row = view.getRowTpl();		// create row template
				        				var colValues = _.values(val);
				        				
				        				for(var i=0; i<colValues.length; i++) {
				        					row.find('td:eq('+i+')').find('input').val(colValues[i]);
				        				}
				        				
				        				_this.$("#"+fileName+" tbody").append(row);
			        				});			        				
			        			} else {
			        				alert('파일 조회에 실패하였습니다.');
			        			}

			        			_this.$("#"+fileName).css('display','table');
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
			            		if(result.isSuccess) {
			      					view.loadData(fileName);
			      				} else {
			      					alert('파일 저장에 실패하였습니다.');
			      				}
			        		}
		        		});
		        },
		        tableToJson: function(table) { 
		        	var _this = this;
		  			var tableData = [];
		  			var rowObj = {};
		  			var headerName = "";
		  			var columnValue = "";

					if(_this.$("#"+table+" tbody tr").length == 0) {	// table row count is 0, add empty row.
						for(var j=0; j<_this.$("#"+table+" th").length-1; j++)	{
							headerName = _this.$("#"+table+" th").eq(j).text();
							columnValue = "";
							console.log(headerName+"/"+columnValue);
							rowObj[headerName.toLowerCase()] = columnValue;
						}
						
						tableData.push(rowObj);
					}	
					else {
						_this.$("#"+table+" tbody tr").each(function (row, tr) {
		  					rowObj = {};
		  				
		  					var colCount = _this.$(tr).find("td").length;
		  					for(var i=0; i<colCount-1; i++) {	// ignore last column
		  						headerName = _this.$("#"+table+" th").eq(i).text();
		  						columnValue = _this.$(tr).find("td:eq("+i+")").find("input").val();
		  					
		  						rowObj[headerName.toLowerCase()] = columnValue;
		  					}
		  				
		  					tableData.push(rowObj);	
		  				});
					}
		  			
		  			return JSON.stringify(tableData, null, 2);
				}
		        
		    });
		    return View;
} );