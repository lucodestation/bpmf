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
new Vue({
    el: '#app',
    data: function () {
        return {
            cateList: [],
            cateId: '',
            navList: [{ id: '', title: '??????' }, { id: 1, title: '??????' }, { id: 2, title: '??????' }],
            type: '',
            payList: [{ id: '', title: '??????' }, { id: 1, title: '????????????' }, { id: 2, title: '????????????' }],
            payId: '',
            winList: [{ id: '', title: '??????' }, { id: 1, title: '????????????' }, { id: 2, title: '????????????' }],
            winId: '',
            trusteeList: [{ id: '', title: '??????' }, { id: 1, title: '??????' }, { id: 2, title: '?????????' }],
            trusteeId: '',
            minList: [{ id: '', title: '??????', min: '', max: '' }, { id: 1, title: '100??????', min: '0', max: '100' }, { id: 2, title: '100-500', min: '100', max: '500' }, { id: 3, title: '500-1000', min: '500', max: '1000' }],
            minId: '',
            min: '',
            max: '',
            sortList: [{ id: '', title: '??????' }, { id: 1, title: '??????' }, { id: 2, title: '?????????????????????' }, { id: 3, title: '?????????????????????' },],
            sortId: '',
            bangList: [],
        };
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.GetRequest();
                        return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Bangwen/cate',
                            })];
                    case 1:
                        res = _a.sent();
                        if (res.code == 200) {
                            this.cateList = res.data;
                            this.cateList.unshift({ id: '', name: '??????' });
                        }
                        setTimeout(function () {
                            _this.onBangwenlist();
                        }, 500);
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // ??????????????????
        onCateClick: function (e) {
            this.cateId = e;
            this.onBangwenlist();
        },
        // ??????????????????
        onNavClick: function (e) {
            this.type = e;
            this.onBangwenlist();
        },
        // ??????????????????
        onPayClick: function (e) {
            this.payId = e;
            this.onBangwenlist();
        },
        // ??????????????????
        onWinClick: function (e) {
            this.winId = e;
            this.onBangwenlist();
        },
        // ??????????????????
        onTrustClick: function (e) {
            this.trusteeId = e;
            this.onBangwenlist();
        },
        // ??????????????????
        onMinClick: function (e) {
            this.minId = e.id;
            this.min = e.min;
            this.max = e.max;
            this.onBangwenlist();
        },
        // ????????????
        onSortClick: function (e) {
            this.sortId = e;
            this.onBangwenlist();
        },
        // ????????????
        onBangwenlist: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Bangwen/list',
                                data: { page: 1, pagenum: 7, b_id: this.cateId, type: this.type, pay_num_type: this.payId, win_type: this.winId, is_trustee: this.trusteeId, min: this.min, max: this.max, sort: this.sortId },
                            })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                                this.bangList = res.data.data;
                            }
                            return [2 /*return*/];
                    }
                });
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
            this.type = theRequest.type;
        },
    }
});
