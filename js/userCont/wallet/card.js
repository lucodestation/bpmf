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
            // 表单数据
            formData: {
                name: '',
                number: '',
                bank_name: '',
                mobile: '',
                code: '', // 验证码
            },
            codeTxt: '获取验证码',
            second: 60
        };
    },
    created: function () { },
    methods: {
        // 获取验证码
        onCode: function () {
            return __awaiter(this, void 0, void 0, function () {
                var reg_tel, data, ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.formData.mobile)
                                return [2 /*return*/, layer.msg('请输入手机号')];
                            if (this.formData.mobile) {
                                reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
                                ;
                                if (!reg_tel.test(this.formData.mobile))
                                    return [2 /*return*/, layer.msg('请输入正确的手机号')];
                            }
                            data = { mobile: this.formData.mobile };
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Login/sendCode',
                                    data: data,
                                })];
                        case 1:
                            ress = _a.sent();
                            if (ress.code == 200) {
                                this.timeDown();
                                layer.msg('发送成功');
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 提交
        onAddClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.formData.name)
                                return [2 /*return*/, layer.msg('请输入姓名')];
                            if (!this.formData.number)
                                return [2 /*return*/, layer.msg('请输入银行卡号')];
                            if (!this.formData.bank_name)
                                return [2 /*return*/, layer.msg('请输入开会银行')];
                            if (!this.formData.code)
                                return [2 /*return*/, layer.msg('请输入短信验证码')];
                            data = {
                                name: this.formData.name,
                                number: this.formData.number,
                                bank_name: this.formData.bank_name,
                                mobile: this.formData.mobile,
                                code: this.formData.code, // 验证码
                            };
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Bankcard/add',
                                    data: data,
                                })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                            }
                            else {
                                layer.msg(res.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        timeDown: function () {
            var _this = this;
            this.result = setInterval(function () {
                --_this.second;
                _this.codeTxt = _this.second + 'S';
                if (_this.second < 0) {
                    clearInterval(_this.result);
                    _this.sending = true;
                    _this.disabled = false;
                    _this.second = 60;
                    _this.codeTxt = '获取验证码';
                }
            }, 1000);
        },
    }
});
