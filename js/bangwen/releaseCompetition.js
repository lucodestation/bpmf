"use strict";
// 发布比赛第一步
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
Vue.use(ELEMENT);
// 发布比赛个人赛
var releaseCompetitionPersonal = {
    template: '#releaseCompetitionPersonal',
    props: ['competitionCateList'],
    data: function () {
        return {
            // 临时
            tempPreShow: true,
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
                roles: '1,2,3',
                fee: '',
                fee_return: 1,
                upper_limit: '',
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
            upperLimitInputShow: true,
            // 添加团队名称列表是否显示
            teamListShow: true,
            // 团队名称列表
            teamNameList: [{ id: 1, name: '' }],
        };
    },
    mounted: function () {
        // 初始化日期时间选择器
        // 初始化报名开始时间
        this.initSignUpStartDate(this.$refs.signUpStartDate);
        // 初始化报名结束时间
        this.initSignUpEndDate(this.$refs.signUpEndDate);
        // 初始化比赛开始时间
        this.initCompetitionStartDate(this.$refs.competitionStartDate);
        // 初始化比赛结束时间
        this.initCompetitionEndDate(this.$refs.competitionEndDate);
    },
    methods: {
        // 选择是否采用队员总分制（单选框）
        handleSelectCompetitionTotalPointes: function (event) {
            var target = event.target || event.srcElement;
            var value = target.value * 1;
            this.formData.is_total_points = value;
            if (value === 1) {
                // 比赛阶段总数，1~5，如果采用队员总分制，则只能是 1
                this.formData.stage = 1;
                // 团队添加，1=组织者添加，2=队员自己填写，采用队员总分制团队必须组织者添加
                this.formData.team_where = 1;
                this.teamListShow = true;
            }
        },
        // 初始化报名开始时间
        initSignUpStartDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('报名开始时间', typeof dateValue, dateValue);
                    // 设置报名开始时间（页面显示用）
                    _this.signUpStartDate = dateValue;
                    // 设置报名开始时间（提交数据用）
                    _this.formData.a_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                    // 如果报名结束时间存在且比报名开始时间小（或相等）
                    if (_this.signUpEndDate && _this.signUpEndDate <= _this.signUpStartDate) {
                        // 如果比赛开始时间存在且比 报名结束时间或报名开始时间小（或相等）
                        if (_this.competitionStartDate && (_this.competitionStartDate <= _this.signUpEndDate || _this.competitionStartDate <= _this.signUpStartDate)) {
                            // 如果比赛结束时间存在且比 比赛开始时间或报名结束时间或报名开始时间小（或相等）
                            if (_this.competitionEndDate &&
                                (_this.competitionEndDate <= _this.competitionStartDate || _this.competitionEndDate <= _this.signUpEndDate || _this.competitionEndDate <= _this.signUpStartDate)) {
                                // 清空比赛结束时间
                                _this.competitionEndDate = '';
                                _this.formData.c_e_t = '';
                            }
                            // 清空比赛开始时间
                            _this.competitionStartDate = '';
                            _this.formData.c_b_t = '';
                        }
                        // 清空报名结束时间
                        _this.signUpEndDate = '';
                        _this.formData.a_e_t = '';
                    }
                },
            });
        },
        // 初始化报名结束时间
        initSignUpEndDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                        layer.msg('请先选择报名开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.signUpStartDate.replace(/-/g, '/'))) {
                        // 如果报名结束时间小于报名开始时间
                        layer.msg('报名结束时间要大于报名开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('报名结束时间', dateValue);
                    _this.signUpEndDate = dateValue;
                    _this.formData.a_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                    if (_this.competitionStartDate && _this.competitionStartDate <= _this.signUpEndDate) {
                        if (_this.competitionEndDate && (_this.competitionEndDate <= _this.competitionStartDate || _this.competitionEndDate <= _this.signUpEndDate)) {
                            _this.competitionEndDate = '';
                            _this.formData.c_e_t = '';
                        }
                        _this.competitionStartDate = '';
                        _this.formData.c_b_t = '';
                    }
                },
            });
        },
        // 初始化比赛开始时间
        initCompetitionStartDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                        layer.msg('请先选择报名结束时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.signUpEndDate.replace(/-/g, '/'))) {
                        // 如果比赛开始时间小于报名结束时间
                        layer.msg('比赛开始时间要大于报名结束时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('比赛开始时间', dateValue);
                    _this.competitionStartDate = dateValue;
                    _this.formData.c_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                    if (_this.competitionEndDate && _this.competitionEndDate <= _this.competitionStartDate) {
                        _this.competitionEndDate = '';
                        _this.formData.c_e_t = '';
                    }
                },
            });
        },
        // 初始化比赛结束时间
        initCompetitionEndDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                        layer.msg('请先选择比赛开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.competitionStartDate.replace(/-/g, '/'))) {
                        // 如果比赛开始时间小于报名结束时间
                        layer.msg('比赛结束时间要大于比赛开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('比赛结束时间', dateValue);
                    _this.competitionEndDate = dateValue;
                    _this.formData.c_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                },
            });
        },
        // 选择封面图
        handleCoverFileChange: function (event) {
            var element = event.target || event.srcElement;
            // 获取文件对象
            var file = element.files[0];
            console.log(file);
            // .png,.jpg,.jpeg,.bmp
            if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
                layer.msg("\u4E0D\u652F\u6301 ".concat(util.getExtensionName(file.name), " \u6587\u4EF6"));
                return;
            }
            window.URL = window.URL || window.webkitURL;
            this.coverImage = {
                // 用于提交数据
                file: file,
                // 用于页面展示
                url: window.URL.createObjectURL(file),
            };
            if (this.formData.cover_picture) {
                // 如果有 url，说明上传过了，改变图片的时候把 url 删除
                this.formData.cover_picture = '';
            }
        },
        // 选择附件
        handleAffixFileChange: function (event) {
            var element = event.target || event.srcElement;
            // 获取文件对象数组
            var files = element.files;
            // 存储符合规定的文件
            var tempArr = __spreadArray([], this.affixList, true);
            // 存储所选文件中不支持的扩展名
            var errorArr = [];
            // 存储所选文件中超过指定大小的文件名
            var errorArr2 = [];
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var item = files_1[_i];
                // 限制个数 5 个
                if (tempArr.length < 5) {
                    var filesNameList = this.affixList.length ? this.affixList.map(function (i) { return i.name; }) : [];
                    // （如果不存在文件名）禁止添加同名文件
                    if (!filesNameList.includes(item.name)) {
                        console.log(item);
                        if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
                            // 限制扩展名
                            if (!errorArr.includes(util.getExtensionName(item.name))) {
                                errorArr.push(util.getExtensionName(item.name));
                            }
                        }
                        else if (item.size > 1024 * 1024 * 10) {
                            // 限制大小 10M
                            if (!errorArr2.includes(item.name)) {
                                errorArr2.push(item.name);
                            }
                        }
                        else if (tempArr.length < 5) {
                            console.log('添加文件');
                            tempArr.push(item);
                            if (this.formData.affix) {
                                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                                this.formData.affix = '';
                            }
                        }
                    }
                }
            }
            console.log('tempArr', tempArr.length, tempArr);
            if (tempArr.length < 5 && errorArr.length) {
                console.log('errorArr', errorArr);
                layer.msg("\u4E0D\u652F\u6301 ".concat(__spreadArray([], errorArr, true), " \u6587\u4EF6"));
            }
            else if (errorArr2.length) {
                console.log('errorArr2', errorArr2);
                layer.msg("\u8BF7\u9009\u62E9 10M \u4EE5\u5185\u7684\u6587\u4EF6");
            }
            this.affixList = tempArr;
            // element.value = ''
            console.log(__assign({}, this.affixList));
        },
        // 删除附件
        handleDeleteAffix: function (index) {
            this.affixList.splice(index, 1);
            if (this.formData.affix) {
                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                this.formData.affix = '';
            }
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
            arr.push({ label: '请选择报名开始时间', validate: !this.formData.a_b_t }, { label: '请选择报名结束时间', validate: !this.formData.a_e_t }, { label: '请选择比赛开始时间', validate: !this.formData.c_b_t }, { label: '请选择比赛结束时间', validate: !this.formData.c_e_t }, { label: '请输入赛事描述', validate: !this.formData.description.trim() }, { label: '请输入赞助方', validate: !this.formData.sponsor }, { label: '请输入赛事客服电话', validate: !this.formData.service_tel }, { label: '请选择封面图', validate: !this.coverImage.url }
            // { label: '请选择附件', validate: !this.affixList.length },
            // { label: '请选择报名信息', validate: !this.formData.apply_info },
            // { label: '请选择联系方式', validate: !this.formData.contact_info },
            // { label: '请选择角色', validate: !this.formData.roles }
            );
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
            return __awaiter(this, void 0, void 0, function () {
                var loadingIndex, _a, affixUrlArr;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('发布比赛 未校验', this.formData);
                            // 校验数据
                            if (!this._validateFormData())
                                return [2 /*return*/];
                            loadingIndex = layer.load(1, {
                                shade: [0.5, '#000'], // 0.1透明度的白色背景
                                // time: 30 * 1000, // 如果30秒还没关闭则自动关闭
                            });
                            if (!!this.formData.cover_picture) return [3 /*break*/, 2];
                            // 上传封面图
                            _a = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.coverImage.file,
                                    fileName: this.coverImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('上传封面图失败', error);
                                    layer.close(loadingIndex);
                                    layer.msg('上传封面图失败');
                                })];
                        case 1:
                            // 上传封面图
                            _a.cover_picture = _b.sent();
                            if (!this.formData.cover_picture)
                                return [2 /*return*/];
                            _b.label = 2;
                        case 2:
                            if (!!this.formData.affix) return [3 /*break*/, 4];
                            return [4 /*yield*/, util
                                    .uploadMultipleFile(this.affixList.map(function (item) {
                                    console.log('affixList item', item);
                                    return {
                                        file: item,
                                        fileName: item.name,
                                    };
                                }))
                                    .catch(function (error) {
                                    console.log('上传附件失败', error);
                                    layer.close(loadingIndex);
                                    layer.msg('上传附件失败');
                                })];
                        case 3:
                            affixUrlArr = _b.sent();
                            if (!affixUrlArr)
                                return [2 /*return*/];
                            this.formData.affix = affixUrlArr.toString();
                            _b.label = 4;
                        case 4:
                            if (this.teamListShow) {
                                this.formData.team_list = this.teamNameList
                                    .filter(function (i) { return i.name; })
                                    .map(function (i) { return i.name; })
                                    .toString();
                            }
                            console.log('发布比赛 已校验', this.formData);
                            // 发布赛事
                            request({
                                url: '/api/competition/push_match',
                                method: 'post',
                                data: this.formData,
                            })
                                .then(function (result) {
                                layer.close(loadingIndex);
                                console.log(result);
                                if (result.code === 200) {
                                    // 发布成功
                                    console.log('发布成功');
                                    // 跳转到个人赛设置阶段页面
                                    window.location.href = "/bangwen/competitionStagePersonal.html?competition_id=".concat(result.data.competition_id);
                                    // this.$alert('发布成功', '', {
                                    //   showClose: false,
                                    //   confirmButtonText: '确定',
                                    //   callback: (action) => {
                                    //     // 跳转到个人赛设置阶段页面
                                    //     window.location.href = `/bangwen/competitionStagePersonal.html?competition_id=${result.data.competition_id}`
                                    //   },
                                    // })
                                }
                                else if (result.code === 201) {
                                    // 发布次数不足，跳转购买会员页面
                                    console.log('发布次数不足，跳转购买会员页面');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 202) {
                                    // 错误信息
                                    console.log('错误信息');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 203) {
                                    // 未绑定手机号
                                    console.log('未绑定手机号');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 205) {
                                    // 余额不足
                                    console.log('余额不足');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 206) {
                                    // 未交保证金
                                    console.log('未交保证金');
                                    layer.msg(result.msg);
                                    syalert.syopen('bondCont');
                                }
                                else if (result.code === 207) {
                                    // 未实名认证
                                    console.log('未实名认证');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 208) {
                                    // 未设置支付密码
                                    console.log('未设置支付密码');
                                    layer.msg(result.msg);
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                layer.close(loadingIndex);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
};
// 发布比赛团队赛
var releaseCompetitionTeam = {
    template: '#releaseCompetitionTeam',
    props: [
        // 赛事类型列表
        'competitionCateList',
    ],
    data: function () {
        return {
            // 临时
            tempPreShow: true,
            // 表单数据
            formData: {
                competition_type: 1,
                category_id: 1,
                category_memo: '',
                competition_name: '',
                stage: 1,
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
                roles: '1,2,3,4',
                fee: '',
                fee_return: 1,
                upper_limit: '',
                team_up: '',
                team_low: '',
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
            upperLimitInputShow: true,
            // 添加团队名称列表是否显示
            teamListShow: true,
            // 团队名称列表
            teamNameList: [{ id: 1, name: '' }],
        };
    },
    mounted: function () {
        // 初始化日期时间选择器
        // 初始化报名开始时间
        this.initSignUpStartDate(this.$refs.signUpStartDate);
        // 初始化报名结束时间
        this.initSignUpEndDate(this.$refs.signUpEndDate);
        // 初始化比赛开始时间
        this.initCompetitionStartDate(this.$refs.competitionStartDate);
        // 初始化比赛结束时间
        this.initCompetitionEndDate(this.$refs.competitionEndDate);
    },
    methods: {
        // 初始化报名开始时间
        initSignUpStartDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('报名开始时间', typeof dateValue, dateValue);
                    // 设置报名开始时间（页面显示用）
                    _this.signUpStartDate = dateValue;
                    // 设置报名开始时间（提交数据用）
                    _this.formData.a_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                    // 如果报名结束时间存在且比报名开始时间小（或相等）
                    if (_this.signUpEndDate && _this.signUpEndDate <= _this.signUpStartDate) {
                        // 如果比赛开始时间存在且比 报名结束时间或报名开始时间小（或相等）
                        if (_this.competitionStartDate && (_this.competitionStartDate <= _this.signUpEndDate || _this.competitionStartDate <= _this.signUpStartDate)) {
                            // 如果比赛结束时间存在且比 比赛开始时间或报名结束时间或报名开始时间小（或相等）
                            if (_this.competitionEndDate &&
                                (_this.competitionEndDate <= _this.competitionStartDate || _this.competitionEndDate <= _this.signUpEndDate || _this.competitionEndDate <= _this.signUpStartDate)) {
                                // 清空比赛结束时间
                                _this.competitionEndDate = '';
                                _this.formData.c_e_t = '';
                            }
                            // 清空比赛开始时间
                            _this.competitionStartDate = '';
                            _this.formData.c_b_t = '';
                        }
                        // 清空报名结束时间
                        _this.signUpEndDate = '';
                        _this.formData.a_e_t = '';
                    }
                },
            });
        },
        // 初始化报名结束时间
        initSignUpEndDate: function (elem) {
            var _this = this;
            console.log('初始化报名结束时间');
            layui.laydate.render({
                elem: elem,
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
                        layer.msg('请先选择报名开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.signUpStartDate.replace(/-/g, '/'))) {
                        // 如果报名结束时间小于报名开始时间
                        layer.msg('报名结束时间要大于报名开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('报名结束时间', dateValue);
                    _this.signUpEndDate = dateValue;
                    _this.formData.a_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                    if (_this.competitionStartDate && _this.competitionStartDate <= _this.signUpEndDate) {
                        if (_this.competitionEndDate && (_this.competitionEndDate <= _this.competitionStartDate || _this.competitionEndDate <= _this.signUpEndDate)) {
                            _this.competitionEndDate = '';
                            _this.formData.c_e_t = '';
                        }
                        _this.competitionStartDate = '';
                        _this.formData.c_b_t = '';
                    }
                },
            });
        },
        // 初始化比赛开始时间
        initCompetitionStartDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                        layer.msg('请先选择报名结束时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.signUpEndDate.replace(/-/g, '/'))) {
                        // 如果比赛开始时间小于报名结束时间
                        layer.msg('比赛开始时间要大于报名结束时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('比赛开始时间', dateValue);
                    _this.competitionStartDate = dateValue;
                    _this.formData.c_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                    if (_this.competitionEndDate && _this.competitionEndDate <= _this.competitionStartDate) {
                        _this.competitionEndDate = '';
                        _this.formData.c_e_t = '';
                    }
                },
            });
        },
        // 初始化比赛结束时间
        initCompetitionEndDate: function (elem) {
            var _this = this;
            layui.laydate.render({
                elem: elem,
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
                        layer.msg('请先选择比赛开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.competitionStartDate.replace(/-/g, '/'))) {
                        // 如果比赛开始时间小于报名结束时间
                        layer.msg('比赛结束时间要大于比赛开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    else if (date.minutes !== 0 && date.minutes !== 30) {
                        // 分钟只能选择 00 或 30
                        layer.msg('请选择具体时间');
                        dateValue = '';
                    }
                    console.log('比赛结束时间', dateValue);
                    _this.competitionEndDate = dateValue;
                    _this.formData.c_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : '';
                },
            });
        },
        // 选择封面图
        handleCoverFileChange: function (event) {
            var element = event.target || event.srcElement;
            // 获取文件对象
            var file = element.files[0];
            console.log(file);
            // .png,.jpg,.jpeg,.bmp
            if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
                layer.msg("\u4E0D\u652F\u6301 ".concat(util.getExtensionName(file.name), " \u6587\u4EF6"));
                return;
            }
            window.URL = window.URL || window.webkitURL;
            this.coverImage = {
                // 用于提交数据
                file: file,
                // 用于页面展示
                url: window.URL.createObjectURL(file),
            };
            if (this.formData.cover_picture) {
                // 如果有 url，说明上传过了，改变图片的时候把 url 删除
                this.formData.cover_picture = '';
            }
        },
        // 选择附件
        handleAffixFileChange: function (event) {
            var element = event.target || event.srcElement;
            // 获取文件对象数组
            var files = element.files;
            // 存储符合规定的文件
            var tempArr = __spreadArray([], this.affixList, true);
            // 存储所选文件中不支持的扩展名
            var errorArr = [];
            // 存储所选文件中超过指定大小的文件名
            var errorArr2 = [];
            for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                var item = files_2[_i];
                // 限制个数 5 个
                if (tempArr.length < 5) {
                    var filesNameList = this.affixList.length ? this.affixList.map(function (i) { return i.name; }) : [];
                    // （如果不存在文件名）禁止添加同名文件
                    if (!filesNameList.includes(item.name)) {
                        console.log(item);
                        if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
                            // 限制扩展名
                            if (!errorArr.includes(util.getExtensionName(item.name))) {
                                errorArr.push(util.getExtensionName(item.name));
                            }
                        }
                        else if (item.size > 1024 * 1024 * 10) {
                            // 限制大小 10M
                            if (!errorArr2.includes(item.name)) {
                                errorArr2.push(item.name);
                            }
                        }
                        else if (tempArr.length < 5) {
                            console.log('添加文件');
                            tempArr.push(item);
                            if (this.formData.affix) {
                                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                                this.formData.affix = '';
                            }
                        }
                    }
                }
            }
            console.log('tempArr', tempArr.length, tempArr);
            if (tempArr.length < 5 && errorArr.length) {
                console.log('errorArr', errorArr);
                layer.msg("\u4E0D\u652F\u6301 ".concat(__spreadArray([], errorArr, true), " \u6587\u4EF6"));
            }
            else if (errorArr2.length) {
                console.log('errorArr2', errorArr2);
                layer.msg("\u8BF7\u9009\u62E9 10M \u4EE5\u5185\u7684\u6587\u4EF6");
            }
            this.affixList = tempArr;
            // element.value = ''
            console.log(__assign({}, this.affixList));
        },
        // 删除附件
        handleDeleteAffix: function (index) {
            this.affixList.splice(index, 1);
            if (this.formData.affix) {
                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                this.formData.affix = '';
            }
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
            arr.push({ label: '请选择报名开始时间', validate: !this.formData.a_b_t }, { label: '请选择报名结束时间', validate: !this.formData.a_e_t }, { label: '请选择比赛开始时间', validate: !this.formData.c_b_t }, { label: '请选择比赛结束时间', validate: !this.formData.c_e_t }, { label: '请输入赛事描述', validate: !this.formData.description.trim() }, { label: '请输入赞助方', validate: !this.formData.sponsor }, { label: '请输入赛事客服电话', validate: !this.formData.service_tel }, { label: '请选择封面图', validate: !this.coverImage.url }
            // { label: '请选择附件', validate: !this.affixList.length },
            // { label: '请选择报名信息', validate: !this.formData.apply_info },
            // { label: '请选择联系方式', validate: !this.formData.contact_info },
            // { label: '请选择角色', validate: !this.formData.roles }
            );
            if (this.feeInputShow) {
                arr.push({ label: '请输入报名费用', validate: !this.formData.fee }, { label: '报名费用必须大于 0', validate: this.formData.fee <= 0 });
            }
            arr.push({ label: '请输入队伍上限', validate: this.formData.upper_limit === '' }, { label: '队伍上限上限必须是 0~100 的整数', validate: this.formData.upper_limit < 0 || this.formData.upper_limit > 100 || this.formData.upper_limit > parseInt(this.formData.upper_limit) }, { label: '请输入每队人数上限', validate: this.formData.team_up === '' }, { label: '每队人数上限必须是 1~100 的整数', validate: this.formData.team_up <= 0 || this.formData.team_up > 100 || this.formData.team_up > parseInt(this.formData.team_up) }, { label: '请输入每队人数下限', validate: this.formData.team_low === '' }, { label: '每队人数下线不能大于每队人数上限', validate: this.formData.team_low > this.formData.team_up }, { label: '每队人数下限必须是 1~100 的整数', validate: this.formData.team_low <= 0 || this.formData.team_low > 100 || this.formData.team_low > parseInt(this.formData.team_low) });
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
            return __awaiter(this, void 0, void 0, function () {
                var loadingIndex, _a, affixUrlArr;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('发布比赛 未校验', this.formData);
                            // 校验数据
                            if (!this._validateFormData())
                                return [2 /*return*/];
                            loadingIndex = layer.load(1, {
                                shade: [0.5, '#000'], // 0.1透明度的白色背景
                                // time: 30 * 1000, // 如果30秒还没关闭则自动关闭
                            });
                            if (!!this.formData.cover_picture) return [3 /*break*/, 2];
                            // 上传封面图
                            _a = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.coverImage.file,
                                    fileName: this.coverImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('上传封面图失败', error);
                                    layer.close(loadingIndex);
                                    layer.msg('上传封面图失败');
                                })];
                        case 1:
                            // 上传封面图
                            _a.cover_picture = _b.sent();
                            if (!this.formData.cover_picture)
                                return [2 /*return*/];
                            _b.label = 2;
                        case 2:
                            if (!!this.formData.affix) return [3 /*break*/, 4];
                            return [4 /*yield*/, util
                                    .uploadMultipleFile(this.affixList.map(function (item) {
                                    console.log('affixList item', item);
                                    return {
                                        file: item,
                                        fileName: item.name,
                                    };
                                }))
                                    .catch(function (error) {
                                    console.log('上传附件失败', error);
                                    layer.close(loadingIndex);
                                    layer.msg('上传附件失败');
                                })];
                        case 3:
                            affixUrlArr = _b.sent();
                            if (!affixUrlArr)
                                return [2 /*return*/];
                            this.formData.affix = affixUrlArr.toString();
                            _b.label = 4;
                        case 4:
                            if (this.teamListShow) {
                                this.formData.team_list = this.teamNameList
                                    .filter(function (i) { return i.name; })
                                    .map(function (i) { return i.name; })
                                    .toString();
                            }
                            console.log('发布比赛 已校验', this.formData);
                            // 发布赛事
                            request({
                                url: '/api/competition_team/push_match',
                                method: 'post',
                                data: this.formData,
                            })
                                .then(function (result) {
                                layer.close(loadingIndex);
                                console.log(result);
                                if (result.code === 200) {
                                    // 发布成功
                                    console.log('发布成功');
                                    // 跳转到团队赛设置阶段页面
                                    window.location.href = "/bangwen/competitionStageTeam.html?competition_id=".concat(result.data.competition_id);
                                    // this.$alert('发布成功', '', {
                                    //   showClose: false,
                                    //   confirmButtonText: '确定',
                                    //   callback: (action) => {
                                    //     // 跳转到团队赛设置阶段页面
                                    //     window.location.href = `/bangwen/competitionStageTeam.html?competition_id=${result.data.competition_id}`
                                    //   },
                                    // })
                                }
                                else if (result.code === 201) {
                                    // 发布次数不足，跳转购买会员页面
                                    console.log('发布次数不足，跳转购买会员页面');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 202) {
                                    // 错误信息
                                    console.log('错误信息');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 203) {
                                    // 未绑定手机号
                                    console.log('未绑定手机号');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 205) {
                                    // 余额不足
                                    console.log('余额不足');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 206) {
                                    // 未交保证金
                                    console.log('未交保证金');
                                    layer.msg(result.msg);
                                    syalert.syopen('bondCont');
                                }
                                else if (result.code === 207) {
                                    // 未实名认证
                                    console.log('未实名认证');
                                    layer.msg(result.msg);
                                }
                                else if (result.code === 208) {
                                    // 未设置支付密码
                                    console.log('未设置支付密码');
                                    layer.msg(result.msg);
                                }
                            })
                                .catch(function (error) {
                                console.log(error);
                                layer.close(loadingIndex);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
};
new Vue({
    el: '#app',
    components: {
        // 发布比赛个人赛
        'release-competition-personal': releaseCompetitionPersonal,
        // 发布比赛团队赛
        'release-competition-team': releaseCompetitionTeam,
    },
    data: function () {
        return {
            // 赛事类型列表（从服务器获取）
            competitionCateList: [],
            // 赛事种类，0=个人赛，1=团队赛
            competitionType: 0,
            // 保证金弹框是否显示
            depositDialogVisible: true,
            // 支付方式
            payMethod: 1,
            // 钱包支付弹框是否显示
            walletPayDialogVisible: false,
            // 支付密码
            payPassword: '',
        };
    },
    created: function () {
        var _this = this;
        // 获取赛事类型列表
        request({
            url: '/api/Competition/get_category_list',
        }).then(function (result) {
            console.log('赛事类型列表', result);
            if (+result.code === 200) {
                _this.competitionCateList = result.data;
            }
        });
        // // 判断是否实名认证
        // request({
        //   url: '/api/Mine/realInfo',
        // }).then((result) => {
        //   if (+result.code === 200) {
        //     if (+result.data.check_status === -2) {
        //       layer.confirm(
        //         '无法发布赛事。您还未实名认证，请实名认证',
        //         {
        //           btn: ['立即认证'], //按钮
        //           title: false,
        //           closeBtn: 0,
        //         },
        //         function (index) {
        //           location.href = '/userCont/setup/realName.html'
        //         }
        //       )
        //     } else if (+result.data.check_status === -1) {
        //       layer.confirm(
        //         '无法发布赛事。实名认证信息审核失败，请重新上传',
        //         {
        //           btn: ['重新上传'], //按钮
        //           title: false,
        //           closeBtn: 0,
        //         },
        //         function (index) {
        //           location.href = '/userCont/setup/realName.html'
        //         }
        //       )
        //     } else if (+result.data.check_status === 0) {
        //       layer.confirm(
        //         '无法发布赛事。实名认证信息审核中...',
        //         {
        //           btn: ['返回'], //按钮
        //           title: false,
        //           closeBtn: 0,
        //         },
        //         function (index) {
        //           // location.href = '/'
        //           history.go(-1)
        //         }
        //       )
        //     }
        //   }
        // })
        // // 判断是否缴纳保证金
        // request({
        //   url: '/api/Mine/info'
        // })
    },
    methods: {
        // 测试
        handleTest: function () {
            console.log('测试');
            // window.open('/')
        },
        // 打开保证金弹框
        handleOpenDepositDialog: function () {
            this.depositDialogVisible = true;
        },
        // 关闭保证金弹框
        handleCloseDepositDialog: function () {
            this.depositDialogVisible = false;
            window.history.go(-1);
        },
        // 确认支付保证金
        handleConfirmPayDeposit: function () {
            return __awaiter(this, void 0, void 0, function () {
                var userInfoResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.payMethod === 1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, request({ url: '/api/Mine/info' })];
                        case 1:
                            userInfoResult = _a.sent();
                            if (+userInfoResult.code === 200 && +userInfoResult.data.is_set_paypwd === 0) {
                                // 未设置支付密码
                                this.$alert('<div style="text-align: center; font-size: 20px;">请先设置支付密码</div>', '', {
                                    confirmButtonText: '确定',
                                    showClose: false,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonClass: 'orange-button-bg',
                                    callback: function () {
                                        // 在新窗口中打开页面
                                        // 打开设置支付密码页面
                                        window.open('/userCont/wallet/pwd.html');
                                    },
                                });
                                return [2 /*return*/];
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        },
    },
});
