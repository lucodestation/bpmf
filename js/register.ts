$(function () {
  $('.public-footer').load('/components/PublicFooter.html')
})
var encrypt = new JSEncrypt()
//公钥.
const publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'
new Vue({
  el: '#app',
  data() {
    return {
      mobile: '', // 手机号
      code: '', // 验证码
      pwd: '', // 密码
      pwd2: '', // 密码
      codeTxt: '获取验证码',
      second: '60',
      checknum: 0
    }
  },
  created() {

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
    onCheckClick() {
      this.checknum = (this.checknum == 0) ? 1 : 0
    },
    // 注册
    async onClick() {
      if (this.checknum == 0) return layer.msg('请阅读并同意协议')
      if (!this.mobile) return layer.msg('请输入手机号')
      if (this.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      }
      if (!this.code) return layer.msg('请输入验证码')
      if (!this.pwd) return layer.msg('请输入密码')
      if (this.pwd.length < 8 || this.pwd.length > 20) return layer.msg('密码长度8~20个字符')
      if (!this.pwd2) return layer.msg('请再次输入密码')
      if (this.pwd2.length < 8 || this.pwd2.length > 20) return layer.msg('密码长度8~20个字符')
      if (this.pwd !== this.pwd2) return layer.msg('2次输入密码不一样，请重新输入')
      encrypt.setPublicKey(publiukey)
      // 加密
      const pwd = encrypt.encrypt(this.pwd) //需要加密的内容
      const pwd2 = encrypt.encrypt(this.pwd2) //需要加密的内容
      let data = {
        mobile: this.mobile, // 手机号
        code: this.code, // 验证码
        pwd: pwd, // 密码
        pwd2: pwd2, // 密码
      }
      const res = await request({
        method: 'POST',
        url: '/api/Login/register',
        data: data,
      })
      if (res.code == 200) {
        clearInterval(this.result)
        this.second = 60
        layer.msg('注册成功')
        localStorage.setItem('token', res.data.token)
        this.$router.push('/')
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
  },
})

