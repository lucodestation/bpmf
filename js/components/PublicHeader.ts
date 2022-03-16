var encrypt = new JSEncrypt()
//公钥.
const publiukey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'
new Vue({
  el: '#Header',
  data() {
    return {
      userShow: false, // 登录之后是否显示
      cooperationShow: false, // 合作吧是否选中
      homeShow: false, // 首页是否选中
      helpShow: false, // 帮助中心是否选中
      hallShow: false, // 榜文大厅是否选中
      userHeadShow: false, // 个人中心头部
    }
  },
  created() {
    if (localStorage.getItem('token')) {
      this.userShow = localStorage.getItem('token') ? true : false
    }
    var url = window.location.pathname.substr(1) //获取当前页面url
    let url1 = url.substr(0, 8)
    url = url.substr(0, url.length - 5)
    this.userHeadShow = url1 == 'userCont' ? true : false
    this.homeShow = url == 'index' ? true : false
    this.cooperationShow = url == 'cooperate/index' ? true : url == 'cooperate/cooperateView' ? true : false
    this.helpShow = url == 'help/index' ? true : url == 'help/helpView' ? true : false
    this.hallShow = url == 'bangwen/index' ? true : url == 'bangwen/hallMore' ? true : url == 'hallList/edithall' ? true : false
  },
  methods: {
    // 退出
    onSignout() {
      localStorage.clear()
      sessionStorage.clear()
      location.href = '/index.html'
    },
  },
})
// 登录
new Vue({
  el: '#alert1',
  data: {
    mobile: '', // 手机号
    pwd: '', // 密码
    code: '', // 验证码
    codeTxt: '获取验证码',
    second: 60,
  },
  created() {},
  methods: {
    // 获取验证码
    async onCode() {
      if (!this.mobile) return layer.msg('请输入手机号')
      if (this.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      }
      let data = { mobile: this.mobile }
      const res = await request({
        method: 'POST',
        url: '/api/Login/sendCode',
        data: data,
      })
      if (res.code == 200) {
        this.timeDown()
        layer.msg('发送成功')
      } else {
        layer.msg(res.msg)
      }
    },
    // 登录
    async onLogin() {
      if (!this.mobile) return layer.msg('请输入手机号')
      if (this.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      }
      if (!this.pwd) return layer.msg('请输入密码')
      // let pwd = jsencrypt.setEncrypt(publiukey, String(this.pwd))
      encrypt.setPublicKey(publiukey)
      // 加密
      const pwd = encrypt.encrypt(this.pwd) //需要加密的内容
      let data = {
        mobile: this.mobile, // 手机号
        pwd: pwd, // 密码
      }
      const res = await request({
        method: 'POST',
        url: '/api/Login/mobilepwdLogin',
        data: data,
      })
      if (res.code == 200) {
        layer.msg('登录成功')
        localStorage.setItem('token', res.data.token)
        location.reload()
      } else {
        layer.msg(res.msg)
      }
    },
    // 短信验证码登录
    async onCodeLogin() {
      if (!this.mobile) return layer.msg('请输入手机号')
      if (this.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.mobile)) return layer.msg('请输入正确的手机号')
      }
      if (!this.code) return layer.msg('请输入验证码')
      let data = {
        mobile: this.mobile, // 手机号
        code: this.code, // 验证码
      }
      const res = await request({
        method: 'POST',
        url: '/api/Login/mobilecodeLogin',
        data: data,
      })
      if (res.code == 200) {
        layer.msg('登录成功')
        localStorage.setItem('token', res.data.token)
        location.reload()
      } else {
        layer.msg(res.msg)
      }
    },
    // 倒计时
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
// 微信登录
new Vue({
  el: '#alert2',
  data: {},
  created() {
    // $.ajax({
    //   method: 'POST',
    //   url: this.baseUrl + '/api/Loginwx/getCode',
    //   success: function (res) {
    //     if (res.code == 200) {
    //       // layer.msg('登录成功')
    //       // localStorage.setItem('token', res.data.token)
    //       // location.reload()
    //     } else {
    //       layer.msg(res.msg)
    //     }
    //   },
    // })
  },
  methods: {},
})
