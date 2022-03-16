$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      // 表单数据
      formData: {
        type: '1',// 1课程直播，2赛事直播
        join_type: '1',// 1申请进入（需要发布者审核），2全网公开，3会员公开，4设置密码
        c_id: '',// 分类
        title: '',// 标题
        start_time: '',// 开始时间
        end_time: '',// 结束时间
        descri: '',// 描述
        image: '',// 封面图
        password: '',// 密码进入，此值必传
      },
      typeList: [{ id: 1, title: '课程直播' }, { id: 2, title: '赛事直播' }],
    }
  },
  async created() {
    // 直播分类
    const res = await request({
      method: 'POST',
      url: '/api/Live/liveCates',
    })
    if (res.code == 200) {
      this.bangList = res.data
    }
  },
  methods: {

  }
})

