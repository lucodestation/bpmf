$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      navList: [],// 热播赛事分类
      navId: '',// 热播赛事id
      matchList: [],// 热播赛事列表
      navsList: [],// 热播课程分类
      navsId: '',// 热播课程id
      courseList: [],// 热播课程列表
      waitList: [],// 直播预告
      liveList: [],// 正在进行直播
    }
  },
  mounted() {
    // 正在进行直播
    request({ url: '/api/Live/livingList', method: 'POST', data: { page: 1, pagenum: 4 } }).then((res) => {
      if (res.code == 200) {
        this.liveList = res.data.data
        setTimeout(() => {
          let swiper = new Swiper(".mySwiper1", {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
          });
          new Swiper(".mySwiper2", {
            spaceBetween: 10,
            thumbs: {
              swiper: swiper,
            },
          });
        }, 500);
      }
    })
    // 直播分类
    request({ url: '/api/Live/liveCates', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.navList = res.data
        this.navList.unshift({ id: '', name: '全部' })
        this.navsList = this.navList
      }
    })
    // 热播赛事
    this.oncompetitionList()
    // 热播课程
    this.competitionList()
    // 直播预告
    request({ url: '/api/Live/waitStartList', method: 'POST', data: { page: 1, pagenum: 8 } }).then((res) => {
      if (res.code == 200) {
        this.waitList = res.data.data
      }
    })
  },
  methods: {
    // 点击热播赛事切换
    onNavClick(id) {
      this.navId = id
      this.oncompetitionList()
    },
    // 热播赛事
    oncompetitionList() {
      request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 1, c_id: this.navId, page: 1, pagenum: 8, status: '' } }).then((res) => {
        if (res.code == 200) {
          this.matchList = res.data.data
        }
      })
    },
    // 点击热播课程切换
    onClick(id) {
      this.navsId = id
      this.competitionList()
    },
    // 热播课程
    competitionList() {
      request({ url: '/api/Live/competitionList', method: 'POST', data: { type: 2, c_id: this.navsId, page: 1, pagenum: 8, status: '' } }).then((res) => {
        if (res.code == 200) {
          this.courseList = res.data.data
        }
      })
    }
  }
})
