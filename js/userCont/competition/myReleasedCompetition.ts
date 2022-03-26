// 个人中心 我发布的赛事

// // 引入头部
// $('.public-header').load('/components/PublicHeader.html')
// // 引入底部
// $('.public-footer').load('/components/PublicFooter.html')
// // 引入侧边栏
// $('.public-user').load('/components/CenterAside.html')
$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})

const encrypt = new JSEncrypt()

Vue.use(ELEMENT)

// 我发布的赛事个人赛
const myReleasedCompetitionPersonal = {
  template: '#myReleasedCompetitionPersonal',
  props: ['competitionCateList'],
  data() {
    return {
      // 当前赛事类型
      currentCompetitionCate: '',
    }
  },
  methods: {
    // 改变赛事类型
    handleChangeCompetitionCate(event) {
      const target = event.target || event.srcElement
      const value = target.value // 字符串类型
      console.log(typeof value, value)
      if (this.currentCompetitionCate === value) return
      this.currentCompetitionCate = value
    },
  },
}

// 我发布的赛事团队赛
const myReleasedCompetitionTeam = {
  template: '#myReleasedCompetitionTeam',
  props: ['competitionCateList'],
}

new Vue({
  el: '#app',
  components: {
    // 发布比赛个人赛
    'my-released-competition-personal': myReleasedCompetitionPersonal,
    // 发布比赛团队赛
    'my-released-competition-team': myReleasedCompetitionTeam,
  },
  data() {
    return {
      // 赛事类型列表（从服务器获取）
      competitionCateList: [],

      // 赛事种类，0=个人赛，1=团队赛
      competitionType: 0,
    }
  },
  created() {
    // 获取赛事类型列表
    request({
      url: '/api/Competition/get_category_list',
    }).then((result) => {
      console.log('赛事类型列表', result)
      if (+result.code === 200) {
        this.competitionCateList = result.data
      }
    })
  },
  mounted() {},
  methods: {
    // 改变赛事种类（个人赛、团队赛）
    handleChangeCompetitionType(type) {
      if (this.competitionType === type) return
      console.log(type)
      this.competitionType = type
    },
  },
})
