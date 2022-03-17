"use strict";
// 发布比赛
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 引入头部
$('.public-header').load('/components/PublicHeader.html');
// 引入底部
$('.public-footer').load('/components/PublicFooter.html');
var encrypt = new JSEncrypt();
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
new Vue({
    el: '#app',
    data: function () {
        return {
            // 赛事类型列表（从服务器获取）
            competitionCateList: [],
            // 表单数据
            formData: {
                competition_type: 0,
                category_id: 1,
                category_memo: '',
                competition_name: '',
                stage: 1,
                is_total_points: 0,
                way: 0,
                way_memo: '',
                join_type: 1,
                a_b_t: '',
                a_e_t: '',
                c_b_t: '',
                c_e_t: '',
                description: '',
                sponsor: '',
                service_tel: '',
                cover_picture: '',
                affix: '',
                apply_info: '',
                contact_info: '',
                roles: '',
                fee: '',
                upper_limit: 0,
                team_where: 1,
                team_list: '', // team_where=1时必传此参数，团队列表，多个用英文逗号隔开
            },
            // 开始时间
            // 如果分钟是 0 或 30，则开始时间再加 10 分钟
            startDate: new Date().getMinutes() === 0 || new Date().getMinutes() === 30 ? new Date(new Date().valueOf() + 1000 * 60 * 10) : new Date().valueOf(),
            // 报名开始时间
            signUpStartDate: '',
            // 报名结束时间
            signUpEndDate: '',
            // 比赛开始时间
            competitionStartDate: '',
            // 比赛结束时间
            competitionEndDate: '',
            // 封面图
            coverImage: {},
            // 附件列表
            affixList: [],
            // 报名费用输入框是否显示
            feeInputShow: true,
            // 报名人数上限输入框是否显示
            upperLimitInputShow: false,
            // 添加团队名称列表是否显示
            teamListShow: true,
            // 团队名称列表
            teamNameList: [{ id: 1, name: '' }],
            // 保证金弹框
            pay_type: '1',
            pwd: '', // 支付密码
        };
    },
    mounted: function () {
        var _this = this;
        // 获取赛事类型列表
        request({
            url: '/api/Competition/get_category_list',
        }).then(function (result) {
            console.log('赛事类型列表', result);
            if (+result.code == 200) {
                _this.competitionCateList = result.data;
            }
            else {
            }
        });
        // 初始化日期时间选择器
        // 初始化报名开始时间
        this.initSignUpStartDate();
        // 初始化报名结束时间
        this.initSignUpEndDate();
        // 初始化比赛开始时间
        this.initCompetitionStartDate();
        // 初始化比赛结束时间
        this.initCompetitionEndDate();
        // 初始化选择封面图
        this.initCoverImageFileChange();
    },
    methods: {
        // 选择赛事分类-赛事种类（单选框）
        handleSelectCompetitionType: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.formData.competition_type = value;
        },
        // 选择赛事类型（单选框）
        handleSelectCompetitionCate: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.formData.category_id = value;
        },
        // 选择是否采用队员总分制（单选框）
        handleSelectCompetitionTotalPointes: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.formData.is_total_points = value;
            if (value === 1) {
                this.formData.stage = 1;
            }
        },
        // 选择比赛方式（单选框）
        handleSelectCompetitionWay: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.formData.way = value;
        },
        // 选择赛事描述-赛事种类（单选框）
        handleSelectJoinType: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.formData.join_type = value;
        },
        // 初始化报名开始时间
        initSignUpStartDate: function () {
            var _this = this;
            layui.laydate.render({
                elem: '#signUpStartDate',
                theme: '#FF7F17',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                btns: ['clear', 'confirm'],
                min: this.startDate,
                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                change: function (value, date) { },
                // 点击清空、现在、确定都会触发
                done: function (value, date) {
                    console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                    console.log(date); //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (new Date(dateValue) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    console.log('报名开始时间', dateValue);
                    _this.signUpStartDate = dateValue;
                    _this.formData.a_b_t = dateValue ? new Date(dateValue).valueOf() : '';
                },
            });
        },
        // 初始化报名结束时间
        initSignUpEndDate: function () {
            var _this = this;
            console.log('初始化报名结束时间');
            layui.laydate.render({
                elem: '#signUpEndDate',
                theme: '#FF7F17',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                btns: ['clear', 'confirm'],
                min: this.startDate,
                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                change: function (value, date) { },
                // 点击清空、现在、确定都会触发
                done: function (value, date) {
                    console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                    console.log(date); //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (!_this.signUpStartDate) {
                        // 如果还没有选择报名开始时间
                        layer.open({
                            type: 0,
                            icon: 0,
                            title: false,
                            content: '请先选择报名开始时间',
                            btn: [],
                        });
                        dateValue = '';
                    }
                    else if (new Date(dateValue) <= new Date(_this.signUpStartDate)) {
                        // 如果报名结束时间小于报名开始时间
                        layer.open({
                            type: 0,
                            icon: 0,
                            title: false,
                            content: '报名结束时间要大于报名开始时间',
                            btn: ['重新选择'],
                        });
                        dateValue = '';
                    }
                    else if (new Date(dateValue) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    console.log('报名结束时间', dateValue);
                    _this.signUpEndDate = dateValue;
                    _this.formData.a_e_t = dateValue ? new Date(dateValue).valueOf() : '';
                },
            });
        },
        // 初始化比赛开始时间
        initCompetitionStartDate: function () {
            var _this = this;
            layui.laydate.render({
                elem: '#competitionStartDate',
                theme: '#FF7F17',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                btns: ['clear', 'confirm'],
                min: this.startDate,
                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                change: function (value, date) { },
                // 点击清空、现在、确定都会触发
                done: function (value, date) {
                    console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                    console.log(date); //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (!_this.signUpEndDate) {
                        // 如果还没有选择报名结束时间
                        layer.open({
                            type: 0,
                            icon: 0,
                            title: false,
                            content: '请先选择报名结束时间',
                            btn: [],
                        });
                        dateValue = '';
                    }
                    else if (new Date(dateValue) <= new Date(_this.signUpEndDate)) {
                        // 如果比赛开始时间小于报名结束时间
                        layer.open({
                            type: 0,
                            icon: 0,
                            title: false,
                            content: '比赛开始时间要大于报名结束时间',
                            btn: ['重新选择'],
                        });
                        dateValue = '';
                    }
                    else if (new Date(dateValue) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    console.log('比赛开始时间', dateValue);
                    _this.competitionStartDate = dateValue;
                    _this.formData.c_b_t = dateValue ? new Date(dateValue).valueOf() : '';
                },
            });
        },
        // 初始化比赛结束时间
        initCompetitionEndDate: function () {
            var _this = this;
            layui.laydate.render({
                elem: '#competitionEndDate',
                theme: '#FF7F17',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm',
                btns: ['clear', 'confirm'],
                min: this.startDate,
                // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
                change: function (value, date) { },
                // 点击清空、现在、确定都会触发
                done: function (value, date) {
                    console.log(value); //得到日期生成的值，如：2022-03-09 00:00
                    console.log(date); //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (!_this.competitionStartDate) {
                        // 如果还没有选择比赛开始时间
                        layer.open({
                            type: 0,
                            icon: 0,
                            title: false,
                            content: '请先选择比赛开始时间',
                            btn: [],
                        });
                        dateValue = '';
                    }
                    else if (new Date(dateValue) <= new Date(_this.competitionStartDate)) {
                        // 如果比赛开始时间小于报名结束时间
                        layer.open({
                            type: 0,
                            icon: 0,
                            title: false,
                            content: '比赛结束时间要大于比赛开始时间',
                            btn: ['重新选择'],
                        });
                        dateValue = '';
                    }
                    else if (new Date(dateValue) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间', { icon: 0, time: 3000 });
                        dateValue = '';
                    }
                    console.log('比赛结束时间', dateValue);
                    _this.competitionEndDate = dateValue;
                    _this.formData.c_e_t = dateValue ? new Date(dateValue).valueOf() : '';
                },
            });
        },
        // 初始化选择封面图
        initCoverImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#uploadCover',
                auto: false,
                // accept: 'image', // 指定允许上传时校验的文件类型
                // acceptMime: '.jpg,.png,.bmp,.jpeg,.webp', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
                // exts: 'jpg|png|bmp|jpeg|webp', // 允许上传的文件后缀。一般结合 accept 参数类设定。
                size: 0,
                multiple: false,
                // 选择文件回调
                choose: function (result) {
                    console.log(result);
                    //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                    result.preview(function (index, file, result) {
                        // console.log(index) //得到文件索引
                        // console.log(file) //得到文件对象
                        // console.log(result) //得到文件base64编码，比如图片
                        _this.coverImage = {
                            file: file,
                            url: result,
                        };
                        console.log(_this.coverImage);
                    });
                },
            });
        },
        // 选择附件
        handleAffixFileChange: function (event) {
            var _a;
            var element = event.target || event.srcElement;
            var files = element.files;
            window.URL = window.URL || window.webkitURL;
            var tempArr = [];
            var errorArr = new Set();
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var item = files_1[_i];
                var filesNameList = this.affixList.length ? this.affixList.map(function (i) { return i.name; }) : [];
                // （如果不存在文件名）禁止添加同名文件
                if (!filesNameList.includes(item.name)) {
                    if (!['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
                        errorArr.add(util.getExtensionName(item.name));
                    }
                    else if (tempArr.length < 5) {
                        tempArr.push({
                            file: item,
                            name: item.name,
                            url: window.URL.createObjectURL(item),
                        });
                    }
                }
            }
            if (errorArr.size) {
                layer.open({
                    type: 0,
                    icon: 0,
                    title: '不受支持的文件类型',
                    content: '您选择的 ' + __spreadArray([], errorArr, true) + ' 类型的文件不受支持',
                    btn: ['重新选择'],
                });
            }
            if (this.affixList.length > 5) {
                tempArr.length = 5 - this.affixList.length;
            }
            (_a = this.affixList).push.apply(_a, tempArr);
            element.value = '';
            console.log(__assign({}, this.affixList));
        },
        // 删除附件
        handleDeleteAffix: function (index) {
            this.affixList = this.affixList.filter(function (item, ind) { return index !== ind; });
        },
        // 选择报名信息（复选框）（年龄、居住地址、自我介绍）
        handleSelectApplyInfo: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value;
            var arr = this.formData.apply_info.split(',').filter(function (i) { return i !== ''; });
            if (arr.includes(value)) {
                // 已有则删除
                arr = arr.filter(function (i) { return i !== value; });
            }
            else {
                // 没有则添加
                arr.push(value);
            }
            this.formData.apply_info = arr.toString();
        },
        // 选择联系方式（复选框）（QQ、MSN、SKYPE、微信号）
        handleSelectContactInfo: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value;
            var arr = this.formData.contact_info.split(',').filter(function (i) { return i !== ''; });
            if (arr.includes(value)) {
                // 已有则删除
                arr = arr.filter(function (i) { return i !== value; });
            }
            else {
                // 没有则添加
                arr.push(value);
            }
            this.formData.contact_info = arr.toString();
        },
        // 选择角色（复选框）（选手、裁判、主裁判）
        handleSelectRoles: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value;
            var arr = this.formData.roles.split(',').filter(function (i) { return i !== ''; });
            if (arr.includes(value)) {
                // 已有则删除
                arr = arr.filter(function (i) { return i !== value; });
            }
            else {
                // 没有则添加
                arr.push(value);
            }
            this.formData.roles = arr.toString();
        },
        // 选择报名费用（单选框）
        handleSelectFee: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            if (value) {
                // 有
                this.feeInputShow = true;
                this.formData.fee = '';
            }
            else {
                // 无
                this.feeInputShow = false;
                this.formData.fee = 0;
            }
        },
        // 选择报名人数上限（单选框）
        handleSelectUpperLimit: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            if (value) {
                // 有
                this.upperLimitInputShow = true;
                this.formData.upper_limit = '';
            }
            else {
                // 无
                this.upperLimitInputShow = false;
                this.formData.upper_limit = 0;
            }
        },
        // 选择添加团队（单选框）
        handleSelectTeamWhere: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            if (value === 1) {
                // 组织者添加
                this.formData.team_where = 1;
                this.teamListShow = true;
            }
            else if (value === 2) {
                // 各队员自己添加
                this.formData.team_where = 2;
                this.teamListShow = false;
            }
        },
        // 删除团队名称
        handleDeleteTeamName: function (index) {
            this.teamNameList.splice(index, 1);
        },
        // 添加团队名称
        handleAddTeamName: function () {
            var maxId = Math.max.apply(Math, this.teamNameList.map(function (i) { return i.id; }));
            this.teamNameList.push({ id: maxId + 1, name: '' });
        },
        // 验证要提交的数据
        _validateFormData: function () {
            var arr = [];
            if (this.formData.category_id === 5) {
                arr.push({ label: '请输入赛事类型补充说明', validate: !this.formData.category_memo });
            }
            arr.push({ label: '请输入赛事名称', validate: !this.formData.competition_name });
            if (this.formData.is_total_points) {
                arr.push({ label: '队员总分制的比赛阶段总数必须为 1', validate: this.formData.stage !== 1 });
            }
            else {
                arr.push({ label: '比赛阶段总数必须是 1~5 的整数（包括 1 和 5 ）', validate: ![1, 2, 3, 4, 5].includes(this.formData.stage) });
            }
            if (this.formData.way === 1) {
                arr.push({ label: '请输入比赛方式补充说明', validate: !this.formData.way_memo });
            }
            arr.push({ label: '请选择报名开始时间', validate: !this.formData.a_b_t }, { label: '请选择报名结束时间', validate: !this.formData.a_e_t }, { label: '请选择比赛开始时间', validate: !this.formData.c_b_t }, { label: '请选择比赛结束时间', validate: !this.formData.c_e_t }, { label: '请输入赛事描述', validate: !this.formData.description.trim() }, { label: '请输入赞助方', validate: !this.coverImage.sponsor }, { label: '请输入赛事客服电话', validate: !this.coverImage.service_tel }, { label: '请选择封面图', validate: !this.coverImage.url }, { label: '请选择附件', validate: !this.affixList.length }, { label: '请选择报名信息', validate: !this.formData.apply_info }, { label: '请选择联系方式', validate: !this.formData.contact_info }, { label: '请选择角色', validate: !this.formData.roles });
            if (this.feeInputShow) {
                arr.push({ label: '请输入报名费用', validate: !this.formData.fee }, { label: '报名费用必须大于 0', validate: this.formData.fee <= 0 });
            }
            if (this.upperLimitInputShow) {
                arr.push({ label: '请输入报名人数上限', validate: !this.formData.upper_limit }, { label: '报名人数上限必须是大于 0 的整数', validate: this.formData.upper_limit <= 0 || this.formData.upper_limit % 1 !== 0 });
            }
            if (this.teamListShow) {
                var tempArr = this.teamNameList.filter(function (i) { return i.name; });
                arr.push({ label: '请输入团队名称', validate: !tempArr.length });
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
        handleNextStep: function (event) {
            // util.uploadFile({
            //   file: this.coverImage.file,
            //   fileName: 'cover',
            // })
            // if (!this._validateFormData()) return
            // this.formData.cover_picture = 'https://pics4.baidu.com/feed/71cf3bc79f3df8dc1fe19ff60a487a8146102858.jpeg'
            // this.formData.affix = 'https://pics4.baidu.com/feed/71cf3bc79f3df8dc1fe19ff60a487a8146102858.jpeg,https://pics4.baidu.com/feed/71cf3bc79f3df8dc1fe19ff60a487a8146102858.jpeg'
            // if (this.teamListShow) {
            //   this.formData.team_list = this.teamNameList
            //     .filter((i) => i.name)
            //     .map((i) => i.name)
            //     .toString()
            // }
            // console.log('发布比赛', this.formData)
            // request({
            //   url: '/api/competition/push_match',
            //   method: 'post',
            //   data: this.formData,
            // }).then((result) => {
            //   console.log(result)
            //   if (result.code === 200) {
            //     // 发布成功
            //     console.log('发布成功')
            //     layer.msg(result.msg)
            //   } else if (result.code === 201) {
            //     // 发布次数不足，跳转购买会员页面
            //     console.log('发布次数不足，跳转购买会员页面')
            //     layer.msg(result.msg)
            //   } else if (result.code === 202) {
            //     // 错误信息
            //     console.log('错误信息')
            //     layer.msg(result.msg)
            //   } else if (result.code === 203) {
            //     // 未绑定手机号
            //     console.log('未绑定手机号')
            //     layer.msg(result.msg)
            //   } else if (result.code === 205) {
            //     // 余额不足
            //     console.log('余额不足')
            //     layer.msg(result.msg)
            //   } else if (result.code === 206) {
            //     // 未交保证金
            //     console.log('未交保证金')
            //     layer.msg(result.msg)
            //     syalert.syopen('bondCont')
            //   } else if (result.code === 207) {
            //     // 未实名认证
            //     console.log('未实名认证')
            //     layer.msg(result.msg)
            //   } else if (result.code === 208) {
            //     // 未设置支付密码
            //     console.log('未设置支付密码')
            //     layer.msg(result.msg)
            //   }
            // })
            //
            //
            //
            // if (this.formData.team_where === 1) {
            //   this.formData.team_list = this.teamNameList
            //     .filter((i) => i.name)
            //     .map((i) => i.name)
            //     .toString()
            // }
            // var formData = new FormData()
            // formData.append('file', this.coverImage.file)
            // console.log(formData.get('file'))
            // console.log('OSS', OSS)
            // const client = new OSS({
            //   // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
            //   region: 'oss-cn-beijing',
            //   // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
            //   accessKeyId: 'LTAI4GDaFivfzrgrQxzncZHT',
            //   accessKeySecret: 'OY9GL3QKj6D78EwkdojkZY132vbLEA',
            //   // 从STS服务获取的安全令牌（SecurityToken）。
            //   stsToken: 'yourSecurityToken',
            //   // 填写Bucket名称。
            //   bucket: 'bpmf',
            // })
            // // client.put('test.txt', formData).then((r) => console.log(r))
        },
        // 保证金
        onBzjClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, pwd, ress, ress, ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('aa');
                            return [4 /*yield*/, request({
                                    method: 'POST',
                                    url: '/api/Deposit/refer',
                                    data: { pay_type: this.pay_type },
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
                            layer.msg(res.msg);
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        },
    },
});
