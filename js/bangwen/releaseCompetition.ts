// 发布比赛第一步

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

const encrypt = new JSEncrypt()

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

// 发布比赛个人赛
const releaseCompetitionPersonal = {
  template: '#releaseCompetitionPersonal',
  props: ['competitionCateList'],
  data() {
    return {
      // 临时
      tempPreShow: true,
      // 表单数据
      formData: {
        competition_type: 0, // 赛事种类：0=个人赛，1=团队赛
        category_id: 1, // 赛事类型，1=围棋，2=象棋，3=五子棋，4=国际象棋，5=其他
        category_memo: '', // 赛事类型补充说明，赛事类型是“其他”时才填写
        competition_name: '', // 赛事名称
        stage: 1, // 比赛阶段总数，1~5，如果采用队员总分制，则只能是 1
        is_total_points: 0, // 是否采用队员总分制：0=否，1=是
        way: 0, // 比赛方式：0=线下场地，1=线上游戏平台
        way_memo: '', // 比赛方式补充说明
        join_type: 1, // 参与类型：1=自由参与，2=批准参与
        a_b_t: '', // 报名开始时间，时间戳（秒），步长 半小时
        a_e_t: '', // 报名结束时间，时间戳（秒）
        c_b_t: '', // 比赛开始时间，时间戳（秒）
        c_e_t: '', // 比赛结束时间，时间戳（秒）
        description: '', // 赛事描述
        sponsor: '', // 赞助方
        service_tel: '', // 客服电话
        cover_picture: '', // 封面图 url
        affix: '', // 附件 url

        apply_info: '', // 报名信息：1=年龄，2=居住地址，3=自我介绍 ps:多个用英文逗号隔开
        contact_info: '', // 联系方式：1=qq,2=MSN,3=SKYPE,4=微信号 ps:多个用英文逗号隔开
        roles: '1,2,3', // 报名角色，1=选手，2=裁判，3=主裁判 ps:多个用英文逗号隔开，必须全选，传递1,2,3
        fee: '', // 报名费用，0=没有报名费，具体金额为每人报名费
        fee_return: 1, // 审核未通过报名费退还：1=不退还，2=退还
        upper_limit: '', // 报名人数上限，0=没有上限，其他值为人数上限，最多不超过10000人
        team_where: 1, // 团队添加，1=组织者添加，2=队员自己填写，采用队员总分制团队必须组织者添加
        team_list: '', // team_where=1时必传此参数，团队列表，多个用英文逗号隔开
      },

      // 开始时间
      // 如果分钟是 0 或 30，则开始时间再加 10 分钟
      startDate: new Date().getMinutes() === 0 || new Date().getMinutes() === 30 ? new Date(new Date().valueOf() + 1000 * 60 * 10) : new Date().valueOf(),

      // 报名开始时间
      signUpStartDate: '',
      // 报名结束时间
      signUpEndDate: '',
      // 比赛开始时间
      competitionStartDate: '',
      // 比赛结束时间
      competitionEndDate: '',

      // 封面图
      coverImage: {},
      // 附件列表
      affixList: [],

      // 报名费用输入框是否显示
      feeInputShow: true,
      // 报名人数上限输入框是否显示
      upperLimitInputShow: true,
      // 添加团队名称列表是否显示
      teamListShow: true,
      // 团队名称列表
      teamNameList: [{ id: 1, name: '' }],
    }
  },
  mounted() {
    setTimeout(() => {
      // 初始化日期时间选择器
      // 初始化报名开始时间
      this.initSignUpStartDate(this.$refs.signUpStartDate)
      // 初始化报名结束时间
      this.initSignUpEndDate(this.$refs.signUpEndDate)
      // 初始化比赛开始时间
      this.initCompetitionStartDate(this.$refs.competitionStartDate)
      // 初始化比赛结束时间
      this.initCompetitionEndDate(this.$refs.competitionEndDate)
    }, 100)
  },
  methods: {
    // 选择是否采用队员总分制（单选框）
    handleSelectCompetitionTotalPointes(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.formData.is_total_points = value
      if (value === 1) {
        // 比赛阶段总数，1~5，如果采用队员总分制，则只能是 1
        this.formData.stage = 1
        // 团队添加，1=组织者添加，2=队员自己填写，采用队员总分制团队必须组织者添加
        this.formData.team_where = 1
        this.teamListShow = true
      }
    },

    // 初始化报名开始时间
    initSignUpStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('报名开始时间', typeof dateValue, dateValue)
          // 设置报名开始时间（页面显示用）
          this.signUpStartDate = dateValue
          // 设置报名开始时间（提交数据用）
          this.formData.a_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          // 如果报名结束时间存在且比报名开始时间小（或相等）
          if (this.signUpEndDate && this.signUpEndDate <= this.signUpStartDate) {
            // 如果比赛开始时间存在且比 报名结束时间或报名开始时间小（或相等）
            if (this.competitionStartDate && (this.competitionStartDate <= this.signUpEndDate || this.competitionStartDate <= this.signUpStartDate)) {
              // 如果比赛结束时间存在且比 比赛开始时间或报名结束时间或报名开始时间小（或相等）
              if (
                this.competitionEndDate &&
                (this.competitionEndDate <= this.competitionStartDate || this.competitionEndDate <= this.signUpEndDate || this.competitionEndDate <= this.signUpStartDate)
              ) {
                // 清空比赛结束时间
                this.competitionEndDate = ''
                this.formData.c_e_t = ''
              }
              // 清空比赛开始时间
              this.competitionStartDate = ''
              this.formData.c_b_t = ''
            }
            // 清空报名结束时间
            this.signUpEndDate = ''
            this.formData.a_e_t = ''
          }
        },
      })
    },
    // 初始化报名结束时间
    initSignUpEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.signUpStartDate) {
            // 如果还没有选择报名开始时间
            layer.msg('请先选择报名开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpStartDate.replace(/-/g, '/'))) {
            // 如果报名结束时间小于报名开始时间
            layer.msg('报名结束时间要大于报名开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('报名结束时间', dateValue)
          this.signUpEndDate = dateValue
          this.formData.a_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          if (this.competitionStartDate && this.competitionStartDate <= this.signUpEndDate) {
            if (this.competitionEndDate && (this.competitionEndDate <= this.competitionStartDate || this.competitionEndDate <= this.signUpEndDate)) {
              this.competitionEndDate = ''
              this.formData.c_e_t = ''
            }
            this.competitionStartDate = ''
            this.formData.c_b_t = ''
          }
        },
      })
    },
    // 初始化比赛开始时间
    initCompetitionStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.signUpEndDate) {
            // 如果还没有选择报名结束时间
            layer.msg('请先选择报名结束时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpEndDate.replace(/-/g, '/'))) {
            // 如果比赛开始时间小于报名结束时间
            layer.msg('比赛开始时间要大于报名结束时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('比赛开始时间', dateValue)
          this.competitionStartDate = dateValue
          this.formData.c_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          if (this.competitionEndDate && this.competitionEndDate <= this.competitionStartDate) {
            this.competitionEndDate = ''
            this.formData.c_e_t = ''
          }
        },
      })
    },
    // 初始化比赛结束时间
    initCompetitionEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.competitionStartDate) {
            // 如果还没有选择比赛开始时间
            layer.msg('请先选择比赛开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.competitionStartDate.replace(/-/g, '/'))) {
            // 如果比赛开始时间小于报名结束时间
            layer.msg('比赛结束时间要大于比赛开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('比赛结束时间', dateValue)
          this.competitionEndDate = dateValue
          this.formData.c_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''
        },
      })
    },

    // 选择封面图
    handleCoverFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象
      const file = element.files[0]
      console.log(file)
      // .png,.jpg,.jpeg,.bmp
      if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
        layer.msg(`不支持 ${util.getExtensionName(file.name)} 文件`)
        return
      }

      window.URL = window.URL || window.webkitURL

      this.coverImage = {
        // 用于提交数据
        file,
        // 用于页面展示
        url: window.URL.createObjectURL(file),
      }
      if (this.formData.cover_picture) {
        // 如果有 url，说明上传过了，改变图片的时候把 url 删除
        this.formData.cover_picture = ''
      }
    },
    // 选择附件
    handleAffixFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象数组
      const files = element.files

      // 存储符合规定的文件
      const tempArr = [...this.affixList]
      // 存储所选文件中不支持的扩展名
      const errorArr = []
      // 存储所选文件中超过指定大小的文件名
      const errorArr2 = []
      for (const item of files) {
        // 限制个数 5 个
        if (tempArr.length < 5) {
          const filesNameList = this.affixList.length ? this.affixList.map((i) => i.name) : []
          // （如果不存在文件名）禁止添加同名文件
          if (!filesNameList.includes(item.name)) {
            console.log(item)
            if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
              // 限制扩展名
              if (!errorArr.includes(util.getExtensionName(item.name))) {
                errorArr.push(util.getExtensionName(item.name))
              }
            } else if (item.size > 1024 * 1024 * 10) {
              // 限制大小 10M
              if (!errorArr2.includes(item.name)) {
                errorArr2.push(item.name)
              }
            } else if (tempArr.length < 5) {
              console.log('添加文件')
              tempArr.push(item)
              if (this.formData.affix) {
                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                this.formData.affix = ''
              }
            }
          }
        }
      }

      console.log('tempArr', tempArr.length, tempArr)

      if (tempArr.length < 5 && errorArr.length) {
        console.log('errorArr', errorArr)
        layer.msg(`不支持 ${[...errorArr]} 文件`)
      } else if (errorArr2.length) {
        console.log('errorArr2', errorArr2)
        layer.msg(`请选择 10M 以内的文件`)
      }

      this.affixList = tempArr
      // element.value = ''
      console.log({ ...this.affixList })
    },
    // 删除附件
    handleDeleteAffix(index) {
      this.affixList.splice(index, 1)
      if (this.formData.affix) {
        // 如果有 url，说明上传过了，改变附件的时候把 url 删除
        this.formData.affix = ''
      }
    },

    // 选择报名信息（复选框）（年龄、居住地址、自我介绍）
    handleSelectApplyInfo(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.apply_info.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.apply_info = arr.toString()
    },
    // 选择联系方式（复选框）（QQ、MSN、SKYPE、微信号）
    handleSelectContactInfo(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.contact_info.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.contact_info = arr.toString()
    },
    // 选择报名费用（单选框）
    handleSelectFee(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value) {
        // 有
        this.feeInputShow = true
        this.formData.fee = ''
      } else {
        // 无
        this.feeInputShow = false
        this.formData.fee = 0
      }
    },
    // 选择报名人数上限（单选框）
    handleSelectUpperLimit(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value) {
        // 有
        this.upperLimitInputShow = true
        this.formData.upper_limit = ''
      } else {
        // 无
        this.upperLimitInputShow = false
        this.formData.upper_limit = 0
      }
    },
    // 选择添加团队（单选框）
    handleSelectTeamWhere(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value === 1) {
        // 组织者添加
        this.formData.team_where = 1
        this.teamListShow = true
      } else if (value === 2) {
        // 各队员自己添加
        this.formData.team_where = 2
        this.teamListShow = false
      }
    },
    // 删除团队名称
    handleDeleteTeamName(index) {
      this.teamNameList.splice(index, 1)
    },
    // 添加团队名称
    handleAddTeamName() {
      const maxId = Math.max(...this.teamNameList.map((i) => i.id))
      this.teamNameList.push({ id: maxId + 1, name: '' })
    },

    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      if (this.formData.category_id === 5) {
        arr.push({ label: '请输入赛事类型补充说明', validate: !this.formData.category_memo })
      }

      arr.push({ label: '请输入赛事名称', validate: !this.formData.competition_name })

      if (this.formData.is_total_points) {
        arr.push({ label: '队员总分制的比赛阶段总数必须为 1', validate: this.formData.stage !== 1 })
      } else {
        arr.push({ label: '比赛阶段总数必须是 1~5 的整数（包括 1 和 5 ）', validate: ![1, 2, 3, 4, 5].includes(this.formData.stage) })
      }

      if (this.formData.way === 1) {
        arr.push({ label: '请输入比赛方式补充说明', validate: !this.formData.way_memo })
      }

      arr.push(
        { label: '请选择报名开始时间', validate: !this.formData.a_b_t },
        { label: '请选择报名结束时间', validate: !this.formData.a_e_t },
        { label: '请选择比赛开始时间', validate: !this.formData.c_b_t },
        { label: '请选择比赛结束时间', validate: !this.formData.c_e_t },
        { label: '请输入赛事描述', validate: !this.formData.description.trim() },
        { label: '请输入赞助方', validate: !this.formData.sponsor },
        { label: '请输入赛事客服电话', validate: !this.formData.service_tel },
        { label: '请选择封面图', validate: !this.coverImage.url }
        // { label: '请选择附件', validate: !this.affixList.length },
        // { label: '请选择报名信息', validate: !this.formData.apply_info },
        // { label: '请选择联系方式', validate: !this.formData.contact_info },
        // { label: '请选择角色', validate: !this.formData.roles }
      )

      if (this.feeInputShow) {
        arr.push({ label: '请输入报名费用', validate: !this.formData.fee }, { label: '报名费用必须大于 0', validate: this.formData.fee <= 0 })
      }

      if (this.upperLimitInputShow) {
        arr.push(
          { label: '请输入报名人数上限', validate: !this.formData.upper_limit },
          { label: '报名人数上限必须是大于 0 的整数', validate: this.formData.upper_limit <= 0 || this.formData.upper_limit % 1 !== 0 }
        )
      }

      arr.push({ label: '采用队员总分制时团队必须由组织者添加', validate: this.formData.is_total_points === 1 && this.formData.team_where === 2 })

      if (this.teamListShow) {
        const tempArr = this.teamNameList.filter((i) => i.name)
        arr.push({ label: '请输入团队名称', validate: !tempArr.length })
      }

      const errorArr = arr.filter((item) => item.validate)
      if (errorArr.length) {
        layer.msg(errorArr[0].label)
      } else {
        return true
      }
    },
    // 下一步
    async handleNextStep(event) {
      console.log('发布比赛 未校验', this.formData)

      // 校验数据
      if (!this._validateFormData()) return

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        // time: 30 * 1000, // 如果30秒还没关闭则自动关闭
      })

      // 如果有 url 说明已经上传过了，没有时才去上传
      if (!this.formData.cover_picture) {
        // 上传封面图
        this.formData.cover_picture = await util
          .uploadFile({
            file: this.coverImage.file,
            fileName: this.coverImage.file.name,
          })
          .catch((error) => {
            console.log('上传封面图失败', error)
            layer.close(loadingIndex)
            layer.msg('上传封面图失败')
          })
        if (!this.formData.cover_picture) return
      }

      // 如果有 url 说明已经上传过了，没有时才去上传
      if (!this.formData.affix) {
        // 上传附件
        const affixUrlArr = await util
          .uploadMultipleFile(
            this.affixList.map((item) => {
              console.log('affixList item', item)
              return {
                file: item,
                fileName: item.name,
              }
            })
          )
          .catch((error) => {
            console.log('上传附件失败', error)
            layer.close(loadingIndex)
            layer.msg('上传附件失败')
          })
        if (!affixUrlArr) return
        this.formData.affix = affixUrlArr.toString()
      }

      if (this.teamListShow) {
        this.formData.team_list = this.teamNameList
          .filter((i) => i.name)
          .map((i) => i.name)
          .toString()
      }
      console.log('发布比赛 已校验', this.formData)

      // 发布赛事
      request({
        url: '/api/competition/push_match',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')
            // 跳转到个人赛设置阶段页面
            window.location.href = `/bangwen/competitionStagePersonal.html?competition_id=${result.data.competition_id}`

            // this.$alert('发布成功', '', {
            //   showClose: false,
            //   confirmButtonText: '确定',
            //   callback: (action) => {
            //     // 跳转到个人赛设置阶段页面
            //     window.location.href = `/bangwen/competitionStagePersonal.html?competition_id=${result.data.competition_id}`
            //   },
            // })
          } else if (result.code === 201) {
            // 发布次数不足，跳转购买会员页面
            console.log('发布次数不足，跳转购买会员页面')
            layer.msg(result.msg)
          } else if (result.code === 202) {
            // 错误信息
            console.log('错误信息')
            layer.msg(result.msg)
          } else if (result.code === 203) {
            // 未绑定手机号
            console.log('未绑定手机号')
            layer.msg(result.msg)
          } else if (result.code === 5) {
            // 余额不足
            console.log('余额不足')
            layer.msg(result.msg)
          } else if (result.code === 206) {
            // 未交保证金
            console.log('未交保证金')
            layer.msg(result.msg)
            syalert.syopen('bondCont')
          } else if (result.code === 207) {
            // 未实名认证
            console.log('未实名认证')
            layer.msg(result.msg)
          } else if (result.code === 208) {
            // 未设置支付密码
            console.log('未设置支付密码')
            layer.msg(result.msg)
          }
        })
        .catch((error) => {
          console.log(error)
          layer.close(loadingIndex)
        })
    },
  },
}

