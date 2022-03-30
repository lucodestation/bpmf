$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      adverList: [],// 广告位简介
      adverCont: '',// 广告详情
      type: '',// 位置
      formData: {
        type_id: '',// 位置id，6需要选择赛事id，7需要选择直播id
        position: '',// 序号
        start_time: '',// 开始时间  2022-03-30 16:00  还是2022-03-30
        end_time: '',// 结束时间
        image: '',// 广告图片
        money: '',// 价格
        url: '',// 跳转url
        d_id: '',// 直播或赛事id
        pay_type: '',// 1余额，2支付宝，3微信
      }
    }
  },
  watch: {
    type: {
      handler(e, m) {
        for (let i = 0; i < this.adverList.length; i++) {
          if (this.adverList[i].id == e) {
            this.adverCont = this.adverList[i]
          }
        }
      }
    },
  },
  created() {
    // 广告位简介
    request({ url: '/api/adver/adverDescri', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.adverList = res.data
        this.formData.type_id = res.data[0].id
        this.type = res.data[0].id
        this.adverCont = res.data[0]
      }
    })
  },
  methods: {}
})
