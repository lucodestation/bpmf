$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      number: '',// 购买月份
      type: '',// 类型
      month: '',// 费用
      title: '',
      userCont: '',
      pay_type: '1',// 支付方式 1余额，2支付宝，3微信
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
    const ress = await request({
      method: 'POST',
      url: '/api/Vip/mineVip',
    })
    if (ress.code == 200) {
      this.userCont = ress.data
    }
  },
  methods: {
    // 点击确定
    async onBtnClick() {
      const res = await request({
        method: 'POST',
        url: '/api/Vip/balanceOnMonth',
        data: { type: this.type, num: this.number, pay_type: this.pay_type }
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
      this.number = theRequest.number
      this.type = theRequest.type
    },
  }
})