// 发布比赛团队赛
const releaseCompetitionTeam = {
  template: '#releaseCompetitionTeam',
  props: [
    // 赛事类型列表
    'competitionCateList',
  ],
  data() {
    return {
      // 临时
      tempPreShow: true,
      // 表单数据
      formData: {
        competition_type: 1, // 赛事种类：0=个人赛，1=团队赛
        category_id: 1, // 赛事类型，1=围棋，2=象棋，3=五子棋，4=国际象棋，5=其他
        category_memo: '', // 赛事类型补充说明，赛事类型是“其他”时才填写
        competition_name: '', // 赛事名称
        stage: 1, // 比赛阶段总数，1~5
        way: 0, // 比赛方式：0=线下场地，1=线上游戏平台
        way_memo: '', // 比赛方式补充说明
        join_type: 1, // 参与类型：1=自由参与，2=批准参与
        a_b_t: '', // 报名开始时间，时间戳（秒），步长 半小时
        a_e_t: '', // 报名结束时间，时间戳（秒）
        c_b_t: '', // 比赛开始时间，时间戳（秒）
        c_e_t: '', // 比赛结束时间，时间戳（秒）
        description: '', // 赛事描述
        sponsor: '', // 赞助方
        service_tel: '', // 客服电话
        cover_picture: '', // 封面图 url
        affix: '', // 附件 url

        apply_info: '', // 报名信息：1=年龄，2=居住地址，3=自我介绍 ps:多个用英文逗号隔开
        contact_info: '', // 联系方式：1=qq,2=MSN,3=SKYPE,4=微信号 ps:多个用英文逗号隔开
        roles: '1,2,3,4', // 报名角色，1=选手，2=裁判，3=主裁判， 4领队 ps:多个用英文逗号隔开，必须全选，传递1,2,3,4
        fee: '', // 报名费用，0=没有报名费，具体金额为每人报名费
        fee_return: 1, // 审核未通过报名费退还：1=不退还，2=退还
        upper_limit: '', // 队伍数上限，最多不超过100队
        team_up: '', // 每队人数上限
        team_low: '', // 每队人数下线
        team_where: 1, // 团队添加，1=组织者添加，2=队员自己填写采用队员总分制团队必须组织者添加
        team_list: '', // team_where=1时必传此参数，团队列表，多个用英文逗号隔开
      },

      // 开始时间
      // 如果分钟是 0 或 30，则开始时间再加 10 分钟
      startDate: new Date().getMinutes() === 0 || new Date().getMinutes() === 30 ? new Date(new Date().valueOf() + 1000 * 60 * 10) : new Date().valueOf(),

      // 报名开始时间
      signUpStartDate: '',
      // 报名结束时间
      signUpEndDate: '',
      // 比赛开始时间
      competitionStartDate: '',
      // 比赛结束时间
      competitionEndDate: '',

      // 封面图
      coverImage: {},
      // 附件列表
      affixList: [],

      // 报名费用输入框是否显示
      feeInputShow: true,
      // 报名人数上限输入框是否显示
      upperLimitInputShow: true,
      // 添加团队名称列表是否显示
      teamListShow: true,
      // 团队名称列表
      teamNameList: [{ id: 1, name: '' }],
    }
  },
  mounted() {
    setTimeout(() => {
      // 初始化日期时间选择器
      // 初始化报名开始时间
      this.initSignUpStartDate(this.$refs.signUpStartDate)
      // 初始化报名结束时间
      this.initSignUpEndDate(this.$refs.signUpEndDate)
      // 初始化比赛开始时间
      this.initCompetitionStartDate(this.$refs.competitionStartDate)
      // 初始化比赛结束时间
      this.initCompetitionEndDate(this.$refs.competitionEndDate)
    }, 100)
  },
  methods: {
    // 初始化报名开始时间
    initSignUpStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('报名开始时间', typeof dateValue, dateValue)
          // 设置报名开始时间（页面显示用）
          this.signUpStartDate = dateValue
          // 设置报名开始时间（提交数据用）
          this.formData.a_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          // 如果报名结束时间存在且比报名开始时间小（或相等）
          if (this.signUpEndDate && this.signUpEndDate <= this.signUpStartDate) {
            // 如果比赛开始时间存在且比 报名结束时间或报名开始时间小（或相等）
            if (this.competitionStartDate && (this.competitionStartDate <= this.signUpEndDate || this.competitionStartDate <= this.signUpStartDate)) {
              // 如果比赛结束时间存在且比 比赛开始时间或报名结束时间或报名开始时间小（或相等）
              if (
                this.competitionEndDate &&
                (this.competitionEndDate <= this.competitionStartDate || this.competitionEndDate <= this.signUpEndDate || this.competitionEndDate <= this.signUpStartDate)
              ) {
                // 清空比赛结束时间
                this.competitionEndDate = ''
                this.formData.c_e_t = ''
              }
              // 清空比赛开始时间
              this.competitionStartDate = ''
              this.formData.c_b_t = ''
            }
            // 清空报名结束时间
            this.signUpEndDate = ''
            this.formData.a_e_t = ''
          }
        },
      })
    },
    // 初始化报名结束时间
    initSignUpEndDate(elem) {
      console.log('初始化报名结束时间')
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.signUpStartDate) {
            // 如果还没有选择报名开始时间
            layer.msg('请先选择报名开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpStartDate.replace(/-/g, '/'))) {
            // 如果报名结束时间小于报名开始时间
            layer.msg('报名结束时间要大于报名开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('报名结束时间', dateValue)
          this.signUpEndDate = dateValue
          this.formData.a_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          if (this.competitionStartDate && this.competitionStartDate <= this.signUpEndDate) {
            if (this.competitionEndDate && (this.competitionEndDate <= this.competitionStartDate || this.competitionEndDate <= this.signUpEndDate)) {
              this.competitionEndDate = ''
              this.formData.c_e_t = ''
            }
            this.competitionStartDate = ''
            this.formData.c_b_t = ''
          }
        },
      })
    },
    // 初始化比赛开始时间
    initCompetitionStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.signUpEndDate) {
            // 如果还没有选择报名结束时间
            layer.msg('请先选择报名结束时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpEndDate.replace(/-/g, '/'))) {
            // 如果比赛开始时间小于报名结束时间
            layer.msg('比赛开始时间要大于报名结束时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('比赛开始时间', dateValue)
          this.competitionStartDate = dateValue
          this.formData.c_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          if (this.competitionEndDate && this.competitionEndDate <= this.competitionStartDate) {
            this.competitionEndDate = ''
            this.formData.c_e_t = ''
          }
        },
      })
    },
    // 初始化比赛结束时间
    initCompetitionEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.competitionStartDate) {
            // 如果还没有选择比赛开始时间
            layer.msg('请先选择比赛开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.competitionStartDate.replace(/-/g, '/'))) {
            // 如果比赛开始时间小于报名结束时间
            layer.msg('比赛结束时间要大于比赛开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('比赛结束时间', dateValue)
          this.competitionEndDate = dateValue
          this.formData.c_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''
        },
      })
    },

    // 选择封面图
    handleCoverFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象
      const file = element.files[0]
      console.log(file)
      // .png,.jpg,.jpeg,.bmp
      if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
        layer.msg(`不支持 ${util.getExtensionName(file.name)} 文件`)
        return
      }

      window.URL = window.URL || window.webkitURL

      this.coverImage = {
        // 用于提交数据
        file,
        // 用于页面展示
        url: window.URL.createObjectURL(file),
      }
      if (this.formData.cover_picture) {
        // 如果有 url，说明上传过了，改变图片的时候把 url 删除
        this.formData.cover_picture = ''
      }
    },
    // 选择附件
    handleAffixFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象数组
      const files = element.files

      // 存储符合规定的文件
      const tempArr = [...this.affixList]
      // 存储所选文件中不支持的扩展名
      const errorArr = []
      // 存储所选文件中超过指定大小的文件名
      const errorArr2 = []
      for (const item of files) {
        // 限制个数 5 个
        if (tempArr.length < 5) {
          const filesNameList = this.affixList.length ? this.affixList.map((i) => i.name) : []
          // （如果不存在文件名）禁止添加同名文件
          if (!filesNameList.includes(item.name)) {
            console.log(item)
            if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
              // 限制扩展名
              if (!errorArr.includes(util.getExtensionName(item.name))) {
                errorArr.push(util.getExtensionName(item.name))
              }
            } else if (item.size > 1024 * 1024 * 10) {
              // 限制大小 10M
              if (!errorArr2.includes(item.name)) {
                errorArr2.push(item.name)
              }
            } else if (tempArr.length < 5) {
              console.log('添加文件')
              tempArr.push(item)
              if (this.formData.affix) {
                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                this.formData.affix = ''
              }
            }
          }
        }
      }

      console.log('tempArr', tempArr.length, tempArr)

      if (tempArr.length < 5 && errorArr.length) {
        console.log('errorArr', errorArr)
        layer.msg(`不支持 ${[...errorArr]} 文件`)
      } else if (errorArr2.length) {
        console.log('errorArr2', errorArr2)
        layer.msg(`请选择 10M 以内的文件`)
      }

      this.affixList = tempArr
      // element.value = ''
      console.log({ ...this.affixList })
    },
    // 删除附件
    handleDeleteAffix(index) {
      this.affixList.splice(index, 1)
      if (this.formData.affix) {
        // 如果有 url，说明上传过了，改变附件的时候把 url 删除
        this.formData.affix = ''
      }
    },

    // 选择报名信息（复选框）（年龄、居住地址、自我介绍）
    handleSelectApplyInfo(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.apply_info.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.apply_info = arr.toString()
    },
    // 选择联系方式（复选框）（QQ、MSN、SKYPE、微信号）
    handleSelectContactInfo(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.contact_info.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.contact_info = arr.toString()
    },
    // 选择报名费用（单选框）
    handleSelectFee(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value) {
        // 有
        this.feeInputShow = true
        this.formData.fee = ''
      } else {
        // 无
        this.feeInputShow = false
        this.formData.fee = 0
      }
    },
    // 选择添加团队（单选框）
    handleSelectTeamWhere(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value === 1) {
        // 组织者添加
        this.formData.team_where = 1
        this.teamListShow = true
      } else if (value === 2) {
        // 各队员自己添加
        this.formData.team_where = 2
        this.teamListShow = false
      }
    },
    // 删除团队名称
    handleDeleteTeamName(index) {
      this.teamNameList.splice(index, 1)
    },
    // 添加团队名称
    handleAddTeamName() {
      const maxId = Math.max(...this.teamNameList.map((i) => i.id))
      this.teamNameList.push({ id: maxId + 1, name: '' })
    },

    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      if (this.formData.category_id === 5) {
        arr.push({ label: '请输入赛事类型补充说明', validate: !this.formData.category_memo })
      }

      arr.push({ label: '请输入赛事名称', validate: !this.formData.competition_name })

      if (this.formData.is_total_points) {
        arr.push({ label: '队员总分制的比赛阶段总数必须为 1', validate: this.formData.stage !== 1 })
      } else {
        arr.push({ label: '比赛阶段总数必须是 1~5 的整数（包括 1 和 5 ）', validate: ![1, 2, 3, 4, 5].includes(this.formData.stage) })
      }

      if (this.formData.way === 1) {
        arr.push({ label: '请输入比赛方式补充说明', validate: !this.formData.way_memo })
      }

      arr.push(
        { label: '请选择报名开始时间', validate: !this.formData.a_b_t },
        { label: '请选择报名结束时间', validate: !this.formData.a_e_t },
        { label: '请选择比赛开始时间', validate: !this.formData.c_b_t },
        { label: '请选择比赛结束时间', validate: !this.formData.c_e_t },
        { label: '请输入赛事描述', validate: !this.formData.description.trim() },
        { label: '请输入赞助方', validate: !this.formData.sponsor },
        { label: '请输入赛事客服电话', validate: !this.formData.service_tel },
        { label: '请选择封面图', validate: !this.coverImage.url }
        // { label: '请选择附件', validate: !this.affixList.length },
        // { label: '请选择报名信息', validate: !this.formData.apply_info },
        // { label: '请选择联系方式', validate: !this.formData.contact_info },
        // { label: '请选择角色', validate: !this.formData.roles }
      )

      if (this.feeInputShow) {
        arr.push({ label: '请输入报名费用', validate: !this.formData.fee }, { label: '报名费用必须大于 0', validate: this.formData.fee <= 0 })
      }

      arr.push(
        { label: '请输入队伍上限', validate: this.formData.upper_limit === '' },
        { label: '队伍上限上限必须是 0~100 的整数', validate: this.formData.upper_limit < 0 || this.formData.upper_limit > 100 || this.formData.upper_limit > parseInt(this.formData.upper_limit) },

        { label: '请输入每队人数上限', validate: this.formData.team_up === '' },
        { label: '每队人数上限必须是 1~100 的整数', validate: this.formData.team_up <= 0 || this.formData.team_up > 100 || this.formData.team_up > parseInt(this.formData.team_up) },

        { label: '请输入每队人数下限', validate: this.formData.team_low === '' },
        { label: '每队人数下线不能大于每队人数上限', validate: this.formData.team_low > this.formData.team_up },
        { label: '每队人数下限必须是 1~100 的整数', validate: this.formData.team_low <= 0 || this.formData.team_low > 100 || this.formData.team_low > parseInt(this.formData.team_low) }
      )

      if (this.teamListShow) {
        const tempArr = this.teamNameList.filter((i) => i.name)
        arr.push({ label: '请输入团队名称', validate: !tempArr.length })
      }

      const errorArr = arr.filter((item) => item.validate)
      if (errorArr.length) {
        layer.msg(errorArr[0].label)
      } else {
        return true
      }
    },
    // 下一步
    async handleNextStep(event) {
      console.log('发布比赛 未校验', this.formData)

      // 校验数据
      if (!this._validateFormData()) return

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        // time: 30 * 1000, // 如果30秒还没关闭则自动关闭
      })

      // 如果有 url 说明已经上传过了，没有时才去上传
      if (!this.formData.cover_picture) {
        // 上传封面图
        this.formData.cover_picture = await util
          .uploadFile({
            file: this.coverImage.file,
            fileName: this.coverImage.file.name,
          })
          .catch((error) => {
            console.log('上传封面图失败', error)
            layer.close(loadingIndex)
            layer.msg('上传封面图失败')
          })
        if (!this.formData.cover_picture) return
      }

      // 如果有 url 说明已经上传过了，没有时才去上传
      if (!this.formData.affix) {
        // 上传附件
        const affixUrlArr = await util
          .uploadMultipleFile(
            this.affixList.map((item) => {
              console.log('affixList item', item)
              return {
                file: item,
                fileName: item.name,
              }
            })
          )
          .catch((error) => {
            console.log('上传附件失败', error)
            layer.close(loadingIndex)
            layer.msg('上传附件失败')
          })
        if (!affixUrlArr) return
        this.formData.affix = affixUrlArr.toString()
      }

      if (this.teamListShow) {
        this.formData.team_list = this.teamNameList
          .filter((i) => i.name)
          .map((i) => i.name)
          .toString()
      }
      console.log('发布比赛 已校验', this.formData)

      // 发布赛事
      request({
        url: '/api/competition_team/push_match',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')

            // 跳转到团队赛设置阶段页面
            window.location.href = `/bangwen/competitionStageTeam.html?competition_id=${result.data.competition_id}`

            // this.$alert('发布成功', '', {
            //   showClose: false,
            //   confirmButtonText: '确定',
            //   callback: (action) => {
            //     // 跳转到团队赛设置阶段页面
            //     window.location.href = `/bangwen/competitionStageTeam.html?competition_id=${result.data.competition_id}`
            //   },
            // })
          } else if (result.code === 201) {
            // 发布次数不足，跳转购买会员页面
            console.log('发布次数不足，跳转购买会员页面')
            layer.msg(result.msg)
          } else if (result.code === 202) {
            // 错误信息
            console.log('错误信息')
            layer.msg(result.msg)
          } else if (result.code === 203) {
            // 未绑定手机号
            console.log('未绑定手机号')
            layer.msg(result.msg)
          } else if (result.code === 5) {
            // 余额不足
            console.log('余额不足')
            layer.msg(result.msg)
          } else if (result.code === 206) {
            // 未交保证金
            console.log('未交保证金')
            layer.msg(result.msg)

            syalert.syopen('bondCont')
          } else if (result.code === 207) {
            // 未实名认证
            console.log('未实名认证')
            layer.msg(result.msg)
          } else if (result.code === 208) {
            // 未设置支付密码
            console.log('未设置支付密码')
            layer.msg(result.msg)
          }
        })
        .catch((error) => {
          console.log(error)
          layer.close(loadingIndex)
        })
    },
  },
}

new Vue({
  el: '#app',
  components: {
    // 发布比赛个人赛
    'release-competition-personal': releaseCompetitionPersonal,
    // 发布比赛团队赛
    'release-competition-team': releaseCompetitionTeam,
  },
  data() {
    return {
      // 赛事类型列表（从服务器获取）
      competitionCateList: [],

      // 赛事种类，0=个人赛，1=团队赛
      competitionType: 0,
    }
  },
  created() {
    // 获取赛事类型列表
    request({
      url: '/api/Competition/get_category_list',
    }).then((result) => {
      console.log('赛事类型列表', result)
      if (+result.code === 200) {
        this.competitionCateList = result.data
      }
    })
  },
  async mounted() {
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

    // 3. 判断赛事发布次数是否不足
    const vipInfo = await request({
      // 我的特权接口
      url: '/api/Vip/mineVip',
    })
    if (+vipInfo.code === 200) {
      if (+vipInfo.data.match_num === 0) {
        this.$alert('<div style="text-align: center; font-size: 20px;">赛事发布次数不足，请购买次数</div>', '', {
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
    // 测试
    handleTest() {
      console.log('测试')
      // window.open('/')
    },
  },
})
