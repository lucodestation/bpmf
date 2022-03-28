"use strict";
function ok(id) {
    syalert.syhide(id);
}
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            newsList: [],
            articleList: [],
            partnerList: [],
            bangwenJkList: [],
            bangwenXkList: [], // 最新榜文-学课
        };
    },
    created: function () {
        var _this = this;
        // 平台公告
        request({ url: '/api/Index/noticeList', method: 'POST', data: { page: 1, pagenum: 1 } }).then(function (res) {
            if (res.code == 200) {
                _this.newsList = res.data.data;
            }
        });
        // 18展位图
        request({ url: '/api/Index/eighteen', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                // this.newsList = res.data.data
            }
        });
        // 最新榜文-教课
        request({ url: '/api/Bangwen/list', method: 'POST', data: { page: 1, pagenum: 7, type: 1, sort: 1 } }).then(function (res) {
            if (res.code == 200) {
                _this.bangwenJkList = res.data.data;
            }
        });
        // 最新榜文-学课
        request({ url: '/api/Bangwen/list', method: 'POST', data: { page: 1, pagenum: 7, type: 2, sort: 1 } }).then(function (res) {
            if (res.code == 200) {
                _this.bangwenXkList = res.data.data;
            }
        });
        // 玻说坡话列表
        request({ url: '/api/Index/articleList', method: 'POST', data: { page: 1, pagenum: 4 } }).then(function (res) {
            if (res.code == 200) {
                _this.articleList = res.data.data;
            }
        });
        // 合作机构
        request({ url: '/api/Index/partner', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.partnerList = res.data;
            }
        });
        new Swiper('.mySwiper', {
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: true,
        });
    },
});
