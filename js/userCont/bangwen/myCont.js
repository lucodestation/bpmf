"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
    $('.public-user').load('/components/CenterAside.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            id: '',
            cateList: [],
            noticeCont: '',
            name: '', // 棋名
        };
    },
    created: function () {
        var _this = this;
        this.GetRequest();
        request({ method: 'POST', url: '/api/Bangwen/cate' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
            }
        });
        request({ url: '/api/Bangwen/bangwenDetail', method: 'POST', data: { bangwen_id: this.id }, }).then(function (res) {
            if (res.code == 200) {
                _this.noticeCont = res.data;
                for (var i in _this.cateList) {
                    if (_this.cateList[i].id == res.data.b_id) {
                        _this.name = _this.cateList[i].name;
                    }
                }
            }
        });
    },
    methods: {
        // 获取当前页面url
        GetRequest: function () {
            var url = location.search; //获取当前页面url
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            this.id = theRequest.id;
        },
    }
});
