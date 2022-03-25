$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      newsCont: '',
    }
  },
  async created() {
    const res = await request({
      method: 'POST',
      url: '/api/Login/setting',
    })
    if (res) {
      this.newsCont = res.data
    }
  },
  methods: {

  }
})

