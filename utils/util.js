"use strict";
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
        // console.log('返回扩展名', arr[arr.length - 1])
        return arr[arr.length - 1];
    }
};
