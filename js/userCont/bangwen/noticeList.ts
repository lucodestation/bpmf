$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
jeDate("#dateS", {
  format: "MM-DD-YYYY"
});
jeDate("#dateE", {
  format: "MM-DD-YYYY"
});
new Vue({
  el: '#app',
  data() {
    return {
      nameList: [{ id: '1', title: '教棋榜文' }, { id: '2', title: '学棋榜文' }],
      type: 1,
      navList: [{ id: '', title: '全部榜文' }, { id: '1', title: '待审核' }, { id: '2', title: '应榜中' }, { id: '3', title: '应榜结束' }, { id: '4', title: '工作中' }, { id: '5', title: '任务结束' }, { id: '6', title: '未通过' }],// 分类
      navId: '',
      cateList: [],// 分类列表
      noticeList: [],// 列表
    }
  },
  async created() {
    const ress = await request({
      method: 'POST',
      url: '/api/Bangwen/cate'
    })
    if (ress.code == 200) {
      this.cateList = ress.data
    }
    setTimeout(() => {
      this.onpushList()
    }, 500);
  },
  methods: {
    // 列表数据
    async onpushList() {
      const res = await request({
        method: 'POST',
        url: '/api/Bangwenpush/pushList',
        data: { type: this.type, status: this.navId, start_time: '', end_time: '', page: 1, pagenum: 10 }
      })
      if (res.code == 200) {
        res.data.data.map(item => {
          for (let i in this.cateList) {
            if (item.b_id == this.cateList[i].id) {
              item.name = this.cateList[i].name
            }
          }
        })
        this.noticeList = res.data.data
      }
    },
    // 点击状态切换
    onNavClick(e) {
      this.navId = e
      this.onpushList()
    },
    onNameClick(e) {
      this.type = e
      this.onpushList()
    }
  }
})
