$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      newsList: []
    }
  },
  async created() {
    const res = await request({
      method: 'POST',
      url: '/api/Index/cooperateList',
      data: { page: 1, pagenum: 10 },
    })
    if (res) {
      this.newsList = res.data.data
    }

  },
})

