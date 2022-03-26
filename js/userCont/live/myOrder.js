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
            navList: [{ id: '', title: '直播类型' }, { id: '1', title: '课程直播' }, { id: '2', title: '赛事直播' }],
            type: '',
            start_time: '',
            end_time: '',
            orderList: [], // 列表
        };
    },
    mounted: function () {
        var _this = this;
        this.onappointLiveList();
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
    },
    methods: {
        // 点击查询
        onClick: function () {
            this.onappointLiveList();
        },
        // 列表数据
        onappointLiveList: function () {
            var _this = this;
            request({ url: '/api/Mine/appointLiveList', method: 'post', data: { page: 1, pagenum: 10, start_time: this.start_time, end_time: this.end_time, type: this.type } }).then(function (res) {
                if (res.code == 200) {
                    res.data.data.map(function (item) {
                        var date1 = new Date((item.end_time + ':00').replace(/\-/g, "/")); //开始时间
                        var date2 = new Date(item.start_time.replace(/\-/g, "/") + ':00'); //结束时间
                        var date3 = date1.getTime() - date2.getTime(); //时间差秒
                        //计算出相差天数
                        var days = Math.floor(date3 / (24 * 3600 * 1000));
                        //计算出小时数
                        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
                        var hours = Math.floor(leave1 / (3600 * 1000));
                        //计算相差分钟数
                        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
                        var minutes = Math.floor(leave2 / (60 * 1000));
                        //计算相差秒数
                        // var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
                        // var seconds = Math.round(leave3 / 1000)
                        item.fen = days * 24 * 60 + hours * 60 + minutes;
                    });
                    _this.orderList = res.data.data;
                }
            });
        }
    }
});
