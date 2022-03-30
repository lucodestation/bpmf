$(function () {
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      mobile: '', // 手机号
      code: '', // 验证码
      codeTxt: '获取验证码',
      second: '60',
    }
  },
  created() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.mobile = searchParams.mobile
  },
  methods: {
    // 获取验证码
    async onCode() {
      if (!this.mobile) return layer.msg('请输入手机号')
      if (this.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      }
      let data = { mobile: this.mobile }
      const ress = await request({
        method: 'POST',
        url: '/api/Login/sendCode',
        data: data,
      })
      if (ress.code == 200) {
        this.timeDown()
        layer.msg('发送成功')
      } else {
        layer.msg(ress.msg)
      }
    },
    onAddClick() {
      // if (!this.mobile) return layer.msg('请输入手机号')
      // if (this.mobile) {
      //   var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
      //   if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      // }
      if (!this.code) return layer.msg('请输入验证码')
      request({ url: '/api/Login/checkMobileCode', method: 'post', data: { mobile: this.mobile, code: this.code } }).then((res) => {
        if (res.code == 200) {
          window.location.href = `./password3.html?mobile=${this.mobile}&code=${this.code}`
        } else {
          layer.msg(res.msg)
        }
      })
    },
    onQuery() {
      window.history.go(-2)
    },
    timeDown() {
      this.result = setInterval(() => {
        --this.second
        this.codeTxt = this.second + 'S'
        if (this.second < 0) {
          clearInterval(this.result)
          this.sending = true
          this.disabled = false
          this.second = 60
          this.codeTxt = '获取验证码'
        }
      }, 1000)
    },
  },
})

