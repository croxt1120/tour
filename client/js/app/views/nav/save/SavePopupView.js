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
			if(TourData.getData("files").length > 0){
				this._reqSaveImage()
					.success(function(data){
						var url = TourData.getData("url");
						_.each(data.files, function(file){
							url.push(file.name);
						});
						TourData.setData("url", url);
						TourData.setData("files", []);
	
						_view._reqSave(false);	
						_view.$(".progress .progress-bar").css("width", "0%");
						_view.$(".progress .progress-bar").text("");
						_view.$(".progress").hide();
					});
			}else{
				_view._reqSave(false);
			}
			
		},
		_reqSaveImage :function(){
			var imageFiles = {
				files: TourData.getData("files"),
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
			var tourName = this.$('#tourName').val();
			var url = '/tour/' + tourName;
			var data = {};

			var packageTour = TourData.getData();


			data['saveData'] = JSON.stringify(packageTour);
			data['isOverWrite'] = isOverWrite;

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
			}).always(function(res) {});
		}
	});

	return SavePopupView;
});