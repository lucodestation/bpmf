// 发布比赛个人赛设置阶段

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

var encrypt = new JSEncrypt()
//公钥.
const publiukey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'

Vue.use(ELEMENT)

new Vue({
  el: '#app',
  data() {
    return {
      competitionId: '',
      // 赛事阶段（从服务器获取）
      competitionStage: {},
      // 赛事阶段名称列表
      competitionStageNameList: [],
      // 赛事信息
      competitionDetail: {},
    }
  },
  created() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.competitionId = searchParams.competition_id

    // 获取总阶段数，当前进行到哪个阶段
    request({
      url: '/api/competition/get_stage_status',
      params: { competition_id: searchParams.competition_id },
    }).then((result) => {
      console.log('获取总阶段数，当前进行到哪个阶段', result)
      if (+result.code === 200) {
        this.competitionStage = result.data
        this.competitionStageNameList = result.data.stage_name_list
      }
    })

    // 获取赛事信息
    request({
      url: '/api/competition/competition_detail',
      params: { competition_id: searchParams.competition_id },
    }).then((result) => {
      console.log('获取总阶段数，当前进行到哪个阶段', result)
      if (+result.code === 200) {
        this.competitionDetail = result.data
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
