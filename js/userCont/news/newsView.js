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
            newsCont: ''
        };
    },
    created: function () {
        var _this = this;
        var searchParams = Qs.parse(location.search.substr(1));
        this.id = searchParams.id;
        request({ url: '/api/Message/readSysMessage', method: 'POST', data: { sysMessage_id: this.id } }).then(function (res) {
            if (res.code == 200) {
                _this.newsCont = res.data;
            }
        });
    },
    methods: {}
});
