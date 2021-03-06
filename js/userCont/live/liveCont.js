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
            dateTime: '',
            liveCont: '',
            userList: [], // 申请列表
        };
    },
    mounted: function () {
        var searchParams = Qs.parse(location.search.substr(1));
        this.id = searchParams.id;
        this.ondetail();
        this.onuserList();
    },
    methods: {
        // 列表数据
        ondetail: function () {
            var _this = this;
            request({ url: '/api/Live/detail', method: 'POST', data: { live_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    var date1 = new Date((res.data.end_time + ':00').replace(/\-/g, "/")); //开始时间
                    var date2 = new Date(res.data.start_time.replace(/\-/g, "/") + ':00'); //结束时间
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
                    _this.dateTime = days * 24 * 60 + hours * 60 + minutes;
                    _this.liveCont = res.data;
                }
            });
        },
        onuserList: function () {
            var _this = this;
            request({ url: '/api/Live/userList', method: 'POST', data: { live_id: Number(this.id), page: 1, pagenum: 10 } }).then(function (res) {
                if (res.code == 200) {
                    _this.userList = res.data.data;
                }
            });
        },
        // 审核或取消
        onShheClick: function (id, k) {
            var _this = this;
            request({ url: '/api/Live/checkPass', method: 'POST', data: { check_id: id } }).then(function (res) {
                if (res.code == 200) {
                    if (k == 1) {
                        layer.msg('审核成功');
                    }
                    else {
                        layer.msg('取消通过成功');
                    }
                    _this.onuserList();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        }
    }
});
