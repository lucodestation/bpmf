"use strict";
// 发布比赛
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
                cover_picture: '',
                affix: '',
                apply_info: '',
                contact_info: '',
                roles: '',
                fee: '',
                upper_limit: '',
                team_where: '',
                team_list: '', // team_where=1时必传此参数，团队列表，多个用英文逗号隔开
            },
            // 开始时间
            // 如果分钟是 0 或 30，则开始时间再加 10 分钟
            startDate: new Date().getMinutes() === 0 || new Date().getMinutes() === 30 ? new Date(new Date().valueOf() + 1000 * 60 * 10) : new Date().valueOf(),
            // 封面图
            coverImage: {},
            // 附件列表
            affixList: [],
        };
    },
    mounted: function () {
        var _this = this;
        // 获取赛事类型列表
        request({
            url: '/api/Competition/get_category_list',
            success: function (result) {
                console.log('赛事类型列表', result);
                if (+result.code == 200) {
                    _this.competitionCateList = result.data;
                }
                else {
                }
            },
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
        // 选择是否采用队员总分制
        handleCheckedTotalPoints: function (value) {
            console.log(value);
            this.formData.is_total_points = value;
            if (value === 1) {
                this.formData.stage = 1;
            }
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
                    _this.formData.a_b_t = dateValue;
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
                    else if (!_this.formData.a_b_t) {
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
                    else if (new Date(dateValue) <= new Date(_this.formData.a_b_t)) {
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
                    _this.formData.a_e_t = dateValue;
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
                    else if (!_this.formData.a_e_t) {
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
                    else if (new Date(dateValue) <= new Date(_this.formData.a_e_t)) {
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
                    _this.formData.c_b_t = dateValue;
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
                    else if (!_this.formData.c_b_t) {
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
                    else if (new Date(dateValue) <= new Date(_this.formData.c_b_t)) {
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
                    _this.formData.c_e_t = dateValue;
                },
            });
        },
        // 初始化选择封面图
        initCoverImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#uploadCover',
                auto: false,
                accept: 'image',
                acceptMime: '.jpg,.png,.bmp,.jpeg,.webp',
                exts: 'jpg|png|bmp|jpeg|webp',
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
                        var formData = new FormData();
                        formData.append('file', file);
                        console.log(formData);
                        _this.coverImage = {
                            file: file,
                            url: result,
                        };
                    });
                },
            });
            // const element = event.target || event.srcElement
            // const files = element.files[0]
            // console.log(files)
            // if (!files.type.startsWith('image/')) {
            //   console.log('请选择图片文件')
            //   layer.msg('请选择图片文件', { icon: 2, time: 3000 })
            //   element.value = ''
            //   this.coverImage = ''
            //   return
            // }
            // window.URL = window.URL || window.webkitURL
            // const url = window.URL.createObjectURL(files)
            // console.log(url)
            // console.log(files)
            // this.coverImage = files
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
                console.log(item);
                var filesNameList = this.affixList.map(function (i) { return i.name; });
                // 禁止添加同名文件
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
            tempArr.length = 5 - this.affixList.length;
            (_a = this.affixList).push.apply(_a, tempArr);
            element.value = '';
        },
        // 删除附件
        handleDeleteAffix: function (index) {
            this.affixList = this.affixList.filter(function (item, ind) { return index !== ind; });
        },
        // 下一步
        handleNextStep: function (event) {
            console.log('下一步 handleNextStep');
            console.log('封面图', this.coverImage);
            var formData = new FormData();
            formData.append('file', this.coverImage.file);
            console.log(formData);
            // console.table({ ...this.formData })
            // console.log([...this.competitionCateList])
        },
    },
});
