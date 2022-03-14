"use strict";
new Vue({
    el: '#CenterAside',
    data: function () {
        return {
            CenterAside: ''
        };
    },
    created: function () {
        var url = window.location.pathname.substr(1); //获取当前页面url
        var url1 = url.substr(0, 4);
        url = url.substr(0, url.length - 5);
        this.CenterAside = url;
    },
});
