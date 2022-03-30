// 发布比赛个人赛赛事奖励

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

const encrypt = new JSEncrypt()

// 我的钱包页面（余额不足需要充值跳到这个页面）
const walletAccountPage = '/userCont/wallet/account.html'
const myReleasedCompetitionPage = '/userCont/competition/myReleasedCompetition.html'

new Vue({
  el: '#app',
  data() {
    return {
      competitionId: '',
      formData: {
        competition_id: '', // 赛事id
        award_type: 1, // 冠亚季
        champion_num: '', // 冠军数量
        champion_money: '', // 冠军奖励金额
        runner_up_num: '', // 亚军数量
        runner_up_money: '', // 亚军奖励金额
        third_winner_num: '', // 季军数量
        third_winner_money: '', // 季军奖励金额
        memo: '', // 奖金备注
        total_money: 0, // 奖金总金额
        trusteeship: '', // 1=托管，2=不托管  备注：选择托管的时候显示支付方式选择，选择不托管不用显示支付方式选择
        pay_way: '', // trusteeship=1的时候传此参数，1=我的钱包，2=支付宝，3=微信
      },
      // 冠军奖金
      championAward: 0,
      // 亚军奖金
      runnerUpAward: 0,
      // 季军奖金
      thirdWinnerAward: 0,

      // 实际支付金额
      payAmount: 0,
      // 支付订单号
      outTradeNo: '',

      // 钱包支付对话框是否显示
      walletPayDialogVisible: false,
      // 支付密码
      payPassword: '',

      // 支付宝支付对话框是否显示
      alipayPayDialogVisible: false,

      // 微信支付对话框是否显示
      wechatPayDialogVisible: false,

      // 获取赛事信息计时器（用于判断是否支付成功）
      getCompetitionDetailTimer: '',
    }
  },
  created() {
    // 解析 url 中的查询字符串
    const searchParams = Qs.parse(location.search.substr(1))
    this.competitionId = searchParams.competition_id * 1
    this.formData.competition_id = searchParams.competition_id * 1
  },
  computed: {
    // 计算属性，为了 watch 时同时监听两个值的变化时处理同一套逻辑
    champion() {
      return { num: this.formData.champion_num, money: this.formData.champion_money }
    },
    runnerUp() {
      return { num: this.formData.runner_up_num, money: this.formData.runner_up_money }
    },
    thirdWinner() {
      return { num: this.formData.third_winner_num, money: this.formData.third_winner_money }
    },
  },
  watch: {
    // 两个值有其中一个值发生变化就会触发 watch
    champion(newValue) {
      if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
        // 都是正整数
        this.championAward = newValue.num * newValue.money
      } else {
        this.championAward = 0
      }
      this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward
    },
    runnerUp(newValue) {
      if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
        // 都是正整数
        this.runnerUpAward = newValue.num * newValue.money
      } else {
        this.runnerUpAward = 0
      }
      this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward
    },
    thirdWinner(newValue) {
      if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
        // 都是正整数
        this.thirdWinnerAward = newValue.num * newValue.money
      } else {
        this.thirdWinnerAward = 0
      }
      this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward
    },
  },
  methods: {
    // 测试
    handleTest() {
      console.log('测试')
    },
    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      arr.push(
        { label: '请输入冠军数量', validate: !this.formData.champion_num },
        { label: '数量必须是大于 0 的整数', validate: this.formData.champion_num < 0 || parseInt(this.formData.champion_num) < this.formData.champion_num },
        { label: '请输入冠军奖励金额', validate: !this.formData.champion_money },
        { label: '奖励金额必须是大于 0 的整数', validate: this.formData.champion_money < 0 || parseInt(this.formData.champion_money) < this.formData.champion_money },

        { label: '请输入亚军数量', validate: !this.formData.runner_up_num },
        { label: '数量必须是大于 0 的整数', validate: this.formData.runner_up_num < 0 || parseInt(this.formData.runner_up_num) < this.formData.runner_up_num },
        { label: '请输入亚军奖励金额', validate: !this.formData.runner_up_money },
        { label: '奖励金额必须是大于 0 的整数', validate: this.formData.runner_up_money < 0 || parseInt(this.formData.runner_up_money) < this.formData.runner_up_money },

        { label: '请输入季军数量', validate: !this.formData.third_winner_num },
        { label: '数量必须是大于 0 的整数', validate: this.formData.third_winner_num < 0 || parseInt(this.formData.third_winner_num) < this.formData.third_winner_num },
        { label: '请输入季军奖励金额', validate: !this.formData.third_winner_money },
        { label: '奖励金额必须是大于 0 的整数', validate: this.formData.third_winner_money < 0 || parseInt(this.formData.third_winner_money) < this.formData.third_winner_money },

        { label: '请选择奖金托管方式', validate: !this.formData.trusteeship }
      )

      if (this.formData.trusteeship === 1) {
        arr.push({ label: '请选择支付方式', validate: !this.formData.pay_way })
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

      if (this.formData.trusteeship === 2) {
        this.formData.pay_way = ''
      }

      console.table({ ...this.formData })

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
      })

      request({
        url: '/api/competition/push_award',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')

            if (!result.data.pay_check) {
              // 不需要支付
              this.$alert('<div style="text-align: center; font-size: 20px;">奖励设置成功</div>', '', {
                confirmButtonText: '确定',
                showClose: false,
                dangerouslyUseHTMLString: true,
                confirmButtonClass: 'orange-button-bg',
                callback: () => {
                  // 跳转到个人赛发布赛事成功页面
                  location.href = `/bangwen/releaseCompetitionSuccess.html?competition_id=${this.competitionId}`
                },
              })
            } else if (result.data.pay_check && +result.data.pay_way === 1) {
              // 1=余额，2=支付宝，3=微信
              this.payAmount = result.data.total_money
              this.outTradeNo = result.data.out_trade_no
              this.walletPayDialogVisible = true
            } else if (result.data.pay_check && +result.data.pay_way === 2) {
              // 1=余额，2=支付宝，3=微信
              this.payAmount = result.data.total_money
              this.outTradeNo = result.data.out_trade_no
              // 打开支付宝支付对话框
              this._openAlipayPayDialog()
            } else if (result.data.pay_check && +result.data.pay_way === 3) {
              // 1=余额，2=支付宝，3=微信
              this.payAmount = result.data.total_money
              this.outTradeNo = result.data.out_trade_no
              // 打开微信支付对话框
              this._openWechatPayDialog()
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
    // 关闭钱包支付对话框
    handleCloseWalletPayDialog() {
      // 跳转到我发布的赛事页面
      location.href = myReleasedCompetitionPage
    },
    // 确认提交钱包支付
    async handleSubmitWalletPay() {
      // /api/pay/pay_by_balance
      if (!this.payPassword) layer.msg('请输入支付密码')

      // 对密码进行加密
      encrypt.setPublicKey(publiukey)
      const payPassword = encrypt.encrypt(this.payPassword) //需要加密的内容

      const payResult = await request({
        url: '/api/pay/pay_by_balance',
        method: 'post',
        data: {
          out_trade_no: this.outTradeNo,
          total_money: this.payAmount,
          pay_pwd: payPassword,
        },
      })
      console.log('payResult', payResult)

      if (+payResult.code === 200) {
        this.$alert('<div style="text-align: center; font-size: 20px;">奖励设置成功</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 跳转到个人赛发布赛事成功页面
            location.href = `/bangwen/releaseCompetitionSuccess.html?competition_id=${this.competitionId}`
          },
        })
      } else if (+payResult.code === 5) {
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
        layer.msg(payResult.msg)
      }
    },

    // 打开支付宝支付对话框
    async _openAlipayPayDialog() {
      // 显示支付宝支付对话框
      this.alipayPayDialogVisible = true

      // 支付宝支付
      // 这里不需要接收返回值，因为啥都没返回
      // 二维码是把请求域名加上请求路径再加上请求参数来生成的
      await request({
        url: '/api/pay/pay_by_ali',
        params: { out_trade_no: this.outTradeNo, total_money: this.payAmount },
      })

      // 警告：this.alipayPayDialogVisible = true 不能放到这里

      // 清除之前生成的二维码
      const alipayPayQrcodeElement = document.getElementById('alipayPayQrcode')
      alipayPayQrcodeElement.innerHTML = ''
      // 生成二维码
      const alipayPayQrcode = new QRCode(alipayPayQrcodeElement, {
        width: 260,
        height: 260,
      })
      // 生成 query 字符串（不带 ?）
      const queryString = Qs.stringify({
        out_trade_no: this.outTradeNo,
        token: localStorage.getItem('token'),
      })
      const codeUrl = baseURL + '/api/pay/pay_by_ali?' + queryString
      alipayPayQrcode.makeCode(codeUrl)

      // 启动获取赛事信息计时器
      this._startGetCompetitionDetailTimer()
    },
    // 关闭支付宝支付对话框
    handleCloseAlipayPayDialog() {
      // 跳转到我发布的赛事页面
      location.href = myReleasedCompetitionPage
    },

    // 打开微信支付对话框
    _openWechatPayDialog() {
      // 显示微信支付对话框
      this.wechatPayDialogVisible = true

      // 微信支付
      request({
        url: '/api/pay/pay_by_wx',
        method: 'post',
        data: {
          out_trade_no: this.outTradeNo,
          total_money: this.payAmount,
        },
      }).then((result) => {
        if (result.code === 200) {
          // 警告：this.wechatPayDialogVisible = true 不能放到这里
          const wechatPayQrcodeElement = document.getElementById('wechatPayQrcode')
          wechatPayQrcodeElement.innerHTML = ''
          // 生成二维码
          const wechatPayQrcode = new QRCode(wechatPayQrcodeElement, {
            width: 260,
            height: 260,
          })
          wechatPayQrcode.makeCode(result.data.code_url)

          // 启动获取赛事信息计时器
          this._startGetCompetitionDetailTimer()
        }
      })
    },
    // 关闭微信支付对话框
    handleCloseWechatPayDialog() {
      // 跳转到我发布的赛事页面
      location.href = myReleasedCompetitionPage
    },

    // 启动获取赛事信息计时器（用于判断是否支付成功）
    _startGetCompetitionDetailTimer() {
      this.getCompetitionDetailTimer = setInterval(() => {
        request({
          url: '/api/competition/competition_detail',
          params: { competition_id: this.competitionId },
        }).then((result) => {
          if (+result.code === 200) {
            if (+result.data.status === 2) {
              // 清除计时器
              clearInterval(this.getCompetitionDetailTimer)
              this.$alert('<div style="text-align: center; font-size: 20px;">奖励设置成功</div>', '', {
                confirmButtonText: '确定',
                showClose: false,
                dangerouslyUseHTMLString: true,
                confirmButtonClass: 'orange-button-bg',
                callback: () => {
                  // 跳转到个人赛发布赛事成功页面
                  location.href = `/bangwen/releaseCompetitionSuccess.html?competition_id=${this.competitionId}`
                },
              })
            }
          }
        })
      }, 3000)
    },
  },
})
