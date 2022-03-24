$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      navList: [{ id: '', name: '全部' }, { id: 1, name: '热播赛事' }, { id: 2, name: '热播直播' }],// 直播种类
      navId: '',// 直播种类id
      cateList: [],// 筛选
    }
  },
  mounted() {
    request({ url: '/api/Live/liveCates', method: 'post' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
      }
    })
    this.oncompetitionList()
  },
  methods: {
    // 点击直播种类切换
    onNavClick(id) {
      this.navId = id
      this.oncompetitionList()
    },
    // 列表数据
    oncompetitionList() {
      request({ url: '/api/Live/competitionList', method: 'post', data: { type: this.navId, c_id: '', page: 1, pagenum: 16, status: '' } }).then((res) => {
        if (res.code == 200) {
          this.liveList = res.data.data
        }
      })
    }
  }
})
