$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})

var encrypt = new JSEncrypt()
//公钥.
const publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'

new Vue({
  el: '#app',
  data() {
    return {
      vipCont: '',// vip的设置信息
      number: '1',// 月
      day: '',// 到期时间
      type: 1,// 类型
      userCont: '',// 用户信息
      UnitPrice: '',// 单价
      Totalprice: '',// 总价
      one_type: '',// 单次购买：1购买直播次数，2购买榜文次数；3购买赛事次数
      num: 1,// 购买次数
      pay_type: '1',// 购买次数支付方式
      pwd: '',// 支付密码
    }
  },
  async created() {
    // vip的设置信息
    const res = await request({
      method: 'POST',
      url: '/api/Vip/buyInfo',
    })
    if (res.code == 200) {
      this.vipCont = res.data
    }
    // 获取用户信息
    const ress = await request({
      method: 'POST',
      url: '/api/Vip/mineVip',
    })
    if (ress.code == 200) {
      this.userCont = ress.data
    }
    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 30 * this.number);
    let month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
    this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate()
  },
  methods: {
    // 点击购买次数
    ontqClick(e) {
      this.one_type = e
      if (e == 1) {
        this.UnitPrice = this.vipCont.onelive_money
        this.Totalprice = this.vipCont.onelive_money * this.num
      } else if (e == 2) {
        this.UnitPrice = this.vipCont.onebang_money
        this.Totalprice = this.vipCont.onebang_money * this.num
      } else if (e == 3) {
        this.UnitPrice = this.vipCont.onematch_money
        this.Totalprice = this.vipCont.onematch_money * this.num
      }
      syalert.syopen('userNumber')
    },
    // 购买次数加
    onAddClick() {
      this.num++
      this.Totalprice = (this.UnitPrice * this.num).toFixed(2)
    },
    // 购买次数减
    onJianClick() {
      if (this.num > 1) {
        this.num--
        this.Totalprice = (this.UnitPrice * this.num).toFixed(2)
      }
    },
    // 购买次数确定
    async onPayClick() {
      if (this.pay_type == '1') {
        if (!this.pwd) return layer.msg('请输入密码')
      }
      const res = await request({
        method: 'POST',
        url: '/api/Vip/onNumRefer',
        data: { one_type: this.one_type, num: this.num, pay_type: this.pay_type }
      })
      if (res.code == 200) {
        if (this.pay_type == '1') {
          encrypt.setPublicKey(publiukey)
          // 加密
          const pwd = encrypt.encrypt(this.pwd) //需要加密的内容
          const ress = await request({
            method: 'POST',
            url: '/api/Vip/numBalancePay',
            data: { out_trade_no: res.data.out_trade_no, pay_pwd: pwd }
          })
          if (ress.code == 200) {
            layer.msg('支付成功')
            syalert.syhide('userNumber')
          } else {
            layer.msg(ress.msg)
          }
        }
        if (this.pay_type == '2') {
          const ress = await request({
            method: 'POST',
            url: '/api/Vip/numAliPay',
            data: { out_trade_no: res.data.out_trade_no }
          })
          if (ress.code == 200) {
            // layer.msg('支付成功')
            // syalert.syhide('userNumber')
          } else {
            layer.msg(ress.msg)
          }
        }
        if (this.pay_type == '3') {
          const ress = await request({
            method: 'POST',
            url: '/api/Vip/numWxPay',
            data: { out_trade_no: res.data.out_trade_no }
          })
          if (ress.code == 200) {
            // layer.msg('支付成功')
            location.href = ress.data.code_url
            syalert.syhide('userNumber')
          } else {
            layer.msg(ress.msg)
          }
        }
      }
    },
    // 时长加
    addClick() {
      this.number++
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + 30 * this.number);
      let month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
      this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate()
    },
    // 时长减
    jianClick() {
      if (this.number > 1) {
        this.number--
        var date1 = new Date();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate() + 30 * this.number);
        let month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
        this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate()
      }
    },
    // 点击购买
    onGoClick() {
      location.href = './pay.html?number=' + this.number + '&type=' + this.type
    }
  }
})
