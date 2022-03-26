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
      scImage: {},// 手持身份证
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
    // 初始化身份证正面
    this.initCoverImageFileChange()
    // 初始化身份证反面
    this.sfzImageFileChange()
    // 初始化身份证反面
    this.scImageFileChange()
  },
  methods: {
    // 初始化身份证正面
    initCoverImageFileChange() {
      layui.upload.render({
        elem: '#uploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        accept: 'images', // 指定允许上传时校验的文件类型
        acceptMime: '.jpg,.png,.bmp,.jpeg', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        exts: 'jpg|png|bmp|jpeg', // 允许上传的文件后缀。一般结合 accept 参数类设定。
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
              // 用于提交数据
              file,
              // 用于页面展示
              url: result,
            }
            console.log(this.coverImage)
          })
        },
      })
    },
    // 初始化身份证反面
    sfzImageFileChange() {
      layui.upload.render({
        elem: '#sfzuploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        accept: 'images', // 指定允许上传时校验的文件类型
        acceptMime: '.jpg,.png,.bmp,.jpeg', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        exts: 'jpg|png|bmp|jpeg', // 允许上传的文件后缀。一般结合 accept 参数类设定。
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
              // 用于提交数据
              file,
              // 用于页面展示
              url: result,
            }
            console.log(this.sfzImage)
          })
        },
      })
    },
    // 初始化身份证反面
    scImageFileChange() {
      layui.upload.render({
        elem: '#scuploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        accept: 'images', // 指定允许上传时校验的文件类型
        acceptMime: '.jpg,.png,.bmp,.jpeg', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        exts: 'jpg|png|bmp|jpeg', // 允许上传的文件后缀。一般结合 accept 参数类设定。
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

            this.scImage = {
              // 用于提交数据
              file,
              // 用于页面展示
              url: result,
            }
            console.log(this.scImage)
          })
        },
      })
    },
    onrealInfo() {
      request({ url: '/api/Mine/realInfo', method: 'post' }).then((res) => {
        if (res.code == 200) {
          this.userCont = res.data
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 点击重新上传按钮
    onuserCont() {
      this.userCont.check_status = '-2'
      this.formData = {
        name: this.userCont.name,// 姓名
        idcard: this.userCont.idcard,// 身份证号
        front_image: '',// 身份证正面
        back_image: '',// 身份证反面
        hand_image: '',// 手持身份证
        check_id: this.userCont.idcard,// 修改是必选，审核数据的id复
      }
    },
    // 提交数据
    async onBtnClick() {
      if (!this.formData.name) return layer.msg('请输入姓名')
      if (!this.formData.idcard) return layer.msg('请输入身份证号')
      if (this.formData.idcard) {
        var reg_tel = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (!reg_tel.test(this.formData.idcard)) return layer.msg('请输入正确的身份证号')
      }
      if (!this.coverImage.url) return layer.msg('请上传身份证正面')
      if (!this.sfzImage.url) return layer.msg('请上传身份证反面')
      if (!this.scImage.url) return layer.msg('请上传手持身份证')
      this.formData.front_image = await util
        .uploadFile({
          file: this.coverImage.file,
          fileName: this.coverImage.file.name,
        })
        .catch((error) => {
          console.log('上传身份证正面失败', error)
          layer.msg('上传身份证正面失败')
        })
      if (!this.formData.front_image) return
      this.formData.back_image = await util
        .uploadFile({
          file: this.sfzImage.file,
          fileName: this.sfzImage.file.name,
        })
        .catch((error) => {
          console.log('上传身份证反面失败', error)
          layer.msg('上传身份证反面失败')
        })
      if (!this.formData.back_image) return
      this.formData.hand_image = await util
        .uploadFile({
          file: this.scImage.file,
          fileName: this.scImage.file.name,
        })
        .catch((error) => {
          console.log('上传手持身份证失败', error)
          layer.msg('上传手持身份证失败')
        })
      if (!this.formData.hand_image) return
      request({ url: '/api/Mine/realname', method: 'post', data: this.formData }).then((res) => {
        if (res.code == 200) {
          layer.msg('提交成功')
          this.onrealInfo()
        } else {
          layer.msg(res.msg)
        }
      })
    },
  }
})
