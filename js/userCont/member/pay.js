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
// 支付密码页面
var walletPwdPage = '/userCont/wallet/pwd.html';
// 我的钱包页面（余额不足需要充值跳到这个页面）
var walletAccountPage = '/userCont/wallet/account.html';
// 实名认证页面
var setupRealNamePage = '/userCont/setup/realName.html';
// 开通会员页面
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
            out_trade_no: '', // 订单编号
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
                                this.title = '经典VIP';
                                this.month = this.number * res.data.vip1_money;
                            }
                            else if (this.type == '2') {
                                this.title = '黄金VIP';
                                this.month = this.number * res.data.vip2_money;
                            }
                            else if (this.type == '3') {
                                this.title = '钻石VIP';
                                this.month = this.number * res.data.vip3_money;
                            }
                        }
                        // 获取用户信息
                        this.onmineVip();
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // 获取用户信息
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
        // 点击确定
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
                                // 未设置支付密码
                                this.$alert('<div style="text-align: center; font-size: 20px;">请先设置支付密码</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 在新窗口中打开页面
                                        // 打开设置支付密码页面
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
        // 关闭钱包支付对话框
        handleCloseWalletPayDialog: function () {
            console.log('关闭钱包支付对话框');
            this.walletPayDialogVisible = false;
            this.pwd = '';
            // 打开保证金对话框
            // this.depositDialogVisible = true
        },
        // 钱包支付
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
                                // 关闭保证金对话框
                                this.depositDialogVisible = false;
                                // 实际支付金额
                                this.payAmount = depositReferResult.data.money.toFixed(2);
                                this.out_trade_no = depositReferResult.data.out_trade_no;
                                // 显示钱包支付对话框
                                this.walletPayDialogVisible = true;
                            }
                            else if (+depositReferResult.code === 5) {
                                // 余额不足
                                this.$alert('<div style="text-align: center; font-size: 20px;">余额不足，请充值</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 在新窗口中打开页面
                                        // 我的钱包页面
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
        // 提交钱包支付（钱包支付对话框点击确定）
        handleSubmitWalletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var pwd, payResult;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.pwd)
                                layer.msg('请输入支付密码');
                            // 对密码进行加密
                            encrypt.setPublicKey(publiukey);
                            pwd = encrypt.encrypt(this.pwd) //需要加密的内容
                            ;
                            return [4 /*yield*/, request({
                                    url: '/api/Vip/monthBalancePay',
                                    method: 'post',
                                    data: { out_trade_no: this.out_trade_no, pay_pwd: pwd },
                                })];
                        case 1:
                            payResult = _a.sent();
                            if (+payResult.code === 200) {
                                this.$alert('<div style="text-align: center; font-size: 20px;">购买成功</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 关闭钱包支付对话框
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
        // 点击支付宝支付对话框关闭按钮
        handleCloseAlipayPayDialog: function () {
            this.alipayPayDialogVisible = false;
            // 清除计时器
            clearInterval(this.getDepositTimer);
        },
        // 支付宝支付
        _alipayPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, alipayPayQrcodeElement, alipayPayQrcode, queryString, codeUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 关闭充值对话框
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
                            // 实际支付金额
                            this.payAmount = depositReferResult.data.money.toFixed(2);
                            // 显示支付宝支付对话框
                            this.alipayPayDialogVisible = true;
                            // 缴纳充值--支付宝支付
                            // 这里不需要接收返回值，因为啥都没返回
                            // 二维码是把请求域名加上请求路径再加上请求参数来生成的
                            return [4 /*yield*/, request({
                                    url: '/api/Vip/monthAliPay',
                                    params: { out_trade_no: depositReferResult.data.out_trade_no },
                                })
                                // 警告：this.alipayPayDialogVisible = true 不能放到这里
                            ];
                        case 2:
                            // 缴纳充值--支付宝支付
                            // 这里不需要接收返回值，因为啥都没返回
                            // 二维码是把请求域名加上请求路径再加上请求参数来生成的
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
                            // 启动获取充值金额的计时器
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
        // 点击微信支付对话框关闭按钮
        handleCloseWechatPayDialog: function () {
            this.wechatPayDialogVisible = false;
            this.num = 1;
            // 清除计时器
            clearInterval(this.getDepositTimer);
        },
        // 微信支付
        _wechatPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, payResult, wechatPayQrcodeElement, wechatPayQrcode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 关闭充值对话框
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
                            // 实际支付金额
                            this.payAmount = depositReferResult.data.money.toFixed(2);
                            // 显示微信支付对话框
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
                                // 启动获取充值金额的计时器
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
        // 启动获取充值金额的计时器
        _startGetDepositTimer: function (payMethod) {
            var _this = this;
            this.getDepositTimer = setInterval(function () {
                // 获取个人信息（通过个人信息中的充值金额判断是否缴纳了充值）
                request({
                    url: '/api/Vip/mineVip',
                }).then(function (res) {
                    if (+res.code === 200) {
                        // 判断发布赛事
                        if (res.data.vip_time != _this.userCont.vip_time) {
                            // 清除计时器
                            clearInterval(_this.getDepositTimer);
                            _this.$alert('<div style="text-align: center; font-size: 20px;">充值成功</div>', '', {
                                confirmButtonText: '确定',
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
                            console.log('充值', +res.data.deposit);
                        }
                    }
                });
            }, 3000);
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
            this.number = theRequest.number;
            this.type = theRequest.type;
        },
    }
});
