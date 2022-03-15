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
var encrypt = new JSEncrypt();
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
new Vue({
    el: '#app',
    data: function () {
        return {
            vipCont: '',
            number: '1',
            day: '',
            type: 1,
            userCont: '',
            UnitPrice: '',
            Totalprice: '',
            one_type: '',
            num: 1,
            pay_type: '1',
            pwd: '', // 支付密码
        };
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, ress, date1, date2, month;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request({
                            method: 'POST',
                            url: '/api/Vip/buyInfo',
                        })];
                    case 1:
                        res = _a.sent();
                        if (res.code == 200) {
                            this.vipCont = res.data;
                        }
                        return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Vip/mineVip',
                            })];
                    case 2:
                        ress = _a.sent();
                        if (ress.code == 200) {
                            this.userCont = ress.data;
                        }
                        date1 = new Date();
                        date2 = new Date(date1);
                        date2.setDate(date1.getDate() + 30 * this.number);
                        month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1));
                        this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate();
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // 点击购买次数
        ontqClick: function (e) {
            this.one_type = e;
            if (e == 1) {
                this.UnitPrice = this.vipCont.onelive_money;
                this.Totalprice = this.vipCont.onelive_money * this.num;
            }
            else if (e == 2) {
                this.UnitPrice = this.vipCont.onebang_money;
                this.Totalprice = this.vipCont.onebang_money * this.num;
            }
            else if (e == 3) {
                this.UnitPrice = this.vipCont.onematch_money;
                this.Totalprice = this.vipCont.onematch_money * this.num;
            }
            syalert.syopen('userNumber');
        },
        // 购买次数加
        onAddClick: function () {
            this.num++;
            this.Totalprice = (this.UnitPrice * this.num).toFixed(2);
        },
        // 购买次数减
        onJianClick: function () {
            if (this.num > 1) {
                this.num--;
                this.Totalprice = (this.UnitPrice * this.num).toFixed(2);
            }
        },
        // 购买次数确定
        onPayClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, pwd, ress, ress, ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.pay_type == '1') {
                                if (!this.pwd)
                                    return [2 /*return*/, layer.msg('请输入密码')];
                            }
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Vip/onNumRefer',
                                    data: { one_type: this.one_type, num: this.num, pay_type: this.pay_type }
                                })];
                        case 1:
                            res = _a.sent();
                            if (!(res.code == 200)) return [3 /*break*/, 7];
                            if (!(this.pay_type == '1')) return [3 /*break*/, 3];
                            encrypt.setPublicKey(publiukey);
                            pwd = encrypt.encrypt(this.pwd) //需要加密的内容
                            ;
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Vip/numBalancePay',
                                    data: { out_trade_no: res.data.out_trade_no, pay_pwd: pwd }
                                })];
                        case 2:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                layer.msg('支付成功');
                                syalert.syhide('userNumber');
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            _a.label = 3;
                        case 3:
                            if (!(this.pay_type == '2')) return [3 /*break*/, 5];
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Vip/numAliPay',
                                    data: { out_trade_no: res.data.out_trade_no }
                                })];
                        case 4:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                // layer.msg('支付成功')
                                // syalert.syhide('userNumber')
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            _a.label = 5;
                        case 5:
                            if (!(this.pay_type == '3')) return [3 /*break*/, 7];
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Vip/numWxPay',
                                    data: { out_trade_no: res.data.out_trade_no }
                                })];
                        case 6:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                // layer.msg('支付成功')
                                location.href = ress.data.code_url;
                                syalert.syhide('userNumber');
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        // 时长加
        addClick: function () {
            this.number++;
            var date1 = new Date();
            var date2 = new Date(date1);
            date2.setDate(date1.getDate() + 30 * this.number);
            var month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1));
            this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate();
        },
        // 时长减
        jianClick: function () {
            if (this.number > 1) {
                this.number--;
                var date1 = new Date();
                var date2 = new Date(date1);
                date2.setDate(date1.getDate() + 30 * this.number);
                var month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1));
                this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate();
            }
        },
        // 点击购买
        onGoClick: function () {
            location.href = './pay.html?number=' + this.number + '&type=' + this.type;
        }
    }
});
