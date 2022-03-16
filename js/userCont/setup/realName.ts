$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      // 表单数据
      formData: {
        name: '',// 姓名
        idcard: '',// 身份证号
        front_image: 'https://pics4.baidu.com/feed/71cf3bc79f3df8dc1fe19ff60a487a8146102858.jpeg',// 身份证正面
        back_image: 'https://pics4.baidu.com/feed/71cf3bc79f3df8dc1fe19ff60a487a8146102858.jpeg',// 身份证反面
        hand_image: 'https://pics4.baidu.com/feed/71cf3bc79f3df8dc1fe19ff60a487a8146102858.jpeg',// 手持身份证
        // check_id: '',// 修改是必选，审核数据的id复
      },
      userCont: '',// 认证信息
    }
  },
  async created() {
    // 初始化选择封面图
    this.initCoverImageFileChange()
    // 实名认证信息
    const res = await request({
      method: 'POST',
      url: '/api/Mine/realInfo',
    })
    if (res.code == 200) {
      this.userCont = res.data
      this.userCont.check_status = 0
    } else {
      layer.msg(res.msg)
    }
  },
  methods: {
    async onBtnClick() {
      const ress = await request({
        method: 'POST',
        url: '/api/Mine/realname',
        data: this.formData
      })
      if (ress.code == 200) {
        // layer.msg('删除成功')
        // this.onCardlist()
      } else {
        layer.msg(ress.msg)
      }
    },
    // 初始化选择封面图
    initCoverImageFileChange() {
      layui.upload.render({
        elem: '#uploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        accept: 'image', // 指定允许上传时校验的文件类型
        acceptMime: '.jpg,.png,.bmp,.jpeg,.webp', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        exts: 'jpg|png|bmp|jpeg|webp', // 允许上传的文件后缀。一般结合 accept 参数类设定。
        size: 0, // 设置文件最大可允许上传的大小，单位 KB，0 表示不限制
        multiple: false, // 是否允许多文件上传, 默认 false
        // 选择文件回调
        choose: (result) => {
          console.log(result)
          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
          result.preview((index, file, result) => {
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
          })
        },
      })
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
})
