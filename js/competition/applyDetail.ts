// 赛事详情
// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

Vue.use(ELEMENT)

const applyDetail = new Vue({
  el: '#app',
  data() {
    return {
      // 赛事信息
      competitionInfo: {},
      // 阶段信息
      stageInfo: [],
      // 当前阶段索引
      currentStateIndex: 0,
      // 奖励信息
      awardInfo: {},
      // 当前 tab 0=对阵安排 1=赛事详情
      currentTab: 0,

      // 角色选择列表
      roleList: [
        { id: 1, label: '参赛选手' },
        { id: 2, label: '裁判' },
        { id: 3, label: '主裁判' },
      ],
      // 省列表
      provinceList: [],
      // 市列表
      cityList: [],
      // 区列表
      areaList: [],
      // 报名对话框是否显示
      applyDialogVisible: false,
      // 赛事频道-我要报名表单请求页接口--个人赛
      applyDialogInfo: {},
      // 报名对话框要提交的数据
      applyDialogData: {
        // 比赛id
        competition_id: '',
        // 所报角色id，1=选手，2=裁判，3=主裁判
        role_id: 1,
        // 其他平台比赛账号
        account_number: '',
        // 技术水平/类型 id，，备注：裁判，主裁判报名时无需传递
        skill_id: '',
        // 技术等级id，，备注：裁判，主裁判报名时无需传递
        level_id: '',
        // 身份证明类型：1=身份证，2=军官证，3=其他
        identification: 1,
        // 身份证明图片url，多个用英文逗号隔开
        i_image: '',
        // 联系方式-手机号
        tel: '',
        qq: '',
        msn: '',
        skype: '',
        wx: '',
        username: '',
        age: '',
        gender: '',
        // 代表队/所在团队
        team: '',
        // 省份id
        province: '',
        // 城市id
        city: '',
        // 区县id
        area: '',
        // 居住地址
        addr: '',
        // 自我介绍
        introduce: '',
        // 附件url
        affix: '',
        // 1=我的钱包，2=支付宝，3=微信支付 //没有报名费不用出现选择支付的信息，直接提交
        pay_way: '',
      },
      // 技术水平列表
      technicalLevelList: [],
      // 技术等级列表
      technicalGradeList: [],
      // 是否已同意协议
      agreedAgreement: false,
      // 身份证明文件列表
      personalID: [],
      // 附件文件列表
      affixList: [],
    }
  },
  // 过滤器
  filters: {
    // 奖金
    bonus(value) {
      if (value > 9999 && value % 10000 === 0) {
        return value / 10000 + '万'
      }
      return value * 1 + '元'
    },
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
    // 破同分规则，1=小分，2=违例，3=加塞，4=抽签，5=直胜，6=胜局，7=并列，8=总局分，9=对手分1型，10=对手分2型，11=净胜局数，12=koya system
    rankingSystem(value) {
      const arr = ['', '小分', '违例', '加塞', '抽签', '直胜', '胜局', '并列', '总局分', '对手分1型', '对手分2型', '净胜局数', 'koya system']
      console.log(
        value
          .split(',')
          .map((item) => arr[+item])
          .join('、')
      )
      return value
        .split(',')
        .map((item) => arr[+item])
        .join('、')
    },
  },
  async created() {
    // 解析 url 中的查询字符串
    const searchParams = Qs.parse(location.search.substr(1))
    console.log(searchParams)

    // 加载报名详情
    const applyDetailResult = await request({
      url: '/api/competition/apply_detail',
      method: 'post',
      data: { competition_id: searchParams.competition_id },
    })
    if (+applyDetailResult.code === 200) {
      this.competitionInfo = applyDetailResult.data.competition
      this.stageInfo = applyDetailResult.data.competition_stage
      this.awardInfo = applyDetailResult.data.competition_award
      setTimeout(() => {
        new Swiper(this.$refs.swiper, {
          slidesPerView: 3,
          spaceBetween: 30,
          loop: false,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      }, 100)

      // 临时
      this.handleOpenApplyDialog()
    }
  },
  methods: {
    // 打开报名对话框
    async handleOpenApplyDialog() {
      this.applyDialogVisible = true
      return

      const result = await request({
        url: '/api/competition/apply',
        method: 'post',
        data: { competition_id: this.competitionInfo.id },
      })
      if (+result.code === 200) {
        console.log('报名对话框需要的信息', result.data)

        this.applyDialogInfo = result.data

        // 根据赛事类型id获得技术水平
        const technicalLevelResult = await request({
          url: '/api/competition/get_competition_skill',
          method: 'post',
          data: { category_id: this.applyDialogInfo.category_id },
        })
        this.technicalLevelList = technicalLevelResult.data

        // 获取省列表
        const provinceResult = await request({
          url: '/api/competition/area',
          method: 'post',
          data: { pid: 0 },
        })
        this.provinceList = provinceResult.data

        this.applyDialogVisible = true
      } else {
        layer.msg(result.msg)
      }
    },
    // 关闭报名对话框
    handleCloseApplyDialog() {
      this.applyDialogInfo = {}
      this.applyDialogData = {
        // 比赛id
        competition_id: '',
        // 所报角色id，1=选手，2=裁判，3=主裁判
        role_id: '',
        // 其他平台比赛账号
        account_number: '',
        // 技术水平/类型 id，，备注：裁判，主裁判报名时无需传递
        skill_id: '',
        // 技术等级id，，备注：裁判，主裁判报名时无需传递
        level_id: '',
        // 身份证明类型：1=身份证，2=军官证，3=其他
        identification: '',
        // 身份证明图片url，多个用英文逗号隔开
        i_image: '',
        // 联系方式-手机号
        tel: '',
        qq: '',
        msn: '',
        skype: '',
        wx: '',
        username: '',
        age: '',
        gender: '',
        // 代表队/所在团队
        team: '',
        // 省份id
        province: '',
        // 城市id
        city: '',
        // 区县id
        area: '',
        // 居住地址
        addr: '',
        // 自我介绍
        introduce: '',
        // 附件url
        affix: '',
        // 1=我的钱包，2=支付宝，3=微信支付 //没有报名费不用出现选择支付的信息，直接提交
        pay_way: '',
      }
      this.applyDialogVisible = false
    },
    // 选择技术水平
    async handleSelectTechnicalLevel(event) {
      const target = event.target || event.srcElement
      // 得到技术等级 id
      const skill_id = target.value
      this.applyDialogData.skill_id = skill_id
      // 根据技术水平id获得技术等级
      const result = await request({
        url: '/api/competition/get_competition_skill_level',
        method: 'post',
        data: { skill_id },
      })
      this.technicalGradeList = result.data
      this.applyDialogData.level_id = ''
    },
    // 选择技术等级
    handleSelectTechnicalGrade(event) {
      const target = event.target || event.srcElement
      const id = target.value
      this.applyDialogData.level_id = id
    },
    // 选择省份
    async handleSelectProvince(event) {
      const target = event.target || event.srcElement
      const id = target.value
      console.log('省 id', id)
      this.applyDialogData.province = id

      // 清除选择的市、县
      this.applyDialogData.city = ''
      this.applyDialogData.area = ''
      // 清除县列表
      this.areaList = []

      // 获取市列表
      const result = await request({
        url: '/api/competition/area',
        method: 'post',
        data: { pid: id },
      })
      this.cityList = result.data
    },
    // 选择城市
    async handleSelectCity(event) {
      const target = event.target || event.srcElement
      const id = target.value
      this.applyDialogData.city = id

      // 清除选择的县
      this.applyDialogData.area = ''

      // 获取县列表
      const result = await request({
        url: '/api/competition/area',
        method: 'post',
        data: { pid: id },
      })
      this.areaList = result.data
    },
    // 选择区县
    handleSelectArea(event) {
      const target = event.target || event.srcElement
      const id = target.value
      this.applyDialogData.area = id
    },
  },
})
