// 个人中心 我发布的赛事

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

// 我发布的赛事个人赛
const myReleasedCompetitionPersonal = {
  template: '#myReleasedCompetitionPersonal',
  props: ['competitionCateList'],
  data() {
    return {
      // 状态列表（tabs）
      statusList: [
        { value: '', label: '全部赛事' },
        { value: 2, label: '审核中' },
        { value: 4, label: '报名中' },
        // { value: 5, label: '报名结束'},
        { value: 6, label: '比赛中' },
        { value: 7, label: '已结束' },
        { value: 3, label: '未通过' },
      ],

      // 开始时间
      startDate: '',
      // 结束时间
      endDate: '',

      searchOption: {
        // 赛事状态：2=审核中，3=未通过，4=审核通过，报名中，5=报名结束，6=比赛中，7=已结束，不传默认返回全部
        status: '',
        // 赛事类型id，筛选时候用
        category_id: '',
        // 开始时间，时间戳（秒）
        begin_time: '',
        // 结束时间，时间戳（秒）
        end_time: '',
      },

      // 赛事列表
      competitionList: [],
      // 总页数
      totalPage: 0,
      // 当前页
      currentPage: 1,
      // 每页数据条数
      // limit: 10,
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
    // 加载赛事列表
    this._loadCompetitionList()
  },
  mounted() {
    setTimeout(() => {
      // 初始化开始时间
      this.initStartDate(this.$refs.startDate)
      // 初始化结束时间
      this.initEndDate(this.$refs.endDate)
    }, 100)

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
    // 改变状态（tabs）
    handleChangeStatus(value) {
      console.log(value)
      if (this.searchOption.status === value) return

      this.searchOption.status = value

      // 加载赛事列表
      this._loadCompetitionList({
        ...this.searchOption,
        page: 1,
      })
    },
    // 初始化开始时间
    initStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          }

          console.log('报名开始时间', typeof dateValue, dateValue)
          // 设置开始时间（页面显示用）
          this.startDate = dateValue
          // 设置开始时间（提交数据用）
          this.searchOption.begin_time = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          // 如果结束时间存在且比开始时间小（或相等）
          if (this.endDate && this.endDate < this.startDate) {
            // 清空结束时间
            this.endDate = ''
            this.searchOption.end_time = ''
          }
        },
      })
    },
    // 初始化结束时间
    initEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => {},
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value

          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (new Date(dateValue.replace(/-/g, '/')) < new Date(this.startDate.replace(/-/g, '/'))) {
            // 如果结束时间小于报名开始时间
            layer.msg('结束时间不能小于开始时间')
            dateValue = ''
          }

          console.log('结束时间', typeof dateValue, dateValue)
          // 设置结束时间（页面显示用）
          this.endDate = dateValue
          // 设置结束时间（提交数据用）
          this.searchOption.end_time = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''
        },
      })
    },
    // 查询/搜索按钮
    handleSearch() {
      // 加载赛事列表
      this._loadCompetitionList({
        ...this.searchOption,
        page: 1,
      })
    },
    // 加载赛事列表
    async _loadCompetitionList(params) {
      console.log(params)
      const result = await request({
        url: '/api/competition/my_push_match',
        params,
      })
      if (+result.code === 200) {
        this.competitionList = result.data.data
        this.totalPage = result.data.last_page
        this.currentPage = result.data.current_page
        this.totalCount = result.data.total
      }
    },
    // 改变页码
    handleChangeCurrentPage(value) {
      // console.log(`第${value}页`)
      // 加载赛事列表
      this._loadCompetitionList({
        ...this.searchOption,
        page: value,
      })
    },

    // 操作
    // 继续发布赛事
    continueReleaseCompetition(detail) {
      console.log(detail)
      // stage 阶段总数
      // push_status 当前发布状态 0未发布阶段 1已发布第一阶段 2已发布第二阶段 3已发布第三阶段 4已发布第四阶段 5已发布第五阶段 6已设置赛事奖励
      if (detail.stage === detail.push_status) {
        // 跳转到发布赛事奖励页面
        window.location.href = `/bangwen/competitionAwardPersonal.html?competition_id=${detail.id}`
      } else {
        // 跳转到发布赛事阶段页面
        window.location.href = `/bangwen/competitionStagePersonal.html?competition_id=${detail.id}`
      }
    },
    // 删除赛事
    async handleDeleteCompetition(detail) {
      await this.$alert('<div style="font-size: 20px;">是否确定删除赛事</div>', '', {
        showClose: false,
        showCancelButton: true,
        dangerouslyUseHTMLString: true,
        confirmButtonClass: 'orange-button-bg',
      })

      // 点击确定才会执行到这里
      console.log('即将删除赛事')

      const result = await request({
        url: '/api/competition/competition_del',
        method: 'post',
        data: { competition_id: detail.id },
      })
      if (result.code === 200) {
        layer.msg(result.msg)
        if (this.currentPage > 1 && this.competitionList.length === 1) {
          // 如果当前页不是第一页且当前页只有一条数据，则加载上一页
          // 加载赛事列表
          this._loadCompetitionList({
            ...this.searchOption,
            page: this.currentPage - 1,
          })
        } else {
          // 否则加载当前页
          // 加载赛事列表
          this._loadCompetitionList({
            ...this.searchOption,
            page: this.currentPage,
          })
        }
      } else {
        layer.msg(result.msg)
      }
    },
    // 打开查看原因弹框
    handleOpenCheckReasonDialog(detail) {
      this.reasonContent = detail.refund_memo
      this.reasonDialogVisible = true
    },
    // 关闭查看原因弹框
    handleCloseCheckReasonDialog() {
      this.reasonDialogVisible = false
      this.reasonContent = ''
    },
    // 打开终止比赛弹框
    handleOpenEndCompetitionDialog(detail) {
      this.endCompetitionData.competitionId = detail.id
      this.endCompetitionDialogVisible = true
    },
    // 关闭终止比赛弹框
    handleCloseEndCompetitionDialog() {
      this.endCompetitionData = {
        // 赛事 id
        competitionId: '',
        // 报名费退还：1=不退还，2=退还
        feeReturn: 1,
        // 原因内容
        reasonContent: '',
      }
      this.endCompetitionDialogVisible = false
    },
    // 提交终止比赛
    handleSubmitEndCompetition() {
      if (!this.endCompetitionData.reasonContent.trim()) {
        layer.msg('请输入终止原因')
        return
      }
      console.table({ ...this.endCompetitionData })
      layer.msg('开发中...')
      this.handleCloseEndCompetitionDialog()
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
    // 发布的比赛个人赛
    'my-released-competition-personal': myReleasedCompetitionPersonal,
    // 发布的比赛团队赛
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
