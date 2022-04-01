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
            payPassword: '', // 支付密码
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
        // 点击学棋开始学习按钮托管(未生成订单)
        onStudytgClick: function (item) {
            this.depositDialogVisible = true;
            this.depositAmount = item.total_money;
            this.order_id = item.id;
        },
        // 点击学棋开始学习按钮托管（生成订单未支付)
        onpayClick: function () {
            this.depositDialogShow = true;
            this.depositAmount = item.total_money;
            this.order_id = item.id;
        },
        // 关闭学棋开始学习弹框页面
        handleCloseDepositDialog: function () {
            this.depositDialogVisible = false;
            this.depositAmount = '';
            this.order_id = '';
        },
        // 确定支付开始学课费用
        confirmPayDeposit: function () {
            return __awaiter(this, void 0, void 0, function () {
                var userInfoResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.payMethod === 1)) return [3 /*break*/, 2];
                            // 钱包支付
                            console.log('钱包支付');
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
                            if (this.payMethod === 2) {
                                // 支付宝支付
                                console.log('支付宝支付');
                                // 支付宝支付
                                this._alipayPay();
                            }
                            else if (this.payMethod === 3) {
                                // 微信支付
                                console.log('微信支付');
                                this._wechatPay();
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // 钱包支付
        _walletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                url: '/api/Bangwenpush/beginLearnManaged',
                                method: 'post',
                                data: { pay_type: 1, order_id: this.order_id },
                            })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (+depositReferResult.code === 200) {
                                // 关闭保证金对话框
                                this.depositDialogVisible = false;
                                // 实际支付金额
                                this.payAmount = depositReferResult.data.money;
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
        // 点击钱包关闭弹框
        handleCloseWalletPayDialog: function () {
            this.walletPayDialogVisible = false;
        },
        // 点击钱包确定按钮
        handleSubmitWalletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var payPassword, payResult;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.payPassword)
                                layer.msg('请输入支付密码');
                            // 对密码进行加密
                            encrypt.setPublicKey(publiukey);
                            payPassword = encrypt.encrypt(this.payPassword) //需要加密的内容
                            ;
                            return [4 /*yield*/, request({
                                    url: '/api/Deposit/balancePay',
                                    method: 'post',
                                    data: { out_trade_no: depositReferResult.data.out_trade_no, pay_pwd: payPassword },
                                })];
                        case 1:
                            payResult = _a.sent();
                            if (+payResult.code === 200) {
                                this.$alert('<div style="text-align: center; font-size: 20px;">支付成功</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 关闭钱包支付对话框
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
        // 支付宝支付
        _alipayPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, alipayPayQrcodeElement, alipayPayQrcode, queryString, codeUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 关闭保证金对话框
                            this.depositDialogVisible = false;
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/beginLearnManaged',
                                    method: 'post',
                                    data: { pay_type: 2, order_id: this.order_id },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            // 实际支付金额
                            this.payAmount = depositReferResult.data.money;
                            // 显示支付宝支付对话框
                            this.alipayPayDialogVisible = true;
                            // 开始学课--支付宝支付
                            // 这里不需要接收返回值，因为啥都没返回
                            // 二维码是把请求域名加上请求路径再加上请求参数来生成的
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/aliPay',
                                    params: { order_num: depositReferResult.data.order_num },
                                })
                                // 警告：this.alipayPayDialogVisible = true 不能放到这里
                            ];
                        case 2:
                            // 开始学课--支付宝支付
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
                            codeUrl = baseURL + '/api/Bangwenpush/aliPay?' + queryString;
                            console.log('codeUrl', codeUrl);
                            alipayPayQrcode.makeCode(codeUrl);
                            // 启动获取保证金金额的计时器
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
        // 关闭支付宝支付对话框
        handleCloseAlipayPayDialog: function () {
            console.log('关闭支付宝支付对话框');
            this.alipayPayDialogVisible = false;
            // 清除计时器
            clearInterval(this.getDepositTimer);
            // 打开保证金对话框
            // this.depositDialogVisible = true
        },
        // 微信支付
        _wechatPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult, payResult, wechatPayQrcodeElement, wechatPayQrcode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 关闭保证金对话框
                            this.depositDialogVisible = false;
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/beginLearnManaged',
                                    method: 'post',
                                    data: { pay_type: 3, order_id: this.order_id },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            // 实际支付金额
                            this.payAmount = depositReferResult.data.money;
                            // 显示微信支付对话框
                            this.wechatPayDialogVisible = true;
                            return [4 /*yield*/, request({
                                    url: '/api/Bangwenpush/wxPay',
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
                                // 启动获取保证金金额的计时器
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
        // 关闭微信支付对话框
        handleCloseWechatPayDialog: function () {
            console.log('关闭微信支付对话框');
            this.wechatPayDialogVisible = false;
            // 清除计时器
            clearInterval(this.getDepositTimer);
            // 打开保证金对话框
            // this.depositDialogVisible = true
        },
        // 启动获取保证金金额的计时器
        _startGetDepositTimer: function (payMethod) {
            var _this = this;
            this.getDepositTimer = setInterval(function () {
                // 获取个人信息（通过个人信息中的保证金金额判断是否缴纳了保证金）
                request({
                    url: '/api/Mine/info',
                }).then(function (result) {
                    if (+result.code === 200) {
                        if (+result.data.deposit !== 0) {
                            // 清除计时器
                            clearInterval(_this.getDepositTimer);
                            _this.$alert('<div style="text-align: center; font-size: 20px;">保证金缴纳成功</div>', '', {
                                confirmButtonText: '确定',
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
                            console.log('保证金', +result.data.deposit);
                        }
                    }
                });
            }, 3000);
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
