"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
    $('.public-user').load('/components/CenterAside.html');
});
Vue.use(ELEMENT);
new Vue({
    el: '#app',
    data: function () {
        return {
            id: '',
            bangwen_id: '',
            cateList: [],
            noticeCont: '',
            name: '',
            selectList: [],
            terminateTaskVisible: false,
            check_content: '',
            check_phone: '',
            status: '',
            checknum: 0
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
                res.data.detail.map(function (item, k) {
                    item.num = k + 1;
                });
                res.data.blList = _this.group(res.data.detail, 3);
                _this.noticeCont = res.data;
            }
        });
        // 开始学习后阶段
        // request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.bangwen_id }, }).then((res) => {
        //   if (res.code == 200) {
        //     res.data.map(item => {
        //       item.detail.map((items, k) => {
        //         items.num = k + 1
        //         item.blList = this.group(item.detail, 3)
        //       })
        //     })
        //     this.selectList = res.data
        //   }
        // })
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
        // 点击开始教课
        onBeginTeachClick: function (item) {
            request({ url: '/api/Bangwenattend/startTeach', method: 'POST', data: { detail_id: item.detail_id }, }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('开始教课');
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // 终止原因弹框是否同意协议
        ondjclick: function () {
            this.checknum = this.checknum == 0 ? 1 : 0;
        },
        // 终止原因关闭弹框
        onQueryClick: function () {
            this.terminateTaskVisible = false;
            this.check_content = '';
            this.check_phone = '';
            this.status = '';
            this.checknum = 0;
        },
        // 终止原因弹框提交数据
        onzzyyClick: function () {
            var _this = this;
            if (this.checknum == 0)
                return layer.msg('请阅读并同意协议');
            if (!this.check_content)
                return layer.msg('请输入反馈内容');
            if (!this.status)
                return layer.msg('请选择是否要平台介入');
            if (!this.check_phone)
                return layer.msg('请输入手机号');
            if (this.check_phone) {
                var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/; //11位手机号码正则
                if (!reg_tel.test(this.check_phone))
                    return layer.msg('请输入正确的手机号');
            }
            request({ url: '/api/Bangwenpush/checkReferEnd', method: 'POST', data: { order_id: this.id, check_content: this.check_content, check_phone: this.check_phone, status: this.status }, }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('提交成功');
                    _this.terminateTaskVisible = false;
                    _this.check_content = '';
                    _this.check_phone = '';
                    _this.status = '';
                    _this.checknum = 0;
                }
                else {
                    layer.msg(res.msg);
                }
            });
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
