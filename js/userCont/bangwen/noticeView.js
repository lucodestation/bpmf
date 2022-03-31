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
            userList: [],
            selectList: [],
            terminateTaskVisible: false,
            reason: '',
            phone: '',
            order_id: ''
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
        this.onselectList();
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
        },
        // 取消中榜
        onQueryClick: function (id) {
            var that = this;
            layui.use('layer', function () {
                layer.confirm('确定要取消中榜吗?', {
                    btn: ['确定', '取消'] //按钮
                }, function (index) {
                    that.cancelSelect(id);
                });
            });
        },
        // 点击取消中榜请求数据
        cancelSelect: function (item) {
            var _this = this;
            request({ url: '/api/Bangwenpush/cancelSelect', method: 'post', data: { order_id: item, bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('中榜成功');
                    _this.onNotice();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // 此处是学棋榜文，不托管  开始学习
        onStudyClick: function (id) {
            request({ url: '/api/bangwenpush/beginLearnUnmanaged', method: 'post', data: { order_id: id } }).then(function (res) {
                if (res.code == 200) {
                    // layer.msg('中榜成功')
                    // this.onselectList()
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        onselectList: function () {
            var _this = this;
            request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.id }, }).then(function (res) {
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
        // 点击终止任务
        onterminateTaskClick: function (id) {
            this.order_id = id;
            this.terminateTaskVisible = true;
        },
        // 点击终止任务关闭按钮
        onterminateTaskQuery: function () {
            this.order_id = '';
            this.terminateTaskVisible = false;
        },
        // 点击终止任务请求数据
        onzzClick: function () {
            request({ url: '/api/Bangwenpush/pushReferEnd', method: 'POST', data: { order_id: this.order_id, reason: this.reason, phone: this.phone }, }).then(function (res) {
                if (res.code == 200) {
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // 数组重构
        group: function (array, subGroupLength) {
            var index = 0;
            var newArray = [];
            while (index < array.length) {
                newArray.push(array.slice(index, index += subGroupLength));
            }
            return newArray;
        },
    }
});
