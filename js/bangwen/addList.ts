$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
var encrypt = new JSEncrypt()

//公钥.
const publiukey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'
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
        type: '1',// 1教课，2学课
        title: '',// 标题
        b_id: '',// 服务分类id
        total_money: '',// 总金额
        is_trustee: '1',// 1托管，2不托管
        pay_num_type: '1',// 1一次性付清,2多次付清
        pay_num: '1',// 付款次数
        more_type: '1',// 1均分，2自定义金额
        win_type: '1',// 1单人中榜，2多人中榜
        win_num: '1',// 中榜人数
        task_start_time: '',// 任务开始时间
        task_end_time: '',// 任务结束时间
        signup_start_time: '',// 报名开始时间
        signup_end_time: '',// 报名结束时间
        detail: '',// 榜文详情
        image: '',// 封面（路径如：/uploads/20211216/6d39ccf1e51e8e21a0ba946de64cb8f0.jpg）
        files: '',// 文件（路径如：/uploads/20211216/6d39ccf1e51e8e21a0ba946de64cb8f0.jpg）
        mobile: '',// 手机号
        qq: '',// qq号
        email: '',// 邮箱号
        moneys: '',// 如果是多次付清的自定义金额，如10,5,5
      },
      monthnum: '',
      typeList: [{ id: 1, name: '教课' }, { id: 2, name: '学课' }],// 发布类型
      cateList: [],// 服务分类
      trusteeList: [{ id: 1, name: '托管' }, { id: 2, name: '不托管' }],// 酬金托管
      payList: [{ id: 1, name: '一次付清' }, { id: 2, name: '多次付清' }],// 支付方式
      moreList: [{ id: 1, name: '均分金额' }, { id: 2, name: '自定义金额' }],// 金额列表
      winList: [{ id: 1, name: '单人中榜' }, { id: 2, name: '多人中榜' }],// 中榜模式
      competitionSignUpStartTimeMinValue: new Date().valueOf(),
      ordeList: [],// 多次付清数据
      totalMoney: '',
      num: '',
      pay_type: '1',// 支付方式
      pwd: '',// 支付密码
      coverImage: {},// 封面图
      affixList: [],// 附件列表
      isShow: false,// 是否同意协议
    }
  },
  watch: {
    totalMoney: {
      handler(e, m) {
        if (this.totalMoney == '') {
          if (this.formData.pay_num_type == 2) {
            this.formData.pay_num_type = 1
          }
        }
        this.formData.total_money = this.totalMoney
        this.num = this.totalMoney * 100
        this.formData.moneys = ''
        this.getCouponSelected()
      }
    },
  },
  async created() {
    this.GetRequest()
    const res = await request({
      method: 'POST',
      url: '/api/Bangwen/cate'
    })
    if (res.code == 200) {
      this.cateList = res.data
      this.formData.b_id = res.data[0].id;
    }
    // 报名起始时间
    layui.laydate.render({
      elem: '#signUpStartDate', //指定元素
      theme: '#FF7F17', // 主题颜色
      btns: ['clear', 'confirm'], // 显示的按钮
      min: this.competitionSignUpStartTimeMinValue, // 最小范围
      // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
      change: (value, date) => { },
      // 点击清空、现在、确定都会触发
      done: (value, date) => {
        this.formData.task_start_time = value
        if (value) {
          initSignUpEndDate()
        }
      },
    })
    // 初始化报名结束时间
    const initSignUpEndDate = () => {
      // 报名结束时间
      layui.laydate.render({
        elem: '#signUpEndDate', //指定元素
        theme: '#FF7F17', // 主题颜色
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionSignUpStartTimeMinValue, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          let dateValue = value
          if (!value) {
            dateValue = ''
          } else if (new Date(this.formData.task_start_time) > new Date(dateValue)) {
            console.log('报名截止日期不能小于报名起始日期')
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '报名截止日期不能小于报名起始日期'
              , btn: ['重新选择']
            });
            dateValue = ''
          }
          this.formData.task_end_time = dateValue
        },
      })
    }
    // 报名起始时间
    layui.laydate.render({
      elem: '#startDate1', //指定元素
      theme: '#FF7F17', // 主题颜色
      btns: ['clear', 'confirm'], // 显示的按钮
      min: this.competitionSignUpStartTimeMinValue, // 最小范围
      // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
      change: (value, date) => { },
      // 点击清空、现在、确定都会触发
      done: (value, date) => {
        this.formData.signup_start_time = value
        if (value) {
          initSignUpEndDate1()
        }
      },
    })
    // 初始化报名结束时间
    const initSignUpEndDate1 = () => {
      // 报名结束时间
      layui.laydate.render({
        elem: '#endDate2', //指定元素
        theme: '#FF7F17', // 主题颜色
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionSignUpStartTimeMinValue, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          let dateValue = value
          if (!value) {
            dateValue = ''
          } else if (new Date(this.formData.task_start_time) > new Date(dateValue)) {
            console.log('报名截止日期不能小于报名起始日期')
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '报名截止日期不能小于报名起始日期'
              , btn: ['重新选择']
            });
            dateValue = ''
          }
          this.formData.signup_end_time = dateValue
        },
      })
    }
    // 初始化选择封面图
    this.initCoverImageFileChange()
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
    // 点击是否同意协议
    onXuanzhongClick() {
      this.isShow = this.isShow == 0 ? 1 : 0
    },
    // 初始化选择封面图
    initCoverImageFileChange() {
      layui.upload.render({
        elem: '#uploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        // accept: 'image', // 指定允许上传时校验的文件类型
        // acceptMime: '.jpg,.png,.bmp,.jpeg,.webp', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        // exts: 'jpg|png|bmp|jpeg|webp', // 允许上传的文件后缀。一般结合 accept 参数类设定。
        size: 0, // 设置文件最大可允许上传的大小，单位 KB，0 表示不限制
        multiple: false, // 是否允许多文件上传, 默认 false
        // 选择文件回调
        choose: (result) => {
          console.log(result)
          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
          result.preview((index, file, result) => {
            // console.log(index) //得到文件索引
            // console.log(file) //得到文件对象
            // console.log(result) //得到文件base64编码，比如图片

            this.coverImage = {
              file,
              url: result,
            }
            console.log(this.coverImage)
          })
        },
      })
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
        // 做多上传 5 个文件
        if (tempArr.length < 5) {
          const filesNameList = this.affixList.length ? this.affixList.map((i) => i.name) : []
          // （如果不存在文件名）禁止添加同名文件
          if (!filesNameList.includes(item.name)) {
            console.log(item)
            if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
              if (!errorArr.includes(util.getExtensionName(item.name))) {
                errorArr.push(util.getExtensionName(item.name))
              }
            } else if (item.size > 2048 * 1024) {
              if (!errorArr2.includes(item.name)) {
                errorArr2.push(item.name)
              }
            } else if (tempArr.length < 5) {
              tempArr.push(item)
            }
          }
        }
      }

      console.log('tempArr', tempArr.length, tempArr)

      if (tempArr.length < 5 && errorArr.length) {
        console.log('errorArr', errorArr)
        layer.open({
          type: 0,
          icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
          title: '不受支持的文件类型',
          content: '您选择的 ' + [...errorArr] + ' 类型的文件不受支持',
          btn: ['重新选择'],
        })
      } else if (errorArr2.length) {
        console.log('errorArr2', errorArr2)
        layer.open({
          type: 0,
          icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
          title: '文件过大',
          content: '请选择 2M 以内的文件',
          btn: ['重新选择'],
        })
      }

      this.affixList = tempArr
      element.value = ''
      console.log({ ...this.affixList })
    },
    // 删除附件
    handleDeleteAffix(index) {
      this.affixList = this.affixList.filter((item, ind) => index !== ind)
    },
    // 点击支付方式判断
    getpaynumSelected() {
      if (this.totalMoney == '') {
        if (this.formData.pay_num_type == 2) {
          layer.msg('酬金额度不能为空')
          this.formData.pay_num_type = 1
        }
      }
      if (this.formData.pay_num_type == 1) {
        this.formData.pay_num = 1
        this.formData.more_type = 1
        this.formData.moneys = ''
      }
    },
    // 支付方式多次支付计算
    getCouponSelected() {
      let arr = []
      let num = 0
      let month = Math.floor(this.formData.total_money / this.formData.pay_num * 100) / 100  // 平分
      for (let i = 1; i <= this.formData.pay_num; i++) {
        num = num + month
        arr.push({ id: i, num: month })
      }
      // 判断平分数据和是否等于酬金额度，如果不相等最后一个价格重新计算
      if (num != this.formData.total_money) {
        arr[arr.length - 1].num = (month + (this.formData.total_money - num)).toFixed(2)
      }
      this.ordeList = arr
      let arr1 = []
      for (let i in arr) {
        arr1.push(arr[i].num)
      }
      this.formData.moneys = arr1.toString()
    },
    // 提交
    async onBtnClick() {

      if (!this.formData.title) return layer.msg('请输入标题')
      if (!this.formData.total_money) return layer.msg('请输入金额')
      if (!this.formData.detail) return layer.msg('请输入榜文详情')
      if (this.isShow == 0) return layer.msg('请阅读并同意协议')
      this.formData.image = await util
        .uploadFile({
          file: this.coverImage.file,
          fileName: this.coverImage.file.name,
        })
        .catch((error) => {
          console.log('上传封面图失败', error)
          layer.msg('上传封面图失败')
        })
      if (!this.formData.image) return

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
          layer.msg('上传附件失败')
        })
      if (!affixUrlArr) return
      this.formData.files = affixUrlArr.toString()
      if (this.formData.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.formData.mobile)) return layer.msg('请输入正确的手机号')
      }
      if (this.formData.qq) {
        var qq = "[1-9][0-9]{4,14}"
        if (!qq.test(this.formData.qq)) return layer.msg('请输入正确QQ号')
      }
      if (this.formData.email) {
        var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if (!email.test(this.formData.email)) return layer.msg('请输入正确邮箱')
      }
      // for (let i = 0; i <= this.ordeList.length; i++) {
      //   if (this.ordeList[i].num == 0 || this.ordeList[i].num == '') {
      //     return layer.msg('多次支付里面金额不能为空')
      //   }
      // }
      const res = await request({
        method: 'POST',
        url: '/api/Bangwen/pushBangwen',
        data: this.formData,
      })
      if (res.code == 200) {
        window.location.href = `/bangwen/success.html`
        layer.msg('发布成功')
        // this.cateList = res.data
        // this.formData.b_id = res.data[0].id;
      } else if (res.code == 206) {
        syalert.syopen('bondCont')
      } else {
        layer.msg(res.msg)
      }
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
      if (theRequest.type) {
        this.formData.type = theRequest.type
      }
    },
  }
})
