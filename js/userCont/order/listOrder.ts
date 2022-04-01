$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      type: '',
      typeList: [{ id: '1', name: '教课' }, { id: '2', name: '学课' }],
      navList: [{ id: '', name: '全部订单' }, { id: '0', name: '待支付' }, { id: '1', name: '已支付' }],
      navId: '',
      search: '',// 订单编号或应榜人
      orderList: [],// 申请列表
      start_time: '',
      end_time: ''
    }
  },
  mounted() {
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
    // 列表数据
    this.onpushBangwenOrder()
  },
  methods: {
    // 点击查询
    onSearchClick() {
      this.onpushBangwenOrder()
    },
    onnavClick(id) {
      this.navId = id
      this.onpushBangwenOrder()
    },
    // 列表数据
    onpushBangwenOrder() {
      request({ url: '/api/Mine/attendBangwenOrder', method: 'POST', data: { page: 1, pagenum: 10, search: this.search, status: this.navId, type: this.type, start_time: this.start_time, end_time: this.end_time } }).then((res) => {
        if (res.code == 200) {
          this.orderList = res.data.data
        }
      })
    }
  }
})
