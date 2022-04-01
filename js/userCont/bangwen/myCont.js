"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        // 点击开始学课
        onBeginTeachClick: function (item) {
            return __awaiter(this, void 0, void 0, function () {
                var ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({ method: 'POST', url: '/api/Bangwenattend/outBeginTeach', data: { order_id: item.id }, })];
                        case 1:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                // this.timeDown()
                                layer.msg('发送成功');
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // onBeginTeachClick(item) {
        //   request({ url: '/api/Bangwenattend/outBeginTeach', method: 'POST', data: { order_id: item.id }, }).then((res) => {
        //     if (res.code == 200) {
        //       // this.noticeCont = res.data
        //     } else {
        //       layer.msg(res.msg)
        //     }
        //   })
        //   // request({ url: '/api/Bangwenattend/outBeginTeach', method: 'POST', data: { order_id: item.id } }).then((res) => {
        //   //   if (res.code == 200) {
        //   //     // res.data.map(item => {
        //   //     //   item.detail.map((items, k) => {
        //   //     //     items.num = k + 1
        //   //     //     item.blList = this.group(item.detail, 3)
        //   //     //   })
        //   //     // })
        //   //     // this.selectList = res.data
        //   //     // console.log(this.selectList)
        //   //   }
        //   // })
        // },
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
            request({ url: '/api/Bangwenpush/checkReferEnd', method: 'POST', data: { check_content: this.check_content, check_phone: this.check_phone, status: this.status }, }).then(function (res) {
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
