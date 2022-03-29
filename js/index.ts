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
      newsList: [], // 平台公告
      articleList: [], // 玻说坡话列表
      partnerList: [], // 合作机构
      bangwenJkList: [],// 最新榜文-教课
      bangwenXkList: [],// 最新榜文-学课
      liveKcList: [],// 直播推荐-课程直播
      liveSsList: [],// 直播推荐-赛事直播
    }
  },
  created() {
    // 平台公告
    request({ url: '/api/Index/noticeList', method: 'POST', data: { page: 1, pagenum: 1 } }).then((res) => {
      if (res.code == 200) {
        this.newsList = res.data.data
      }
    })
    // 18展位图
    request({ url: '/api/Index/eighteen', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        // this.newsList = res.data.data
      }
    })
    // 最新榜文-教课
    request({ url: '/api/Bangwen/list', method: 'POST', data: { page: 1, pagenum: 7, type: 1, sort: 1 } }).then((res) => {
      if (res.code == 200) {
        this.bangwenJkList = res.data.data
      }
    })
    // 最新榜文-学课
    request({ url: '/api/Bangwen/list', method: 'POST', data: { page: 1, pagenum: 7, type: 2, sort: 1 } }).then((res) => {
      if (res.code == 200) {
        this.bangwenXkList = res.data.data
      }
    })
    // 直播推荐-课程直播
    request({ url: '/api/Live/competitionList', method: 'POST', data: { page: 1, pagenum: 7, type: 1 } }).then((res) => {
      if (res.code == 200) {
        this.liveKcList = res.data.data
      }
    })
    // 直播推荐-赛事直播
    request({ url: '/api/Live/competitionList', method: 'POST', data: { page: 1, pagenum: 7, type: 2 } }).then((res) => {
      if (res.code == 200) {
        this.liveSsList = res.data.data
      }
    })
    // 玻说坡话列表
    request({ url: '/api/Index/articleList', method: 'POST', data: { page: 1, pagenum: 4 } }).then((res) => {
      if (res.code == 200) {
        this.articleList = res.data.data
      }
    })
    // 合作机构
    request({ url: '/api/Index/partner', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.partnerList = res.data
      }
    })

    new Swiper('.mySwiper', {
      pagination: {
        el: '.swiper-pagination',
      },
      autoplay: true,
    })
  },
})
