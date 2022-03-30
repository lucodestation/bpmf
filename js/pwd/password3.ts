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
      pwd: '',
      pwd2: '',
    }
  },
  created() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.mobile = searchParams.mobile
    this.code = searchParams.code
  },
  methods: {
    onAddClick() {
      if (!this.pwd) return layer.msg('请输入密码')
      if (this.pwd.length < 8 || this.pwd.length > 20) return layer.msg('密码长度8~20个字符')
      if (!this.pwd2) return layer.msg('请再次输入密码')
      if (this.pwd2.length < 8 || this.pwd2.length > 20) return layer.msg('密码长度8~20个字符')
      if (this.pwd !== this.pwd2) return layer.msg('2次输入密码不一样，请重新输入')
      encrypt.setPublicKey(publiukey)
      // 加密
      const pwd = encrypt.encrypt(this.pwd) //需要加密的内容
      const pwd2 = encrypt.encrypt(this.pwd2) //需要加密的内容
      request({ url: '/api/Login/forgetPwd', method: 'post', data: { mobile: this.mobile, code: this.code, pwd: pwd, pwd2: pwd2 } }).then((res) => {
        if (res.code == 200) {
          window.location.href = `./password4.html`
        } else {
          layer.msg(res.msg)
        }
      })
    },
  },
})

