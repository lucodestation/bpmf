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
            cateList: [],
            noticeCont: '',
            name: '',
            userList: [], // 应榜人列表
        };
    },
    created: function () {
        var _this = this;
        this.GetRequest();
        request({ method: 'POST', url: '/api/Bangwen/cate' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
            }
        });
        this.onNotice();
    },
    methods: {
        // 请求页面数据
        onNotice: function () {
            var _this = this;
            request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: { bangwen_id: this.id }, }).then(function (res) {
                if (res.code == 200) {
                    _this.noticeCont = res.data;
                    for (var i in _this.cateList) {
                        if (_this.cateList[i].id == res.data.b_id) {
                            _this.name = _this.cateList[i].name;
                        }
                    }
                }
            });
            request({ url: '/api/Bangwenpush/attendList', method: 'post', data: { bangwen_id: this.id }, }).then(function (res) {
                if (res.code == 200) {
                    _this.userList = res.data;
                }
            });
        },
        onDelClick: function () {
            syalert.syopen('noticeDelCont');
        },
        // 删除数据
        onDelqueryClick: function () {
            request({ url: '/api/Bangwenpush/delete', method: 'post', data: { bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('删除成功');
                    syalert.syhide('noticeDelCont');
                    window.history.go(-1);
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
        },
        // 点击中榜
        onZbClick: function (item) {
            var that = this;
            layui.use('layer', function () {
                layer.confirm('确定要中榜吗?', {
                    btn: ['确定', '取消'] //按钮
                }, function (index) {
                    that.onSelection(item);
                });
            });
        },
        // 点击中榜请求数据
        onSelection: function (item) {
            var _this = this;
            request({ url: '/api/Bangwenpush/select', method: 'post', data: { order_id: item.id, bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('中榜成功');
                    _this.onNotice();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        }
    }
});
