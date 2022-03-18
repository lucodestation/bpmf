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
        front_image: '',// 身份证正面
        back_image: '',// 身份证反面
        hand_image: '',// 手持身份证
        // check_id: '',// 修改是必选，审核数据的id复
      },
      userCont: '',// 认证信息
      coverImage: {},// 身份证正面
      sfzImage: {},// 身份证反面
    }
  },
  async created() {
    // 实名认证信息
    const res = await request({
      method: 'POST',
      url: '/api/Mine/realInfo',
    })
    if (res.code == 200) {
      this.userCont = res.data
    } else {
      layer.msg(res.msg)
    }
    // 身份证正面
    this.initCoverImageFileChange()
    // 身份证反面
    this.ImageFileChange()
  },
  methods: {
    // 身份证正面
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

            this.coverImage = {
              file,
              url: result,
            }
            console.log(this.coverImage)
          })
        },
      })
    },
    // 身份证反面
    ImageFileChange() {
      layui.upload.render({
        elem: '#uploadSfz', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        // accept: 'image', // 指定允许上传时校验的文件类型
        // acceptMime: '.jpg,.png,.bmp,.jpeg,.webp', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        // exts: 'jpg|png|bmp|jpeg|webp', // 允许上传的文件后缀。一般结合 accept 参数类设定。
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

            this.sfzImage = {
              file,
              url: result,
            }
            console.log(this.sfzImage)
          })
        },
      })
    },
    async onBtnClick() {
      let aa = util.uploadFile({
        file: this.sfzImage.file,
        fileName: 'cover',
      })
      console.log(aa)
      console.log(this.sfzImage)
      console.log(this.sfzImage.file)
      // this.formData.image = this.coverImage.file
      return
      const ress = await request({
        method: 'POST',
        url: '/api/Mine/realname',
        data: this.formData
      })
      if (ress.code == 200) {
      } else {
        layer.msg(ress.msg)
      }
    },
  }
})
