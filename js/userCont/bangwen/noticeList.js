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
Vue.use(ELEMENT);
new Vue({
    el: '#app',
    data: function () {
        return {
            nameList: [{ id: '1', title: '????????????' }, { id: '2', title: '????????????' }],
            type: 2,
            navList: [{ id: '', title: '????????????' }, { id: '1', title: '?????????' }, { id: '2', title: '?????????' }, { id: '3', title: '????????????' }, { id: '4', title: '?????????' }, { id: '5', title: '????????????' }, { id: '6', title: '?????????' }],
            navId: '',
            b_id: '',
            start_time: '',
            end_time: '',
            cateList: [],
            noticeList: [],
            id: '',
            totalPage: 0,
            currentPage: 1,
            // ??????????????????
            // limit: 10,
            totalCount: 0, // ???????????????
        };
    },
    created: function () {
        var _this = this;
        request({ url: '/api/Bangwen/cate', method: 'post' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
                _this.cateList.unshift({ id: '', name: '??????' });
            }
        });
        setTimeout(function () {
            _this.onpushList();
        }, 500);
        // ????????????
        layui.laydate.render({
            elem: '#signUpStartDate',
            theme: '#FF7F17',
            btns: ['clear', 'confirm'],
            done: function (value, date) {
                _this.start_time = value;
            },
        });
        // ????????????
        layui.laydate.render({
            elem: '#signUpEndDate',
            theme: '#FF7F17',
            btns: ['clear', 'confirm'],
            done: function (value, date) {
                _this.end_time = value;
            },
        });
    },
    methods: {
        // ??????
        onqueryClick: function () {
            this.onpushList();
        },
        // ????????????
        onpushList: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request({
                                method: 'POST',
                                url: '/api/Bangwenpush/pushList',
                                data: { type: this.type, status: this.navId, b_id: this.b_id, start_time: this.start_time, end_time: this.end_time, page: this.currentPage, pagenum: 10 }
                            })];
                        case 1:
                            res = _a.sent();
                            if (res.code == 200) {
                                res.data.data.map(function (item) {
                                    for (var i in _this.cateList) {
                                        if (item.b_id == _this.cateList[i].id) {
                                            item.name = _this.cateList[i].name;
                                        }
                                    }
                                });
                                this.noticeList = res.data.data;
                                // this.competitionList = result.data.data
                                this.totalPage = res.data.last_page;
                                this.currentPage = res.data.current_page;
                                this.totalCount = res.data.total;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        // ????????????
        handleChangeCurrentPage: function (value) {
            console.log("\u7B2C".concat(value, "\u9875"));
            this.currentPage = value;
            // ??????????????????
            this.onpushList();
        },
        // ??????????????????
        onNavClick: function (e) {
            this.navId = e;
            this.onpushList();
        },
        onNameClick: function (e) {
            this.type = e;
            this.onpushList();
        },
        // ??????????????????
        onDelClick: function (e) {
            this.id = e;
            syalert.syopen('noticeDelCont');
        },
        onDelqueryClick: function () {
            var _this = this;
            request({ url: '/api/Bangwenpush/delete', method: 'post', data: { bangwen_id: this.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg('????????????');
                    syalert.syhide('noticeDelCont');
                    _this.onpushList();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        onXxClick: function (item) {
            var _this = this;
            request({ url: '/api/Bangwenattend/outBeginTeach', method: 'post', data: { order_id: item.id } }).then(function (res) {
                if (res.code == 200) {
                    // layer.msg('????????????')
                    // syalert.syhide('noticeDelCont')
                    _this.onpushList();
                }
                else {
                    layer.msg(res.msg);
                }
            });
        }
    }
});
