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
new Vue({
    el: '#app',
    data: function () {
        return {
            userCont: '',
            depositDialogVisible: false,
            payMethod: '2',
            money: '',
            alipayPayDialogVisible: false,
            payAmount: '1',
            wechatPayDialogVisible: false, // ?????????????????????????????????
        };
    },
    created: function () {
        var _this = this;
        // ??????????????????
        request({ url: '/api/Mine/info', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.userCont = res.data;
            }
        });
    },
    methods: {
        // ??????????????????
        onRechargeClick: function () {
            this.depositDialogVisible = true;
        },
        // ?????????????????????????????????
        onRechargeQuery: function () {
            this.depositDialogVisible = false;
            this.money = '';
            this.payMethod = 2;
        },
        // ?????????????????????????????????
        onPayClick: function () {
            if (!this.money)
                return layer.msg('?????????????????????');
            if (this.payMethod == 2) {
                this._alipayPay();
            }
            else if (this.payMethod == 3) {
                this._wechatPay();
            }
        },
        // ??????????????????????????????????????????
        handleCloseAlipayPayDialog: function () {
            this.alipayPayDialogVisible = false;
            // ???????????????
            clearInterval(this.getDepositTimer);
        },
        // ???????????????
        _alipayPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, alipayPayQrcodeElement, alipayPayQrcode, queryString, codeUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // ?????????????????????
                            this.depositDialogVisible = false;
                            return [4 /*yield*/, request({
                                    url: '/api/Recharge/refer',
                                    method: 'post',
                                    data: { money: this.money, pay_type: 2 },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            // ??????????????????
                            this.payAmount = depositReferResult.data.money;
                            // ??????????????????????????????
                            this.alipayPayDialogVisible = true;
                            // ????????????--???????????????
                            // ??????????????????????????????????????????????????????
                            // ??????????????????????????????????????????????????????????????????????????????
                            return [4 /*yield*/, request({
                                    url: '/api/Recharge/aliPay',
                                    params: { out_trade_no: depositReferResult.data.out_trade_no },
                                })
                                // ?????????this.alipayPayDialogVisible = true ??????????????????
                            ];
                        case 2:
                            // ????????????--???????????????
                            // ??????????????????????????????????????????????????????
                            // ??????????????????????????????????????????????????????????????????????????????
                            _a.sent();
                            alipayPayQrcodeElement = document.getElementById('alipayPayQrcode');
                            alipayPayQrcodeElement.innerHTML = '';
                            alipayPayQrcode = new QRCode(alipayPayQrcodeElement, {
                                width: 260,
                                height: 260,
                            });
                            queryString = Qs.stringify({
                                out_trade_no: depositReferResult.data.out_trade_no,
                                token: localStorage.getItem('token'),
                            });
                            codeUrl = baseURL + '/api/Recharge/aliPay?' + queryString;
                            console.log('codeUrl', codeUrl);
                            alipayPayQrcode.makeCode(codeUrl);
                            // ????????????????????????????????????
                            this._startGetDepositTimer('alipay');
                            return [3 /*break*/, 4];
                        case 3:
                            layer.msg(depositReferResult.msg);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        // ???????????????????????????????????????
        handleCloseWechatPayDialog: function () {
            this.wechatPayDialogVisible = false;
            // ???????????????
            clearInterval(this.getDepositTimer);
        },
        // ????????????
        _wechatPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, payResult, wechatPayQrcodeElement, wechatPayQrcode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // ?????????????????????
                            this.depositDialogVisible = false;
                            return [4 /*yield*/, request({
                                    url: '/api/Recharge/refer',
                                    method: 'post',
                                    data: { money: this.money, pay_type: 3 },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            // ??????????????????
                            this.payAmount = depositReferResult.data.money;
                            // ???????????????????????????
                            this.wechatPayDialogVisible = true;
                            return [4 /*yield*/, request({
                                    url: '/api/Recharge/wxPay',
                                    method: 'post',
                                    data: { out_trade_no: depositReferResult.data.out_trade_no },
                                })];
                        case 2:
                            payResult = _a.sent();
                            if (+payResult.code === 200) {
                                wechatPayQrcodeElement = document.getElementById('wechatPayQrcode');
                                wechatPayQrcodeElement.innerHTML = '';
                                wechatPayQrcode = new QRCode(wechatPayQrcodeElement, {
                                    width: 260,
                                    height: 260,
                                });
                                wechatPayQrcode.makeCode(payResult.data.code_url);
                                // ????????????????????????????????????
                                this._startGetDepositTimer('wechat');
                            }
                            else {
                                layer.msg(payResult.msg);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            layer.msg(payResult.msg);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        // ????????????????????????????????????
        _startGetDepositTimer: function (payMethod) {
            var _this = this;
            this.getDepositTimer = setInterval(function () {
                // ???????????????????????????????????????????????????????????????????????????????????????
                request({
                    url: '/api/Mine/info',
                }).then(function (res) {
                    if (+res.code === 200) {
                        if (res.data.money != _this.userCont.money) {
                            // ???????????????
                            clearInterval(_this.getDepositTimer);
                            _this.$alert('<div style="text-align: center; font-size: 20px;">????????????</div>', '', {
                                confirmButtonText: '??????',
                                showClose: false,
                                dangerouslyUseHTMLString: true,
                                confirmButtonClass: 'orange-button-bg',
                                callback: function () {
                                    if (payMethod === 'alipay') {
                                        _this.alipayPayDialogVisible = false;
                                    }
                                    else if (payMethod === 'wechat') {
                                        _this.wechatPayDialogVisible = false;
                                    }
                                },
                            });
                        }
                        else {
                            console.log('??????', +res.data.deposit);
                        }
                    }
                });
            }, 3000);
        },
    }
});
