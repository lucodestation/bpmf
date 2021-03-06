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
new Vue({
    el: '#app',
    data: function () {
        return {
            // ????????????
            formData: {
                name: '',
                idcard: '',
                front_image: '',
                back_image: '',
                hand_image: '', // ???????????????
                // check_id: '',// ?????????????????????????????????id???
            },
            userCont: '',
            coverImage: {},
            sfzImage: {},
            scImage: {}, // ???????????????
        };
    },
    created: function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request({
                            method: 'POST',
                            url: '/api/Mine/realInfo',
                        })];
                    case 1:
                        res = _a.sent();
                        if (res.code == 200) {
                            this.userCont = res.data;
                        }
                        else {
                            layer.msg(res.msg);
                        }
                        // ????????????????????????
                        this.initCoverImageFileChange();
                        // ????????????????????????
                        this.sfzImageFileChange();
                        // ????????????????????????
                        this.scImageFileChange();
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // ????????????????????????
        initCoverImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#uploadCover',
                auto: false,
                accept: 'images',
                acceptMime: '.jpg,.png,.bmp,.jpeg',
                exts: 'jpg|png|bmp|jpeg',
                size: 0,
                multiple: false,
                // ??????????????????
                choose: function (result) {
                    console.log(result);
                    //?????????????????????????????????????????????????????????(?????????ie8/9)
                    result.preview(function (index, file, result) {
                        // console.log(index) //??????????????????
                        // console.log(file) //??????????????????
                        // console.log(result) //????????????base64?????????????????????
                        _this.coverImage = {
                            // ??????????????????
                            file: file,
                            // ??????????????????
                            url: result,
                        };
                        console.log(_this.coverImage);
                    });
                },
            });
        },
        // ????????????????????????
        sfzImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#sfzuploadCover',
                auto: false,
                accept: 'images',
                acceptMime: '.jpg,.png,.bmp,.jpeg',
                exts: 'jpg|png|bmp|jpeg',
                size: 0,
                multiple: false,
                // ??????????????????
                choose: function (result) {
                    console.log(result);
                    //?????????????????????????????????????????????????????????(?????????ie8/9)
                    result.preview(function (index, file, result) {
                        // console.log(index) //??????????????????
                        // console.log(file) //??????????????????
                        // console.log(result) //????????????base64?????????????????????
                        _this.sfzImage = {
                            // ??????????????????
                            file: file,
                            // ??????????????????
                            url: result,
                        };
                        console.log(_this.sfzImage);
                    });
                },
            });
        },
        // ????????????????????????
        scImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#scuploadCover',
                auto: false,
                accept: 'images',
                acceptMime: '.jpg,.png,.bmp,.jpeg',
                exts: 'jpg|png|bmp|jpeg',
                size: 0,
                multiple: false,
                // ??????????????????
                choose: function (result) {
                    console.log(result);
                    //?????????????????????????????????????????????????????????(?????????ie8/9)
                    result.preview(function (index, file, result) {
                        // console.log(index) //??????????????????
                        // console.log(file) //??????????????????
                        // console.log(result) //????????????base64?????????????????????
                        _this.scImage = {
                            // ??????????????????
                            file: file,
                            // ??????????????????
                            url: result,
                        };
                        console.log(_this.scImage);
                    });
                },
            });
        },
        onrealInfo: function () {
            var _this = this;
            request({ url: '/api/Mine/realInfo', method: 'post' }).then(function (res) {
                if (res.code == 200) {
                    _this.userCont = res.data;
                }
                else {
                    layer.msg(res.msg);
                }
            });
        },
        // ????????????????????????
        onuserCont: function () {
            this.userCont.check_status = '-2';
            this.formData = {
                name: this.userCont.name,
                idcard: this.userCont.idcard,
                front_image: '',
                back_image: '',
                hand_image: '',
                check_id: this.userCont.idcard, // ?????????????????????????????????id???
            };
        },
        // ????????????
        onBtnClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var reg_tel, _a, _b, _c;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!this.formData.name)
                                return [2 /*return*/, layer.msg('???????????????')];
                            if (!this.formData.idcard)
                                return [2 /*return*/, layer.msg('?????????????????????')];
                            if (this.formData.idcard) {
                                reg_tel = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                                if (!reg_tel.test(this.formData.idcard))
                                    return [2 /*return*/, layer.msg('??????????????????????????????')];
                            }
                            if (!this.coverImage.url)
                                return [2 /*return*/, layer.msg('????????????????????????')];
                            if (!this.sfzImage.url)
                                return [2 /*return*/, layer.msg('????????????????????????')];
                            if (!this.scImage.url)
                                return [2 /*return*/, layer.msg('????????????????????????')];
                            _a = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.coverImage.file,
                                    fileName: this.coverImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('???????????????????????????', error);
                                    layer.msg('???????????????????????????');
                                })];
                        case 1:
                            _a.front_image = _d.sent();
                            if (!this.formData.front_image)
                                return [2 /*return*/];
                            _b = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.sfzImage.file,
                                    fileName: this.sfzImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('???????????????????????????', error);
                                    layer.msg('???????????????????????????');
                                })];
                        case 2:
                            _b.back_image = _d.sent();
                            if (!this.formData.back_image)
                                return [2 /*return*/];
                            _c = this.formData;
                            return [4 /*yield*/, util
                                    .uploadFile({
                                    file: this.scImage.file,
                                    fileName: this.scImage.file.name,
                                })
                                    .catch(function (error) {
                                    console.log('???????????????????????????', error);
                                    layer.msg('???????????????????????????');
                                })];
                        case 3:
                            _c.hand_image = _d.sent();
                            if (!this.formData.hand_image)
                                return [2 /*return*/];
                            request({ url: '/api/Mine/realname', method: 'post', data: this.formData }).then(function (res) {
                                if (res.code == 200) {
                                    layer.msg('????????????');
                                    _this.onrealInfo();
                                }
                                else {
                                    layer.msg(res.msg);
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
    }
});
