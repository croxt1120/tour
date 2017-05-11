define([
        'backbone',
        'underscore',
        'moment',
], function (
		Backbone,
		_,
		moment
) {
	var TourData = Backbone.View.extend({
	    initialize : function(){
	        this.clearData();
	    },
	    
	    setData : function(key, data){
	    	if(!_.isString(key)){
	    		this.tourData = key;
	    		this.trigger("change:all");
	    		
	    	}else{
		        this.tourData[key] = data;
	        	this.trigger("change:"+key);
	        	
	        	if(key == "images"){
	        		console.log("SET DATA : ", key, data);
	        	}
	    	}
	    },
	    
	    getData :function (key){
	    	if(_.isUndefined(key)){
	    		return this.tourData;
	    	}else{
	    		return this.tourData[key];
	    	}
	    },
	    
	    clearData : function(){
	        this.tourData = {
	            member : {
	                adult : 0,
	                child : 0,
	                baby : 0
	            },
	            
	            info : {
	            	client : "",
	            	title : "",
	            	planner : "",
	            	plannerInfo : "",
	            	inclusion : "",
	            	exclusion : "",
	            	specialty : "",
	            	extraCharge : "",
	            	extraChargeInfo : "",
	            	car : "",
	            	driver : ""
	            },
	            
	            date : {
	            	start : moment().format("YYYY-MM-DD"),
	            	end : moment().format("YYYY-MM-DD"),
	            },
	            
	            airlines : [{
	            	airline : "",
	            	flight : "",
	            	locale1: "",
	            	locale2 : "",
	            	time1 : "",
	            	time2 : ""
	            }, {
	            	airline : "",
	            	flight : "",
	            	locale1: "",
	            	locale2 : "",
	            	time1 : "",
	            	time2 : ""
	            }],
	            
	            hotels : [{
	            	name : "",
	            	phone : "",
	            }],
	            
	            meals : [
	            	[{
		            	name : "",
		            	price : 0,
	            	}, {
		            	name : "",
		            	price : 0,
		            }, {
		            	name : "",
		            	price : 0,
		            }]
	            ],
	            
	            schedules : [
	            	[{
	            		type : "place",
	            		place : "", 
	            		price : 0
	            	}]
	            ],
	            
	            price : {
	                exchangeRate : {
	                    USD : 0,
	                    EUR : 0
	                },
	                
	                airfare : {
	                    adult : {
	                        summary : "",
	                        price : 0,
	                        currency : "KRW",
	                        person : 0,
	                        people : 0,
	                    },
	                    
	                    child : {
	                        summary : "",
	                        price : 0,
	                        currency : "KRW",
	                        person : 0,
	                        people : 0,
	                    },
	                    
	                    baby : {
	                        summary : "",
	                        price : 0,
	                        currency : "KRW",
	                        person : 0,
	                        people : 0,
	                    },
	                },
	                
	                hotel : [{
	                    summary : "",
	                    price : 0,
	                    currency : "KRW",
	                    person : 0,
	                    people : 0,
	                }],
	                
	                tour : [{
	                    summary : "",
	                    price : 0,
	                    currency : "KRW",
	                    person : 0,
	                    people : 0,
	                }],
	                
	                result : {
	                    adult : {
	                        revenue : 0,
	                        person : 0,
	                        people : 0,
	                    },
	                    
	                    child : {
	                        revenue : 0,
	                        person : 0,
	                        people : 0,
	                    },
	                    
	                    baby : {
	                        revenue : 0,
	                        person : 0,
	                        people : 0,
	                    },
	                },
	                
	                deposit : 0,
	                balance : 0,
	                dueDate : moment().format("YYYY-MM-DD")
	            },
	            admin : {
					depositor : "보성블루투어",
					bankName : "국민은행",
					accountNumber : "472901-01-055465",
					packagePrintMsg : "* 계약금은 예약일로 3일 이내입금하셔야 하며, 미입금시 예약은 통보없이 취소될수 있습니다.\n" +
	    							  "* 최소약관: 항공권 수수료 - 환불불가, 출발 7일전 -10%, 전일 -50%, 당일 -80%\n"+
	    							  "* 고객님의 요청으로 일정이 별결 될 경우 변경 수수료가 발생 할 수 있습니다.\n"
				},
				
				files : [],
				url : [],
	        };
	        
		    this.trigger("change:all");
	    }
	});
	
	
	return new TourData();
});