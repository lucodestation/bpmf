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
            // 表单数据
            formData: {
                name: '',
                idcard: '',
                front_image: '',
                back_image: '',
                hand_image: '',
                check_id: '', // 修改是必选，审核数据的id复
            },
        };
    },
    created: function () {
        // 初始化选择封面图
        this.initCoverImageFileChange();
    },
    methods: {
        // 初始化选择封面图
        initCoverImageFileChange: function () {
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
                        // const formData = new FormData()
                        // formData.append('file', file)
                        // console.log(formData)
                        // this.coverImage = {
                        //   file,
                        //   url: result,
                        // }
                    });
                },
            });
            // const element = event.target || event.srcElement
            // const files = element.files[0]
            // console.log(files)
            // if (!files.type.startsWith('image/')) {
            //   console.log('请选择图片文件')
            //   layer.msg('请选择图片文件', { icon: 2, time: 3000 })
            //   element.value = ''
            //   this.coverImage = ''
            //   return
            // }
            // window.URL = window.URL || window.webkitURL
            // const url = window.URL.createObjectURL(files)
            // console.log(url)
            // console.log(files)
            // this.coverImage = files
        },
    }
});
