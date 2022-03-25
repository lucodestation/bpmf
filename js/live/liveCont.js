"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            id: '',
            dateTime: '',
            noticeCont: '',
            adverList: [],
            content: '',
            plList: [],
            phone: '',
            tsCont: '',
            isShow: 0, // 是否同意协议
        };
    },
    mounted: function () {
        var _this = this;
        var searchParams = Qs.parse(location.search.substr(1));
        this.id = searchParams.id;
        this.onpushList();
        // 广告图
        request({ url: '/api/Live/adverList', method: 'POST', data: { live_id: this.id } }).then(function (res) {
            if (res.code == 200) {
                _this.adverList = res.data;
            }
        });
        this.onjudgeList();
    },
    methods: {
        // 点赞
        onZanClick: function () {
            var _this = this;
            request({ url: '/api/Live/giveZan', method: 'POST', data: { live_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    _this.onpushList();
                    // this.adverList = res.data
                }
            });
        },
        onxyClick: function () {
            this.isShow = (this.isShow == 0) ? 1 : 0;
        },
        // 投诉
        onComplaintClick: function () {
            var _this = this;
            if (this.isShow == 0)
                return layer.msg('请阅读并同意协议');
            if (!this.tsCont)
                return layer.msg('请输入投诉内容');
            if (!this.phone)
                return layer.msg('请输入手机号');
            if (this.phone) {
                var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/; //11位手机号码正则
                if (!reg_tel.test(this.phone))
                    return layer.msg('请输入正确的手机号');
            }
            request({ url: '/api/Live/complaint', method: 'POST', data: { live_id: this.id, content: this.tsCont, phone: this.phone } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('投诉成功');
                    _this.tsCont = '';
                    _this.phone = '';
                    syalert.syhide('tsCont');
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // 关闭弹框
        onQuery: function () {
            this.tsCont = '';
            this.phone = '';
            syalert.syhide('tsCont');
        },
        // 详情数据
        onpushList: function () {
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
                    // })
                    _this.noticeCont = res.data;
                }
            });
        },
        // 评论列表
        onjudgeList: function () {
            var _this = this;
            request({ url: '/api/Live/judgeList', method: 'POST', data: { live_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    _this.plList = res.data.data;
                }
            });
        },
        // 发布评论
        onPlClick: function () {
            var _this = this;
            if (!this.content)
                return layer.msg('请输入评论内容');
            request({ url: 'api/Live/judgeRefer', method: 'POST', data: { live_id: this.id, content: this.content } }).then(function (res) {
                if (res.code == 200) {
                    _this.content = '';
                    layer.msg('评论成功');
                }
            });
        }
    }
});
