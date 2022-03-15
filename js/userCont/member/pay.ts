$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      vipCont: '',// vip的设置信息
      number: '1',// 月
      day: '',// 到期时间
      type: 1,// 类型
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
    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + 30 * this.number);
    let month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
    this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate()
  },
  methods: {
    addClick() {
      this.number++
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + 30 * this.number);
      let month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
      this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate()
    },
    jianClick() {
      if (this.number > 1) {
        this.number--
        var date1 = new Date();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate() + 30 * this.number);
        let month = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
        this.day = date2.getFullYear() + "-" + month + "-" + date2.getDate()
      }
    }
  }
})
