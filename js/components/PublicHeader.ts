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
      competitionShow: false, // 赛事频道是否选中
      liveShow: false, // 直播频道是否选中
      userHeadShow: false, // 个人中心头部
      userCont: '', // 个人信息
    }
  },
  created() {
    // 判断是否有token
    if (localStorage.getItem('token')) {
      this.userShow = localStorage.getItem('token') ? true : false
      // 获取个人信息
      request({ method: 'POST', url: '/api/Mine/info' }).then((res) => {
        if (res.code == 200) {
          this.userCont = res.data
        }
      })
    }
    var url = window.location.pathname.substr(1) //获取当前页面url
    let url1 = url.substr(0, 8)
    url = url.substr(0, url.length - 5)
    this.userHeadShow = url1 == 'userCont' ? true : false
    this.homeShow = url == 'index' ? true : false // 首页是否选中
    this.cooperationShow = url == 'cooperate/index' ? true : url == 'cooperate/cooperateView' ? true : false
    this.helpShow = url == 'help/index' ? true : url == 'help/helpView' ? true : false
    this.hallShow = url.substr(0, 7) == 'bangwen' ? true : false // 榜文大厅是否选中
    this.competitionShow = url.substr(0, 11) == 'competition' ? true : false // 榜文大厅是否选中
    this.liveShow = url.substr(0, 4) == 'live' ? true : false // 直播频道是否选中
    if (url == '') {
      this.homeShow = true
    }
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
  el: '#loginConter',
  data: {
    mobile: '', // 手机号
    pwd: '', // 密码
    code: '', // 验证码
    codeTxt: '获取验证码',
    second: 60,
  },
  created() { },
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
    // 跳转微信授权
    onwxClick() {
      syalert.syhide('loginConter')
      setTimeout(() => {
        syalert.syopen('wxConter')
      }, 500)
    },
  },
})
// 微信登录
new Vue({
  el: '#wxConter',
  data: {
    wxImg: '',
  },
  created() {
    if (!localStorage.getItem('token')) {
      const searchParams = Qs.parse(location.search.substr(1))
      console.log(searchParams)
      if (searchParams.code && searchParams.state) {
        // 微信登录-根据code和state获取openid和用户信息
        request({
          url: '/api/Loginwx/getOpenid',
          method: 'post',
          data: {
            code: searchParams.code,
            state: searchParams.state,
          },
        }).then((result) => {
          console.log('/api/Loginwx/getOpenid', result)
          // code: 202
          // msg: "授权失败,请重新操作！"
        })
      } else {
        // 微信登录-获取微信登录二维码
        request({ url: '/api/Loginwx/getCode', method: 'POST' }).then((res) => {
          if (res.code == 200) {
            // this.wxImg = res.data
            console.log(res.data.substr(res.data.indexOf('?') + 1))
            const searchParams = Qs.parse(res.data.substr(res.data.indexOf('?') + 1))
            console.log(searchParams)

            new WxLogin({
              self_redirect: false,
              // id: this.$refs.wechatLoginQrcode,
              id: 'wechatLoginQrcode',
              appid: searchParams.appid,
              scope: searchParams.scope,
              redirect_uri: searchParams.redirect_uri,
              state: searchParams.state,
            })
          }
        })
      }
    }
  },
  methods: {
    // 密码登录
    onPwdClick() {
      syalert.syhide('wxConter')
      setTimeout(() => {
        syalert.syopen('loginConter')
      }, 500)
    },
    // 短信登录
    ondxClick() {
      syalert.syhide('wxConter')
      setTimeout(() => {
        syalert.syopen('loginConter')
      }, 500)
    },
  },
})
