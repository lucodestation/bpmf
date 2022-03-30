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
            navsList: [],
            navsId: '',
            courseList: [],
            waitList: [],
            liveList: [], // 正在进行直播
        };
    },
    mounted: function () {
        var _this = this;
        // 正在进行直播
        request({ url: '/api/Live/livingList', method: 'POST', data: { page: 1, pagenum: 4 } }).then(function (res) {
            if (res.code == 200) {
                _this.liveList = res.data.data;
                setTimeout(function () {
                    var swiper = new Swiper(".mySwiper1", {
                        spaceBetween: 10,
                        slidesPerView: 4,
                        freeMode: true,
                        watchSlidesProgress: true,
                    });
                    new Swiper(".mySwiper2", {
                        spaceBetween: 10,
                        thumbs: {
                            swiper: swiper,
                        },
                    });
                }, 500);
            }
        });
        // 直播分类
        request({ url: '/api/Live/liveCates', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.navList = res.data;
                _this.navList.unshift({ id: '', name: '全部' });
                _this.navsList = _this.navList;
            }
        });
        // 热播赛事
        this.oncompetitionList();
        // 热播课程
        this.competitionList();
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
            this.oncompetitionList();
        },
        // 热播赛事
        oncompetitionList: function () {
            var _this = this;
            request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 1, c_id: this.navId, page: 1, pagenum: 8, status: '' } }).then(function (res) {
                if (res.code == 200) {
                    _this.matchList = res.data.data;
                }
            });
        },
        // 点击热播课程切换
        onClick: function (id) {
            this.navsId = id;
            this.competitionList();
        },
        // 热播课程
        competitionList: function () {
            var _this = this;
            request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 2, c_id: this.navsId, page: 1, pagenum: 8, status: '' } }).then(function (res) {
                if (res.code == 200) {
                    _this.courseList = res.data.data;
                }
            });
        }
    }
});
