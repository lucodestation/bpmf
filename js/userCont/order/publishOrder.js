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
            type: '',
            typeList: [{ id: '1', name: '教课' }, { id: '2', name: '学课' }],
            navList: [{ id: '', name: '全部订单' }, { id: '0', name: '待支付' }, { id: '1', name: '已支付' }],
            navId: '',
            search: '',
            orderList: [],
            start_time: '',
            end_time: ''
        };
    },
    mounted: function () {
        var _this = this;
        // 起始时间
        layui.laydate.render({
            elem: '#signUpStartDate',
            theme: '#FF7F17',
            btns: ['clear', 'confirm'],
            done: function (value, date) {
                _this.start_time = value;
            },
        });
        // 结束时间
        layui.laydate.render({
            elem: '#signUpEndDate',
            theme: '#FF7F17',
            btns: ['clear', 'confirm'],
            done: function (value, date) {
                _this.end_time = value;
            },
        });
        // 列表数据
        this.onpushBangwenOrder();
    },
    methods: {
        // 点击查询
        onSearchClick: function () {
            this.onpushBangwenOrder();
        },
        onnavClick: function (id) {
            this.navId = id;
            this.onpushBangwenOrder();
        },
        // 列表数据
        onpushBangwenOrder: function () {
            var _this = this;
            request({ url: '/api/Mine/pushBangwenOrder', method: 'POST', data: { page: 1, pagenum: 10, search: this.search, status: this.navId, type: this.type, start_time: this.start_time, end_time: this.end_time } }).then(function (res) {
                if (res.code == 200) {
                    _this.orderList = res.data.data;
                }
            });
        }
    }
});
