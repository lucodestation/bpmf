$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      newsList: [],// 玻说坡话
    }
  },
  async created() {
    // 玻说坡话
    const res = await request({
      method: 'POST',
      url: '/api/Index/articleList',
      data: { page: 1, pagenum: 4 },
    })
    if (res) {
      this.newsList = res.data.data
    }
  },
})

