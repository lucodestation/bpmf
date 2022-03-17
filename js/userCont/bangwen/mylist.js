"use strict";
$(function () {
    $('.public-header').load('/components/PublicHeader.html');
    $('.public-footer').load('/components/PublicFooter.html');
    $('.public-user').load('/components/CenterAside.html');
});
new Vue({
    el: '#app',
    data: function () {
        return {
            myList: [], // 列表
        };
    },
    created: function () {
        var _this = this;
        // this.GetRequest()
        // request({ method: 'POST', url: '/api/Bangwen/cate' }).then((res) => {
        //   if (res.code == 200) {
        //     this.cateList = res.data
        //   }
        // })
        request({ url: '/api/Bangwenattend/list', method: 'post', data: { type: 1 }, }).then(function (res) {
            if (res.code == 200) {
                _this.myList = res.data;
                // for (let i in this.cateList) {
                //   if (this.cateList[i].id == res.data.b_id) {
                //     this.name = this.cateList[i].name
                //   }
                // }
            }
        });
    },
    methods: {
    // 获取当前页面url
    // GetRequest() {
    //   let url = location.search; //获取当前页面url
    //   let theRequest = new Object();
    //   if (url.indexOf("?") != -1) {
    //     var str = url.substr(1);
    //     let strs = str.split("&");
    //     for (let i = 0; i < strs.length; i++) {
    //       theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    //     }
    //   }
    //   this.id = theRequest.id
    // },
    }
});
