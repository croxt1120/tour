define([
        'backbone',
        'underscore',
        'moment',
], function (
		Backbone,
		_,
		moment
) {
	/***************************************
	 * 모든 데이터는 TourData 항목에 저장함
	 * getData : 저장되어 있는 데이터 조회 (key 항목으로 부분조회 가능)
	 * setData : 데이터 저장 (key 항목으로 부분저장 가능)
	 * clearData : 화면을 설정하는 기본데이터
	 ***************************************/
	
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
	        	// 성인, 아동, 유아 숫자
	            member : {
	                adult : 0,								// 성인 수
	                child : 0,								// 아동 수
	                baby : 0								// 유아 수
	            },
	            // 기본 정보 화면 데이터
	            info : {
	            	client : "",							// 손님
	            	title : "",								// 제목
	            	planner : "",							// 기획자
	            	plannerInfo : "",						// 기획자 정보
	            	inclusion : "",							// 포함 사항
	            	exclusion : "",							// 불포함 사항
	            	specialty : "",							// 특별 사항
	            	extraCharge : "",						// 기타 추가요금
	            	extraChargeInfo : "",					// 기타 추가요금 내역
	            	car : "",								// 차량
	            	driver : "",							// 차량 운전자
	            	domestic : false						// 국내
	            },
	            // 기본 정보 내 날짜 관련 데이터
	            date : {
	            	start : moment().format("YYYY-MM-DD"),	// 여행 개시일
	            	end : moment().format("YYYY-MM-DD"),	// 여행 종료일
	            },
	            // 기본 정보 내 항공사 데이터
	            airlines : [{								// 항공사 정보 (기본값 2개)
	            	airline : "",							// 항공사
	            	flight : "",							// 편명
	            	locale1: "",							// 출발지역
	            	locale2 : "",							// 도착지역
	            	date1 : moment().format("YYYY-MM-DD"),
	            	date2 : moment().format("YYYY-MM-DD"),
	            	time1 : "00:00",						// 출발시간
	            	time2 : "00:00",						// 도착시간	
	            	flighttime : 0
	            }, {
	            	airline : "",							// 항공사
	            	flight : "",							// 편명
	            	locale1: "",							// 출발지역
	            	locale2 : "",							// 도착지역
	            	date1 : moment().format("YYYY-MM-DD"),
	            	date2 : moment().format("YYYY-MM-DD"),
	            	time1 : "00:00",						// 출발시간
	            	time2 : "00:00",						// 도착시간				
	            	flighttime : 0
	            }],
	            // 숙소 화면 데이터
	            hotels : [{									// 숙소 정보 (Array)	
	            	name : "",								// 숙소명
	            	phone : "",								// 전화번호
	            }],
	            // 식사 화면 데이터
	            meals : [									// 식사 정보 (Array)
	            	[{										// 일자별 식사 정보
		            	name : "",							// 식사 (조식)
		            	price : 0,							// 식사 가격 (조식)
	            	}, {
		            	name : "",							// 식사 (중식)
		            	price : 0,							// 식사 가격 (중식)
		            }, {
		            	name : "",							// 식사 (석식)
		            	price : 0,							// 식사 가격 (석식)
		            }]
	            ],
	            // 일정 화면 데이터
	            schedules : [								// 일정 정보 (Array)
	            	[{										// 일자별 일정 정보
	            		type : "place",						// 일정 타입 (place / airline)
	            		place : "", 						// 일정명
	            		price : 0							// 일정 가격
	            	}]
	            ],
	            // 가격 화면 데이터
	            price : {
	            	// 환율
	                exchangeRate : {						
	                    USD : 0,							// USD 환율
	                    EUR : 0								// EUR 환율
	                },
	                // 항공 요금
	                airfare : {
	                    adult : {							// 성인
	                        summary : "",					// 적요
	                        price : 0,						// 가격
	                        currency : "KRW",				// 단위
	                        person : 0,						// 1인당 요금
	                        people : 0,						// 전체 요금
	                    },
	                    child : {							// 아동
	                        summary : "",					// 적요
	                        price : 0,						// 가격
	                        currency : "KRW",				// 단위
	                        person : 0,						// 1인당 요금
	                        people : 0,						// 전체 요금
	                    },
	                    baby : {							// 유아
	                        summary : "",					// 적요
	                        price : 0,						// 가격
	                        currency : "KRW",				// 단위
	                        person : 0,						// 1인당 요금
	                        people : 0,						// 전체 요금
	                    },
	                },
	                // 호텔 요금
	                hotel : [{
	                    summary : "",						// 적요
	                    price : 0,							// 가격
	                    currency : "KRW",					// 단위
	                    person : 0,							// 1인당 요금
	                    people : 0,							// 전체 요금
	                }],
	                // 현지투어 요금
	                tour : [{
	                    summary : "",						// 적요
	                    price : 0,							// 가격
	                    currency : "KRW",					// 단위
	                    person : 0,							// 1인당 요금
	                    people : 0,							// 전체 요금
	                }],
	                // 1인 총 금액 
	                result : {
	                    adult : {							// 성인
	                        revenue : 0,					// 1인 수익
	                        person : 0,						// 1인당 요금
	                        people : 0,						// 전체 요금
	                    },
	                    
	                    child : {							// 아동
	                        revenue : 0,					// 1인 수익
	                        person : 0,						// 1인당 요금
	                        people : 0,						// 전체 요금
	                    },
	                    
	                    baby : {							// 유아
	                        revenue : 0,					// 1인 수익
	                        person : 0,						// 1인당 요금
	                        people : 0,						// 전체 요금
	                    },
	                },
	                
	                deposit : 0,							// 계약금
	                balance : 0,							// 잔금
	                dueDate : moment().format("YYYY-MM-DD") // 납기일
	            },
	            // 관리자 화면 데이터
	            admin : {
					depositor : "보성블루투어(강순영)",
					bankName : "신한은행",
					accountNumber : "100-028-663472",
					packagePrintMsg : "* 계약금은 예약일로 3일 이내입금하셔야 하며, 미입금시 예약은 통보없이 취소될수 있습니다.\n" +
	    							  "* 최소약관: 항공권 수수료 - 환불불가, 출발 7일전 -10%, 전일 -50%, 당일 -80%\n"+
	    							  "* 고객님의 요청으로 일정이 별결 될 경우 변경 수수료가 발생 할 수 있습니다.\n"
				},
				// 화면에서 추가한 파일 내역
				files : [],
				// 이미 추가된 파일 내역 (서버에 저장된 url)
				url : [],
	        };
	        
		    this.trigger("change:all");
	    }
	});
	
	
	return new TourData();
});