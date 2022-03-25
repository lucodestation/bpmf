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
var encrypt = new JSEncrypt();
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
new Vue({
    el: '#Header',
    data: function () {
        return {
            userShow: false,
            cooperationShow: false,
            homeShow: false,
            helpShow: false,
            hallShow: false,
            liveShow: false,
            userHeadShow: false,
            userCont: '', // 个人信息
        };
    },
    created: function () {
        var _this = this;
        // 判断是否有token
        if (localStorage.getItem('token')) {
            this.userShow = localStorage.getItem('token') ? true : false;
            // 获取个人信息
            request({ method: 'POST', url: '/api/Mine/info' }).then(function (res) {
                if (res.code == 200) {
                    _this.userCont = res.data;
                }
            });
        }
        var url = window.location.pathname.substr(1); //获取当前页面url
        var url1 = url.substr(0, 8);
        url = url.substr(0, url.length - 5);
        this.userHeadShow = url1 == 'userCont' ? true : false;
        this.homeShow = url == 'index' ? true : false; // 首页是否选中
        this.cooperationShow = url == 'cooperate/index' ? true : url == 'cooperate/cooperateView' ? true : false;
        this.helpShow = url == 'help/index' ? true : url == 'help/helpView' ? true : false;
        this.hallShow = url.substr(0, 7) == 'bangwen' ? true : false; // 榜文大厅是否选中
        this.liveShow = url.substr(0, 4) == 'live' ? true : false; // 直播频道是否选中
        if (url == '') {
            this.homeShow = true;
        }
    },
    methods: {
        // 退出
        onSignout: function () {
            localStorage.clear();
            sessionStorage.clear();
            location.href = '/index.html';
        },
    },
});
// 登录
new Vue({
    el: '#loginConter',
    data: {
        mobile: '',
        pwd: '',
        code: '',
        codeTxt: '获取验证码',
        second: 60,
    },
    created: function () { },
    methods: {
        // 获取验证码
        onCode: function () {
            return __awaiter(this, void 0, void 0, function () {
                var reg_tel, data, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.mobile)
                                return [2 /*return*/, layer.msg('请输入手机号')];
                            if (this.mobile) {
                                reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
                                ;
                                if (!reg_tel.test(this.mobile))
                                    return [2 /*return*/, layer.msg('请输入正确的手机号')];
                            }
                            data = { mobile: this.mobile };
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Login/sendCode',
                                    data: data,
                                })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                                this.timeDown();
                                layer.msg('发送成功');
                            }
                            else {
                                layer.msg(res.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 登录
        onLogin: function () {
            return __awaiter(this, void 0, void 0, function () {
                var reg_tel, pwd, data, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.mobile)
                                return [2 /*return*/, layer.msg('请输入手机号')];
                            if (this.mobile) {
                                reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
                                ;
                                if (!reg_tel.test(this.mobile))
                                    return [2 /*return*/, layer.msg('请输入正确的手机号')];
                            }
                            if (!this.pwd)
                                return [2 /*return*/, layer.msg('请输入密码')
                                    // let pwd = jsencrypt.setEncrypt(publiukey, String(this.pwd))
                                ];
                            // let pwd = jsencrypt.setEncrypt(publiukey, String(this.pwd))
                            encrypt.setPublicKey(publiukey);
                            pwd = encrypt.encrypt(this.pwd) //需要加密的内容
                            ;
                            data = {
                                mobile: this.mobile,
                                pwd: pwd, // 密码
                            };
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Login/mobilepwdLogin',
                                    data: data,
                                })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                                layer.msg('登录成功');
                                localStorage.setItem('token', res.data.token);
                                location.reload();
                            }
                            else {
                                layer.msg(res.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 短信验证码登录
        onCodeLogin: function () {
            return __awaiter(this, void 0, void 0, function () {
                var reg_tel, data, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.mobile)
                                return [2 /*return*/, layer.msg('请输入手机号')];
                            if (this.mobile) {
                                reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
                                ;
                                if (!reg_tel.test(this.mobile))
                                    return [2 /*return*/, layer.msg('请输入正确的手机号')];
                            }
                            if (!this.code)
                                return [2 /*return*/, layer.msg('请输入验证码')];
                            data = {
                                mobile: this.mobile,
                                code: this.code, // 验证码
                            };
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Login/mobilecodeLogin',
                                    data: data,
                                })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                                layer.msg('登录成功');
                                localStorage.setItem('token', res.data.token);
                                location.reload();
                            }
                            else {
                                layer.msg(res.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 倒计时
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
        // 跳转微信授权
        onwxClick: function () {
            syalert.syhide('loginConter');
            setTimeout(function () {
                syalert.syopen('wxConter');
            }, 500);
        },
    },
});
// 微信登录
new Vue({
    el: '#wxConter',
    data: {
        wxImg: '',
    },
    created: function () {
        var _this = this;
        // 获取微信二维码
        request({ url: '/api/Loginwx/getCode', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.wxImg = res.data;
            }
        });
    },
    methods: {
        // 密码登录
        onPwdClick: function () {
            syalert.syhide('wxConter');
            setTimeout(function () {
                syalert.syopen('loginConter');
            }, 500);
        },
        // 短信登录
        ondxClick: function () {
            syalert.syhide('wxConter');
            setTimeout(function () {
                syalert.syopen('loginConter');
            }, 500);
        },
    },
});
