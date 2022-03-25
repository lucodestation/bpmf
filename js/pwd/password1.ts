$(function () {
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      mobile: '', // 手机号
      code: '', // 验证码 
      img: ''
    }
  },
  created() {
    this.onImgClick()
  },
  methods: {
    onImgClick() {
      request({
        url: '/api/Login/captcha', method: 'get',
        params: { mobile: this.mobile },
        responseType: 'blob', //接收的值类型
      }).then((result) => {
        console.log(result)
        window.URL = window.URL || window.webkitURL
        this.img = window.URL.createObjectURL(result)
      })
    },
    onAddClick() {
      if (!this.mobile) return layer.msg('请输入手机号')
      if (this.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      }
      if (!this.code) return layer.msg('请输入验证码')
      request({ url: '/api/Login/checkCaptcha', method: 'post', data: { mobile: this.mobile, code: this.code } }).then((res) => {
        if (res.code == 200) {
          window.location.href = `./password2.html`
        } else {
          layer.msg(res.msg)
        }
      })
    },
    onQuery() {
      window.history.go(-1)
    }
  },
})

