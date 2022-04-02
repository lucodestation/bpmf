$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
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
new Vue({
  el: '#app',
  data() {
    return {
      id: '',
      cateList: [],// 棋分类
      noticeCont: '',// 详情内容
      name: '',// 棋名
      userList: [],// 应榜人列表
      selectList: [],// 中榜列表
      terminateTaskVisible: false,// 终止任务弹框是否显示
      reason: '',// 终止原因
      phone: '',// 联系方式
      order_id: '',
      depositDialogVisible: false,// 开始学课对话框
      depositDialogShow: false,
      walletPayDialogVisible: false,// 钱包支付对话框
      alipayPayDialogVisible: false,// 支付宝支付对话框
      wechatPayDialogVisible: false,// 微信支付对话框
      depositAmount: '',// 课时费
      payMethod: 1,// 支付方式
      payAmount: '',// 实际费用
      payPassword: '',// 支付密码
      order_num: '',// 订单号
      out_trade_no: ''
    }
  },
  created() {
    this.GetRequest()
    request({ method: 'POST', url: '/api/Bangwen/cate' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
      }
    })
    this.onNotice()
    this.onselectList()
  },
  methods: {
    // 请求页面数据
    onNotice() {
      request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: { bangwen_id: this.id }, }).then((res) => {
        if (res.code == 200) {
          this.noticeCont = res.data
          for (let i in this.cateList) {
            if (this.cateList[i].id == res.data.b_id) {
              this.name = this.cateList[i].name
            }
          }
        }
      })
      request({ url: '/api/Bangwenpush/attendList', method: 'post', data: { bangwen_id: this.id }, }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data
        }
      })
    },
    onDelClick() {
      syalert.syopen('noticeDelCont')
    },
    // 删除数据
    onDelqueryClick() {
      request({ url: '/api/Bangwenpush/delete', method: 'post', data: { bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('删除成功')
          syalert.syhide('noticeDelCont')
          window.history.go(-1)
        } else {
          layer.msg(res.msg)
        }
      })
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
      this.id = theRequest.id
    },
    // 点击中榜
    onZbClick(item) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('确定要中榜吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          that.onSelection(item)
        });
      });
    },
    // 点击中榜请求数据
    onSelection(item) {
      request({ url: '/api/Bangwenpush/select', method: 'post', data: { order_id: item.id, bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('中榜成功')
          this.onNotice()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 取消中榜
    onQueryClick(id) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('确定要取消中榜吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          that.cancelSelect(id)
        });
      });
    },
    // 点击取消中榜请求数据
    cancelSelect(item) {
      request({ url: '/api/Bangwenpush/cancelSelect', method: 'post', data: { order_id: item, bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('中榜成功')
          this.onNotice()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 此处是学棋榜文，不托管  开始学习
    onStudyClick(id) {
      request({ url: '/api/bangwenpush/beginLearnUnmanaged', method: 'post', data: { order_id: id } }).then((res) => {
        if (res.code == 200) {
          // layer.msg('中榜成功')
          // this.onselectList()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    onselectList() {
      request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.id }, }).then((res) => {
        if (res.code == 200) {
          res.data.map(item => {
            item.detail.map((items, k) => {
              items.num = k + 1
              item.blList = this.group(item.detail, 3)
            })
          })
          this.selectList = res.data
          console.log(this.selectList)
        }
      })
    },
    // 点击终止任务
    onterminateTaskClick(id) {
      this.order_id = id
      this.terminateTaskVisible = true
    },
    // 点击终止任务关闭按钮
    onterminateTaskQuery() {
      this.order_id = ''
      this.terminateTaskVisible = false
    },
    // 点击终止任务请求数据
    onzzClick() {
      request({ url: '/api/Bangwenpush/pushReferEnd', method: 'POST', data: { order_id: this.order_id, reason: this.reason, phone: this.phone }, }).then((res) => {
        if (res.code == 200) {

        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 点击学棋开始学习按钮托管(未生成订单)
    onStudytgClick(item) {
      this.depositDialogVisible = true
      this.depositAmount = item.total_money
      this.order_id = item.id
    },
    // 点击学棋开始学习按钮托管（生成订单未支付)
    onpayClick(item) {
      this.depositDialogShow = true
      this.depositAmount = item.total_money
      this.order_num = item.order_num
    },
    // 关闭学棋开始学习弹框页面
    handleCloseDepositDialog() {
      this.depositDialogVisible = false
      this.depositAmount = ''
      this.order_id = ''
    },
    // 确定支付开始学课费用
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
    // 开始学课重新生成对话框关闭按钮
    handleCloseDeposit() {
      this.order_num = ''
      this.depositDialogShow = false
    },
    // 开始学课重新生成对话框确定按钮
    async PayDeposit() {
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
    // 钱包支付
    async _walletPay() {
      // 开始学课--提交请求（获取订单号和实际支付金额）
      const depositReferResult = ''
      if (this.order_num) {
        depositReferResult = await request({
          url: '/api/Mine/payNow',
          method: 'post',
          data: { pay_type: 1, order_num: this.order_num },
        })
      } else {
        depositReferResult = await request({
          url: '/api/Bangwenpush/beginLearnManaged',
          method: 'post',
          data: { pay_type: 1, order_id: this.order_id },
        })
      }

      if (+depositReferResult.code === 200) {
        // 关闭保证金对话框
        this.depositDialogVisible = false
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        this.out_trade_no = depositReferResult.data.order_num
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
    // 点击钱包关闭弹框
    handleCloseWalletPayDialog() {
      this.walletPayDialogVisible = false
    },
    // 点击钱包确定按钮
    async handleSubmitWalletPay() {
      if (!this.payPassword) layer.msg('请输入支付密码')

      // 对密码进行加密
      encrypt.setPublicKey(publiukey)
      const payPassword = encrypt.encrypt(this.payPassword) //需要加密的内容

      // 开始学课--钱包支付
      const payResult = await request({
        url: '/api/Bangwenpush/balancePay',
        method: 'post',
        data: { order_num: this.out_trade_no, pay_pwd: payPassword },
      })

      if (+payResult.code === 200) {
        this.$alert('<div style="text-align: center; font-size: 20px;">支付成功</div>', '', {
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

      // 开始学课--提交请求（获取订单号和实际支付金额）
      const depositReferResult = ''
      if (this.order_num) {
        depositReferResult = await request({
          url: '/api/Mine/payNow',
          method: 'post',
          data: { pay_type: 2, order_num: this.order_num },
        })
      } else {
        depositReferResult = await request({
          url: '/api/Bangwenpush/beginLearnManaged',
          method: 'post',
          data: { pay_type: 2, order_id: this.order_id },
        })
      }

      if (+depositReferResult.code === 200) {
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        // 显示支付宝支付对话框
        this.alipayPayDialogVisible = true

        // 开始学课--支付宝支付
        // 这里不需要接收返回值，因为啥都没返回
        // 二维码是把请求域名加上请求路径再加上请求参数来生成的
        await request({
          url: '/api/Bangwenpush/aliPay',
          params: { order_num: depositReferResult.data.order_num },
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
          order_num: depositReferResult.data.order_num,
          token: localStorage.getItem('token'),
        })
        const codeUrl = baseURL + '/api/Bangwenpush/aliPay?' + queryString
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
      // this.depositDialogVisible = true
    },

    // 微信支付
    async _wechatPay() {
      // 关闭保证金对话框
      this.depositDialogVisible = false

      // 开始学课--提交请求（获取订单号和实际支付金额）
      const depositReferResult = ''
      if (this.order_num) {
        depositReferResult = await request({
          url: '/api/Mine/payNow',
          method: 'post',
          data: { pay_type: 3, order_num: this.order_num },
        })
      } else {
        depositReferResult = await request({
          url: '/api/Bangwenpush/beginLearnManaged',
          method: 'post',
          data: { pay_type: 3, order_id: this.order_id },
        })
      }

      if (+depositReferResult.code === 200) {
        // 实际支付金额
        this.payAmount = depositReferResult.data.money
        // 显示微信支付对话框
        this.wechatPayDialogVisible = true

        // 开始学课--微信支付
        const payResult = await request({
          url: '/api/Bangwenpush/wxPay',
          method: 'post',
          data: { order_num: depositReferResult.data.order_num },
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
      // this.depositDialogVisible = true
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
              // this.$alert('<div style="text-align: center; font-size: 20px;">保证金缴纳成功</div>', '', {
              //   confirmButtonText: '确定',
              //   showClose: false,
              //   dangerouslyUseHTMLString: true,
              //   confirmButtonClass: 'orange-button-bg',
              //   callback: () => {
              //     if (payMethod === 'alipay') {
              //       this.alipayPayDialogVisible = false
              //     } else if (payMethod === 'wechat') {
              //       this.wechatPayDialogVisible = false
              //     }
              //   },
              // })
            } else {
              console.log('保证金', +result.data.deposit)
            }
          }
        })
      }, 3000)
    },
    // 点击完成教课
    onfinishTeachClick(item) {
      request({ url: '/api/Bangwenattend/finishTeach', method: 'POST', data: { detail_id: item.detail_id }, }).then((res) => {
        if (res.code == 200) {
          layer.msg('已完成教课')
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 数组重构
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    },
  }
})
