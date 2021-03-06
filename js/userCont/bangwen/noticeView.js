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
Vue.use(ELEMENT);
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
            order_id: '',
            depositDialogVisible: false,
            depositDialogShow: false,
            walletPayDialogVisible: false,
            alipayPayDialogVisible: false,
            wechatPayDialogVisible: false,
            depositAmount: '',
            payMethod: 1,
            payAmount: '',
            payPassword: '',
            order_num: '',
            out_trade_no: ''
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
        // ??????????????????
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
        // ????????????
        onDelqueryClick: function () {
            request({ url: '/api/Bangwenpush/delete', method: 'post', data: { bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('????????????');
                    syalert.syhide('noticeDelCont');
                    window.history.go(-1);
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
        },
        // ????????????
        onZbClick: function (item) {
            var that = this;
            layui.use('layer', function () {
                layer.confirm('???????????????????', {
                    btn: ['??????', '??????'] //??????
                }, function (index) {
                    that.onSelection(item);
                });
            });
        },
        // ????????????????????????
        onSelection: function (item) {
            var _this = this;
            request({ url: '/api/Bangwenpush/select', method: 'post', data: { order_id: item.id, bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('????????????');
                    _this.onNotice();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ????????????
        onQueryClick: function (id) {
            var that = this;
            layui.use('layer', function () {
                layer.confirm('?????????????????????????', {
                    btn: ['??????', '??????'] //??????
                }, function (index) {
                    that.cancelSelect(id);
                });
            });
        },
        // ??????????????????????????????
        cancelSelect: function (item) {
            var _this = this;
            request({ url: '/api/Bangwenpush/cancelSelect', method: 'post', data: { order_id: item, bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('????????????');
                    _this.onNotice();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ?????????????????????????????????  ????????????
        onStudyClick: function (id) {
            request({ url: '/api/bangwenpush/beginLearnUnmanaged', method: 'post', data: { order_id: id } }).then(function (res) {
                if (res.code == 200) {
                    // layer.msg('????????????')
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
        // ??????????????????
        onterminateTaskClick: function (id) {
            this.order_id = id;
            this.terminateTaskVisible = true;
        },
        // ??????????????????????????????
        onterminateTaskQuery: function () {
            this.order_id = '';
            this.terminateTaskVisible = false;
        },
        // ??????????????????????????????
        onzzClick: function () {
            request({ url: '/api/Bangwenpush/pushReferEnd', method: 'POST', data: { order_id: this.order_id, reason: this.reason, phone: this.phone }, }).then(function (res) {
                if (res.code == 200) {
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ????????????????????????????????????(???????????????)
        onStudytgClick: function (item) {
            this.depositDialogVisible = true;
            this.depositAmount = item.total_money;
            this.order_id = item.id;
        },
        // ????????????????????????????????????????????????????????????)
        onpayClick: function (item) {
            this.depositDialogShow = true;
            this.depositAmount = item.total_money;
            this.order_num = item.order_num;
        },
        // ????????????????????????????????????
        handleCloseDepositDialog: function () {
            this.depositDialogVisible = false;
            this.depositAmount = '';
            this.order_id = '';
        },
        // ??????????????????????????????
        confirmPayDeposit: function () {
            return __awaiter(this, void 0, void 0, function () {
                var userInfoResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.payMethod === 1)) return [3 /*break*/, 2];
                            // ????????????
                            console.log('????????????');
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
                            if (this.payMethod === 2) {
                                // ???????????????
                                console.log('???????????????');
                                // ???????????????
                                this._alipayPay();
                            }
                            else if (this.payMethod === 3) {
                                // ????????????
                                console.log('????????????');
                                this._wechatPay();
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // ?????????????????????????????????????????????
        handleCloseDeposit: function () {
            this.order_num = '';
            this.depositDialogShow = false;
        },
        // ?????????????????????????????????????????????
        PayDeposit: function () {
            return __awaiter(this, void 0, void 0, function () {
                var userInfoResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.payMethod === 1)) return [3 /*break*/, 2];
                            // ????????????
                            console.log('????????????');
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
                            if (this.payMethod === 2) {
                                // ???????????????
                                console.log('???????????????');
                                // ???????????????
                                this._alipayPay();
                            }
                            else if (this.payMethod === 3) {
                                // ????????????
                                console.log('????????????');
                                this._wechatPay();
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // ????????????
        _walletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            depositReferResult = '';
                            if (!this.order_num) return [3 /*break*/, 2];
                            return [4 /*yield*/, request({
                                    url: '/api/Mine/payNow',
                                    method: 'post',
                                    data: { pay_type: 1, order_num: this.order_num },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, request({
                                url: '/api/Bangwenpush/beginLearnManaged',
                                method: 'post',
                                data: { pay_type: 1, order_id: this.order_id },
                            })];
                        case 3:
                            depositReferResult = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (+depositReferResult.code === 200) {
                                // ????????????????????????
                                this.depositDialogVisible = false;
                                // ??????????????????
                                this.payAmount = depositReferResult.data.money;
                                this.out_trade_no = depositReferResult.data.order_num;
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
        // ????????????????????????
        handleCloseWalletPayDialog: function () {
            this.walletPayDialogVisible = false;
        },
        // ????????????????????????
        handleSubmitWalletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var payPassword, payResult;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.payPassword)
                                layer.msg('?????????????????????');
                            // ?????????????????????
                            encrypt.setPublicKey(publiukey);
                            payPassword = encrypt.encrypt(this.payPassword) //?????????????????????
                            ;
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/balancePay',
                                    method: 'post',
                                    data: { order_num: this.out_trade_no, pay_pwd: payPassword },
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
        // ???????????????
        _alipayPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, alipayPayQrcodeElement, alipayPayQrcode, queryString, codeUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // ????????????????????????
                            this.depositDialogVisible = false;
                            depositReferResult = '';
                            if (!this.order_num) return [3 /*break*/, 2];
                            return [4 /*yield*/, request({
                                    url: '/api/Mine/payNow',
                                    method: 'post',
                                    data: { pay_type: 2, order_num: this.order_num },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, request({
                                url: '/api/Bangwenpush/beginLearnManaged',
                                method: 'post',
                                data: { pay_type: 2, order_id: this.order_id },
                            })];
                        case 3:
                            depositReferResult = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 6];
                            // ??????????????????
                            this.payAmount = depositReferResult.data.money;
                            // ??????????????????????????????
                            this.alipayPayDialogVisible = true;
                            // ????????????--???????????????
                            // ??????????????????????????????????????????????????????
                            // ??????????????????????????????????????????????????????????????????????????????
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/aliPay',
                                    params: { order_num: depositReferResult.data.order_num },
                                })
                                // ?????????this.alipayPayDialogVisible = true ??????????????????
                            ];
                        case 5:
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
                                order_num: depositReferResult.data.order_num,
                                token: localStorage.getItem('token'),
                            });
                            codeUrl = baseURL + '/api/Bangwenpush/aliPay?' + queryString;
                            console.log('codeUrl', codeUrl);
                            alipayPayQrcode.makeCode(codeUrl);
                            // ???????????????????????????????????????
                            this._startGetDepositTimer('alipay');
                            return [3 /*break*/, 7];
                        case 6:
                            layer.msg(depositReferResult.msg);
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        // ??????????????????????????????
        handleCloseAlipayPayDialog: function () {
            console.log('??????????????????????????????');
            this.alipayPayDialogVisible = false;
            // ???????????????
            clearInterval(this.getDepositTimer);
            // ????????????????????????
            // this.depositDialogVisible = true
        },
        // ????????????
        _wechatPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, payResult, wechatPayQrcodeElement, wechatPayQrcode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // ????????????????????????
                            this.depositDialogVisible = false;
                            depositReferResult = '';
                            if (!this.order_num) return [3 /*break*/, 2];
                            return [4 /*yield*/, request({
                                    url: '/api/Mine/payNow',
                                    method: 'post',
                                    data: { pay_type: 3, order_num: this.order_num },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, request({
                                url: '/api/Bangwenpush/beginLearnManaged',
                                method: 'post',
                                data: { pay_type: 3, order_id: this.order_id },
                            })];
                        case 3:
                            depositReferResult = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 6];
                            // ??????????????????
                            this.payAmount = depositReferResult.data.money;
                            // ???????????????????????????
                            this.wechatPayDialogVisible = true;
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/wxPay',
                                    method: 'post',
                                    data: { order_num: depositReferResult.data.order_num },
                                })];
                        case 5:
                            payResult = _a.sent();
                            if (+payResult.code === 200) {
                                wechatPayQrcodeElement = document.getElementById('wechatPayQrcode');
                                wechatPayQrcodeElement.innerHTML = '';
                                wechatPayQrcode = new QRCode(wechatPayQrcodeElement, {
                                    width: 260,
                                    height: 260,
                                });
                                wechatPayQrcode.makeCode(payResult.data.code_url);
                                // ???????????????????????????????????????
                                this._startGetDepositTimer('wechat');
                            }
                            else {
                                layer.msg(payResult.msg);
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            layer.msg(payResult.msg);
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        // ???????????????????????????
        handleCloseWechatPayDialog: function () {
            console.log('???????????????????????????');
            this.wechatPayDialogVisible = false;
            // ???????????????
            clearInterval(this.getDepositTimer);
            // ????????????????????????
            // this.depositDialogVisible = true
        },
        // ???????????????????????????????????????
        _startGetDepositTimer: function (payMethod) {
            var _this = this;
            this.getDepositTimer = setInterval(function () {
                // ?????????????????????????????????????????????????????????????????????????????????????????????
                request({
                    url: '/api/Mine/info',
                }).then(function (result) {
                    if (+result.code === 200) {
                        if (+result.data.deposit !== 0) {
                            // ???????????????
                            clearInterval(_this.getDepositTimer);
                            // this.$alert('<div style="text-align: center; font-size: 20px;">?????????????????????</div>', '', {
                            //   confirmButtonText: '??????',
                            //   showClose: false,
                            //   dangerouslyUseHTMLString: true,
                            //   confirmButtonClass: 'orange-button-bg',
                            //   callback: () => {
                            //     if (payMethod === 'alipay') {
                            //       this.alipayPayDialogVisible = false
                            //     } else if (payMethod === 'wechat') {
                            //       this.wechatPayDialogVisible = false
                            //     }
                            //   },
                            // })
                        }
                        else {
                            console.log('?????????', +result.data.deposit);
                        }
                    }
                });
            }, 3000);
        },
        // ??????????????????
        onfinishTeachClick: function (item) {
            request({ url: '/api/Bangwenattend/finishTeach', method: 'POST', data: { detail_id: item.detail_id }, }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('???????????????');
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ????????????
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
