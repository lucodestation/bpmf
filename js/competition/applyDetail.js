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
// 赛事详情
// 引入头部
$('.public-header').load('/components/PublicHeader.html');
// 引入底部
$('.public-footer').load('/components/PublicFooter.html');
Vue.use(ELEMENT);
var applyDetail = new Vue({
    el: '#app',
    data: function () {
        return {
            // 赛事信息
            competitionInfo: {},
            // 阶段信息
            stageInfo: [],
            // 当前阶段索引
            currentStateIndex: 0,
            // 奖励信息
            awardInfo: {},
            // 当前 tab 0=对阵安排 1=赛事详情
            currentTab: 0,
            // 角色选择列表
            roleList: [
                { id: 1, label: '参赛选手' },
                { id: 2, label: '裁判' },
                { id: 3, label: '主裁判' },
            ],
            // 省列表
            provinceList: [],
            // 市列表
            cityList: [],
            // 区列表
            areaList: [],
            // 报名对话框是否显示
            applyDialogVisible: false,
            // 赛事频道-我要报名表单请求页接口--个人赛
            applyDialogInfo: {},
            // 报名对话框要提交的数据
            applyDialogData: {
                // 比赛id
                competition_id: '',
                // 所报角色id，1=选手，2=裁判，3=主裁判
                role_id: 1,
                // 其他平台比赛账号
                account_number: '',
                // 技术水平/类型 id，，备注：裁判，主裁判报名时无需传递
                skill_id: '',
                // 技术等级id，，备注：裁判，主裁判报名时无需传递
                level_id: '',
                // 身份证明类型：1=身份证，2=军官证，3=其他
                identification: 1,
                // 身份证明图片url，多个用英文逗号隔开
                i_image: '',
                // 联系方式-手机号
                tel: '',
                qq: '',
                msn: '',
                skype: '',
                wx: '',
                username: '',
                age: '',
                gender: '',
                // 代表队/所在团队
                team: '',
                // 省份id
                province: '',
                // 城市id
                city: '',
                // 区县id
                area: '',
                // 居住地址
                addr: '',
                // 自我介绍
                introduce: '',
                // 附件url
                affix: '',
                // 1=我的钱包，2=支付宝，3=微信支付 //没有报名费不用出现选择支付的信息，直接提交
                pay_way: '',
            },
            // 技术水平列表
            technicalLevelList: [],
            // 技术等级列表
            technicalGradeList: [],
            // 是否已同意协议
            agreedAgreement: false,
            // 身份证明文件列表
            personalID: [],
            // 附件文件列表
            affixList: [],
        };
    },
    // 过滤器
    filters: {
        // 奖金
        bonus: function (value) {
            if (value > 9999 && value % 10000 === 0) {
                return value / 10000 + '万';
            }
            return value * 1 + '元';
        },
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
        // 破同分规则，1=小分，2=违例，3=加塞，4=抽签，5=直胜，6=胜局，7=并列，8=总局分，9=对手分1型，10=对手分2型，11=净胜局数，12=koya system
        rankingSystem: function (value) {
            var arr = ['', '小分', '违例', '加塞', '抽签', '直胜', '胜局', '并列', '总局分', '对手分1型', '对手分2型', '净胜局数', 'koya system'];
            console.log(value
                .split(',')
                .map(function (item) { return arr[+item]; })
                .join('、'));
            return value
                .split(',')
                .map(function (item) { return arr[+item]; })
                .join('、');
        },
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, applyDetailResult;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = Qs.parse(location.search.substr(1));
                        console.log(searchParams);
                        return [4 /*yield*/, request({
                                url: '/api/competition/apply_detail',
                                method: 'post',
                                data: { competition_id: searchParams.competition_id },
                            })];
                    case 1:
                        applyDetailResult = _a.sent();
                        if (+applyDetailResult.code === 200) {
                            this.competitionInfo = applyDetailResult.data.competition;
                            this.stageInfo = applyDetailResult.data.competition_stage;
                            this.awardInfo = applyDetailResult.data.competition_award;
                            setTimeout(function () {
                                new Swiper(_this.$refs.swiper, {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                    loop: false,
                                    navigation: {
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    },
                                });
                            }, 100);
                            // 临时
                            this.handleOpenApplyDialog();
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // 打开报名对话框
        handleOpenApplyDialog: function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, technicalLevelResult, provinceResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.applyDialogVisible = true;
                            return [2 /*return*/];
                        case 1:
                            result = _a.sent();
                            if (!(+result.code === 200)) return [3 /*break*/, 4];
                            console.log('报名对话框需要的信息', result.data);
                            this.applyDialogInfo = result.data;
                            return [4 /*yield*/, request({
                                    url: '/api/competition/get_competition_skill',
                                    method: 'post',
                                    data: { category_id: this.applyDialogInfo.category_id },
                                })];
                        case 2:
                            technicalLevelResult = _a.sent();
                            this.technicalLevelList = technicalLevelResult.data;
                            return [4 /*yield*/, request({
                                    url: '/api/competition/area',
                                    method: 'post',
                                    data: { pid: 0 },
                                })];
                        case 3:
                            provinceResult = _a.sent();
                            this.provinceList = provinceResult.data;
                            this.applyDialogVisible = true;
                            return [3 /*break*/, 5];
                        case 4:
                            layer.msg(result.msg);
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        // 关闭报名对话框
        handleCloseApplyDialog: function () {
            this.applyDialogInfo = {};
            this.applyDialogData = {
                // 比赛id
                competition_id: '',
                // 所报角色id，1=选手，2=裁判，3=主裁判
                role_id: '',
                // 其他平台比赛账号
                account_number: '',
                // 技术水平/类型 id，，备注：裁判，主裁判报名时无需传递
                skill_id: '',
                // 技术等级id，，备注：裁判，主裁判报名时无需传递
                level_id: '',
                // 身份证明类型：1=身份证，2=军官证，3=其他
                identification: '',
                // 身份证明图片url，多个用英文逗号隔开
                i_image: '',
                // 联系方式-手机号
                tel: '',
                qq: '',
                msn: '',
                skype: '',
                wx: '',
                username: '',
                age: '',
                gender: '',
                // 代表队/所在团队
                team: '',
                // 省份id
                province: '',
                // 城市id
                city: '',
                // 区县id
                area: '',
                // 居住地址
                addr: '',
                // 自我介绍
                introduce: '',
                // 附件url
                affix: '',
                // 1=我的钱包，2=支付宝，3=微信支付 //没有报名费不用出现选择支付的信息，直接提交
                pay_way: '',
            };
            this.applyDialogVisible = false;
        },
        // 选择技术水平
        handleSelectTechnicalLevel: function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var target, skill_id, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            target = event.target || event.srcElement;
                            skill_id = target.value;
                            this.applyDialogData.skill_id = skill_id;
                            return [4 /*yield*/, request({
                                    url: '/api/competition/get_competition_skill_level',
                                    method: 'post',
                                    data: { skill_id: skill_id },
                                })];
                        case 1:
                            result = _a.sent();
                            this.technicalGradeList = result.data;
                            this.applyDialogData.level_id = '';
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 选择技术等级
        handleSelectTechnicalGrade: function (event) {
            var target = event.target || event.srcElement;
            var id = target.value;
            this.applyDialogData.level_id = id;
        },
        // 选择省份
        handleSelectProvince: function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var target, id, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            target = event.target || event.srcElement;
                            id = target.value;
                            console.log('省 id', id);
                            this.applyDialogData.province = id;
                            // 清除选择的市、县
                            this.applyDialogData.city = '';
                            this.applyDialogData.area = '';
                            // 清除县列表
                            this.areaList = [];
                            return [4 /*yield*/, request({
                                    url: '/api/competition/area',
                                    method: 'post',
                                    data: { pid: id },
                                })];
                        case 1:
                            result = _a.sent();
                            this.cityList = result.data;
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 选择城市
        handleSelectCity: function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var target, id, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            target = event.target || event.srcElement;
                            id = target.value;
                            this.applyDialogData.city = id;
                            // 清除选择的县
                            this.applyDialogData.area = '';
                            return [4 /*yield*/, request({
                                    url: '/api/competition/area',
                                    method: 'post',
                                    data: { pid: id },
                                })];
                        case 1:
                            result = _a.sent();
                            this.areaList = result.data;
                            return [2 /*return*/];
                    }
                });
            });
        },
        // 选择区县
        handleSelectArea: function (event) {
            var target = event.target || event.srcElement;
            var id = target.value;
            this.applyDialogData.area = id;
        },
    },
});
