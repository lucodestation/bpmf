"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
                title: '',
                b_id: '',
                total_money: '',
                is_trustee: '1',
                pay_num_type: '1',
                pay_num: '1',
                more_type: '1',
                win_type: '1',
                win_num: '1',
                task_start_time: '',
                task_end_time: '',
                signup_start_time: '',
                signup_end_time: '',
                detail: '',
                image: '',
                files: '',
                mobile: '',
                qq: '',
                email: '',
                moneys: '', // 如果是多次付清的自定义金额，如10,5,5
            },
            monthnum: '',
            typeList: [{ id: 1, name: '教课' }, { id: 2, name: '学课' }],
            cateList: [],
            trusteeList: [{ id: 1, name: '托管' }, { id: 2, name: '不托管' }],
            payList: [{ id: 1, name: '一次付清' }, { id: 2, name: '多次付清' }],
            moreList: [{ id: 1, name: '均分金额' }, { id: 2, name: '自定义金额' }],
            winList: [{ id: 1, name: '单人中榜' }, { id: 2, name: '多人中榜' }],
            competitionSignUpStartTimeMinValue: new Date().valueOf(),
            ordeList: [],
            totalMoney: '',
            num: '',
            id: '',
            coverImage: {},
            affixList: [],
            isShow: false, // 是否同意协议
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
            var res, initSignUpEndDate, initSignUpEndDate1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.GetRequest();
                        return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Bangwen/cate'
                            })];
                    case 1:
                        res = _a.sent();
                        if (res.code == 200) {
                            this.cateList = res.data;
                            this.formData.b_id = res.data[0].id;
                        }
                        if (this.id) {
                            request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: { bangwen_id: this.id }, }).then(function (res) {
                                if (res.code == 200) {
                                    _this.formData = {
                                        type: res.data.type,
                                        title: res.data.title,
                                        b_id: res.data.b_id,
                                        total_money: res.data.total_money,
                                        is_trustee: res.data.is_trustee,
                                        pay_num_type: res.data.pay_num_type,
                                        pay_num: res.data.pay_num,
                                        more_type: res.data.more_type,
                                        win_type: res.data.win_type,
                                        win_num: res.data.win_num,
                                        task_start_time: res.data.task_start_time,
                                        task_end_time: res.data.task_end_time,
                                        signup_start_time: res.data.signup_start_time,
                                        signup_end_time: res.data.signup_end_time,
                                        detail: res.data.detail,
                                        image: res.data.image,
                                        files: res.data.files,
                                        mobile: res.data.mobile,
                                        qq: res.data.qq,
                                        email: res.data.email,
                                        moneys: '',
                                        bangwen_id: _this.id, // 榜文id
                                    };
                                    _this.totalMoney = res.data.total_money;
                                    res.data.moneys.map(function (item, k) {
                                        item.num = item.money;
                                        item.id = k + 1;
                                    });
                                    _this.ordeList = res.data.moneys;
                                    var arr1 = [];
                                    for (var i in res.data.moneys) {
                                        arr1.push(res.data.moneys[i].num);
                                    }
                                    _this.formData.moneys = arr1.toString();
                                }
                            });
                        }
                        // 报名起始时间
                        layui.laydate.render({
                            elem: '#signUpStartDate',
                            theme: '#FF7F17',
                            btns: ['clear', 'confirm'],
                            min: this.competitionSignUpStartTimeMinValue,
                            // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                            change: function (value, date) { },
                            // 点击清空、现在、确定都会触发
                            done: function (value, date) {
                                _this.formData.task_start_time = value;
                                if (value) {
                                    initSignUpEndDate();
                                }
                            },
                        });
                        // 初始化报名结束时间
                        if (this.id) {
                            layui.laydate.render({
                                elem: '#signUpEndDate',
                                theme: '#FF7F17',
                                btns: ['clear', 'confirm'],
                                min: this.competitionSignUpStartTimeMinValue,
                                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                                change: function (value, date) { },
                                // 点击清空、现在、确定都会触发
                                done: function (value, date) {
                                    console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                                    var dateValue = value;
                                    if (!value) {
                                        dateValue = '';
                                    }
                                    else if (new Date(_this.formData.task_start_time) > new Date(dateValue)) {
                                        console.log('报名截止日期不能小于报名起始日期');
                                        layer.open({
                                            type: 0,
                                            icon: 0,
                                            title: false,
                                            content: '报名截止日期不能小于报名起始日期',
                                            btn: ['重新选择']
                                        });
                                        dateValue = '';
                                    }
                                    _this.formData.task_end_time = dateValue;
                                },
                            });
                        }
                        else {
                            initSignUpEndDate = function () {
                                // 报名结束时间
                                layui.laydate.render({
                                    elem: '#signUpEndDate',
                                    theme: '#FF7F17',
                                    btns: ['clear', 'confirm'],
                                    min: _this.competitionSignUpStartTimeMinValue,
                                    // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                                    change: function (value, date) { },
                                    // 点击清空、现在、确定都会触发
                                    done: function (value, date) {
                                        console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                                        var dateValue = value;
                                        if (!value) {
                                            dateValue = '';
                                        }
                                        else if (new Date(_this.formData.task_start_time) > new Date(dateValue)) {
                                            console.log('报名截止日期不能小于报名起始日期');
                                            layer.open({
                                                type: 0,
                                                icon: 0,
                                                title: false,
                                                content: '报名截止日期不能小于报名起始日期',
                                                btn: ['重新选择']
                                            });
                                            dateValue = '';
                                        }
                                        _this.formData.task_end_time = dateValue;
                                    },
                                });
                            };
                        }
                        // 报名起始时间
                        layui.laydate.render({
                            elem: '#startDate1',
                            theme: '#FF7F17',
                            btns: ['clear', 'confirm'],
                            min: this.competitionSignUpStartTimeMinValue,
                            // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                            change: function (value, date) { },
                            // 点击清空、现在、确定都会触发
                            done: function (value, date) {
                                _this.formData.signup_start_time = value;
                                if (value) {
                                    initSignUpEndDate1();
                                }
                            },
                        });
                        // 初始化报名结束时间
                        if (this.id) {
                            layui.laydate.render({
                                elem: '#endDate2',
                                theme: '#FF7F17',
                                btns: ['clear', 'confirm'],
                                min: this.competitionSignUpStartTimeMinValue,
                                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                                change: function (value, date) { },
                                // 点击清空、现在、确定都会触发
                                done: function (value, date) {
                                    console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                                    var dateValue = value;
                                    if (!value) {
                                        dateValue = '';
                                    }
                                    else if (new Date(_this.formData.task_start_time) > new Date(dateValue)) {
                                        console.log('报名截止日期不能小于报名起始日期');
                                        layer.open({
                                            type: 0,
                                            icon: 0,
                                            title: false,
                                            content: '报名截止日期不能小于报名起始日期',
                                            btn: ['重新选择']
                                        });
                                        dateValue = '';
                                    }
                                    _this.formData.signup_end_time = dateValue;
                                },
                            });
                        }
                        else {
                            initSignUpEndDate1 = function () {
                                // 报名结束时间
                                layui.laydate.render({
                                    elem: '#endDate2',
                                    theme: '#FF7F17',
                                    btns: ['clear', 'confirm'],
                                    min: _this.competitionSignUpStartTimeMinValue,
                                    // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                                    change: function (value, date) { },
                                    // 点击清空、现在、确定都会触发
                                    done: function (value, date) {
                                        console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                                        var dateValue = value;
                                        if (!value) {
                                            dateValue = '';
                                        }
                                        else if (new Date(_this.formData.task_start_time) > new Date(dateValue)) {
                                            console.log('报名截止日期不能小于报名起始日期');
                                            layer.open({
                                                type: 0,
                                                icon: 0,
                                                title: false,
                                                content: '报名截止日期不能小于报名起始日期',
                                                btn: ['重新选择']
                                            });
                                            dateValue = '';
                                        }
                                        _this.formData.signup_end_time = dateValue;
                                    },
                                });
                            };
                        }
                        // 初始化选择封面图
                        this.initCoverImageFileChange();
                        return [2 /*return*/];
                }
            });
        });
    },
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var realNameAuthResult, userInfoResult, vipInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request({
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
        // 点击是否同意协议
        onXuanzhongClick: function () {
            this.isShow = this.isShow == 0 ? 1 : 0;
        },
        // 初始化选择封面图
        initCoverImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#uploadCover',
                auto: false,
                accept: 'images',
                acceptMime: '.jpg,.png,.bmp,.jpeg',
                exts: 'jpg|png|bmp|jpeg',
                size: 0,
                multiple: false,
                // 选择文件回调
                choose: function (result) {
                    console.log(result);
                    //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                    result.preview(function (index, file, result) {
                        // console.log(index) //得到文件索引
                        // console.log(file) //得到文件对象
                        // console.log(result) //得到文件base64编码，比如图片
                        _this.coverImage = {
                            // 用于提交数据
                            file: file,
                            // 用于页面展示
                            url: result,
                        };
                        console.log(_this.coverImage);
                    });
                },
            });
        },
        // 选择附件
        handleAffixFileChange: function (event) {
            var element = event.target || event.srcElement;
            // 获取文件对象数组
            var files = element.files;
            // 存储符合规定的文件
            var tempArr = __spreadArray([], this.affixList, true);
            // 存储所选文件中不支持的扩展名
            var errorArr = [];
            // 存储所选文件中超过指定大小的文件名
            var errorArr2 = [];
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var item = files_1[_i];
                // 做多上传 5 个文件
                if (tempArr.length < 5) {
                    var filesNameList = this.affixList.length ? this.affixList.map(function (i) { return i.name; }) : [];
                    // （如果不存在文件名）禁止添加同名文件
                    if (!filesNameList.includes(item.name)) {
                        console.log(item);
                        if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
                            if (!errorArr.includes(util.getExtensionName(item.name))) {
                                errorArr.push(util.getExtensionName(item.name));
                            }
                        }
                        else if (item.size > 2048 * 1024) {
                            if (!errorArr2.includes(item.name)) {
                                errorArr2.push(item.name);
                            }
                        }
                        else if (tempArr.length < 5) {
                            tempArr.push(item);
                        }
                    }
                }
            }
            console.log('tempArr', tempArr.length, tempArr);
            if (tempArr.length < 5 && errorArr.length) {
                console.log('errorArr', errorArr);
                layer.open({
                    type: 0,
                    icon: 0,
                    title: '不受支持的文件类型',
                    content: '您选择的 ' + __spreadArray([], errorArr, true) + ' 类型的文件不受支持',
                    btn: ['重新选择'],
                });
            }
            else if (errorArr2.length) {
                console.log('errorArr2', errorArr2);
                layer.open({
                    type: 0,
                    icon: 0,
                    title: '文件过大',
                    content: '请选择 2M 以内的文件',
                    btn: ['重新选择'],
                });
            }
            this.affixList = tempArr;
            element.value = '';
            console.log(__assign({}, this.affixList));
        },
        // 删除附件
        handleDeleteAffix: function (index) {
            this.affixList = this.affixList.filter(function (item, ind) { return index !== ind; });
        },
        // 点击支付方式判断
        getpaynumSelected: function () {
            if (this.totalMoney == '') {
                if (this.formData.pay_num_type == 2) {
                    layer.msg('酬金额度不能为空');
                    this.formData.pay_num_type = 1;
                }
            }
            if (this.formData.pay_num_type == 1) {
                this.formData.pay_num = 1;
                this.formData.more_type = 1;
                this.formData.moneys = '';
            }
        },
        // 支付方式多次支付计算
        getCouponSelected: function () {
            var arr = [];
            var num = 0;
            var month = Math.floor(this.formData.total_money / this.formData.pay_num * 100) / 100; // 平分
            for (var i = 1; i <= this.formData.pay_num; i++) {
                num = num + month;
                arr.push({ id: i, num: month });
            }
            // 判断平分数据和是否等于酬金额度，如果不相等最后一个价格重新计算
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
        // 提交
        onBtnClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var reg_tel, reg_tel, reg_tel, _a, affixUrlArr;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.formData.title)
                                return [2 /*return*/, layer.msg('请输入标题')];
                            if (!this.formData.total_money)
                                return [2 /*return*/, layer.msg('请输入金额')];
                            if (!this.formData.detail)
                                return [2 /*return*/, layer.msg('请输入榜文详情')];
                            if (this.isShow == 0)
                                return [2 /*return*/, layer.msg('请阅读并同意协议')];
                            if (this.formData.mobile) {
                                reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
                                ;
                                if (!reg_tel.test(this.formData.mobile))
                                    return [2 /*return*/, layer.msg('请输入正确的手机号')];
                            }
                            if (this.formData.qq) {
                                reg_tel = /^[1-9][0-9]{4,10}$/gim;
                                if (!reg_tel.test(this.formData.qq))
                                    return [2 /*return*/, layer.msg('请输入正确的QQ')];
                            }
                            if (this.formData.email) {
                                reg_tel = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                                if (!reg_tel.test(this.formData.email))
                                    return [2 /*return*/, layer.msg('请输入正确的邮箱')];
                            }
                            _a = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.coverImage.file,
                                    fileName: this.coverImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('上传封面图失败', error);
                                    layer.msg('上传封面图失败');
                                })];
                        case 1:
                            _a.image = _b.sent();
                            if (!this.formData.image)
                                return [2 /*return*/];
                            return [4 /*yield*/, util
                                    .uploadMultipleFile(this.affixList.map(function (item) {
                                    console.log('affixList item', item);
                                    return {
                                        file: item,
                                        fileName: item.name,
                                    };
                                }))
                                    .catch(function (error) {
                                    console.log('上传附件失败', error);
                                    layer.msg('上传附件失败');
                                })];
                        case 2:
                            affixUrlArr = _b.sent();
                            if (!affixUrlArr)
                                return [2 /*return*/];
                            this.formData.files = affixUrlArr.toString();
                            // for (let i = 0; i <= this.ordeList.length; i++) {
                            //   if (this.ordeList[i].num == 0 || this.ordeList[i].num == '') {
                            //     return layer.msg('多次支付里面金额不能为空')
                            //   }
                            // }
                            if (this.id) {
                                // 修改
                                request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: this.formData }).then(function (res) {
                                    if (res.code == 200) {
                                        location.href = './noticeList.html';
                                    }
                                    else {
                                        layer.msg(res.msg);
                                    }
                                });
                            }
                            else {
                                // 添加
                                request({ url: '/api/Bangwen/pushBangwen', method: 'post', data: this.formData }).then(function (res) {
                                    if (res.code == 200) {
                                        location.href = './noticeList.html';
                                    }
                                    else {
                                        layer.msg(res.msg);
                                    }
                                });
                            }
                            return [2 /*return*/];
                    }
                });
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
    }
});
