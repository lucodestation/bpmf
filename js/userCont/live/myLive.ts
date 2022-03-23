$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      pushList: []
    }
  },
  mounted() {
    request({ url: '/api/Live/pushList', method: 'POST', data: { page: 1, pagenum: 10, type: '' } }).then((res) => {
      if (res.code == 200) {
        res.data.data.map(item => {
          var date1 = new Date((item.end_time + ':00').replace(/\-/g, "/"));    //开始时间
          var date2 = new Date(item.start_time.replace(/\-/g, "/") + ':00');    //结束时间
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
          var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
          var seconds = Math.round(leave3 / 1000)
          console.log(days + "天" + hours + "时" + minutes + "分" + seconds + "秒")
          item.fen = days * 24 + hours * 60 + minutes
          console.log(days * 24 + hours * 60 + minutes)
        })
        this.pushList = res.data.data
      }
    })
  },
  methods: {

  }
})
