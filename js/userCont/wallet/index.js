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
            userCont: '', // 个人信息
        };
    },
    created: function () {
        var _this = this;
        request({ url: '/api/Mine/info', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.userCont = res.data;
            }
        });
    },
    methods: {}
});
