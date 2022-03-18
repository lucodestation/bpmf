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
            // 表单数据
            formData: {
                name: '',
                idcard: '',
                front_image: '',
                back_image: '',
                hand_image: '', // 手持身份证
                // check_id: '',// 修改是必选，审核数据的id复
            },
            userCont: '',
            coverImage: {},
            sfzImage: {}, // 身份证反面
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
                        // 身份证正面
                        this.initCoverImageFileChange();
                        // 身份证反面
                        this.ImageFileChange();
                        return [2 /*return*/];
                }
            });
        });
    },
    methods: {
        // 身份证正面
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
                        _this.coverImage = {
                            file: file,
                            url: result,
                        };
                        console.log(_this.coverImage);
                    });
                },
            });
        },
        // 身份证反面
        ImageFileChange: function () {
            var _this = this;
            layui.upload.render({
                elem: '#uploadSfz',
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
                        _this.sfzImage = {
                            file: file,
                            url: result,
                        };
                        console.log(_this.sfzImage);
                    });
                },
            });
        },
        onBtnClick: function () {
            return __awaiter(this, void 0, void 0, function () {
                var aa, ress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            aa = util.uploadFile({
                                file: this.sfzImage.file,
                                fileName: 'cover',
                            });
                            console.log(aa);
                            console.log(this.sfzImage);
                            console.log(this.sfzImage.file);
                            // this.formData.image = this.coverImage.file
                            return [2 /*return*/];
                        case 1:
                            ress = _a.sent();
                            if (ress.code == 200) {
                            }
                            else {
                                layer.msg(ress.msg);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
    }
});
