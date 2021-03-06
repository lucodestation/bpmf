"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            push_url: '',
            isShow: false
        };
    },
    mounted: function () {
        var searchParams = Qs.parse(location.search.substr(1));
        if (searchParams.push_url) {
            this.isShow = true;
            this.push_url = searchParams.push_url;
            // syalert.syopen('liveCont')
        }
    },
    methods: {
        copyUrl: function () {
            this.copyContent = this.$refs.copytext.innerText; //也可以直接写上等于你想要复制的内容
            var input = document.createElement("input"); // 直接构建input
            input.value = this.copyContent; // 设置内容
            console.log(input.value);
            document.body.appendChild(input); // 添加临时实例
            input.select(); // 选择实例内容
            document.execCommand("Copy"); // 执行复制
            document.body.removeChild(input); // 删除临时实例
            layer.msg("复制成功");
        },
        // 确定直播
        onBtnClick: function () {
            request({ url: '/api/Live/beginLive', method: 'POST', data: { live_id: this.liveCont.id } }).then(function (res) {
                if (res.code == 200) {
                    layer.msg("直播已开始");
                    syalert.syhide('liveCont');
                }
            });
        },
    }
});
