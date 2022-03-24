$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      id: '',// id
      dateTime: '',// 时间
      noticeCont: '',// 详情
      adverList: [],// 广告
    }
  },
  mounted() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.id = searchParams.id
    this.onpushList()
    request({ url: 'api/Live/adverList', method: 'POST', data: { live_id: this.id } }).then((res) => {
      if (res.code == 200) {
        this.adverList = res.data
      }
    })
  },
  methods: {
    // 列表数据
    onpushList() {
      request({ url: '/api/Live/detail', method: 'POST', data: { live_id: this.id } }).then((res) => {
        if (res.code == 200) {

          var date1 = new Date((res.data.end_time + ':00').replace(/\-/g, "/"));    //开始时间
          var date2 = new Date(res.data.start_time.replace(/\-/g, "/") + ':00');    //结束时间
          var date3 = date1.getTime() - date2.getTime(); //时间差秒
          //计算出相差天数
          var days = Math.floor(date3 / (24 * 3600 * 1000))
          //计算出小时数
          var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
          var hours = Math.floor(leave1 / (3600 * 1000))
          //计算相差分钟数
          var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave2 / (60 * 1000))
          //计算相差秒数
          // var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
          // var seconds = Math.round(leave3 / 1000)
          this.dateTime = days * 24 * 60 + hours * 60 + minutes
          // })
          this.noticeCont = res.data
        }
      })
    }
  }
})
