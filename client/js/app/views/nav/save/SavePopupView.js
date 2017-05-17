define([
	'jquery',
	'underscore',
	'bootstrap',
	'backbone',
	'custom/View',
	'common/TourData',
	'text!views/nav/save/tpls/saveTpl.html'
], function(
	$,
	_,
	bootstrap,
	Backbone,
	View,
	TourData,
	saveTpl
) {

	var SavePopupView = View.extend({
		initialize: function() {
			this.render();
		},

		render: function() {
			$("body").append(saveTpl);
			this.setElement($("#tourSavePopup"));

			this.$el.modal({
				backdrop: 'static',
				keyboard: false,
				show: false
			});

			return this;
		},

		open: function() {
			$('body').append(this.el);
			this.$el.modal("show");
		},

		// 팝업창 보이지 않게
		close: function() {
			this.$el.modal('hide');
		},

		events: {
			"click .btn-save": "_onClickSave"
		},

		_onClickSave: function() {
			var _view = this;
			this.$("button").attr("disabled", true);
			var isValid = false;
			var files = TourData.getData("files");
			for(var i =0; i<files.length; i++){
				if(files[i].length != 0){
					isValid = true;
					break;
				}
			}
			if(isValid == true){
				this._reqSaveImage()
					.success(function(data){
						var url = TourData.getData("url");
						var files = TourData.getData("files");
						var newFiles = [];
						var fileNames = {};
						
						_.each(data.files, function(file){
							fileNames[file.originalName] = file.name;
						});
						
						_.each(files, function(fileArr, day){
							newFiles.push([]);
							if(_.isUndefined(url[day])){
								url[day] = [];		
							}
							_.each(fileArr, function(file){
								url[day].push(fileNames[file.name]);
							});
						});
						
						console.log(url, newFiles);
						TourData.setData("url", url);
						TourData.setData("files", newFiles);
	
						_view._reqSave(false);	
						_view.$(".progress .progress-bar").css("width", "0%");
						_view.$(".progress .progress-bar").text("");
						_view.$(".progress").hide();
					})
					.always(function(){
						_view.$("button").removeAttr("disabled");
					});
			}else{
				_view._reqSave(false);
			}
			
		},
		
		_reqSaveImage :function(){
			var data = TourData.getData("files");
			var files = [];
			_.each(data, function(v){
				files = files.concat(v);
			});
			
			var imageFiles = {
				files: files,
				url : "/file/upload",
			};
			var _view = this;
			$('#fileupload').bind('fileuploadprogress', function (e, data) {
			    // Log the current bitrate for this upload:
			    console.log(data.loaded, "/", data.total);
			    var percent = Math.round(data.loaded/data.total * 1000)/10;
			    
			    _view.$(".progress .progress-bar").css("width", percent + "%");
			    _view.$(".progress .progress-bar").text(percent + "%");
			});
			
			_view.$(".progress").show();
			return $('#fileupload').fileupload("send", imageFiles);
		},
		
		_reqSave: function(isOverWrite) {
			var _this = this;
			var tourName = this.$('#tourName').val().replace(/\s*$/,"");
			var r = new RegExp(/[\\\\\/:*?"<>|]/);
			
			if(r.test(tourName) == true){
				alert("이름에 특수문자 \\ / : * ? < > | 를 사용할 수 없습니다.");
				return;
			}
			
			var url = '/tour/' + encodeURIComponent(tourName);
			
			var data = {};

			var packageTour = TourData.getData();


			data['saveData'] = JSON.stringify(packageTour);
			data['isOverWrite'] = isOverWrite;
			
			
			console.log("SAVE DATA", data);
			$.post(url, data, function(res) {
				if (res.isSuccess) {
					alert('데이터를 저장하였습니다.');
					_this.close();
				}
				else {
					if (res.isExisted) {
						if (confirm("같은 이름의 데이터가 존재합니다. \n 덮어 쓰시겠습니까?")) {
							_this._reqSave(true);
						}
					}
					else {
						alert('데이터 저장에 실패 했습니다.');
					}
				}

			}).fail(function(res) {
				alert('데이터 저장에 실패 했습니다.');
			}).always(function(res) {
				_this.$("button").removeAttr("disabled");
			});
		}
	});

	return SavePopupView;
});