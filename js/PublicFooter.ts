new Vue({
  el: '#publicFooter',
  data() {
    return {
      // 网站信息
      siteInfo: '',
    }
  },
  async created() {
    const result = await request({
      url: '/api/Index/comInfo',
    })
    if (result) {
      this.siteInfo = result.data
    }
  },
})
