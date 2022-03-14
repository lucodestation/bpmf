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
        number: '',// 卡号
        bank_name: '',// 开户行
        mobile: '',// 手机号码
        code: '',// 验证码
      },
      codeTxt: '获取验证码',
      second: 60
    }
  },
  created() { },
  methods: {
    // 获取验证码
    async onCode() {
      if (!this.formData.mobile) return layer.msg('请输入手机号')
      if (this.formData.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.formData.mobile)) return layer.msg('请输入正确的手机号')
      }
      let data = { mobile: this.formData.mobile }
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
    // 提交
    async onAddClick() {
      if (!this.formData.name) return layer.msg('请输入姓名')
      if (!this.formData.number) return layer.msg('请输入银行卡号')
      if (!this.formData.bank_name) return layer.msg('请输入开会银行')
      if (!this.formData.code) return layer.msg('请输入短信验证码')
      let data = {
        name: this.formData.name,// 姓名
        number: this.formData.number,// 卡号
        bank_name: this.formData.bank_name,// 开户行
        mobile: this.formData.mobile,// 手机号码
        code: this.formData.code,// 验证码
      }
      const res = await request({
        method: 'POST',
        url: '/api/Bankcard/add',
        data: data,
      })
      if (res.code == 200) {

      } else {
        layer.msg(res.msg)
      }
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
  }
})
