"use strict";
// 个人中心 我发布的赛事 赛事管理
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
    // // 引入头部
    $('.public-header').load('/components/PublicHeader.html');
    // // 引入底部
    $('.public-footer').load('/components/PublicFooter.html');
    // // 引入侧边栏
    $('.public-user').load('/components/CenterAside.html');
});
Vue.use(ELEMENT);
new Vue({
    el: '#app',
    data: function () {
        return {
            // 赛事详情
            competitionDetail: {},
            // 报名角色tab列表
            applyRoleTabList: [],
            // 报名角色列表（从服务器获取的数据）
            applyRoleList: [],
            // 报名筛选选项
            applyFilterOption: {
                // 赛事id
                competition_id: '',
                // 角色类型id：1=选手，2=裁判
                role_id: 1,
                // 搜索状态参数：0=待审核，1=审核不通过，2=审核通过
                status: '',
                // 搜索：姓名或者参赛账号
                keyword: '',
            },
            // 报名管理选择的报名 id
            applySelectedApplyId: [],
        };
    },
    // 过滤器
    filters: {
        // 时间戳转成日期（xxxx-xx-xx xx:xx）
        timestampToDate: function (value) {
            var dateObj = new Date(value * 1000);
            var year = dateObj.getFullYear();
            var month = String(dateObj.getMonth() + 1).padStart(2, '0');
            var date = String(dateObj.getDate()).padStart(2, '0');
            var hours = String(dateObj.getHours()).padStart(2, '0');
            var minutes = String(dateObj.getMinutes()).padStart(2, '0');
            return "".concat(year, "-").concat(month, "-").concat(date, " ").concat(hours, ":").concat(minutes);
        },
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, competitionDetailResult, applyRoleMenu, arr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = Qs.parse(location.search.substr(1));
                        this.applyFilterOption.competition_id = searchParams.competition_id * 1;
                        return [4 /*yield*/, request({
                                url: '/api/Competitionindex/detail',
                                method: 'post',
                                data: { competition_id: searchParams.competition_id * 1 },
                            })];
                    case 1:
                        competitionDetailResult = _a.sent();
                        if (+competitionDetailResult.code === 200) {
                            this.competitionDetail = competitionDetailResult.data;
                        }
                        else {
                            layer.msg(competitionDetailResult.msg);
                        }
                        return [4 /*yield*/, request({
                                url: '/api/competition/get_role_menu',
                                method: 'post',
                                data: { competition_id: searchParams.competition_id * 1 },
                            })];
                    case 2:
                        applyRoleMenu = _a.sent();
                        if (+applyRoleMenu.code === 200) {
                            arr = applyRoleMenu.data.roles.split(',').map(function (i) { return i * 1; });
                            console.log(arr);
                            if (arr.includes(1)) {
                                this.applyRoleTabList.push({ value: 1, label: '选手列表' });
                            }
                            if (arr.includes(2) || arr.includes(3)) {
                                this.applyRoleTabList.push({ value: 2, label: '裁判列表' });
                            }
                        }
                        else {
                            layer.msg(applyRoleMenu.msg);
                        }
                        // 获取报名角色列表
                        this._loadApplyRoleList(this.applyFilterOption);
                        return [2 /*return*/];
                }
            });
        });
    },
    mounted: function () {
        // 临时
        layer.open({
            title: '临时',
            type: 1,
            // skin: 'layui-layer-rim', //加上边框
            area: ['300px', '200px'],
            content: $('#personalCompetitionTemp'),
            shade: 0,
            offset: 'rt',
        });
    },
    methods: {
        // 改变报名角色
        handleChangeApplyRole: function (value) {
            if (this.applyFilterOption.role_id === value)
                return;
            this.applyFilterOption.role_id = value;
            // 获取报名角色列表
            this._loadApplyRoleList(this.applyFilterOption);
        },
        // 报名搜索
        handleApplySearch: function () {
            console.log('报名搜索');
            // 获取报名角色列表
            this._loadApplyRoleList(this.applyFilterOption);
        },
        // 获取报名角色列表
        _loadApplyRoleList: function (data) {
            var _this = this;
            request({
                url: '/api/competition/apply_role_list',
                method: 'post',
                data: util.objFilterEmptyStrProp(data),
            }).then(function (result) {
                if (+result.code === 200) {
                    _this.applyRoleList = result.data;
                    // this.applyRoleList = result.data.map((item) => {
                    //   item.status = 2
                    //   return item
                    // })
                }
                else {
                    layer.msg(result.msg);
                }
            });
        },
        // 报名管理 - 选择报名 id
        handleChangeApplyCheckbox: function (id) {
            console.log(id);
            if (this.applySelectedApplyId.includes(id)) {
                this.applySelectedApplyId = this.applySelectedApplyId.filter(function (i) { return i !== id; });
            }
            else {
                this.applySelectedApplyId.push(id);
            }
        },
        // 报名管理 - 全选
        handleChangeApplySelectAll: function () {
            console.log('all');
            if (this.applySelectedApplyId.length === this.applyRoleList.length) {
                // 已全选
                this.applySelectedApplyId = [];
            }
            else {
                // 未全选
                this.applySelectedApplyId = this.applyRoleList.map(function (i) { return i.id; });
            }
        },
    },
});
