$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      newsList: [],// 平台公告
    }
  },
  async created() {
    // 平台公告
    const res = await request({
      method: 'POST',
      url: '/api/Index/noticeList',
      data: { page: 1, pagenum: 4 },
    })
    if (res) {
      this.newsList = res.data.data
    }
  },
})

