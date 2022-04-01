// 个人中心 我发布的赛事 赛事管理

$(function () {
  // // 引入头部
  $('.public-header').load('/components/PublicHeader.html')
  // // 引入底部
  $('.public-footer').load('/components/PublicFooter.html')
  // // 引入侧边栏
  $('.public-user').load('/components/CenterAside.html')
})

Vue.use(ELEMENT)

new Vue({
  el: '#app',
  data() {
    return {
      // 赛事详情
      competitionDetail: {},
      // 报名角色tab列表
      applyRoleTabList: [],
      // 报名角色列表（从服务器获取的数据）
      applyRoleList: [],
      // 报名筛选选项
      applyFilterOption: {
        // 赛事id
        competition_id: '',
        // 角色类型id：1=选手，2=裁判
        role_id: 1,
        // 搜索状态参数：0=待审核，1=审核不通过，2=审核通过
        status: '',
        // 搜索：姓名或者参赛账号
        keyword: '',
      },
      // 报名管理选择的报名 id
      applySelectedApplyId: [],
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
  async created() {
    // 解析 url 中的查询字符串
    const searchParams = Qs.parse(location.search.substr(1))
    this.applyFilterOption.competition_id = searchParams.competition_id * 1

    // 赛事详情
    const competitionDetailResult = await request({
      url: '/api/Competitionindex/detail',
      method: 'post',
      data: { competition_id: searchParams.competition_id * 1 },
    })
    if (+competitionDetailResult.code === 200) {
      this.competitionDetail = competitionDetailResult.data
    } else {
      layer.msg(competitionDetailResult.msg)
    }

    // 报名管理--获得角色菜单列表
    const applyRoleMenu = await request({
      url: '/api/competition/get_role_menu',
      method: 'post',
      data: { competition_id: searchParams.competition_id * 1 },
    })
    if (+applyRoleMenu.code === 200) {
      // "roles": "1,2,3", //1=选手，2,3=裁判
      // "is_total_points": 0 //0=没有代表队，1=有代表队
      const arr = applyRoleMenu.data.roles.split(',').map((i) => i * 1)
      console.log(arr)
      if (arr.includes(1)) {
        this.applyRoleTabList.push({ value: 1, label: '选手列表' })
      }
      if (arr.includes(2) || arr.includes(3)) {
        this.applyRoleTabList.push({ value: 2, label: '裁判列表' })
      }
    } else {
      layer.msg(applyRoleMenu.msg)
    }

    // 获取报名角色列表
    this._loadApplyRoleList(this.applyFilterOption)
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
    // 改变报名角色
    handleChangeApplyRole(value) {
      if (this.applyFilterOption.role_id === value) return
      this.applyFilterOption.role_id = value

      // 获取报名角色列表
      this._loadApplyRoleList(this.applyFilterOption)
    },
    // 报名搜索
    handleApplySearch() {
      console.log('报名搜索')
      // 获取报名角色列表
      this._loadApplyRoleList(this.applyFilterOption)
    },
    // 获取报名角色列表
    _loadApplyRoleList(data) {
      request({
        url: '/api/competition/apply_role_list',
        method: 'post',
        data: util.objFilterEmptyStrProp(data),
      }).then((result) => {
        if (+result.code === 200) {
          this.applyRoleList = result.data
          // this.applyRoleList = result.data.map((item) => {
          //   item.status = 2
          //   return item
          // })
        } else {
          layer.msg(result.msg)
        }
      })
    },
    // 报名管理 - 选择报名 id
    handleChangeApplyCheckbox(id) {
      console.log(id)
      if (this.applySelectedApplyId.includes(id)) {
        this.applySelectedApplyId = this.applySelectedApplyId.filter((i) => i !== id)
      } else {
        this.applySelectedApplyId.push(id)
      }
    },
    // 报名管理 - 全选
    handleChangeApplySelectAll() {
      console.log('all')
      if (this.applySelectedApplyId.length === this.applyRoleList.length) {
        // 已全选
        this.applySelectedApplyId = []
      } else {
        // 未全选
        this.applySelectedApplyId = this.applyRoleList.map((i) => i.id)
      }
    },
  },
})
