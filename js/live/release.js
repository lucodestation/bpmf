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
            // 表单数据
            formData: {
                type: '1',
                join_type: '1',
                c_id: '',
                title: '',
                start_time: '',
                end_time: '',
                descri: '',
                image: '',
                password: '', // 密码进入，此值必传
            },
            cateList: [],
            startDate: new Date().valueOf(),
            signUpStartDate: '',
            signUpEndDate: '',
            coverImage: {},
            push_url: ''
        };
    },
    mounted: function () {
        var _this = this;
        // 直播分类
        request({ url: '/api/Live/liveCates', method: 'POST' }).then(function (res) {
            if (res.code == 200) {
                _this.cateList = res.data;
                _this.formData.c_id = res.data[0].id;
            }
        });
        // 开始时间
        this.initSignUpStartDate(this.$refs.signUpStartDate);
        // 结束时间
        this.initSignUpEndDate(this.$refs.signUpEndDate);
    },
    methods: {
        // 开始时间
        initSignUpStartDate: function (elem) {
            var _this = this;
            console.log(elem);
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
                    // console.log(value) //得到日期生成的值，如：2022-03-09 00:00
                    // console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
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
                    // console.log('报名开始时间', typeof dateValue, dateValue)
                    // 设置报名开始时间（页面显示用）
                    _this.signUpStartDate = dateValue;
                    // 设置报名开始时间（提交数据用）
                    _this.formData.start_time = dateValue;
                    // 如果报名结束时间存在且比报名开始时间小（或相等）
                    if (_this.signUpEndDate && _this.signUpEndDate <= _this.signUpStartDate) {
                        // 清空报名结束时间
                        _this.signUpEndDate = '';
                        _this.formData.end_time = '';
                    }
                },
            });
        },
        // 结束时间
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
                    var dateValue = value;
                    if (!dateValue) {
                        // 点击了清空
                        console.log('点击了清空', dateValue);
                    }
                    else if (!_this.signUpStartDate) {
                        // 如果还没有选择报名开始时间
                        layer.msg('请先选择开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(_this.signUpStartDate.replace(/-/g, '/'))) {
                        // 如果报名结束时间小于报名开始时间
                        layer.msg('结束时间要大于开始时间');
                        dateValue = '';
                    }
                    else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
                        // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
                        console.log('选择的时间小于当前时间');
                        layer.msg('选择的时间不能小于当前时间');
                        dateValue = '';
                    }
                    console.log('报名结束时间', dateValue);
                    _this.signUpEndDate = dateValue;
                    _this.formData.end_time = dateValue;
                },
            });
        },
        // 上传头像
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
        },
        // 提交申请
        onAddClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadingIndex, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.formData.join_type == 4) {
                                if (!this.formData.password)
                                    return [2 /*return*/, layer.msg('请输入设置密码')];
                                if (this.formData.password.length != 6)
                                    return [2 /*return*/, layer.msg('密码长度为6位')];
                            }
                            if (!this.formData.title)
                                return [2 /*return*/, layer.msg('请输入直播讲解主题')];
                            if (!this.formData.start_time)
                                return [2 /*return*/, layer.msg('请选择开始时间')];
                            if (!this.formData.end_time)
                                return [2 /*return*/, layer.msg('请选择结束时间')];
                            if (!this.formData.descri)
                                return [2 /*return*/, layer.msg('请输入直播内容')];
                            loadingIndex = layer.load(1, {
                                shade: [0.5, '#000'],
                                time: 10 * 1000, // 如果十秒还没关闭则自动关闭
                            });
                            // 上传封面图
                            _a = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.coverImage.file,
                                    fileName: this.coverImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('上传直播头像', error);
                                    layer.close(loadingIndex);
                                    layer.msg('上传直播头像');
                                })];
                        case 1:
                            // 上传封面图
                            _a.image = _b.sent();
                            if (!this.formData.image)
                                return [2 /*return*/];
                            request({ url: '/api/Live/push', method: 'POST', data: this.formData, }).then(function (res) {
                                layer.close(loadingIndex);
                                if (res.code == 200) {
                                    _this.push_url = res.data.push_url;
                                    _this.formData = {
                                        type: '1',
                                        join_type: '1',
                                        c_id: '',
                                        title: '',
                                        start_time: '',
                                        end_time: '',
                                        descri: '',
                                        image: '',
                                        password: '', // 密码进入，此值必传
                                    };
                                    syalert.syopen('liveCont');
                                }
                                else {
                                    layer.msg(result.msg);
                                }
                            }).catch(function (error) {
                                console.log(error);
                                layer.close(loadingIndex);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
        copyUrl: function () {
            // var aa = document.getElementById('url')
            // aa.select()
            // document.execCommand('Copy')
            // window.clipboardData.setData('Text', this.push_url)
            this.copyContent = this.$refs.copytext.innerText; //也可以直接写上等于你想要复制的内容
            var input = document.createElement("input"); // 直接构建input
            input.value = this.copyContent; // 设置内容
            console.log(input.value);
            document.body.appendChild(input); // 添加临时实例
            input.select(); // 选择实例内容
            document.execCommand("Copy"); // 执行复制
            document.body.removeChild(input); // 删除临时实例
            layer.msg("复制成功");
        }
    }
});
