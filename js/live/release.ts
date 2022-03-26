$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
// 支付密码页面
const walletPwdPage = '/userCont/wallet/pwd.html'
// 我的钱包页面（余额不足需要充值跳到这个页面）
const walletAccountPage = '/userCont/wallet/account.html'
// 实名认证页面
const setupRealNamePage = '/userCont/setup/realName.html'
// 开通会员页面
const memberPage = '/userCont/member/member.html'
Vue.use(ELEMENT)
Vue.component('deposit-dialog', {
  template: '#depositDialog',
  data: function () {
    return {
      // 保证金弹框是否显示
      depositDialogVisible: false,
      // 支付方式 1余额支付，2支付宝支付，3微信支付
      payMethod: 1,
      // 保证金金额
      depositAmount: 0,

      // 实际支付金额
      payAmount: 0,

      // 钱包支付对话框是否显示
      walletPayDialogVisible: false,
      // 支付密码
      payPassword: '',

      // 支付宝支付对话框是否显示
      alipayPayDialogVisible: false,

      // 微信支付对话框是否显示
      wechatPayDialogVisible: false,

      // 获取保证金计时器（用于判断是否支付成功）
      getDepositTimer: '',
    }
  },
  created() {
    request({
      url: '/api/Login/setting',
    }).then((result) => {
      if (+result.code === 200) {
        this.depositAmount = result.data.plat_deposit
      }
    })
  },
  methods: {
    // 打开保证金对话框
    handleOpenDepositDialog() {
      this.depositDialogVisible = true
    },
    // 关闭保证金对话框
    handleCloseDepositDialog() {
      this.depositDialogVisible = false
      // 返回上个页面
      window.history.go(-1)
    },
    // 确认支付保证金
    async confirmPayDeposit() {
      if (this.payMethod === 1) {
        // 钱包支付
        console.log('钱包支付')

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
      } else if (this.payMethod === 2) {
        // 支付宝支付
        console.log('支付宝支付')
        // 支付宝支付
        this._alipayPay()
      } else if (this.payMethod === 3) {
        // 微信支付
        console.log('微信支付')
        this._wechatPay()
      }
    },

    // 关闭钱包支付对话框
    handleCloseWalletPayDialog() {
      console.log('关闭钱包支付对话框')
      this.walletPayDialogVisible = false
      this.payPassword = ''

      // 打开保证金对话框
      this.depositDialogVisible = true
    },
    // 钱包支付
    async _walletPay() {
      // 缴纳保证金--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Deposit/refer',
        method: 'post',
        data: { pay_type: 1 },
      })

      if (+depositReferResult.code === 200) {
        // 关闭保证金对话框
        this.depositDialogVisible = false
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
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
      if (!this.payPassword) layer.msg('请输入支付密码')

      // 对密码进行加密
      encrypt.setPublicKey(publiukey)
      const payPassword = encrypt.encrypt(this.payPassword) //需要加密的内容

      // 缴纳保证金--钱包支付
      const payResult = await request({
        url: '/api/Deposit/balancePay',
        method: 'post',
        data: { out_trade_no: depositReferResult.data.out_trade_no, pay_pwd: payPassword },
      })

      if (+payResult.code === 200) {
        this.$alert('<div style="text-align: center; font-size: 20px;">保证金缴纳成功</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 关闭钱包支付对话框
            this.walletPayDialogVisible = false
          },
        })
      } else {
        layer.msg(payResult.msg)
      }
    },

    // 支付宝支付
    async _alipayPay() {
      // 关闭保证金对话框
      this.depositDialogVisible = false

      // 缴纳保证金--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Deposit/refer',
        method: 'post',
        data: { pay_type: 2 },
      })

      if (+depositReferResult.code === 200) {
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        // 显示支付宝支付对话框
        this.alipayPayDialogVisible = true

        // 缴纳保证金--支付宝支付
        // 这里不需要接收返回值，因为啥都没返回
        // 二维码是把请求域名加上请求路径再加上请求参数来生成的
        await request({
          url: '/api/Deposit/aliPay',
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
        const codeUrl = baseURL + '/api/Deposit/aliPay?' + queryString
        console.log('codeUrl', codeUrl)
        alipayPayQrcode.makeCode(codeUrl)

        // 启动获取保证金金额的计时器
        this._startGetDepositTimer('alipay')
      } else {
        layer.msg(depositReferResult.msg)
      }
    },
    // 关闭支付宝支付对话框
    handleCloseAlipayPayDialog() {
      console.log('关闭支付宝支付对话框')
      this.alipayPayDialogVisible = false
      // 清除计时器
      clearInterval(this.getDepositTimer)

      // 打开保证金对话框
      this.depositDialogVisible = true
    },

    // 微信支付
    async _wechatPay() {
      // 关闭保证金对话框
      this.depositDialogVisible = false

      // 缴纳保证金--提交请求（获取订单号和实际支付金额）
      const depositReferResult = await request({
        url: '/api/Deposit/refer',
        method: 'post',
        data: { pay_type: 3 },
      })

      if (+depositReferResult.code === 200) {
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        // 显示微信支付对话框
        this.wechatPayDialogVisible = true

        // 缴纳保证金--微信支付
        const payResult = await request({
          url: '/api/Deposit/wxPay',
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

          // 启动获取保证金金额的计时器
          this._startGetDepositTimer('wechat')
        } else {
          layer.msg(payResult.msg)
        }
      } else {
        layer.msg(payResult.msg)
      }
    },
    // 关闭微信支付对话框
    handleCloseWechatPayDialog() {
      console.log('关闭微信支付对话框')
      this.wechatPayDialogVisible = false
      // 清除计时器
      clearInterval(this.getDepositTimer)

      // 打开保证金对话框
      this.depositDialogVisible = true
    },

    // 启动获取保证金金额的计时器
    _startGetDepositTimer(payMethod) {
      this.getDepositTimer = setInterval(() => {
        // 获取个人信息（通过个人信息中的保证金金额判断是否缴纳了保证金）
        request({
          url: '/api/Mine/info',
        }).then((result) => {
          if (+result.code === 200) {
            if (+result.data.deposit !== 0) {
              // 清除计时器
              clearInterval(this.getDepositTimer)
              this.$alert('<div style="text-align: center; font-size: 20px;">保证金缴纳成功</div>', '', {
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
              console.log('保证金', +result.data.deposit)
            }
          }
        })
      }, 3000)
    },
  },
})
new Vue({
  el: '#app',
  data() {
    return {
      // 表单数据
      formData: {
        type: '1',// 1课程直播，2赛事直播
        join_type: '1',// 1申请进入（需要发布者审核），2全网公开，3会员公开，4设置密码
        c_id: '',// 分类
        title: '',// 标题
        start_time: '',// 开始时间
        end_time: '',// 结束时间
        descri: '',// 描述
        image: '',// 封面图
        password: '',// 密码进入，此值必传
      },
      cateList: [],// 棋类型
      startDate: new Date().valueOf(),// 如果分钟是 0 或 30，则开始时间再加 10 分钟
      signUpStartDate: '',  // 报名开始时间
      signUpEndDate: '', // 报名结束时间
      coverImage: {},// 头像临时
      push_url: '',
      checkNum: 0,// 是否选中
    }
  },
  created() {
    // 直播分类
    request({ url: '/api/Live/liveCates', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
        this.formData.c_id = res.data[0].id
      }
    })
  },
  async mounted() {
    // 开始时间
    this.initSignUpStartDate(this.$refs.signUpStartDate)
    // 结束时间
    this.initSignUpEndDate(this.$refs.signUpEndDate)
    // 1. 判断是否实名认证
    const realNameAuthResult = await request({
      url: '/api/Mine/realInfo',
    })
    if (+realNameAuthResult.code === 200) {
      if (+realNameAuthResult.data.check_status === -2) {
        // check_status -2未提交，-1审核失败，0待审核，1已通过
        this.$alert('<div style="text-align: center; font-size: 20px;">请先进行实名认证</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 实名认证页面
            window.location.href = setupRealNamePage
          },
        })
        return
      } else if (+realNameAuthResult.data.check_status === -1) {
        // check_status -2未提交，-1审核失败，0待审核，1已通过
        this.$alert('<div style="text-align: center; font-size: 20px;">实名认证审核失败，请重新上传</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 实名认证页面
            window.location.href = setupRealNamePage
          },
        })
        return
      } else if (+realNameAuthResult.data.check_status === 0) {
        // check_status -2未提交，-1审核失败，0待审核，1已通过
        this.$alert('<div style="text-align: center; font-size: 20px;">实名认证审核中...</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 返回上个页面
            window.history.go(-1)
          },
        })
        return
      }
    }

    // 2. 判断是否缴纳保证金
    // 获取个人信息（通过个人信息中的保证金金额判断是否缴纳了保证金）
    const userInfoResult = await request({
      url: '/api/Mine/info',
    })
    if (+userInfoResult.code === 200) {
      if (+userInfoResult.data.deposit === 0) {
        // 如果保证金为 0
        // 打开保证金对话框
        this.$refs.depositDialog.handleOpenDepositDialog()
        return
      }
    }

    // 3. 判断直播发布次数是否不足
    const vipInfo = await request({
      // 我的特权接口
      url: '/api/Vip/mineVip',
    })
    if (+vipInfo.code === 200) {
      if (+vipInfo.data.live_num === 0) {
        this.$alert('<div style="text-align: center; font-size: 20px;">直播发布次数不足，请购买次数</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 开通会员页面
            window.location.href = memberPage
          },
        })
        return
      }
    }
  },
  methods: {
    // 开始时间
    initSignUpStartDate(elem) {
      console.log(elem)
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          // console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          // console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value
          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          }
          // console.log('报名开始时间', typeof dateValue, dateValue)
          // 设置报名开始时间（页面显示用）
          this.signUpStartDate = dateValue
          // 设置报名开始时间（提交数据用）
          this.formData.start_time = dateValue
          // 如果报名结束时间存在且比报名开始时间小（或相等）
          if (this.signUpEndDate && this.signUpEndDate <= this.signUpStartDate) {
            // 清空报名结束时间
            this.signUpEndDate = ''
            this.formData.end_time = ''
          }
        },
      })
    },
    // 结束时间
    initSignUpEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          let dateValue = value
          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.signUpStartDate) {
            // 如果还没有选择报名开始时间
            layer.msg('请先选择开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpStartDate.replace(/-/g, '/'))) {
            // 如果报名结束时间小于报名开始时间
            layer.msg('结束时间要大于开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          }
          console.log('报名结束时间', dateValue)
          this.signUpEndDate = dateValue
          this.formData.end_time = dateValue
        },
      })
    },
    // 上传头像
    handleCoverFileChange: function (event) {
      var element = event.target || event.srcElement;
      // 获取文件对象
      var file = element.files[0];
      console.log(file);
      // .png,.jpg,.jpeg,.bmp
      if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
        layer.msg("\u4E0D\u652F\u6301 ".concat(util.getExtensionName(file.name), " \u6587\u4EF6"));
        return;
      }
      window.URL = window.URL || window.webkitURL;
      this.coverImage = {
        // 用于提交数据
        file: file,
        // 用于页面展示
        url: window.URL.createObjectURL(file),
      };
    },
    onintClick() {
      this.checkNum = this.checkNum == 0 ? 1 : 0
    },
    // 提交申请
    async onAddClick() {
      if (this.formData.join_type == 4) {
        if (!this.formData.password) return layer.msg('请输入设置密码');
        if (this.formData.password.length != 6) return layer.msg('密码长度为6位');
      }
      if (!this.formData.title) return layer.msg('请输入直播讲解主题');
      if (!this.formData.start_time) return layer.msg('请选择开始时间');
      if (!this.formData.end_time) return layer.msg('请选择结束时间');
      if (!this.formData.descri) return layer.msg('请输入直播内容');
      if (!this.coverImage.file) return layer.msg('请上传直播封面');
      if (this.checkNum == 0) return layer.msg('请阅读并同意协议');
      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        time: 10 * 1000, // 如果十秒还没关闭则自动关闭
      })
      // 上传封面图
      this.formData.image = await util
        .uploadFile({
          file: this.coverImage.file,
          fileName: this.coverImage.file.name,
        })
        .catch((error) => {
          console.log('上传直播头像', error)
          layer.close(loadingIndex)
          layer.msg('上传直播头像')
        })
      if (!this.formData.image) return

      request({ url: '/api/Live/push', method: 'POST', data: this.formData, }).then((res) => {
        layer.close(loadingIndex)
        if (res.code == 200) {
          location.href = '/live/liveSuccess.html?push_url=' + res.data.push_url
          // this.push_url =
          // this.formData = {
          //   type: '1',// 1课程直播，2赛事直播
          //   join_type: '1',// 1申请进入（需要发布者审核），2全网公开，3会员公开，4设置密码
          //   c_id: '',// 分类
          //   title: '',// 标题
          //   start_time: '',// 开始时间
          //   end_time: '',// 结束时间
          //   descri: '',// 描述
          //   image: '',// 封面图
          //   password: '',// 密码进入，此值必传
          // }
          // syalert.syopen('liveCont')
        } else {
          layer.msg(result.msg)
        }
      }).catch((error) => {
        console.log(error)
        layer.close(loadingIndex)
      })
    },
  }
})
