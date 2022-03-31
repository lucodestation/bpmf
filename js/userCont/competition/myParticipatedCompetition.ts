// 个人中心 我参加的赛事

$(function () {
  // // 引入头部
  $('.public-header').load('/components/PublicHeader.html')
  // // 引入底部
  $('.public-footer').load('/components/PublicFooter.html')
  // // 引入侧边栏
  $('.public-user').load('/components/CenterAside.html')
})

const encrypt = new JSEncrypt()

Vue.use(ELEMENT)

const myParticipatedCompetitionPersonal = {
  template: '#myParticipatedCompetitionPersonal',
  props: ['competitionCateList'],
  data() {
    return {
      // 状态列表（tabs）
      statusList: [
        { value: '', label: '全部赛事' },
        { value: 0, label: '审核中' },
        { value: 2, label: '已通过' },
        { value: 1, label: '未通过' },
        { value: 3, label: '已退赛' },
        { value: 4, label: '已禁赛' },
      ],

      searchOption: {
        // 赛事编号
        number: '',
        // 赛事名称
        competition_name: '',
        // 赛事排序 1报名时间倒序，2报名时间正序
        sort: '',
        // 审核状态：0=待审核，1=审核不通过，2=审核通过，3=已退赛，4=禁赛
        apply_status: '',
      },

      // 赛事列表
      competitionList: [],
      // 总页数
      totalPage: 0,
      // 当前页
      currentPage: 1,
      // 每页数据条数
      limit: 10,
      // 总数据条数
      totalCount: 0,

      // 原因对话框是否显示
      reasonDialogVisible: false,
      // 原因内容
      reasonContent: '',

      // 终止比赛弹框是否显示
      endCompetitionDialogVisible: false,
      // 终止比赛弹框数据
      endCompetitionData: {
        // 赛事 id
        competitionId: '',
        // 报名费退还：1=不退还，2=退还
        feeReturn: 1,
        // 原因内容
        reasonContent: '',
      },
    }
  },
  // 过滤器
  filters: {
    // 时间戳转成日期（xxxx-xx-xx xx:xx）
    timestampToDate(value) {
      const dateObj = new Date(value * 1000)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const date = String(dateObj.getDate()).padStart(2, '0')
      const hours = String(dateObj.getHours()).padStart(2, '0')
      const minutes = String(dateObj.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${date} ${hours}:${minutes}`
    },
  },
  created() {
    // 搜索
    this.handleSearch()
  },
  mounted() {
    // 临时
    layer.open({
      title: '临时',
      type: 1,
      // skin: 'layui-layer-rim', //加上边框
      area: ['300px', '200px'], //宽高
      content: $('#personalCompetitionTemp'),
      shade: 0,
      offset: 'rt',
    })
  },
  methods: {
    // 状态 tab 改变
    handleChangeStatus(value) {
      if (this.searchOption.apply_status === value) return
      this.searchOption.apply_status = value

      // 搜索
      this.handleSearch()
    },
    // 搜索
    handleSearch() {
      // 加载我参加的赛事列表
      this._loadCompetitionList({
        ...this.searchOption,
        page: 1,
        pagenum: this.limit,
      })
    },
    // 排序
    handleSort() {
      // 1报名时间倒序，2报名时间正序
      if (this.searchOption.sort === '' || this.searchOption.sort === 2) {
        this.searchOption.sort = 1
      } else if (this.searchOption.sort === 1) {
        this.searchOption.sort = 2
      }

      // 搜索
      this.handleSearch()
    },
    // 加载我参加的赛事列表
    _loadCompetitionList(data) {
      request({
        url: '/api/Competitionattend/list',
        method: 'post',
        data,
      }).then((result) => {
        if (+result.code === 200) {
          this.competitionList = result.data.data
          this.totalPage = result.data.last_page
          this.currentPage = result.data.current_page
          this.totalCount = result.data.total
        }
      })
    },

    handleChangeCurrentPage() {},

    continueReleaseCompetition() {},
    handleDeleteCompetition() {},
    handleOpenCheckReasonDialog() {},
    handleCloseCheckReasonDialog() {},
    handleOpenEndCompetitionDialog() {},
    handleCloseEndCompetitionDialog() {},
    handleSubmitEndCompetition() {},
  },
}

const myParticipatedCompetitionTeam = {
  template: '#myParticipatedCompetitionTeam',
  props: ['competitionCateList'],
  data() {
    return {}
  },
}

new Vue({
  el: '#app',
  components: {
    // 参加的比赛个人赛
    'my-participated-competition-personal': myParticipatedCompetitionPersonal,
    // 参加的比赛团队赛
    'my-participated-competition-team': myParticipatedCompetitionTeam,
  },
  data() {
    return {
      // 赛事种类，0=个人赛，1=团队赛
      competitionType: 0,
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 改变赛事种类（个人赛、团队赛）
    handleChangeCompetitionType(type) {
      if (this.competitionType === type) return
      this.competitionType = type
    },
  },
})
