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
            navList: [{ id: 1, name: '教课应榜' }, { id: 2, name: '学课应榜' }],
            navId: 1,
            myList: [], // 列表
        };
    },
    created: function () {
        this.onlist();
    },
    methods: {
        // 获取数据列表
        onlist: function () {
            var _this = this;
            request({ url: '/api/Bangwenattend/list', method: 'post', data: { type: this.navId } }).then(function (res) {
                if (res.code == 200) {
                    _this.myList = res.data;
                }
            });
        },
        // 点击切换类型
        onNavClick: function (id) {
            this.navId = id;
            this.onlist();
        }
    }
});
