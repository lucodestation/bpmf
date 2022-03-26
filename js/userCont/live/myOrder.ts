$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      navList: [{ id: '', title: '直播类型' }, { id: '1', title: '课程直播' }, { id: '2', title: '赛事直播' }],// 分类
      type: '',
      start_time: '',
      end_time: '',
      orderList: [],// 列表
    }
  },
  mounted() {
    this.onappointLiveList()
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
    // 点击查询
    onClick() {
      this.onappointLiveList()
    },
    // 列表数据
    onappointLiveList() {
      request({ url: '/api/Mine/appointLiveList', method: 'post', data: { page: 1, pagenum: 10, start_time: this.start_time, end_time: this.end_time, type: this.type } }).then((res) => {
        if (res.code == 200) {
          res.data.data.map(item => {
            var date1 = new Date((item.end_time + ':00').replace(/\-/g, "/"));    //开始时间
            var date2 = new Date(item.start_time.replace(/\-/g, "/") + ':00');    //结束时间
            var date3 = date1.getTime() - date2.getTime(); //时间差秒
            //计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000))
            //计算出小时数
            var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            // var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
            // var seconds = Math.round(leave3 / 1000)
            item.fen = days * 24 * 60 + hours * 60 + minutes
          })
          this.orderList = res.data.data
        }
      })
    }
  }
})
