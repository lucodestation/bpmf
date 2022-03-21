"use strict";
// 发布比赛
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
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
// 使用httpVueLoader
console.log('httpVueLoader', httpVueLoader);
Vue.use(httpVueLoader);
new Vue({
    components: {
        // 将组建加入组建库
        'release-personal-competition': 'url:/vueComponents/releasePersonalCompetition.vue',
    },
    el: '#app',
    data: function () {
        return {
            // 赛事种类，0=个人赛，1=团队赛
            competitionType: 0,
            // 保证金弹框
            pay_type: '1',
            pwd: '', // 支付密码
        };
    },
    mounted: function () {
        console.log('xxxxxxxx');
    },
    methods: {
        // 测试
        handleTest: function () {
            console.log('测试');
        },
        // 选择赛事分类-赛事种类（单选框）
        handleSelectCompetitionType: function (event) {
            console.log(event);
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.competitionType = value;
        },
        // 保证金
        onBzjClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadingIndex, res, pwd, ress, ress, ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('aa');
                            loadingIndex = layer.load(1, {
                                shade: [0.5, '#000'],
                                time: 10 * 1000, // 如果十秒还没关闭则自动关闭
                            });
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Deposit/refer',
                                    data: { pay_type: this.pay_type },
                                }).catch(function (error) {
                                    console.log('error', error);
                                })];
                        case 1:
                            res = _a.sent();
                            if (!(res && res.code == 200)) return [3 /*break*/, 8];
                            layer.close(loadingIndex);
                            if (!(this.pay_type == '1')) return [3 /*break*/, 3];
                            encrypt.setPublicKey(publiukey);
                            pwd = encrypt.encrypt(this.pwd) //需要加密的内容
                            ;
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Deposit/balancePay',
                                    data: { out_trade_no: res.data.out_trade_no, pay_pwd: pwd },
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
                                    data: { out_trade_no: res.data.out_trade_no },
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
                                    data: { out_trade_no: res.data.out_trade_no },
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
                            if (res) {
                                layer.close(loadingIndex);
                                layer.msg(res.msg);
                            }
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        },
    },
});
