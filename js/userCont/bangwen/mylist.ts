$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      navList: [{ id: 1, name: '教课应榜' }, { id: 2, name: '学课应榜' }],
      navId: 2,
      myList: [],// 列表
    }
  },
  created() {
    this.onlist()
  },
  methods: {
    // 获取数据列表
    onlist() {
      request({ url: '/api/Bangwenattend/list', method: 'post', data: { type: this.navId } }).then((res) => {
        if (res.code == 200) {
          this.myList = res.data
        }
      })
    },
    // 点击切换类型
    onNavClick(id) {
      this.navId = id
      this.onlist()
    },
    onJiaoKeClick(item) {
      request({ url: '/api/Bangwenattend/outBeginTeach', method: 'post', data: { order_id: item.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('操作成功')
          // this.myList = res.data
        } else {
          layer.msg(res.msg)
        }
      })
    }
  }
})
