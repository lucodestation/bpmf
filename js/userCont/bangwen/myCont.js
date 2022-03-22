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
            bangwen_id: '',
            cateList: [],
            noticeCont: '',
            name: '',
            selectList: [], // 阶段列表数据
        };
    },
    created: function () {
        var _this = this;
        this.GetRequest();
        // 分类列表
        request({ method: 'POST', url: '/api/Bangwen/cate' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
            }
        });
        // 详情内容
        request({ url: '/api/Bangwenattend/attendDetail', method: 'POST', data: { attend_id: this.id }, }).then(function (res) {
            if (res.code == 200) {
                _this.noticeCont = res.data;
            }
        });
        // 开始学习后阶段
        request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.bangwen_id }, }).then(function (res) {
            if (res.code == 200) {
                res.data.map(function (item) {
                    item.detail.map(function (items, k) {
                        items.num = k + 1;
                        item.blList = _this.group(item.detail, 3);
                    });
                });
                _this.selectList = res.data;
                console.log(_this.selectList);
            }
        });
    },
    methods: {
        // 数组重构
        group: function (array, subGroupLength) {
            var index = 0;
            var newArray = [];
            while (index < array.length) {
                newArray.push(array.slice(index, index += subGroupLength));
            }
            return newArray;
        },
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
            this.name = theRequest.name;
            this.bangwen_id = theRequest.bangwen_id;
        },
    }
});
