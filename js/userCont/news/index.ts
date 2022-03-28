$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})

new Vue({
  el: '#app',
  data() {
    return {
      newsList: []
    }
  },
  created() {
    // 获取个人信息
    request({ url: '/api/Message/sysMessageList', method: 'POST', data: { page: 1, pagenum: 10 } }).then((res) => {
      if (res.code == 200) {
        this.newsList = res.data.data
      }
    })
  },
  methods: {

  }
})
