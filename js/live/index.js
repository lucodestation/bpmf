"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            navList: [],
            navId: '',
            matchList: [],
            courseList: [],
            waitList: [], // 直播预告
        };
    },
    mounted: function () {
        var _this = this;
        // 直播分类
        request({ url: '/api/Live/liveCates', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.navList = res.data;
                _this.navList.unshift({ id: '', name: '全部' });
            }
        });
        // 热播赛事
        request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 1, c_id: this.navId, page: 1, pagenum: 8, status: '' } }).then(function (res) {
            if (res.code == 200) {
                _this.matchList = res.data.data;
            }
        });
        // 热播课程
        request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 2, c_id: this.navId, page: 1, pagenum: 8, status: '' } }).then(function (res) {
            if (res.code == 200) {
                _this.courseList = res.data.data;
            }
        });
        // 直播预告
        request({ url: '/api/Live/waitStartList', method: 'POST', data: { page: 1, pagenum: 8 } }).then(function (res) {
            if (res.code == 200) {
                _this.waitList = res.data.data;
            }
        });
    },
    methods: {
        // 点击热播赛事切换
        onNavClick: function (id) {
            this.navId = id;
        }
    }
});
