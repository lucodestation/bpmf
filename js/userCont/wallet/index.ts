$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      userCont: '',// 个人信息
    }
  },
  created() {
    request({ url: '/api/Mine/info', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.userCont = res.data
      }
    })
  },
  methods: {}
})
