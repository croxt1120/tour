require.config({
		
		// 경로 설정
        paths: {
            jquery     : '../libs/jquery.min',
            text       : '../libs/text',
            underscore : '../libs/underscore.min',
            backbone   : '../libs/backbone',
            semantic   : '../libs/semantic',
            moment     : '../libs/moment-with-locales',
            bootstrap  : '../libs/bootstrap',
            datetimepicker : '../libs/bootstrap-datetimepicker.min',
            datepicker : '../libs/bootstrap-datepicker',
            select2    : '../libs/select2.min',
            html2canvas : '../libs/html2canvas',
            localekr   : '../locales/bootstrap-datepicker.kr.min',
            
            // path
            components: './components/',
            popup: './views/popup/',
            router: 'router'
        },

        // 의존 파일 설정
        shim : {
        	backbone : {
        		deps : ['jquery', 'underscore'],
                exports : 'Backbone'
            },
            underscore : {
            	exports : '_'
            },
            semantic : {
                deps : ['jquery'],
                exports : 'semantic'
            },
            datetimepicker : {
                deps: ['jquery', 'moment', 'bootstrap'],
                exports : 'datetimepicker'
            },
            datepicker : {
                deps: ['jquery', 'bootstrap'],
                exports : 'datepicker'
            },
            localekr: {
                deps: ['datepicker'],
                exports : 'localekr'
            },
            select2: {
                deps: ['jquery'],
                exports : 'select2'
            }
            
        }

});