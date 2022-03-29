$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
// 支付密码页面
const walletPwdPage = '/userCont/wallet/pwd.html'
// 我的钱包页面（余额不足需要充值跳到这个页面）
const walletAccountPage = '/userCont/wallet/account.html'
// 实名认证页面
const setupRealNamePage = '/userCont/setup/realName.html'
// 开通会员页面
const memberPage = '/userCont/member/member.html'
new Vue({
  el: '#app',
  data() {
    return {
      number: '',// 购买月份
      type: '',// 类型
      month: '',// 费用
      title: '',
      userCont: '',
      pay_type: 1,// 支付方式 1余额，2支付宝，3微信
      pwd: '',// 支付密码
      depositDialogVisible: false,// 购买次数弹框
      alipayPayDialogVisible: false,// 支付宝弹框
      wechatPayDialogVisible: false,// 微信弹框
      walletPayDialogVisible: false,// 钱包支付弹框
      payAmount: '',// 实际支付金额
      out_trade_no: '',// 订单编号
    }
  },
  async created() {
    this.GetRequest()
    const res = await request({
      method: 'POST',
      url: '/api/Vip/buyInfo',
    })
    if (res.code == 200) {
      if (this.type == '1') {
        this.title = '经典VIP'
        this.month = this.number * res.data.vip1_money
      } else if (this.type == '2') {
        this.title = '黄金VIP'
        this.month = this.number * res.data.vip2_money
      } else if (this.type == '3') {
        this.title = '钻石VIP'
        this.month = this.number * res.data.vip3_money
      }
    }
    // 获取用户信息
    this.onmineVip()
  },
  methods: {
    // 获取用户信息
    async onmineVip() {
      const ress = await request({
        method: 'POST',
        url: '/api/Vip/mineVip',
      })
      if (ress.code == 200) {
        this.userCont = ress.data
      }
    },
    // 点击确定
    async onBtnClick() {
      if (this.pay_type == 1) {
        // 判断是否设置了支付密码
        const userInfoResult = await request({ url: '/api/Mine/info' })
        if (+userInfoResult.code === 200 && +userInfoResult.data.is_set_paypwd === 0) {
          // 未设置支付密码
          this.$alert('<div style="text-align: center; font-size: 20px;">请先设置支付密码</div>', '', {
            confirmButtonText: '确定',
            showClose: false,
            dangerouslyUseHTMLString: true,
            confirmButtonClass: 'orange-button-bg',
            callback: () => {
              // 在新窗口中打开页面
              // 打开设置支付密码页面
              window.open(walletPwdPage)
            },
          })
          return
        }
        this._walletPay()
      } else if (this.pay_type == 2) {
        this._alipayPay()
      } else if (this.pay_type == 3) {
        this._wechatPay()
      }
    },
    // 关闭钱包支付对话框
    handleCloseWalletPayDialog() {
      console.log('关闭钱包支付对话框')
      this.walletPayDialogVisible = false
      this.pwd = ''
      // 打开保证金对话框
      // this.depositDialogVisible = true
    },
    // 钱包支付
    async _walletPay() {
      // 购买次数--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Vip/onMonthRefer',
        method: 'post',
        data: { type: this.type, num: this.number, pay_type: Number(this.pay_type) },
      })

      if (+depositReferResult.code === 200) {
        // 关闭保证金对话框
        this.depositDialogVisible = false
        // 实际支付金额
        this.payAmount = depositReferResult.data.money.toFixed(2)
        this.out_trade_no = depositReferResult.data.out_trade_no
        // 显示钱包支付对话框
        this.walletPayDialogVisible = true
      } else if (+depositReferResult.code === 5) {
        // 余额不足
        this.$alert('<div style="text-align: center; font-size: 20px;">余额不足，请充值</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 在新窗口中打开页面
            // 我的钱包页面
            window.open(walletAccountPage)
          },
        })
      } else {
        layer.msg(depositReferResult.msg)
      }
    },
    // 提交钱包支付（钱包支付对话框点击确定）
    async handleSubmitWalletPay() {
      if (!this.pwd) layer.msg('请输入支付密码')

      // 对密码进行加密
      encrypt.setPublicKey(publiukey)
      const pwd = encrypt.encrypt(this.pwd) //需要加密的内容

      // 购买次数--钱包支付
      const payResult = await request({
        url: '/api/Vip/monthBalancePay',
        method: 'post',
        data: { out_trade_no: this.out_trade_no, pay_pwd: pwd },
      })
      if (+payResult.code === 200) {
        this.$alert('<div style="text-align: center; font-size: 20px;">购买成功</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 关闭钱包支付对话框
            this.walletPayDialogVisible = false
            this.onmineVip()
          },
        })
      } else {
        layer.msg(payResult.msg)
      }
    },
    // 点击支付宝支付对话框关闭按钮
    handleCloseAlipayPayDialog() {
      this.alipayPayDialogVisible = false
      // 清除计时器
      clearInterval(this.getDepositTimer)
    },
    // 支付宝支付
    async _alipayPay() {
      // 关闭充值对话框
      this.depositDialogVisible = false
      // 缴纳充值--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Vip/onMonthRefer',
        method: 'post',
        data: { type: this.type, num: this.number, pay_type: Number(this.pay_type) },
      })
      if (+depositReferResult.code === 200) {
        this.num = 1
        // 实际支付金额
        this.payAmount = depositReferResult.data.money.toFixed(2)
        // 显示支付宝支付对话框
        this.alipayPayDialogVisible = true

        // 缴纳充值--支付宝支付
        // 这里不需要接收返回值，因为啥都没返回
        // 二维码是把请求域名加上请求路径再加上请求参数来生成的
        await request({
          url: '/api/Vip/monthAliPay',
          params: { out_trade_no: depositReferResult.data.out_trade_no },
        })

        // 警告：this.alipayPayDialogVisible = true 不能放到这里
        const alipayPayQrcodeElement = document.getElementById('alipayPayQrcode')
        alipayPayQrcodeElement.innerHTML = ''
        // 生成二维码
        const alipayPayQrcode = new QRCode(alipayPayQrcodeElement, {
          width: 260,
          height: 260,
        })
        // 生成 query 字符串（不带 ?）
        const queryString = Qs.stringify({
          out_trade_no: depositReferResult.data.out_trade_no,
          token: localStorage.getItem('token'),
        })
        const codeUrl = baseURL + '/api/Vip/monthAliPay?' + queryString
        console.log('codeUrl', codeUrl)
        alipayPayQrcode.makeCode(codeUrl)

        // 启动获取充值金额的计时器
        this._startGetDepositTimer('alipay')
      } else {
        layer.msg(depositReferResult.msg)
      }
    },
    // 点击微信支付对话框关闭按钮
    handleCloseWechatPayDialog() {
      this.wechatPayDialogVisible = false
      this.num = 1
      // 清除计时器
      clearInterval(this.getDepositTimer)
    },
    // 微信支付
    async _wechatPay() {
      // 关闭充值对话框
      this.depositDialogVisible = false

      // 缴纳充值--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Vip/onMonthRefer',
        method: 'post',
        data: { type: this.type, num: this.number, pay_type: Number(this.pay_type) },
      })

      if (+depositReferResult.code === 200) {
        this.num = 1
        // 实际支付金额
        this.payAmount = depositReferResult.data.money.toFixed(2)
        // 显示微信支付对话框
        this.wechatPayDialogVisible = true

        // 缴纳充值--微信支付
        const payResult = await request({
          url: '/api/Vip/monthWxPay',
          method: 'post',
          data: { out_trade_no: depositReferResult.data.out_trade_no },
        })

        if (+payResult.code === 200) {
          // 警告：this.wechatPayDialogVisible = true 不能放到这里
          const wechatPayQrcodeElement = document.getElementById('wechatPayQrcode')
          wechatPayQrcodeElement.innerHTML = ''
          // 生成二维码
          const wechatPayQrcode = new QRCode(wechatPayQrcodeElement, {
            width: 260,
            height: 260,
          })
          wechatPayQrcode.makeCode(payResult.data.code_url)

          // 启动获取充值金额的计时器
          this._startGetDepositTimer('wechat')
        } else {
          layer.msg(payResult.msg)
        }
      } else {
        layer.msg(payResult.msg)
      }
    },
    // 启动获取充值金额的计时器
    _startGetDepositTimer(payMethod) {
      this.getDepositTimer = setInterval(() => {
        // 获取个人信息（通过个人信息中的充值金额判断是否缴纳了充值）
        request({
          url: '/api/Vip/mineVip',
        }).then((res) => {
          if (+res.code === 200) {
            // 判断发布赛事
            if (res.data.vip_time != this.userCont.vip_time) {
              // 清除计时器
              clearInterval(this.getDepositTimer)
              this.$alert('<div style="text-align: center; font-size: 20px;">充值成功</div>', '', {
                confirmButtonText: '确定',
                showClose: false,
                dangerouslyUseHTMLString: true,
                confirmButtonClass: 'orange-button-bg',
                callback: () => {
                  if (payMethod === 'alipay') {
                    this.alipayPayDialogVisible = false
                    this.onmineVip()
                  } else if (payMethod === 'wechat') {
                    this.wechatPayDialogVisible = false
                    this.onmineVip()
                  }
                },
              })
            } else {
              console.log('充值', +res.data.deposit)
            }
          }
        })
      }, 3000)
    },
    // 获取当前页面url
    GetRequest() {
      let url = location.search; //获取当前页面url
      let theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      this.number = theRequest.number
      this.type = theRequest.type
    },
  }
})
