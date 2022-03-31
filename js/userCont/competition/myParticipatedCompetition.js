"use strict";
// 个人中心 我参加的赛事
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
$(function () {
    // // 引入头部
    $('.public-header').load('/components/PublicHeader.html');
    // // 引入底部
    $('.public-footer').load('/components/PublicFooter.html');
    // // 引入侧边栏
    $('.public-user').load('/components/CenterAside.html');
});
var encrypt = new JSEncrypt();
Vue.use(ELEMENT);
var myParticipatedCompetitionPersonal = {
    template: '#myParticipatedCompetitionPersonal',
    props: ['competitionCateList'],
    data: function () {
        return {
            // 状态列表（tabs）
            statusList: [
                { value: '', label: '全部赛事' },
                { value: 0, label: '审核中' },
                { value: 2, label: '已通过' },
                { value: 1, label: '未通过' },
                { value: 3, label: '已退赛' },
                { value: 4, label: '已禁赛' },
            ],
            searchOption: {
                // 赛事编号
                number: '',
                // 赛事名称
                competition_name: '',
                // 赛事排序 1报名时间倒序，2报名时间正序
                sort: '',
                // 审核状态：0=待审核，1=审核不通过，2=审核通过，3=已退赛，4=禁赛
                apply_status: '',
            },
            // 赛事列表
            competitionList: [],
            // 总页数
            totalPage: 0,
            // 当前页
            currentPage: 1,
            // 每页数据条数
            limit: 10,
            // 总数据条数
            totalCount: 0,
            // 原因对话框是否显示
            reasonDialogVisible: false,
            // 原因内容
            reasonContent: '',
            // 终止比赛弹框是否显示
            endCompetitionDialogVisible: false,
            // 终止比赛弹框数据
            endCompetitionData: {
                // 赛事 id
                competitionId: '',
                // 报名费退还：1=不退还，2=退还
                feeReturn: 1,
                // 原因内容
                reasonContent: '',
            },
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
        // 搜索
        this.handleSearch();
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
        // 状态 tab 改变
        handleChangeStatus: function (value) {
            if (this.searchOption.apply_status === value)
                return;
            this.searchOption.apply_status = value;
            // 搜索
            this.handleSearch();
        },
        // 搜索
        handleSearch: function () {
            // 加载我参加的赛事列表
            this._loadCompetitionList(__assign(__assign({}, this.searchOption), { page: 1, pagenum: this.limit }));
        },
        // 排序
        handleSort: function () {
            // 1报名时间倒序，2报名时间正序
            if (this.searchOption.sort === '' || this.searchOption.sort === 2) {
                this.searchOption.sort = 1;
            }
            else if (this.searchOption.sort === 1) {
                this.searchOption.sort = 2;
            }
            // 搜索
            this.handleSearch();
        },
        // 加载我参加的赛事列表
        _loadCompetitionList: function (data) {
            var _this = this;
            request({
                url: '/api/Competitionattend/list',
                method: 'post',
                data: data,
            }).then(function (result) {
                if (+result.code === 200) {
                    _this.competitionList = result.data.data;
                    _this.totalPage = result.data.last_page;
                    _this.currentPage = result.data.current_page;
                    _this.totalCount = result.data.total;
                }
            });
        },
        handleChangeCurrentPage: function () { },
        continueReleaseCompetition: function () { },
        handleDeleteCompetition: function () { },
        handleOpenCheckReasonDialog: function () { },
        handleCloseCheckReasonDialog: function () { },
        handleOpenEndCompetitionDialog: function () { },
        handleCloseEndCompetitionDialog: function () { },
        handleSubmitEndCompetition: function () { },
    },
};
var myParticipatedCompetitionTeam = {
    template: '#myParticipatedCompetitionTeam',
    props: ['competitionCateList'],
    data: function () {
        return {};
    },
};
new Vue({
    el: '#app',
    components: {
        // 参加的比赛个人赛
        'my-participated-competition-personal': myParticipatedCompetitionPersonal,
        // 参加的比赛团队赛
        'my-participated-competition-team': myParticipatedCompetitionTeam,
    },
    data: function () {
        return {
            // 赛事种类，0=个人赛，1=团队赛
            competitionType: 0,
        };
    },
    created: function () { },
    mounted: function () { },
    methods: {
        // 改变赛事种类（个人赛、团队赛）
        handleChangeCompetitionType: function (type) {
            if (this.competitionType === type)
                return;
            this.competitionType = type;
        },
    },
});
