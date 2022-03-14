$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      helpList: [],
      ArticleList: [],
      navId: ''
    }
  },
  async created() {
    const res = await request({
      method: 'POST',
      url: '/api/Index/helpCate',
    })
    if (res.code == 200) {
      this.helpList = res.data
      this.navId = res.data[0].child[0].id
    }
    setTimeout(() => {
      this.ongetHelpArticle()
    }, 500);
  },
  methods: {
    onClick(id) {
      this.navId = id
      this.ongetHelpArticle()
    },
    async ongetHelpArticle() {
      const res = await request({
        method: 'POST',
        url: '/api/Index/getHelpArticle',
        data: { c_id: this.navId, page: 1, pagenum: 4 },
      })
      if (res.code == 200) {
        this.ArticleList = res.data.data
      }
    }
  }
})

