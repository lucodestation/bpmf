"use strict";
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
// const baseURL = 'http://bpmf.duowencaiwu.com'
var baseURL = 'http://192.168.0.158';
var request = axios.create({
    baseURL: baseURL,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5 * 1000, // request timeout
});
// 请求拦截器
request.interceptors.request.use(function (config) {
    // console.log('请求拦截器', config)
    // console.log('config.params', config.params)
    // console.log('config.data', config.data)
    // 只要有 token 就带着
    var token = localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
        if (config.method.toLowerCase() === 'get' || !config.method) {
            config.params = __assign(__assign({}, config.params), { token: token });
        }
        else {
            config.data = __assign(__assign({}, config.data), { token: token });
        }
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
// 响应拦截器
request.interceptors.response.use(function (response) {
    // console.log('响应拦截器', response)
    var data = response.data;
    // 判断没有登录
    if (data.code == 502) {
        syalert.syopen('loginConter');
    }
    return data;
}, function (error) {
    // console.log('响应拦截器 error', response)
    var status = error.response.status;
    if (status === 401) {
    }
    else if (status >= 500) {
    }
    else {
    }
    return Promise.reject(error);
});
