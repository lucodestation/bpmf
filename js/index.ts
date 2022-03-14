function ok(id) {
  syalert.syhide(id)
}
$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      newsList: [],// 平台公告
      articleList: [],// 玻说坡话列表
      partnerList: [],// 合作机构
    }
  },
  async created() {
    // 平台公告
    const res = await request({
      method: 'POST',
      url: '/api/Index/noticeList',
      data: { page: 1, pagenum: 1 },
    })
    if (res) {
      this.newsList = res.data.data
    }
    // 18展位图
    const ress = await request({
      method: 'POST',
      url: '/api/Index/eighteen',
    })
    // 玻说坡话列表
    const articleList = await request({
      method: 'POST',
      url: '/api/Index/articleList',
      data: { page: 1, pagenum: 4 },
    })
    if (articleList) {
      this.articleList = articleList.data.data
    }
    // 合作机构
    const partnerList = await request({
      method: 'POST',
      url: '/api/Index/partner',
    })
    if (partnerList) {
      this.partnerList = partnerList.data
    }

    new Swiper('.mySwiper', {
      pagination: {
        el: '.swiper-pagination',
      },
      autoplay: true,
    })
  },
})

