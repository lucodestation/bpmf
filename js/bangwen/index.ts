$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      bangList: [],// 教课榜文列表
    }
  },
  async created() {
    // 教课榜文列表
    const res = await request({
      method: 'POST',
      url: '/api/Bangwen/list',
      data: { page: 1, pagenum: 7, type: 1 },
    })
    if (res) {
      this.bangList = res.data.data
    }
  },
})
