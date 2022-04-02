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

// 保证金对话框
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

// 组件模板 - 第一步
const templateFirstStep = {
  template: '#templateFirstStep',
  data() {
    return {
      // 临时
      tempPreShow: true,

      // 赛事类型列表（从服务器获取）
      competitionCateList: [],

      // 表单数据
      formData: {
        competition_type: 0, // 赛事种类：0=个人赛，1=团队赛
        category_id: 1, // 赛事类型，1=围棋，2=象棋，3=五子棋，4=国际象棋，5=其他
        category_memo: '', // 赛事类型补充说明，赛事类型是“其他”时才填写
        competition_name: '', // 赛事名称
        stage: 1, // 比赛阶段总数，1~5，如果是个人赛且采用队员总分制，则“比赛阶段总数”只能是 1

        is_total_points: 0, // 是否采用队员总分制：0=否，1=是（只有个人赛有此项。如果采用队员总分制，则“比赛阶段总数”只能是 1。如果采用队员总分制，则“团队添加”必须是“组织者添加”）

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
        roles: '1,2,3', // 报名角色，1=选手，2=裁判，3=主裁判，4=领队选手 ps:多个用英文逗号隔开，必须全选，只有团队赛有“领队”
        fee: '', // 报名费用，0=没有报名费，具体金额为每人报名费
        fee_return: 1, // 审核未通过报名费退还：1=不退还，2=退还

        // 个人赛表示 报名人数上限，0=没有上限，其他值为人数上限，最多不超过10000人
        // 团队赛表示 队伍数上限，最多不超过 100 队
        upper_limit: '',

        team_up: '', // 每队人数上限（团队赛才有）
        team_low: '', // 每队人数上限（团队赛才有），队际赛每队人数最低限制6人，设置不足6人时，系统自动限制为6人

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
      // 团队名称列表
      teamNameList: [{ id: 1, name: '' }],
    }
  },
  // 侦听器
  watch: {
    // 赛事类型（个人赛、团队赛）
    'formData.competition_type'(newValue) {
      if (newValue === 0) {
        // 个人赛
        // 设置选择的角色
        this.formData.roles = '1,2,3'
      } else if (newValue === 1) {
        // 团队赛
        // 设置选择的角色
        this.formData.roles = '1,2,3,4'
      }
      // 设置报名人数上限
      this.formData.upper_limit = ''
    },
    // 是否采用队员总分制
    'formData.is_total_points'(newValue) {
      if (newValue === 1) {
        // 比赛阶段总数，1~5，如果采用队员总分制，则只能是 1
        this.formData.stage = 1
        // 团队添加，1=组织者添加，2=队员自己填写，采用队员总分制团队必须组织者添加
        this.formData.team_where = 1
      }
    },
  },
  created() {
    console.log('组件模板 - 第一步 被创建')
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
    // 添加团队名称
    handleAddTeamName() {
      const maxId = Math.max(...this.teamNameList.map((i) => i.id))
      this.teamNameList.push({ id: maxId + 1, name: '' })
    },
    // 删除团队名称
    handleDeleteTeamName(index) {
      this.teamNameList.splice(index, 1)
    },

    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      if (this.formData.category_id === 5) {
        arr.push({ label: '请输入赛事类型补充说明', validate: !this.formData.category_memo })
      }

      arr.push({ label: '请输入赛事名称', validate: !this.formData.competition_name })

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
      )

      if (this.feeInputShow) {
        arr.push({ label: '请输入报名费用', validate: !this.formData.fee }, { label: '报名费用必须大于 0', validate: this.formData.fee <= 0 })
      }

      if (this.formData.competition_type === 0 && this.upperLimitInputShow) {
        // 个人赛
        arr.push(
          { label: '请输入报名人数上限', validate: !this.formData.upper_limit },
          { label: '报名人数上限必须是大于 0 的整数', validate: this.formData.upper_limit <= 0 || this.formData.upper_limit % 1 !== 0 },
          { label: '报名人数上限不能大于 10000', validate: this.formData.upper_limit > 10000 }
        )
      } else if (this.formData.competition_type === 1) {
        // 团队赛
        arr.push(
          { label: '请输入队伍上限', validate: !this.formData.upper_limit },
          { label: '队伍上限必须是大于 0 的整数', validate: this.formData.upper_limit <= 0 || this.formData.upper_limit % 1 !== 0 },
          { label: '队伍上限不能大于 100', validate: this.formData.upper_limit > 100 },

          { label: '请输入每队人数上限', validate: !this.formData.team_up },
          { label: '每队人数上限必须是大于 0 的整数', validate: this.formData.team_up <= 0 || this.formData.team_up % 1 !== 0 },

          { label: '请输入每队人数下限', validate: !this.formData.team_low },
          { label: '每队人数下限必须是大于 0 的整数', validate: this.formData.team_low <= 0 || this.formData.team_low % 1 !== 0 },

          { label: '每队人数上限必须不能小于每队人数下线', validate: this.formData.team_up < this.formData.team_low }
        )
      }

      if (this.formData.team_where === 1) {
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
    // 对 formData 进行处理
    _formatFormData() {
      const obj = JSON.parse(JSON.stringify(this.formData))
      // 赛事类型
      if (obj.category_id !== 5) delete obj.category_memo
      // 队员总分制
      if (obj.competition_type === 1) delete obj.is_total_points
      // 比赛方式
      if (obj.way !== 1) delete obj.way_memo
      // 每队人数
      if (obj.competition_type !== 1) delete obj.team_up
      if (obj.competition_type !== 1) delete obj.team_low
      // 团队
      if (obj.team_where !== 1) delete obj.team_list

      return util.objFilterEmptyStrProp(obj)
    },
    // 下一步
    async handleNextStep(event) {
      console.log('发布比赛 未校验', this.formData)

      // 校验要提交的数据
      if (!this._validateFormData()) return

      // 请求路径
      let requestUrl = this.formData.competition_type ? '/api/competition_team/push_match' : '/api/competition/push_match'

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        // time: 30 * 1000, // 如果30秒还没关闭则自动关闭
      })

      // 上传单个封面图到阿里 OSS
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

      // // 上传多个附件到阿里 OSS
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

      // 设置团队名称列表
      if (this.formData.team_where === 1) {
        this.formData.team_list = this.teamNameList
          .filter((i) => i.name)
          .map((i) => i.name)
          .toString()
      }
      console.log('发布比赛 已校验', this.formData)

      // 发布赛事
      request({ url: requestUrl, method: 'post', data: this._formatFormData() })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')
            // 跳转到个人赛设置阶段页面
            window.location.href = `/bangwen/competitionStagePersonal.html?competition_id=${result.data.competition_id}`
            window.location.href = `?competition_id=${result.data.competition_id}`

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

// 组件模板 - 第二步
const templateSecondStep = {
  template: '#templateSecondStep',
  props: ['competitionStageInfo'],
  data() {
    return {
      // 临时
      tempPreShow: true,

      // 赛事阶段名称列表
      competitionStageNameList: [],
      // 阶段开始时间
      stageStartDate: '',
      // 阶段结束时间
      stageEndDate: '',

      formData: {
        // 赛事id
        competition_id: '',
        // 阶段名称
        stage_name: '',
        // 当前阶段数
        stage: '',

        // 阶段赛开始时间（时间戳（秒））
        s_b_t: '',
        // 阶段赛结束时间（时间戳（秒））
        s_e_t: '',
        // 比赛制度：1=淘汰赛，2=循环赛，3=其他赛制
        system: '',
        // 规则：system=1,rule:1=单败淘汰，2=双败淘汰，system=2,rule:1=单循环，2=双循环。备注：其他赛制不用传此参数
        rule: '',
        // system=2时传，循环赛算法：1=贝格尔法，2=蛇形编排，3=顺时针法，4=逆时针法
        arithmetic: '',
        // 赛制说明
        system_memo: '',
        // 分组数
        group_num: '',
        // 晋级或者淘汰：1=晋级，2=淘汰
        rank_or_week: '',
        // 晋级/淘汰人数
        people_num: '',

        // 比赛形式：1=擂台赛，2=对抗赛，3=全队轮赛，4=队际赛；备注：system=4时即比赛制度为擂台赛时不传递此参数
        shape: '',
        // 选择对抗赛时传递此参数：1=单场，2=主客场
        shape_choose: '',
        // 台次设定：1=分台定人制，2=临时定人制，3=全队轮赛制，4=分台换人制（不适用于擂台赛），5=队员总分制
        tai_set: '',
        // 出场次序：针对擂台赛和对抗赛的，其他形式不传递次参数，1=出场次序不可更改，2=出场次序可调整
        ordinal: '',
        // 台数，对抗赛时传递此参数
        tai_num: '',

        // 参赛选手分组：1=按种子分组，2=随机分组，3=同队或同单位限制，4=地区分组
        group_way: '',
        // 参赛选手参赛号：1=按等级分，2=按技术水平分，3=随机分号
        competition_num: '',
        // 比赛形式补充说明
        group_memo: '',
        // 先后手：1=猜先，2=按约定
        before_after: '',
        // 先后手其余轮次：0=未选择，1=按约定
        surplus: 0,

        // 每台赛局数
        sai_num: '',
        // 胜利获得分数
        win_score: '',
        // 平局获得分数
        dogfall_score: '',
        // 失败获得分数
        defeated_score: '',
        // 弃权获得分数
        waiver_score: '',
        // 犯规获得分数
        illegality_score: '',
        // 破同分规则，1=小分，2=违例，3=加塞，4=抽签，5=直胜，6=胜局，7=并列，8=总局分，9=对手分1型，10=对手分2型，11=净胜局数，12=koya system，多个用英文逗号隔开
        ranking_system: '',
      },
      // 淘汰赛规则 1=单败淘汰，2=双败淘汰
      system1Rule: '',
      // 循环赛规则 1=单循环，2=双循环
      system2Rule: '',
      // 擂台赛规则 1=随机出场，2=按约定
      system4Rule: '',
      // 破同分规则，1=小分，2=违例，3=加塞，4=抽签，5=直胜，6=胜局，7=并列，8=总局分，9=对手分1型，10=对手分2型，11=净胜局数，12=koya system，多个用英文逗号隔开
      rankingSystemList: [
        { value: 1, label: '小分' },
        { value: 2, label: '违例' },
        { value: 3, label: '加塞' },
        { value: 4, label: '抽签' },
        { value: 5, label: '直胜' },
        { value: 6, label: '胜局' },
        { value: 7, label: '并列' },
        { value: 8, label: '总局分' },
        { value: 9, label: '对手分1型' },
        { value: 10, label: '对手分2型' },
        { value: 11, label: '净胜局数' },
        { value: 12, label: 'koya system' },
      ],
      rankingSystemList2: [],
      // 破同分规则选择的值
      rankingSystemSelected: [],
    }
  },
  watch: {
    'formData.system'(newValue) {
      console.log(newValue)
      this.system1Rule = ''
      this.system2Rule = ''
      this.system4Rule = ''
      this.formData.arithmetic = ''
      this.formData.system_memo = ''

      if (newValue === 3) {
        // 其他赛制
        this.formData.sai_num = ''
      }
      if (newValue === 1 || newValue === 3) {
        // 淘汰赛 其他赛制
        this.formData.win_score = ''
        this.formData.dogfall_score = ''
        this.formData.defeated_score = ''
        this.formData.waiver_score = ''
        this.formData.illegality_score = ''
        this.rankingSystemList2 = []
        this.rankingSystemList2.push(this.rankingSystemList)
        this.rankingSystemSelected = []
      }
    },
  },
  created() {
    console.log('组件模板 - 第二步 被创建')

    console.log('this.competitionStageInfo', this.competitionStageInfo)
    this.competitionStageNameList = this.competitionStageInfo.stage_name_list
    this.formData.competition_id = this.competitionStageInfo.competition_id
    this.formData.stage_name = this.competitionStageInfo.stage_name
    this.formData.stage = this.competitionStageInfo.stage

    // 存储第 1 项下拉选项需要的数据（选择平分名次排列：优先级从左到右排列（下拉选项））
    this.rankingSystemList2.push(this.rankingSystemList)
  },
  mounted() {
    setTimeout(() => {
      // 初始化日期时间选择器
      // 初始化阶段开始时间
      this.initStageStartDate(this.$refs.stageStartDate)
      // 初始化阶段结束时间
      this.initStageEndDate(this.$refs.stageEndDate)
    }, 100)
  },
  methods: {
    // 测试
    handleTest() {
      console.log('测试')
    },
    // 初始化阶段开始时间
    initStageStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionStageInfo.a_b_t * 1000 + 1000 * 60 + 1, // 最小范围 大于报名开始时间
        max: this.competitionStageInfo.c_e_t * 1000 - 1000 * 60 - 1, // 最大范围 小于比赛结束时间
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
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('阶段开始时间', typeof dateValue, dateValue)
          // 设置阶段开始时间（页面显示用）
          this.stageStartDate = dateValue
          // 设置阶段开始时间（提交数据用）
          this.formData.s_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          // 如果阶段结束时间存在且比阶段开始时间小（或相等）
          if (this.stageEndDate && this.stageEndDate <= this.stageStartDate) {
            // 清空阶段结束时间
            this.stageEndDate = ''
            this.formData.s_e_t = ''
          }
        },
      })
    },
    // 初始化阶段结束时间
    initStageEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionStageInfo.a_b_t * 1000 + 1000 * 60 + 1, // 最小范围 大于报名开始时间
        max: this.competitionStageInfo.c_e_t * 1000 - 1000 * 60 - 1, // 最大范围 小于比赛结束时间
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
          } else if (!this.stageStartDate) {
            // 如果还没有选择阶段开始时间
            layer.msg('请先选择阶段开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.stageStartDate.replace(/-/g, '/'))) {
            // 如果阶段结束时间小于阶段开始时间
            layer.msg('阶段结束时间要大于阶段开始时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('阶段开始时间', typeof dateValue, dateValue)
          // 设置阶段开始时间（页面显示用）
          this.stageEndDate = dateValue
          // 设置阶段开始时间（提交数据用）
          this.formData.s_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''
        },
      })
    },
    // 选择平分名次排列：优先级从左到右排列（下拉选项）
    handleSelectRankingSystem(event, num) {
      const target = event.target || event.srcElement
      const value = target.value * 1

      // 存储选择的第 num 项值
      this.rankingSystemSelected[num] = value
      // 大于第 num 项的值删除掉
      this.rankingSystemSelected = this.rankingSystemSelected.filter((item, index) => index <= num)

      // 存储第 num 项下拉选项需要的数据
      this.rankingSystemList2[num + 1] = this.rankingSystemList.filter((i) => !this.rankingSystemSelected.includes(i.value))
      // 大于第 num + 1 项需要的数据删除掉
      this.rankingSystemList2 = this.rankingSystemList2.filter((item, index) => index <= num + 1)
    },
    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      arr.push(
        { label: '请选择阶段开始时间', validate: !this.formData.s_b_t },
        { label: '请选择阶段结束时间', validate: !this.formData.s_e_t },
        { label: '请选择比赛制度', validate: !this.formData.system }
      )
      if (this.formData.system === 1) {
        arr.push({ label: '请选择淘汰赛规则', validate: !this.system1Rule })
      } else if (this.formData.system === 2) {
        arr.push({ label: '请选择循环赛规则', validate: !this.system2Rule }, { label: '请选择循环赛算法', validate: !this.formData.arithmetic })
      } else if (this.formData.system === 3) {
        arr.push({ label: '请输入其他赛制备注内容', validate: !this.formData.system_memo })
      }
      arr.push(
        { label: '请输入分组数', validate: !this.formData.group_num },
        { label: '分组数必须是大于 0 的整数', validate: this.formData.group_num < 0 || parseInt(this.formData.group_num) < this.formData.group_num },
        { label: '请选择晋级/淘汰', validate: !this.formData.rank_or_week },
        { label: '请输入晋级/淘汰人数', validate: !this.formData.people_num },
        { label: '晋级/淘汰人数必须是大于 0 的整数', validate: this.formData.people_num < 0 || parseInt(this.formData.people_num) < this.formData.people_num },
        { label: '请选择参赛选手分组', validate: !this.formData.group_way },
        { label: '请选择参赛选手参赛号', validate: !this.formData.competition_num },
        { label: '请输入比赛形式补充说明', validate: !this.formData.group_memo },
        { label: '请选择先后手', validate: !this.formData.before_after }
      )

      if (this.formData.system === 1 || this.formData.system === 2) {
        // 淘汰赛或循环赛
        arr.push(
          { label: '请输入每台赛局数', validate: !this.formData.sai_num },
          { label: '每台赛局数必须是大于 0 的整数', validate: this.formData.sai_num < 0 || parseInt(this.formData.sai_num) < this.formData.sai_num }
        )
      }
      if (this.formData.system === 2) {
        // 循环赛
        arr.push(
          { label: '请输入胜利得分', validate: !this.formData.win_score },
          { label: '得分最多 1 位小数', validate: this.formData.win_score.toString().split('.')[1] && this.formData.win_score.toString().split('.')[1].length > 1 },

          { label: '请输入平局得分', validate: !this.formData.dogfall_score },
          { label: '得分最多 1 位小数', validate: this.formData.dogfall_score.toString().split('.')[1] && this.formData.dogfall_score.toString().split('.')[1].length > 1 },

          { label: '请输入失败得分', validate: !this.formData.defeated_score },
          { label: '得分最多 1 位小数', validate: this.formData.defeated_score.toString().split('.')[1] && this.formData.defeated_score.toString().split('.')[1].length > 1 },

          { label: '请输入弃权得分', validate: !this.formData.waiver_score },
          { label: '得分最多 1 位小数', validate: this.formData.waiver_score.toString().split('.')[1] && this.formData.waiver_score.toString().split('.')[1].length > 1 },

          { label: '请输入犯规得分', validate: !this.formData.illegality_score },
          { label: '得分最多 1 位小数', validate: this.formData.illegality_score.toString().split('.')[1] && this.formData.illegality_score.toString().split('.')[1].length > 1 },

          { label: '请至少选择 3 项平分名次排列规则', validate: this.rankingSystemSelected.length < 3 }
        )
      }

      const errorArr = arr.filter((item) => item.validate)
      if (errorArr.length) {
        layer.msg(errorArr[0].label)
      } else {
        return true
      }
    },
    // 下一步
    handleNextStep() {
      // 校验数据
      if (!this._validateFormData()) return

      if (this.formData.system === 1) {
        this.formData.rule = this.system1Rule
      } else if (this.formData.system === 2) {
        this.formData.rule = this.system2Rule
      }

      if (this.formData.system === 2) {
        // 循环赛
        this.formData.ranking_system = this.rankingSystemSelected.toString()
      }

      console.log('this.formData')
      console.table({ ...this.formData })

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
      })

      request({
        url: '/api/competition/push_stage',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')

            if (this.competitionStage.stage === this.competitionStage.stage_all) {
              // 如果是最后一个阶段
              // 跳转到个人赛奖励页面
              location.href = `/bangwen/competitionAwardPersonal.html?competition_id=${this.competitionStage.competition_id}`
            } else {
              // 还有下个阶段
              // 刷新当前页
              location.reload()
            }
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
          } else if (result.code === 205) {
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

// 组件模板 - 第三步
const templateThirdStep = {
  template: '#templateThirdStep',
  data() {},
}

// 组件模板 - 第四步
const templateFourthStep = {
  template: '#templateFourthStep',
  data() {},
}

new Vue({
  el: '#app',
  components: {
    // 组件 - 第一步
    'template-first-step': templateFirstStep,
    // 组件 - 第二步
    'template-second-step': templateSecondStep,
    // 组件 - 第三步
    'template-third-step': templateThirdStep,
    // 组件 - 第四步
    'template-fourth-step': templateFourthStep,
  },
  data() {
    return {
      // url 中的查询字符串转换成的对象
      searchParams: '',
      // 赛事阶段信息
      competitionStageInfo: '',
      // 赛事详情
      competitionDetail: '',
    }
  },
  async created() {
    // 解析 url 中的查询字符串
    this.searchParams = Qs.parse(location.search.substr(1))
    console.log('url 中的查询字符串转换成的对象', { ...this.searchParams })

    if (this.searchParams.competition_id) {
      // 获取总阶段数，当前进行到哪个阶段
      request({
        url: '/api/competition/get_stage_status',
        method: 'post',
        data: { competition_id: this.searchParams.competition_id * 1 },
      }).then((result) => {
        console.log('获取总阶段数，当前进行到哪个阶段', result)
        if (+result.code === 200) {
          this.competitionStageInfo = result.data

          if (this.competitionStageInfo.push_status === 6) {
            // 获取赛事详情，判断赛事是否已支付
            request({
              url: '/api/competitionindex/detail',
              params: { competition_id: this.searchParams.competition_id * 1 },
            }).then((result) => {
              console.log('获取赛事详情，判断赛事是否已支付', result)
              if (+result.code === 200) {
                this.competitionDetail = result.data
              }
            })
          }
        }
      })
    }
  },
  async mounted() {
    // 发布赛事要满足以下条件
    // 1. 实名认证
    // 2. 缴纳保证金
    //      缴纳保证金如果是使用钱包余额支付，要先设置支付密码
    // 3. 剩余发布赛事次数大于 0

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
