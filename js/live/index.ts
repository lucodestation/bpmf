$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      navList: [],// 热播赛事分类
      navId: '',// 热播赛事id
      matchList: [],// 热播赛事列表
      courseList: [],// 热播课程列表
      waitList: [],// 直播预告
    }
  },
  mounted() {
    // 直播分类
    request({ url: '/api/Live/liveCates', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.navList = res.data
        this.navList.unshift({ id: '', name: '全部' })
      }
    })
    // 热播赛事
    request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 1, c_id: this.navId, page: 1, pagenum: 8, status: '' } }).then((res) => {
      if (res.code == 200) {
        this.matchList = res.data.data
      }
    })
    // 热播课程
    request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 2, c_id: this.navId, page: 1, pagenum: 8, status: '' } }).then((res) => {
      if (res.code == 200) {
        this.courseList = res.data.data
      }
    })
    // 直播预告
    request({ url: '/api/Live/waitStartList', method: 'POST', data: { page: 1, pagenum: 8 } }).then((res) => {
      if (res.code == 200) {
        this.waitList = res.data.data
      }
    })
    // this.aa()
  },
  methods: {
    aa() {
      // let that = this
      // that.num = 2
      // $.ajax({
      //   method: 'POST',
      //   url: that.baseUrl + '/front/ali/pcPay',
      //   data: { orderNo: that.order },
      //   success: function (res) {
      //     if (res.code == 200) {
      this.inhtml = '<form id=\'alipaysubmit\' name=\'alipaysubmit\' action=\'https://openapi.alipay.com/gateway.do?charset=UTF-8\' method=\'POST\'><input type=\'hidden\' name=\'biz_content\' value=\'{"productCode":"QUICK_WAP_WAY","body":"发布赛事费用","subject":"发布赛事费用","out_trade_no":"c-202203244856974938","total_amount":"0.01","timeout_express":"5m"}\'/><input type=\'hidden\' name=\'app_id\' value=\'2021002102656262\'/><input type=\'hidden\' name=\'version\' value=\'1.0\'/><input type=\'hidden\' name=\'format\' value=\'json\'/><input type=\'hidden\' name=\'sign_type\' value=\'RSA2\'/><input type=\'hidden\' name=\'method\' value=\'alipay.trade.wap.pay\'/><input type=\'hidden\' name=\'timestamp\' value=\'2022-03-24 10:38:23\'/><input type=\'hidden\' name=\'alipay_sdk\' value=\'alipay-sdk-php-20180705\'/><input type=\'hidden\' name=\'notify_url\' value=\'http://bpmf.duowencaiwu.com/api/pay/ali_notify\'/><input type=\'hidden\' name=\'return_url\' value=\'http://bpmf.duowencaiwu.com/return_url.html\'/><input type=\'hidden\' name=\'charset\' value=\'UTF-8\'/><input type=\'hidden\' name=\'sign\' value=\'KS6d891QtBIcS6cbMCvYFM9lp0cYp9k8K8TbTRck84SWhQRDoYejGXCUu6K57ICDXxy6ycLMdRI0tUQ9Wo95GDKhgi+o3H0kYTn5ZCCE80L3iL1HjH3IU7w2s7R8wH+h1N63QUXHjMuEMY8XilvXeKvHRjWplf77OsTr4C4eR38ov1SG4H5AFTp+nzlcpexp4btR0Y8ztMiT1b7Q753I83LiFiEPrnlTOLNTs2o7+YFdIvaFJ015QMz6f8v2hb/fLOwVdUhxTcF4TiKmSdWPo5Rhr00P94wqxFq9gVsrYrOH1msAzcWjZK2ScHO4p2mIp+aXRxlVQ4LhH2oaETW5lg==\'/><input type=\'submit\' value=\'ok\' style=\'display:none;\'\'></form><script>document.forms[\'alipaysubmit\'].submit();</script>'
      //支付宝支付
      // 添加之前先删除一下，如果单页面，页面不刷新，添加进去的内容会一直保留在页面中，二次调用form表单会出错
      let divForm = document.getElementsByTagName('divform')
      if (divForm.length) {
        document.body.removeChild(divForm[0])
      }
      const div = document.createElement('divform');
      div.innerHTML = this.inhtml; // data就是接口返回的form 表单字符串
      document.body.appendChild(div);
      document.forms[0].submit();
    }
  }
})
