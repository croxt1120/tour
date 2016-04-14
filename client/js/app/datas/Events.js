define([
        'underscore',
        'backbone'
	], function (
		_,
		Backbone
		) {
	
	return {
		eventBus: _.extend({}, Backbone.Events),
		
		CHANGE_DATE: 'change_date',
		CHANGE_PRICE: 'change_price',
		CHANGE_MEMBER: 'change_member',
		CHANGE_EXTRA_CHARGE: 'change_extra_charge',
		CHANGE_MEMBER_ADULT: 'change_member_adult',
		CHANGE_MEMBER_CHILDREN: 'change_member_children',
		CLOSE_POPUP: 'close_popup',
		CLICK_DROP_DOWN_MENU: 'click_drop_down_menu',
		CLICK_FIRST_MENU: 'click_first_menu'
	};
} );