"use strict";
// 个人中心 我参加的赛事
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
            ],
            // 赛事编号
            competitionNumber: '',
            // 赛事名称
            competitionName: '',
            // 赛事排序 1报名时间倒序，2报名时间正序
            competitionSort: '',
            searchOption: {
                // 赛事状态：2=审核中，3=未通过，4=审核通过，报名中，5=报名结束，6=比赛中，7=已结束，不传默认返回全部
                status: '',
                // 赛事类型id，筛选时候用
                category_id: '',
                // 开始时间，时间戳（秒）
                begin_time: '',
                // 结束时间，时间戳（秒）
                end_time: '',
            },
            // 赛事列表
            competitionList: [],
            // 总页数
            totalPage: 0,
            // 当前页
            currentPage: 1,
            // 每页数据条数
            // limit: 10,
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
        handleChangeStatus: function () { },
        handleSearch: function () { },
        handleSort: function () {
            // 1报名时间倒序，2报名时间正序
            if (this.competitionSort === '' || this.competitionSort === 2) {
                this.competitionSort = 1;
            }
            else if (this.competitionSort === 1) {
                this.competitionSort = 2;
            }
        },
        _loadCompetitionList: function () { },
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
