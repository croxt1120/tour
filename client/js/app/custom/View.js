define([
        'backbone'
], function (
		Backbone
) {

	var View = Backbone.View.extend({
	    _children: {},
	    
	    getChildren: function() {
	    	return this._children;
	    },	    
	    
	    addChild: function(target, child) {	    	
	    	if (this.$(target)) {
	    		this._children[child.viewID] = child;
	    		this.$(target).append(child.el);
	    	} else {
	    		alert("error!! : " + target);
	    	}
	    },
	    
	    removeChild: function(viewID) {
	    	if (this._children[viewID]) {
	    		this._children[viewID].destroy();
	    		delete this._children[viewID];
	    	} else {
	    		console.log('Can not find this view: ' + viewID);
	    	}
	    },

	    removeChildren: function() {
	    	for (var i = 0, len = this._children.length; i < len; i++) {
	    		this._children[i].destroy();
	    	}
	    	this._children = [];
	    },
	    
	    destroy: function(){
	    	this.removeChildren();
	        this.remove();
	    }
	});
	
	/*
	var View = Backbone.View.extend({
	    _children: {},
	    
	    addChild: function(child) {
	    	this._children[child.viewID] = child;
	    	return child;
	    },
	    
	    removeChild: function(viewID) {
	    	this._children[viewID].destroy();
	    },
	    
	    getChildren: function() {
	    	return this._children;
	    },

//////////////////////////////////////////////////////////////
	    removeChildren: function() {
	    	for (var i = 0, len = this._children.length; i < len; i++) {
	    		this._children[i].destroy();
	    	}
	    	this._children = [];
	    },
	    
	    destroy: function(){
	    	this.removeChildren();
	        this.remove();
	    }
	});	
	
	*/

	return View;
} );