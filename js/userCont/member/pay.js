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
//??????.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
// ??????????????????
var walletPwdPage = '/userCont/wallet/pwd.html';
// ??????????????????????????????????????????????????????????????????
var walletAccountPage = '/userCont/wallet/account.html';
// ??????????????????
var setupRealNamePage = '/userCont/setup/realName.html';
// ??????????????????
var memberPage = '/userCont/member/member.html';
new Vue({
    el: '#app',
    data: function () {
        return {
            number: '',
            type: '',
            month: '',
            title: '',
            userCont: '',
            pay_type: 1,
            pwd: '',
            depositDialogVisible: false,
            alipayPayDialogVisible: false,
            wechatPayDialogVisible: false,
            walletPayDialogVisible: false,
            payAmount: '',
            out_trade_no: '', // ????????????
        };
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
                                url: '/api/Vip/buyInfo',
                            })];
                    case 1:
                        res = _a.sent();
                        if (res.code == 200) {
                            if (this.type == '1') {
                                this.title = '??????VIP';
                                this.month = this.number * res.data.vip1_money;
                            }
                            else if (this.type == '2') {
                                this.title = '??????VIP';
                                this.month = this.number * res.data.vip2_money;
                            }
                            else if (this.type == '3') {
                                this.title = '??????VIP';
                                this.month = this.number * res.data.vip3_money;
                            }
                        }
                        // ??????????????????
                        this.onmineVip();
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // ??????????????????
        onmineVip: function () {
            return __awaiter(this, void 0, void 0, function () {
                var ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Vip/mineVip',
                            })];
                        case 1:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                this.userCont = ress.data;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // ????????????
        onBtnClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var userInfoResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.pay_type == 1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, request({ url: '/api/Mine/info' })];
                        case 1:
                            userInfoResult = _a.sent();
                            if (+userInfoResult.code === 200 && +userInfoResult.data.is_set_paypwd === 0) {
                                // ?????????????????????
                                this.$alert('<div style="text-align: center; font-size: 20px;">????????????????????????</div>', '', {
                                    confirmButtonText: '??????',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // ???????????????????????????
                                        // ??????????????????????????????
                                        window.open(walletPwdPage);
                                    },
                                });
                                return [2 /*return*/];
                            }
                            this._walletPay();
                            return [3 /*break*/, 3];
                        case 2:
                            if (this.pay_type == 2) {
                                this._alipayPay();
                            }
                            else if (this.pay_type == 3) {
                                this._wechatPay();
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // ???????????????????????????
        handleCloseWalletPayDialog: function () {
            console.log('???????????????????????????');
            this.walletPayDialogVisible = false;
            this.pwd = '';
            // ????????????????????????
            // this.depositDialogVisible = true
        },
        // ????????????
        _walletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                url: '/api/Vip/onMonthRefer',
                                method: 'post',
                                data: { type: this.type, num: this.number, pay_type: Number(this.pay_type) },
                            })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (+depositReferResult.code === 200) {
                                // ????????????????????????
                                this.depositDialogVisible = false;
                                // ??????????????????
                                this.payAmount = depositReferResult.data.money.toFixed(2);
                                this.out_trade_no = depositReferResult.data.out_trade_no;
                                // ???????????????????????????
                                this.walletPayDialogVisible = true;
                            }
                            else if (+depositReferResult.code === 5) {
                                // ????????????
                                this.$alert('<div style="text-align: center; font-size: 20px;">????????????????????????</div>', '', {
                                    confirmButtonText: '??????',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // ???????????????????????????
                                        // ??????????????????
                                        window.open(walletAccountPage);
                                    },
                                });
                            }
                            else {
                                layer.msg(depositReferResult.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // ?????????????????????????????????????????????????????????
        handleSubmitWalletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var pwd, payResult;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.pwd)
                                layer.msg('?????????????????????');
                            // ?????????????????????
                            encrypt.setPublicKey(publiukey);
                            pwd = encrypt.encrypt(this.pwd) //?????????????????????
                            ;
                            return [4 /*yield*/, request({
                                    url: '/api/Vip/monthBalancePay',
                                    method: 'post',
                                    data: { out_trade_no: this.out_trade_no, pay_pwd: pwd },
                                })];
                        case 1:
                            payResult = _a.sent();
                            if (+payResult.code === 200) {
                                this.$alert('<div style="text-align: center; font-size: 20px;">????????????</div>', '', {
                                    confirmButtonText: '??????',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // ???????????????????????????
                                        _this.walletPayDialogVisible = false;
                                        _this.onmineVip();
                                    },
                                });
                            }
                            else {
                                layer.msg(payResult.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
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
                                    url: '/api/Vip/onMonthRefer',
                                    method: 'post',
                                    data: { type: this.type, num: this.number, pay_type: Number(this.pay_type) },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            this.num = 1;
                            // ??????????????????
                            this.payAmount = depositReferResult.data.money.toFixed(2);
                            // ??????????????????????????????
                            this.alipayPayDialogVisible = true;
                            // ????????????--???????????????
                            // ??????????????????????????????????????????????????????
                            // ??????????????????????????????????????????????????????????????????????????????
                            return [4 /*yield*/, request({
                                    url: '/api/Vip/monthAliPay',
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
                            codeUrl = baseURL + '/api/Vip/monthAliPay?' + queryString;
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
            this.num = 1;
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
                                    url: '/api/Vip/onMonthRefer',
                                    method: 'post',
                                    data: { type: this.type, num: this.number, pay_type: Number(this.pay_type) },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            this.num = 1;
                            // ??????????????????
                            this.payAmount = depositReferResult.data.money.toFixed(2);
                            // ???????????????????????????
                            this.wechatPayDialogVisible = true;
                            return [4 /*yield*/, request({
                                    url: '/api/Vip/monthWxPay',
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
                    url: '/api/Vip/mineVip',
                }).then(function (res) {
                    if (+res.code === 200) {
                        // ??????????????????
                        if (res.data.vip_time != _this.userCont.vip_time) {
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
                                        _this.onmineVip();
                                    }
                                    else if (payMethod === 'wechat') {
                                        _this.wechatPayDialogVisible = false;
                                        _this.onmineVip();
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
            this.number = theRequest.number;
            this.type = theRequest.type;
        },
    }
});
