"use strict";
// 发布比赛个人赛发布成功
// 引入头部
$('.public-header').load('/components/PublicHeader.html');
// 引入底部
$('.public-footer').load('/components/PublicFooter.html');
var encrypt = new JSEncrypt();
//公钥.
var publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----';
Vue.use(ELEMENT);
new Vue({
    el: '#app',
    data: function () {
        return {
            competitionId: '',
            adverList: [],
        };
    },
    created: function () {
        var _this = this;
        var searchParams = Qs.parse(location.search.substr(1));
        this.competitionId = searchParams.competition_id * 1;
        // 赛事广告位
        request({
            url: '/api/Competitionindex/adverList',
            method: 'post',
            data: { competition_id: searchParams.competition_id * 1 },
        }).then(function (result) {
            console.log('获取总阶段数，当前进行到哪个阶段', result);
            if (+result.code === 200) {
                _this.adverList = result.data;
            }
        });
    },
    methods: {
        // 测试
        handleTest: function () {
            console.log('测试');
        },
    },
});
