$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      xueList: [],// 学课
      bangList: [],// 教课榜文列表
    }
  },
  async created() {
    // 学课榜文列表
    const res = await request({
      method: 'POST',
      url: '/api/Bangwen/list',
      data: { page: 1, pagenum: 7, type: 2 },
    })
    if (res) {
      this.xueList = res.data.data
    }
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
