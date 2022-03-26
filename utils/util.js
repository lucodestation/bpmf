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
var util = {};
// 获取扩展名，例 aaa.bbb.ccc.png 返回 png，aaa 返回 undefined，.gitignore 返回 gitignore
util.getExtensionName = function (fileName) {
    var arr = fileName.split('.');
    // console.log('获取扩展名', arr)
    if (!fileName.includes('.')) {
        // console.log('文件名有误')
        return;
    }
    else {
        console.log('返回扩展名', arr[arr.length - 1]);
        return arr[arr.length - 1];
    }
};
/**
 * 上传（单个）文件
 * @param option <object>
 * @param option.fileName <string> 文件名
 * @param option.file <file> 要上传的文件
 * @returns
 */
util.uploadFile = function (option) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var OSSInfo, client, fileName, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request({
                        url: '/api/common/sts_token',
                    }).catch(function (error) {
                        reject(error);
                    })];
                case 1:
                    OSSInfo = _a.sent();
                    if (!OSSInfo)
                        return [2 /*return*/];
                    console.log('OSSInfo', OSSInfo);
                    client = new OSS({
                        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
                        region: 'oss-cn-beijing',
                        'Content-Disposition': 'inline',
                        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
                        accessKeyId: OSSInfo.data.AccessKeyId,
                        accessKeySecret: OSSInfo.data.AccessKeySecret,
                        // 从STS服务获取的安全令牌（SecurityToken）。
                        stsToken: OSSInfo.data.SecurityToken,
                        // 填写Bucket名称。
                        bucket: 'bpmf',
                        secure: true,
                    });
                    fileName = new Date().valueOf() + '-' + option.fileName;
                    console.log(fileName);
                    headers = {
                    // 指定该Object被下载时网页的缓存行为。
                    // 'Cache-Control': 'no-cache',
                    // 指定该Object被下载时的名称。
                    // 'Content-Disposition': 'inline',
                    // 指定该Object被下载时的内容编码格式。
                    // 'Content-Encoding': 'UTF-8',
                    // 指定过期时间。
                    // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
                    // 指定Object的存储类型。
                    // 'x-oss-storage-class': 'Standard',
                    // 指定Object的访问权限。
                    // 'x-oss-object-acl': 'private',
                    // 设置Object的标签，可同时设置多个标签。
                    // 'x-oss-tagging': 'Tag1=1&Tag2=2',
                    // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
                    // 'x-oss-forbid-overwrite': 'true',
                    };
                    client
                        .put('images/' + fileName, option.file, { headers: headers })
                        .then(function () {
                        var url = "https://bpmf.oss-cn-beijing.aliyuncs.com/images/".concat(fileName);
                        resolve(url);
                    })
                        .catch(function (error) {
                        console.log('上传失败', error);
                        reject(error);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
};
/**
 * 上传（多个）文件
 * @param option <array[object]>
 * @param option[n] <object>
 * @param option[n].fileName <string>
 * @param option[n].file <file>
 * @returns
 */
util.uploadMultipleFile = function (option) { return __awaiter(void 0, void 0, void 0, function () {
    var OSSInfo, client, arr, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request({
                    url: '/api/common/sts_token',
                }).catch(function (error) {
                    reject(error);
                })];
            case 1:
                OSSInfo = _a.sent();
                if (!OSSInfo)
                    return [2 /*return*/];
                console.log('OSSInfo', OSSInfo);
                client = new OSS({
                    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
                    region: 'oss-cn-beijing',
                    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
                    accessKeyId: OSSInfo.data.AccessKeyId,
                    accessKeySecret: OSSInfo.data.AccessKeySecret,
                    // 从STS服务获取的安全令牌（SecurityToken）。
                    stsToken: OSSInfo.data.SecurityToken,
                    // 填写Bucket名称。
                    bucket: 'bpmf',
                });
                arr = option.map(function (item) {
                    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                        var fileName, headers;
                        return __generator(this, function (_a) {
                            fileName = new Date().valueOf() + '-' + item.fileName;
                            headers = {
                            // 指定该Object被下载时网页的缓存行为。
                            // 'Cache-Control': 'no-cache',
                            // 指定该Object被下载时的名称。
                            // 'Content-Disposition': 'inline',
                            // 指定该Object被下载时的内容编码格式。
                            // 'Content-Encoding': 'UTF-8',
                            // 指定过期时间。
                            // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
                            // 指定Object的存储类型。
                            // 'x-oss-storage-class': 'Standard',
                            // 指定Object的访问权限。
                            // 'x-oss-object-acl': 'private',
                            // 设置Object的标签，可同时设置多个标签。
                            // 'x-oss-tagging': 'Tag1=1&Tag2=2',
                            // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
                            // 'x-oss-forbid-overwrite': 'true',
                            };
                            client
                                .put('images/' + fileName, item.file, { headers: headers })
                                .then(function () {
                                var url = "https://bpmf.oss-cn-beijing.aliyuncs.com/images/".concat(fileName);
                                resolve(url);
                            })
                                .catch(function (error) {
                                console.log('上传失败', error);
                                reject(error);
                            });
                            return [2 /*return*/];
                        });
                    }); });
                });
                return [4 /*yield*/, Promise.all(arr)];
            case 2:
                result = _a.sent();
                console.log(result);
                return [2 /*return*/, result];
        }
    });
}); };
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
