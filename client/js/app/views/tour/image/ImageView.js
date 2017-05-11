define([
    "jquery",
    "jquery_ui_widget",
    "jquery_iframe_transport",
    "jquery_fileupload",
    "underscore",
    "backbone",
    "common/TourData",
    "text!views/tour/image/imageTpl.html",
    "text!views/tour/image/galleryTpl.html",
], function(
    $,
    jquery_ui_widget,
    jquery_iframe_transport,
    jquery_fileupload,
    _,
    Backbone,
    TourData,
    imageTpl,
    galleryTpl
) {
    var ScheduleView = Backbone.View.extend({
        initialize: function() {
            this.render();
            this.files = [];
        },

        addGallery: function(files) {
            var _view = this;
            if (_.isArray(files)) {
                _.each(files, function(file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var gallery = $(galleryTpl);
                        gallery.find("img").attr("src", e.target.result);
                        gallery.insertBefore(_view.$(".thumbnail.add"));
                    };
                    reader.readAsDataURL(file);
                });

                this.files = this.files.concat(files);
                TourData.setData("files", this.files);
            }
        },

        render: function() {
            var _view = this;
            this.$el.append(imageTpl);
            $('#fileupload').fileupload({
                dataType: 'json',
                add: function(e, data) {
                    var uploadFile = data.files[0];
                    var isValid = true;
                    if (!(/png|jpe?g|gif/i).test(uploadFile.name)) {
                        alert('png, jpg, gif 만 가능합니다');
                        isValid = false;
                    }
                    else if (uploadFile.size > 5000000) { // 5mb
                        alert('파일 용량은 5메가를 초과할 수 없습니다.');
                        isValid = false;
                    }

                    if (isValid == false) {
                        return;
                    }
                    if (uploadFile) {
                        _view.addGallery(data.files);
                    }
                },
                fail: function(e, data) {
                    alert('서버와 통신 중 문제가 발생했습니다');
                }
            });
        },

        events: {
            // "click img": "_onClickImg"
        },

        // _onClickImg: function(evt) {
        //     var target = $(evt.target).parents(".thumbnail");
        //     var index = target.index(".thumbnail");

        //     this.files.splice(index, 1);
        //     TourData.setData("files", this.files);

        //     target.remove();
        // },

        setData: function() {
            var urls = TourData.getData("url");
            
            this.$(".thumbnail.img").remove();
            
            var _view = this;
            _.each(urls, function(url) {
                var gallery = $(galleryTpl);
                gallery.find("img").attr("src", "/image/"+url);
                gallery.insertBefore(_view.$(".thumbnail.add"));
            });
        }
    });

    return ScheduleView;
});