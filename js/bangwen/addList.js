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
var encrypt = new JSEncrypt();
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
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
                image: 'https://lmg.jj20.com/up/allimg/4k/s/02/21092423260Q119-0-lp.jpg',
                files: 'https://lmg.jj20.com/up/allimg/4k/s/02/21092423260Q119-0-lp.jpg',
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
            pay_type: '1',
            pwd: '', // 支付密码
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
                    case 0: return [4 /*yield*/, request({
                            method: 'POST',
                            url: '/api/Bangwen/cate'
                        })];
                    case 1:
                        res = _a.sent();
                        if (res.code == 200) {
                            this.cateList = res.data;
                            this.formData.b_id = res.data[0].id;
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
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
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
                var reg_tel, qq, email, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.formData.title)
                                return [2 /*return*/, layer.msg('请输入标题')];
                            if (!this.formData.total_money)
                                return [2 /*return*/, layer.msg('请输入金额')];
                            if (!this.formData.detail)
                                return [2 /*return*/, layer.msg('请输入榜文详情')];
                            if (this.formData.mobile) {
                                reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
                                ;
                                if (!reg_tel.test(this.formData.mobile))
                                    return [2 /*return*/, layer.msg('请输入正确的手机号')];
                            }
                            if (this.formData.qq) {
                                qq = "[1-9][0-9]{4,14}";
                                if (!qq.test(this.formData.qq))
                                    return [2 /*return*/, layer.msg('请输入正确QQ号')];
                            }
                            if (this.formData.email) {
                                email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                                if (!email.test(this.formData.email))
                                    return [2 /*return*/, layer.msg('请输入正确邮箱')];
                            }
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Bangwen/pushBangwen',
                                    data: this.formData,
                                })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                                // this.cateList = res.data
                                // this.formData.b_id = res.data[0].id;
                            }
                            else if (res.code == 206) {
                                syalert.syopen('bondCont');
                            }
                            else {
                                layer.msg(res.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 保证金
        onBzjClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, pwd, ress, ress, ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Deposit/refer',
                                data: { pay_type: this.pay_type }
                            })];
                        case 1:
                            res = _a.sent();
                            if (!(res.code == 200)) return [3 /*break*/, 8];
                            if (!(this.pay_type == '1')) return [3 /*break*/, 3];
                            encrypt.setPublicKey(publiukey);
                            pwd = encrypt.encrypt(this.pwd) //需要加密的内容
                            ;
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Deposit/balancePay',
                                    data: { out_trade_no: res.data.out_trade_no, pay_pwd: pwd }
                                })];
                        case 2:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                layer.msg('支付成功');
                                syalert.syhide('bondCont');
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            _a.label = 3;
                        case 3:
                            if (!(this.pay_type == '2')) return [3 /*break*/, 5];
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Deposit/aliPay',
                                    data: { out_trade_no: res.data.out_trade_no }
                                })];
                        case 4:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                location.href = ress.data.code_url;
                                syalert.syhide('bondCont');
                            }
                            _a.label = 5;
                        case 5:
                            if (!(this.pay_type == '3')) return [3 /*break*/, 7];
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Deposit/wxPay',
                                    data: { out_trade_no: res.data.out_trade_no }
                                })];
                        case 6:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                location.href = ress.data.code_url;
                                syalert.syhide('bondCont');
                            }
                            _a.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            layer.msg(res.msg);
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        }
    }
});
