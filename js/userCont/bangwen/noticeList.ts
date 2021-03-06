$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
Vue.use(ELEMENT)
new Vue({
  el: '#app',
  data() {
    return {
      nameList: [{ id: '1', title: '教棋榜文' }, { id: '2', title: '学棋榜文' }],
      type: 2,
      navList: [{ id: '', title: '全部榜文' }, { id: '1', title: '待审核' }, { id: '2', title: '应榜中' }, { id: '3', title: '应榜结束' }, { id: '4', title: '工作中' }, { id: '5', title: '任务结束' }, { id: '6', title: '未通过' }],// 分类
      navId: '',
      b_id: '',
      start_time: '',
      end_time: '',
      cateList: [],// 分类列表
      noticeList: [],// 列表
      id: '',// 删除id

      totalPage: 0,  // 总页数

      currentPage: 1, // 当前页
      // 每页数据条数
      // limit: 10,

      totalCount: 0,  // 总数据条数
    }
  },
  created() {
    request({ url: '/api/Bangwen/cate', method: 'post' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
        this.cateList.unshift({ id: '', name: '分类' })
      }
    })
    setTimeout(() => {
      this.onpushList()
    }, 500);
    // 起始时间
    layui.laydate.render({
      elem: '#signUpStartDate', //指定元素
      theme: '#FF7F17', // 主题颜色
      btns: ['clear', 'confirm'], // 显示的按钮
      done: (value, date) => {
        this.start_time = value
      },
    })
    // 结束时间
    layui.laydate.render({
      elem: '#signUpEndDate', //指定元素
      theme: '#FF7F17', // 主题颜色
      btns: ['clear', 'confirm'], // 显示的按钮
      done: (value, date) => {
        this.end_time = value
      },
    })
  },
  methods: {
    // 查询
    onqueryClick() {
      this.onpushList()
    },
    // 列表数据
    async onpushList() {
      const res = await request({
        method: 'POST',
        url: '/api/Bangwenpush/pushList',
        data: { type: this.type, status: this.navId, b_id: this.b_id, start_time: this.start_time, end_time: this.end_time, page: this.currentPage, pagenum: 10 }
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

        // this.competitionList = result.data.data
        this.totalPage = res.data.last_page
        this.currentPage = res.data.current_page
        this.totalCount = res.data.total
      }
    },
    // 改变页码
    handleChangeCurrentPage(value) {
      console.log(`第${value}页`)
      this.currentPage = value
      // 加载赛事列表
      this.onpushList()
    },
    // 点击状态切换
    onNavClick(e) {
      this.navId = e
      this.onpushList()
    },
    onNameClick(e) {
      this.type = e
      this.onpushList()
    },
    // 点击删除按钮
    onDelClick(e) {
      this.id = e
      syalert.syopen('noticeDelCont')
    },
    onDelqueryClick() {
      request({ url: '/api/Bangwenpush/delete', method: 'post', data: { bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('删除成功')
          syalert.syhide('noticeDelCont')
          this.onpushList()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    onXxClick(item) {
      request({ url: '/api/Bangwenattend/outBeginTeach', method: 'post', data: { order_id: item.id } }).then((res) => {
        if (res.code == 200) {
          // layer.msg('删除成功')
          // syalert.syhide('noticeDelCont')
          this.onpushList()
        } else {
          layer.msg(res.msg)
        }
      })
    }
  }
})
