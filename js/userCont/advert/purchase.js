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
            adverList: [],
            adverCont: '',
            type: '',
            formData: {
                type_id: '',
                position: '',
                start_time: '',
                end_time: '',
                image: '',
                money: '',
                url: '',
                d_id: '',
                pay_type: '', // 1余额，2支付宝，3微信
            }
        };
    },
    watch: {
        type: {
            handler: function (e, m) {
                for (var i = 0; i < this.adverList.length; i++) {
                    if (this.adverList[i].id == e) {
                        this.adverCont = this.adverList[i];
                    }
                }
            }
        },
    },
    created: function () {
        var _this = this;
        // 广告位简介
        request({ url: '/api/adver/adverDescri', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.adverList = res.data;
                _this.formData.type_id = res.data[0].id;
                _this.type = res.data[0].id;
                _this.adverCont = res.data[0];
            }
        });
    },
    methods: {}
});
