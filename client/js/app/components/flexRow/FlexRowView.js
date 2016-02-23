define([
        'jquery',
        'underscore',
        'backbone',
        'custom/View',
        'datas/foods',
        'text!components/flexRow/flexRowBoxTpl.html',
        'text!components/flexRow/rowTpl.html'
], function ( 
		$,
		_,
		Backbone,
		View,
		foods,
		flexRowBoxTpl,
		rowTpl
		) {

			var _createFoodSelector = function(view) {
				var foodSelector = view.$('.food-selector');
	            _.each(foods, function(food) {
	            	foodSelector.append('<option value="'+ food.code +'">' + food.name + '</option>');
	            });
	            view.$('.ui.dropdown').dropdown({
	            	onChange: function(value, text, $selectedItem) {
	            		var obj = _.where(foods, {code: value});
	            		if (obj.length == 1) {
	            			view._data = _.clone(obj[0]);
	            			view.$('.food-value').val(view._data.value);
	            		}
	            	}
	            });
			};

			var Row = View.extend({
		        initialize: function(opt) {
		            this.render();
		            this._data = null;
		            this._day = 0;
		        },
		        
		        render: function() {
		            var tpl = _.template(rowTpl, {} );
		            this.$el.html(tpl);
		            this.setElement(this.$el);
		            
		            _createFoodSelector(this);
		            return this;
		        },
		        
		        events: {
		            "click .add": "_onAddRowClick",
		            "click .remove": "_onRemoveRowClick"
		        },
		        
		        _onAddRowClick: function(evt) {
		        	this.trigger('addRowEvent');
		        },
		        
		        _onRemoveRowClick: function(evt) {
		        	this.trigger('removeRowEvent', this);
		        },

		        setDay: function(day) {
		        	this._day = day;
		        	this.$('.day').val(this._day + "일");
		        },

		        getDay: function() {
		        	return this._day;	
		        },

		        setData: function(data) {
		        	this.setDay(data.day);
		        	this.$('.ui.dropdown').dropdown('set text', data.name);
		        	this.$('.ui.dropdown').dropdown('set value', data.code);
		        },
		        
		        getData: function() {
		        	var selCode = this.$('.ui.dropdown').dropdown('get value');
		        	var selItem = _.where(foods, {code: selCode});

		        	if (selItem.length == 1) {
		        		this._data = _.clone(selItem[0]);
		        		this._data['day'] = this._day;
		        		return this._data;
		        	} else {
		        		alert('error');
		        	}
		        },
		        
		        destroy: function() {
		        	this.$('.ui.dropdown').dropdown('destroy');
		        	this.remove();
		        }
		    });


			var FlexRowView = View.extend({
		        initialize: function(opt) {
		            this._children = [];
		            this.render();
		            this._createRow();
		        },
		        
		        render: function() {
		            var tpl = _.template(flexRowBoxTpl, {} );
		            this.$el.html(tpl);
		            
		            this.setElement(this.$el);
		            return this;
		        },
		        
		        events: {
		        },
		        
		        _createRow: function() {
		            var row = new Row();
		            row.on('addRowEvent', this._createRow, this);
		            row.on('removeRowEvent', this._onRemoveRow, this);
		            //this.$('.rows').append(row.el);
		            //this._children.push(row);
		            this.addChild(row, '.rows');

		            row.setDay(this._children.length);

		            return row;
		        },
		        
		        _onRemoveRow: function($row) {
		        	var children = this._children;
		        	var len = children.length;
		        	
		        	if (len > 1) {
		        		$row.remove();
		        		var day = $row.getDay();
		        		children.splice( (day -1) , 1);
		        		for (var i = 0, len = children.length; i < len; i++) {
		        			children[i].setDay(i+1);
		        		}
		        	}
		        },
		        
		        getData: function() {
		        	var data = [];
		        	_.each(this._children, function(child) {
		        		data.push(child.getData());
		        	});
		        	return data;
		        },

		        setData: function(datas) {
		        	/*
		        	var children = this._children;
					for (var i = 0, len = children.length; i < len; i++) {
						children[i].destroy();
						delete children[i];
					}
					*/
					this.removeChildren();

		        	var _this = this;
		        	_.each(datas, function(data){
		        		_this._createRow().setData(data);
		        	});
		        },

		        destroy: function() {
		        	var children = this._children;
					for (var i = 0, len = children.length; i < len; i++) {
						children[i].destroy();
					}

					this._children = [];
		        	this.remove();
		        }		        
		    });
		    
		    return FlexRowView;
} );