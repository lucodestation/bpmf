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
// 支付密码页面
var walletPwdPage = '/userCont/wallet/pwd.html';
// 我的钱包页面（余额不足需要充值跳到这个页面）
var walletAccountPage = '/userCont/wallet/account.html';
// 实名认证页面
var setupRealNamePage = '/userCont/setup/realName.html';
// 开通会员页面
var memberPage = '/userCont/member/member.html';
Vue.use(ELEMENT);
Vue.component('deposit-dialog', {
    template: '#depositDialog',
    data: function () {
        return {
            // 保证金弹框是否显示
            depositDialogVisible: false,
            // 支付方式 1余额支付，2支付宝支付，3微信支付
            payMethod: 1,
            // 保证金金额
            depositAmount: 0,
            // 实际支付金额
            payAmount: 0,
            // 钱包支付对话框是否显示
            walletPayDialogVisible: false,
            // 支付密码
            payPassword: '',
            // 支付宝支付对话框是否显示
            alipayPayDialogVisible: false,
            // 微信支付对话框是否显示
            wechatPayDialogVisible: false,
            // 获取保证金计时器（用于判断是否支付成功）
            getDepositTimer: '',
        };
    },
    created: function () {
        var _this = this;
        request({
            url: '/api/Login/setting',
        }).then(function (result) {
            if (+result.code === 200) {
                _this.depositAmount = result.data.plat_deposit;
            }
        });
    },
    methods: {
        // 打开保证金对话框
        handleOpenDepositDialog: function () {
            this.depositDialogVisible = true;
        },
        // 关闭保证金对话框
        handleCloseDepositDialog: function () {
            this.depositDialogVisible = false;
            // 返回上个页面
            window.history.go(-1);
        },
        // 确认支付保证金
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
        // 关闭钱包支付对话框
        handleCloseWalletPayDialog: function () {
            console.log('关闭钱包支付对话框');
            this.walletPayDialogVisible = false;
            this.payPassword = '';
            // 打开保证金对话框
            this.depositDialogVisible = true;
        },
        // 钱包支付
        _walletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var depositReferResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                url: '/api/Deposit/refer',
                                method: 'post',
                                data: { pay_type: 1 },
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
        // 提交钱包支付（钱包支付对话框点击确定）
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
                                this.$alert('<div style="text-align: center; font-size: 20px;">保证金缴纳成功</div>', '', {
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
                                    url: '/api/Deposit/refer',
                                    method: 'post',
                                    data: { pay_type: 2 },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            // 实际支付金额
                            this.payAmount = depositReferResult.data.money;
                            // 显示支付宝支付对话框
                            this.alipayPayDialogVisible = true;
                            // 缴纳保证金--支付宝支付
                            // 这里不需要接收返回值，因为啥都没返回
                            // 二维码是把请求域名加上请求路径再加上请求参数来生成的
                            return [4 /*yield*/, request({
                                    url: '/api/Deposit/aliPay',
                                    params: { out_trade_no: depositReferResult.data.out_trade_no },
                                })
                                // 警告：this.alipayPayDialogVisible = true 不能放到这里
                            ];
                        case 2:
                            // 缴纳保证金--支付宝支付
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
                            codeUrl = baseURL + '/api/Deposit/aliPay?' + queryString;
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
            this.depositDialogVisible = true;
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
                                    url: '/api/Deposit/refer',
                                    method: 'post',
                                    data: { pay_type: 3 },
                                })];
                        case 1:
                            depositReferResult = _a.sent();
                            if (!(+depositReferResult.code === 200)) return [3 /*break*/, 3];
                            // 实际支付金额
                            this.payAmount = depositReferResult.data.money;
                            // 显示微信支付对话框
                            this.wechatPayDialogVisible = true;
                            return [4 /*yield*/, request({
                                    url: '/api/Deposit/wxPay',
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
            this.depositDialogVisible = true;
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
    },
});
new Vue({
    el: '#app',
    data: function () {
        return {
            // 表单数据
            formData: {
                type: '1',
                join_type: '1',
                c_id: '',
                title: '',
                start_time: '',
                end_time: '',
                descri: '',
                image: '',
                password: '', // 密码进入，此值必传
            },
            cateList: [],
            startDate: new Date().valueOf(),
            signUpStartDate: '',
            signUpEndDate: '',
            coverImage: {},
            push_url: '',
            checkNum: 0, // 是否选中
        };
    },
    created: function () {
        var _this = this;
        // 直播分类
        request({ url: '/api/Live/liveCates', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
                _this.formData.c_id = res.data[0].id;
            }
        });
    },
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var realNameAuthResult, userInfoResult, vipInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 开始时间
                        this.initSignUpStartDate(this.$refs.signUpStartDate);
                        // 结束时间
                        this.initSignUpEndDate(this.$refs.signUpEndDate);
                        return [4 /*yield*/, request({
                                url: '/api/Mine/realInfo',
                            })];
                    case 1:
                        realNameAuthResult = _a.sent();
                        if (+realNameAuthResult.code === 200) {
                            if (+realNameAuthResult.data.check_status === -2) {
                                // check_status -2未提交，-1审核失败，0待审核，1已通过
                                this.$alert('<div style="text-align: center; font-size: 20px;">请先进行实名认证</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 实名认证页面
                                        window.location.href = setupRealNamePage;
                                    },
                                });
                                return [2 /*return*/];
                            }
                            else if (+realNameAuthResult.data.check_status === -1) {
                                // check_status -2未提交，-1审核失败，0待审核，1已通过
                                this.$alert('<div style="text-align: center; font-size: 20px;">实名认证审核失败，请重新上传</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 实名认证页面
                                        window.location.href = setupRealNamePage;
                                    },
                                });
                                return [2 /*return*/];
                            }
                            else if (+realNameAuthResult.data.check_status === 0) {
                                // check_status -2未提交，-1审核失败，0待审核，1已通过
                                this.$alert('<div style="text-align: center; font-size: 20px;">实名认证审核中...</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 返回上个页面
                                        window.history.go(-1);
                                    },
                                });
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, request({
                                url: '/api/Mine/info',
                            })];
                    case 2:
                        userInfoResult = _a.sent();
                        if (+userInfoResult.code === 200) {
                            if (+userInfoResult.data.deposit === 0) {
                                // 如果保证金为 0
                                // 打开保证金对话框
                                this.$refs.depositDialog.handleOpenDepositDialog();
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, request({
                                // 我的特权接口
                                url: '/api/Vip/mineVip',
                            })];
                    case 3:
                        vipInfo = _a.sent();
                        if (+vipInfo.code === 200) {
                            if (+vipInfo.data.live_num === 0) {
                                this.$alert('<div style="text-align: center; font-size: 20px;">直播发布次数不足，请购买次数</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 开通会员页面
                                        window.location.href = memberPage;
                                    },
                                });
                                return [2 /*return*/];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // 开始时间
        initSignUpStartDate: function (elem) {
            var _this = this;
            console.log(elem);
            layui.laydate.render({
                elem: elem,
                theme: '#FF7F17',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                btns: ['clear', 'confirm'],
                min: this.startDate,
                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                change: function (value, date) { },
                // 点击清空、现在、确定都会触发
                done: function (value, date) {
                    // console.log(value) //得到日期生成的值，如：2022-03-09 00:00
                    // console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    // console.log('报名开始时间', typeof dateValue, dateValue)
                    // 设置报名开始时间（页面显示用）
                    _this.signUpStartDate = dateValue;
                    // 设置报名开始时间（提交数据用）
                    _this.formData.start_time = dateValue;
                    // 如果报名结束时间存在且比报名开始时间小（或相等）
                    if (_this.signUpEndDate && _this.signUpEndDate <= _this.signUpStartDate) {
                        // 清空报名结束时间
                        _this.signUpEndDate = '';
                        _this.formData.end_time = '';
                    }
                },
            });
        },
        // 结束时间
        initSignUpEndDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
                theme: '#FF7F17',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                btns: ['clear', 'confirm'],
                min: this.startDate,
                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                change: function (value, date) { },
                // 点击清空、现在、确定都会触发
                done: function (value, date) {
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (!_this.signUpStartDate) {
                        // 如果还没有选择报名开始时间
                        layer.msg('请先选择开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.signUpStartDate.replace(/-/g, '/'))) {
                        // 如果报名结束时间小于报名开始时间
                        layer.msg('结束时间要大于开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    console.log('报名结束时间', dateValue);
                    _this.signUpEndDate = dateValue;
                    _this.formData.end_time = dateValue;
                },
            });
        },
        // 上传头像
        handleCoverFileChange: function (event) {
            var element = event.target || event.srcElement;
            // 获取文件对象
            var file = element.files[0];
            console.log(file);
            // .png,.jpg,.jpeg,.bmp
            if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
                layer.msg("\u4E0D\u652F\u6301 ".concat(util.getExtensionName(file.name), " \u6587\u4EF6"));
                return;
            }
            window.URL = window.URL || window.webkitURL;
            this.coverImage = {
                // 用于提交数据
                file: file,
                // 用于页面展示
                url: window.URL.createObjectURL(file),
            };
        },
        onintClick: function () {
            this.checkNum = this.checkNum == 0 ? 1 : 0;
        },
        // 提交申请
        onAddClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadingIndex, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.formData.join_type == 4) {
                                if (!this.formData.password)
                                    return [2 /*return*/, layer.msg('请输入设置密码')];
                                if (this.formData.password.length != 6)
                                    return [2 /*return*/, layer.msg('密码长度为6位')];
                            }
                            if (!this.formData.title)
                                return [2 /*return*/, layer.msg('请输入直播讲解主题')];
                            if (!this.formData.start_time)
                                return [2 /*return*/, layer.msg('请选择开始时间')];
                            if (!this.formData.end_time)
                                return [2 /*return*/, layer.msg('请选择结束时间')];
                            if (!this.formData.descri)
                                return [2 /*return*/, layer.msg('请输入直播内容')];
                            if (!this.coverImage.file)
                                return [2 /*return*/, layer.msg('请上传直播封面')];
                            if (this.checkNum == 0)
                                return [2 /*return*/, layer.msg('请阅读并同意协议')];
                            loadingIndex = layer.load(1, {
                                shade: [0.5, '#000'],
                                time: 10 * 1000, // 如果十秒还没关闭则自动关闭
                            });
                            // 上传封面图
                            _a = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.coverImage.file,
                                    fileName: this.coverImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('上传直播头像', error);
                                    layer.close(loadingIndex);
                                    layer.msg('上传直播头像');
                                })];
                        case 1:
                            // 上传封面图
                            _a.image = _b.sent();
                            if (!this.formData.image)
                                return [2 /*return*/];
                            request({ url: '/api/Live/push', method: 'POST', data: this.formData, }).then(function (res) {
                                layer.close(loadingIndex);
                                if (res.code == 200) {
                                    if (res.data.status == 1) {
                                        location.href = '/live/liveSuccess.html?push_url=' + res.data.push_url;
                                    }
                                    else {
                                        location.href = '/live/liveSuccess.html';
                                    }
                                }
                                else {
                                    layer.msg(result.msg);
                                }
                            }).catch(function (error) {
                                console.log(error);
                                layer.close(loadingIndex);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
    }
});
