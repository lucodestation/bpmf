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
});
new Vue({
    el: '#app',
    data: function () {
        return {
            id: '',
            newsCont: '',
            formData: {
                bangwen_id: '',
                total_money: '',
                descri: '',
                files: '',
                pay_num_type: '1',
                pay_num: '',
                more_type: '1',
                moneys: '', // ????????????????????????????????????1.00,50.00,3.00
            },
            payList: [{ id: 1, name: '????????????' }, { id: 2, name: '????????????' }],
            moreList: [{ id: 1, name: '????????????' }, { id: 2, name: '???????????????' }],
            num: '',
            ordeList: [],
            totalMoney: '',
            content: '', // ????????????
        };
    },
    watch: {
        totalMoney: {
            handler: function (e, m) {
                if (this.totalMoney == '') {
                    if (this.formData.pay_num_type == 2) {
                        this.formData.pay_num_type = 1;
                    }
                }
                this.formData.total_money = this.totalMoney;
                this.num = this.totalMoney * 100;
                this.formData.moneys = '';
                this.getCouponSelected();
            }
        },
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.GetRequest();
                        return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Bangwen/bangwenDetail',
                                data: { bangwen_id: this.id },
                            })];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            this.newsCont = res.data;
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // ??????
        onCollClick: function () {
            var _this = this;
            request({
                url: '/api/Bangwen/collect',
                method: 'post',
                data: { bangwen_id: this.id },
            }).then(function (res) {
                if (res.code == 200) {
                    layer.msg(res.msg);
                    request({
                        url: '/api/Bangwen/bangwenDetail',
                        method: 'post',
                        data: { bangwen_id: _this.id },
                    }).then(function (ress) {
                        _this.newsCont = ress.data;
                    });
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ????????????
        onReportClick: function () {
            var _this = this;
            if (!this.content)
                return layer.msg('?????????????????????');
            request({
                url: '/api/Bangwen/report',
                method: 'post',
                data: { bangwen_id: this.id, content: this.content },
            }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('????????????');
                    syalert.syhide('reportCont');
                    _this.content = '';
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ????????????????????????
        getpaynumSelected: function () {
            if (this.totalMoney == '') {
                if (this.formData.pay_num_type == 2) {
                    layer.msg('??????????????????');
                    this.formData.pay_num_type = 1;
                }
            }
            if (this.formData.pay_num_type == 1) {
                this.formData.pay_num = 1;
                this.formData.more_type = 1;
                this.formData.moneys = '';
            }
        },
        // ??????????????????????????????
        getCouponSelected: function () {
            var arr = [];
            var num = 0;
            var month = Math.floor(this.formData.total_money / this.formData.pay_num * 100) / 100; // ??????
            for (var i = 1; i <= this.formData.pay_num; i++) {
                num = num + month;
                arr.push({ id: i, num: month });
            }
            // ?????????????????????????????????????????????????????????????????????????????????????????????
            if (num != this.formData.total_money) {
                arr[arr.length - 1].num = (month + (this.formData.total_money - num)).toFixed(2);
            }
            this.ordeList = arr;
            var arr1 = [];
            for (var i in arr) {
                arr1.push(arr[i].num);
            }
            this.formData.moneys = arr1.toString();
        },
        // ????????????
        onBtnClick: function () {
            var _this = this;
            var arr1 = [];
            var num = 0;
            for (var i in this.ordeList) {
                arr1.push(this.ordeList[i].num);
                num = Number(num) + Number(this.ordeList[i].num);
            }
            this.formData.moneys = arr1.toString();
            console.log(num.toFixed(0));
            console.log(this.formData);
            if (!this.formData.total_money)
                return layer.msg('???????????????');
            if (!this.formData.descri)
                return layer.msg('???????????????');
            request({
                url: '/api/Bangwen/attend',
                method: 'post',
                data: this.formData,
            }).then(function (res) {
                if (res.code == 200) {
                    syalert.syhide('bangCont');
                    request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: { bangwen_id: _this.id } }).then(function (ress) {
                        if (ress.code == 200) {
                            _this.newsCont = ress.data;
                        }
                        else {
                            layer.msg(res.msg);
                        }
                    });
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ??????????????????url
        GetRequest: function () {
            var url = location.search; //??????????????????url
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            this.id = theRequest.id;
            this.formData.bangwen_id = theRequest.id;
        },
    }
});
