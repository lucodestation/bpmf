// 发布比赛个人赛发布成功

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

const encrypt = new JSEncrypt()

Vue.use(ELEMENT)

new Vue({
  el: '#app',
  data() {
    return {
      competitionId: '',
      adverList: [],
    }
  },
  created() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.competitionId = searchParams.competition_id * 1

    // 赛事广告位
    request({
      url: '/api/Competitionindex/adverList',
      method: 'post',
      data: { competition_id: searchParams.competition_id * 1 },
    }).then((result) => {
      console.log('获取总阶段数，当前进行到哪个阶段', result)
      if (+result.code === 200) {
        this.adverList = result.data
      }
    })
  },

  methods: {
    // 测试
    handleTest() {
      console.log('测试')
    },
  },
})
