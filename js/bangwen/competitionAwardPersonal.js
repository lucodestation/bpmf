"use strict";
// 发布比赛个人赛赛事奖励
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
// 引入头部
$('.public-header').load('/components/PublicHeader.html');
// 引入底部
$('.public-footer').load('/components/PublicFooter.html');
var encrypt = new JSEncrypt();
// 我的钱包页面（余额不足需要充值跳到这个页面）
var walletAccountPage = '/userCont/wallet/account.html';
var myReleasedCompetitionPage = '/userCont/competition/myReleasedCompetition.html';
new Vue({
    el: '#app',
    data: function () {
        return {
            competitionId: '',
            formData: {
                competition_id: '',
                award_type: 1,
                champion_num: '',
                champion_money: '',
                runner_up_num: '',
                runner_up_money: '',
                third_winner_num: '',
                third_winner_money: '',
                memo: '',
                total_money: 0,
                trusteeship: '',
                pay_way: '', // trusteeship=1的时候传此参数，1=我的钱包，2=支付宝，3=微信
            },
            // 冠军奖金
            championAward: 0,
            // 亚军奖金
            runnerUpAward: 0,
            // 季军奖金
            thirdWinnerAward: 0,
            // 实际支付金额
            payAmount: 0,
            // 支付订单号
            outTradeNo: '',
            // 钱包支付对话框是否显示
            walletPayDialogVisible: false,
            // 支付密码
            payPassword: '',
            // 支付宝支付对话框是否显示
            alipayPayDialogVisible: false,
            // 微信支付对话框是否显示
            wechatPayDialogVisible: false,
            // 获取赛事信息计时器（用于判断是否支付成功）
            getCompetitionDetailTimer: '',
        };
    },
    created: function () {
        // 解析 url 中的查询字符串
        var searchParams = Qs.parse(location.search.substr(1));
        this.competitionId = searchParams.competition_id * 1;
        this.formData.competition_id = searchParams.competition_id * 1;
    },
    computed: {
        // 计算属性，为了 watch 时同时监听两个值的变化时处理同一套逻辑
        champion: function () {
            return { num: this.formData.champion_num, money: this.formData.champion_money };
        },
        runnerUp: function () {
            return { num: this.formData.runner_up_num, money: this.formData.runner_up_money };
        },
        thirdWinner: function () {
            return { num: this.formData.third_winner_num, money: this.formData.third_winner_money };
        },
    },
    watch: {
        // 两个值有其中一个值发生变化就会触发 watch
        champion: function (newValue) {
            if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
                // 都是正整数
                this.championAward = newValue.num * newValue.money;
            }
            else {
                this.championAward = 0;
            }
            this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward;
        },
        runnerUp: function (newValue) {
            if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
                // 都是正整数
                this.runnerUpAward = newValue.num * newValue.money;
            }
            else {
                this.runnerUpAward = 0;
            }
            this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward;
        },
        thirdWinner: function (newValue) {
            if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
                // 都是正整数
                this.thirdWinnerAward = newValue.num * newValue.money;
            }
            else {
                this.thirdWinnerAward = 0;
            }
            this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward;
        },
    },
    methods: {
        // 测试
        handleTest: function () {
            console.log('测试');
        },
        // 验证要提交的数据
        _validateFormData: function () {
            var arr = [];
            arr.push({ label: '请输入冠军数量', validate: !this.formData.champion_num }, { label: '数量必须是大于 0 的整数', validate: this.formData.champion_num < 0 || parseInt(this.formData.champion_num) < this.formData.champion_num }, { label: '请输入冠军奖励金额', validate: !this.formData.champion_money }, { label: '奖励金额必须是大于 0 的整数', validate: this.formData.champion_money < 0 || parseInt(this.formData.champion_money) < this.formData.champion_money }, { label: '请输入亚军数量', validate: !this.formData.runner_up_num }, { label: '数量必须是大于 0 的整数', validate: this.formData.runner_up_num < 0 || parseInt(this.formData.runner_up_num) < this.formData.runner_up_num }, { label: '请输入亚军奖励金额', validate: !this.formData.runner_up_money }, { label: '奖励金额必须是大于 0 的整数', validate: this.formData.runner_up_money < 0 || parseInt(this.formData.runner_up_money) < this.formData.runner_up_money }, { label: '请输入季军数量', validate: !this.formData.third_winner_num }, { label: '数量必须是大于 0 的整数', validate: this.formData.third_winner_num < 0 || parseInt(this.formData.third_winner_num) < this.formData.third_winner_num }, { label: '请输入季军奖励金额', validate: !this.formData.third_winner_money }, { label: '奖励金额必须是大于 0 的整数', validate: this.formData.third_winner_money < 0 || parseInt(this.formData.third_winner_money) < this.formData.third_winner_money }, { label: '请选择奖金托管方式', validate: !this.formData.trusteeship });
            if (this.formData.trusteeship === 1) {
                arr.push({ label: '请选择支付方式', validate: !this.formData.pay_way });
            }
            var errorArr = arr.filter(function (item) { return item.validate; });
            if (errorArr.length) {
                layer.msg(errorArr[0].label);
            }
            else {
                return true;
            }
        },
        // 下一步
        handleNextStep: function () {
            var _this = this;
            // 校验数据
            if (!this._validateFormData())
                return;
            if (this.formData.trusteeship === 2) {
                this.formData.pay_way = '';
            }
            console.table(__assign({}, this.formData));
            // 加载中
            var loadingIndex = layer.load(1, {
                shade: [0.5, '#000'], // 0.1透明度的白色背景
            });
            request({
                url: '/api/competition/push_award',
                method: 'post',
                data: this.formData,
            })
                .then(function (result) {
                layer.close(loadingIndex);
                console.log(result);
                if (result.code === 200) {
                    // 发布成功
                    console.log('发布成功');
                    if (!result.data.pay_check) {
                        // 不需要支付
                        _this.$alert('<div style="text-align: center; font-size: 20px;">奖励设置成功</div>', '', {
                            confirmButtonText: '确定',
                            showClose: false,
                            dangerouslyUseHTMLString: true,
                            confirmButtonClass: 'orange-button-bg',
                            callback: function () {
                                // 跳转到个人赛发布赛事成功页面
                                location.href = "/bangwen/releaseCompetitionSuccess.html?competition_id=".concat(_this.competitionId);
                            },
                        });
                    }
                    else if (result.data.pay_check && +result.data.pay_way === 1) {
                        // 1=余额，2=支付宝，3=微信
                        _this.payAmount = result.data.total_money;
                        _this.outTradeNo = result.data.out_trade_no;
                        _this.walletPayDialogVisible = true;
                    }
                    else if (result.data.pay_check && +result.data.pay_way === 2) {
                        // 1=余额，2=支付宝，3=微信
                        _this.payAmount = result.data.total_money;
                        _this.outTradeNo = result.data.out_trade_no;
                        // 打开支付宝支付对话框
                        _this._openAlipayPayDialog();
                    }
                    else if (result.data.pay_check && +result.data.pay_way === 3) {
                        // 1=余额，2=支付宝，3=微信
                        _this.payAmount = result.data.total_money;
                        _this.outTradeNo = result.data.out_trade_no;
                        // 打开微信支付对话框
                        _this._openWechatPayDialog();
                    }
                }
                else if (result.code === 201) {
                    // 发布次数不足，跳转购买会员页面
                    console.log('发布次数不足，跳转购买会员页面');
                    layer.msg(result.msg);
                }
                else if (result.code === 202) {
                    // 错误信息
                    console.log('错误信息');
                    layer.msg(result.msg);
                }
                else if (result.code === 203) {
                    // 未绑定手机号
                    console.log('未绑定手机号');
                    layer.msg(result.msg);
                }
                else if (result.code === 205) {
                    // 余额不足
                    console.log('余额不足');
                    layer.msg(result.msg);
                }
                else if (result.code === 206) {
                    // 未交保证金
                    console.log('未交保证金');
                    layer.msg(result.msg);
                    syalert.syopen('bondCont');
                }
                else if (result.code === 207) {
                    // 未实名认证
                    console.log('未实名认证');
                    layer.msg(result.msg);
                }
                else if (result.code === 208) {
                    // 未设置支付密码
                    console.log('未设置支付密码');
                    layer.msg(result.msg);
                }
            })
                .catch(function (error) {
                console.log(error);
                layer.close(loadingIndex);
            });
        },
        // 关闭钱包支付对话框
        handleCloseWalletPayDialog: function () {
            // 跳转到我发布的赛事页面
            location.href = myReleasedCompetitionPage;
        },
        // 确认提交钱包支付
        handleSubmitWalletPay: function () {
            return __awaiter(this, void 0, void 0, function () {
                var payPassword, payResult;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // /api/pay/pay_by_balance
                            if (!this.payPassword)
                                layer.msg('请输入支付密码');
                            // 对密码进行加密
                            encrypt.setPublicKey(publiukey);
                            payPassword = encrypt.encrypt(this.payPassword) //需要加密的内容
                            ;
                            return [4 /*yield*/, request({
                                    url: '/api/pay/pay_by_balance',
                                    method: 'post',
                                    data: {
                                        out_trade_no: this.outTradeNo,
                                        total_money: this.payAmount,
                                        pay_pwd: payPassword,
                                    },
                                })];
                        case 1:
                            payResult = _a.sent();
                            console.log('payResult', payResult);
                            if (+payResult.code === 200) {
                                this.$alert('<div style="text-align: center; font-size: 20px;">奖励设置成功</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 跳转到个人赛发布赛事成功页面
                                        location.href = "/bangwen/releaseCompetitionSuccess.html?competition_id=".concat(_this.competitionId);
                                    },
                                });
                            }
                            else if (+payResult.code === 5) {
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
                                layer.msg(payResult.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 打开支付宝支付对话框
        _openAlipayPayDialog: function () {
            return __awaiter(this, void 0, void 0, function () {
                var alipayPayQrcodeElement, alipayPayQrcode, queryString, codeUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // 显示支付宝支付对话框
                            this.alipayPayDialogVisible = true;
                            // 支付宝支付
                            // 这里不需要接收返回值，因为啥都没返回
                            // 二维码是把请求域名加上请求路径再加上请求参数来生成的
                            return [4 /*yield*/, request({
                                    url: '/api/pay/pay_by_ali',
                                    params: { out_trade_no: this.outTradeNo, total_money: this.payAmount },
                                })
                                // 警告：this.alipayPayDialogVisible = true 不能放到这里
                            ];
                        case 1:
                            // 支付宝支付
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
                                out_trade_no: this.outTradeNo,
                                token: localStorage.getItem('token'),
                            });
                            codeUrl = baseURL + '/api/pay/pay_by_ali?' + queryString;
                            alipayPayQrcode.makeCode(codeUrl);
                            // 启动获取赛事信息计时器
                            this._startGetCompetitionDetailTimer();
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 关闭支付宝支付对话框
        handleCloseAlipayPayDialog: function () {
            // 跳转到我发布的赛事页面
            location.href = myReleasedCompetitionPage;
        },
        // 打开微信支付对话框
        _openWechatPayDialog: function () {
            var _this = this;
            // 显示微信支付对话框
            this.wechatPayDialogVisible = true;
            // 微信支付
            request({
                url: '/api/pay/pay_by_wx',
                method: 'post',
                data: {
                    out_trade_no: this.outTradeNo,
                    total_money: this.payAmount,
                },
            }).then(function (result) {
                if (result.code === 200) {
                    // 警告：this.wechatPayDialogVisible = true 不能放到这里
                    var wechatPayQrcodeElement = document.getElementById('wechatPayQrcode');
                    wechatPayQrcodeElement.innerHTML = '';
                    // 生成二维码
                    var wechatPayQrcode = new QRCode(wechatPayQrcodeElement, {
                        width: 260,
                        height: 260,
                    });
                    wechatPayQrcode.makeCode(result.data.code_url);
                    // 启动获取赛事信息计时器
                    _this._startGetCompetitionDetailTimer();
                }
            });
        },
        // 关闭微信支付对话框
        handleCloseWechatPayDialog: function () {
            // 跳转到我发布的赛事页面
            location.href = myReleasedCompetitionPage;
        },
        // 启动获取赛事信息计时器（用于判断是否支付成功）
        _startGetCompetitionDetailTimer: function () {
            var _this = this;
            this.getCompetitionDetailTimer = setInterval(function () {
                request({
                    url: '/api/competition/competition_detail',
                    params: { competition_id: _this.competitionId },
                }).then(function (result) {
                    if (+result.code === 200) {
                        if (+result.data.status === 2) {
                            // 清除计时器
                            clearInterval(_this.getCompetitionDetailTimer);
                            _this.$alert('<div style="text-align: center; font-size: 20px;">奖励设置成功</div>', '', {
                                confirmButtonText: '确定',
                                showClose: false,
                                dangerouslyUseHTMLString: true,
                                confirmButtonClass: 'orange-button-bg',
                                callback: function () {
                                    // 跳转到个人赛发布赛事成功页面
                                    location.href = "/bangwen/releaseCompetitionSuccess.html?competition_id=".concat(_this.competitionId);
                                },
                            });
                        }
                    }
                });
            }, 3000);
        },
    },
});
