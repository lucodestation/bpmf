$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})

new Vue({
  el: '#app',
  data() {
    return {
      userCont: '',// 个人信息
      depositDialogVisible: false,// 充值对话框是否显示
      payMethod: '2',// 充值方式
      money: '',// 充值金额
      alipayPayDialogVisible: false,// 支付宝支付对话框是否显示
      payAmount: '1',// 充值页面金额
      wechatPayDialogVisible: false,// 微信支付对话框是否显示
    }
  },
  created() {
    // 获取个人信息
    request({ url: '/api/Mine/info', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.userCont = res.data
      }
    })
  },
  methods: {
    // 点击充值按钮
    onRechargeClick() {
      this.depositDialogVisible = true
    },
    // 点击充值对话框关闭按钮
    onRechargeQuery() {
      this.depositDialogVisible = false
      this.money = ''
      this.payMethod = 2
    },
    // 点击充值对话框确定按钮
    onPayClick() {
      if (!this.money) return layer.msg('请输入充值金额');
      if (this.payMethod == 2) {
        this._alipayPay()
      } else if (this.payMethod == 3) {
        this._wechatPay()
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
        url: '/api/Recharge/refer',
        method: 'post',
        data: { money: this.money, pay_type: 2 },
      })

      if (+depositReferResult.code === 200) {
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        // 显示支付宝支付对话框
        this.alipayPayDialogVisible = true

        // 缴纳充值--支付宝支付
        // 这里不需要接收返回值，因为啥都没返回
        // 二维码是把请求域名加上请求路径再加上请求参数来生成的
        await request({
          url: '/api/Recharge/aliPay',
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
        const codeUrl = baseURL + '/api/Recharge/aliPay?' + queryString
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
      // 清除计时器
      clearInterval(this.getDepositTimer)
    },
    // 微信支付
    async _wechatPay() {
      // 关闭充值对话框
      this.depositDialogVisible = false

      // 缴纳充值--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Recharge/refer',
        method: 'post',
        data: { money: this.money, pay_type: 3 },
      })

      if (+depositReferResult.code === 200) {
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        // 显示微信支付对话框
        this.wechatPayDialogVisible = true

        // 缴纳充值--微信支付
        const payResult = await request({
          url: '/api/Recharge/wxPay',
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
          url: '/api/Mine/info',
        }).then((res) => {
          if (+res.code === 200) {
            if (res.data.money != this.userCont.money) {
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
                  } else if (payMethod === 'wechat') {
                    this.wechatPayDialogVisible = false
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
  }
})
