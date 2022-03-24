"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            navList: [{ id: '', name: '全部' }, { id: 1, name: '热播赛事' }, { id: 2, name: '热播直播' }],
            navId: '',
            cateList: [], // 筛选
        };
    },
    mounted: function () {
        var _this = this;
        request({ url: '/api/Live/liveCates', method: 'post' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
            }
        });
        this.oncompetitionList();
    },
    methods: {
        // 点击直播种类切换
        onNavClick: function (id) {
            this.navId = id;
            this.oncompetitionList();
        },
        // 列表数据
        oncompetitionList: function () {
            var _this = this;
            request({ url: '/api/Live/competitionList', method: 'post', data: { type: this.navId, c_id: '', page: 1, pagenum: 16, status: '' } }).then(function (res) {
                if (res.code == 200) {
                    _this.liveList = res.data.data;
                }
            });
        }
    }
});
