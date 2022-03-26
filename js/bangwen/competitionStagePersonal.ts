// 发布比赛个人赛赛事阶段

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
      // 赛事阶段（从服务器获取）
      competitionStage: {},
      // 赛事阶段名称列表
      competitionStageNameList: [],
      // 赛事信息
      competitionDetail: {},
      // 阶段开始时间
      stageStartDate: '',
      // 阶段结束时间
      stageEndDate: '',

      formData: {
        competition_id: '', // 赛事id
        stage_name: '', // 阶段名称
        stage: '', // 当前阶段数

        s_b_t: '', // 阶段赛开始时间（时间戳（秒））
        s_e_t: '', // 阶段赛结束时间（时间戳（秒））
        system: '', // 比赛制度：1=淘汰赛，2=循环赛，3=其他赛制
        rule: '', // 规则：system=1,rule:1=单败淘汰，2=双败淘汰，system=2,rule:1=单循环，2=双循环。备注：其他赛制不用传此参数
        arithmetic: '', // system=2时传，循环赛算法：1=贝格尔法，2=蛇形编排，3=顺时针法，4=逆时针法
        system_memo: '', // 赛制说明
        group_num: '', // 分组数
        rank_or_week: '', // 晋级或者淘汰：1=晋级，2=淘汰
        people_num: '', // 晋级/淘汰人数

        group_way: '', // 参赛选手分组：1=按种子分组，2=随机分组，3=同队或同单位限制，4=地区分组
        competition_num: '', // 参赛选手参赛号：1=按等级分，2=按技术水平分，3=随机分号
        group_memo: '', // 比赛形式补充说明
        before_after: '', // 先后手：1=猜先，2=按约定
        surplus: 0, // 先后手其余轮次：0=未选择，1=按约定

        sai_num: '', // 每台赛局数
        win_score: '', // 胜利获得分数
        dogfall_score: '', // 平局获得分数
        defeated_score: '', // 失败获得分数
        waiver_score: '', // 弃权获得分数
        illegality_score: '', // 犯规获得分数
        ranking_system: '', // 破同分规则，1=小分，2=违例，3=加塞，4=抽签，5=直胜，6=胜局，7=并列，8=总局分，9=对手分1型，10=对手分2型，11=净胜局数，12=koya system，多个用英文逗号隔开
      },
      // 淘汰赛规则 1=单败淘汰，2=双败淘汰
      system1Rule: '',
      // 循环赛规则 1=单循环，2=双循环
      system2Rule: '',
      // 破同分规则，1=小分，2=违例，3=加塞，4=抽签，5=直胜，6=胜局，7=并列，8=总局分，9=对手分1型，10=对手分2型，11=净胜局数，12=koya system，多个用英文逗号隔开
      rankingSystemList: [
        { value: 1, label: '小分' },
        { value: 2, label: '违例' },
        { value: 3, label: '加塞' },
        { value: 4, label: '抽签' },
        { value: 5, label: '直胜' },
        { value: 6, label: '胜局' },
        { value: 7, label: '并列' },
        { value: 8, label: '总局分' },
        { value: 9, label: '对手分1型' },
        { value: 10, label: '对手分2型' },
        { value: 11, label: '净胜局数' },
        { value: 12, label: 'koya system' },
      ],
      rankingSystemList2: [],
      // 破同分规则选择的值
      rankingSystemSelected: [],
    }
  },
  created() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.competitionId = searchParams.competition_id * 1

    // 获取总阶段数，当前进行到哪个阶段
    request({
      url: '/api/competition/get_stage_status',
      params: { competition_id: searchParams.competition_id * 1 },
    }).then((result) => {
      console.log('获取总阶段数，当前进行到哪个阶段', result)
      if (+result.code === 200) {
        this.competitionStage = result.data
        this.competitionStageNameList = result.data.stage_name_list
        this.formData.competition_id = result.data.competition_id
        this.formData.stage_name = result.data.stage_name
        this.formData.stage = result.data.stage
      }
    })

    // 获取赛事信息
    request({
      url: '/api/competition/competition_detail',
      params: { competition_id: searchParams.competition_id * 1 },
    }).then((result) => {
      console.log('获取赛事信息', result)
      if (+result.code === 200) {
        this.competitionDetail = result.data

        // 初始化日期时间选择器
        // 初始化阶段开始时间
        this.initStageStartDate(this.$refs.stageStartDate)
        // 初始化阶段结束时间
        this.initStageEndDate(this.$refs.stageEndDate)
      }
    })

    // 存储第 1 项下拉选项需要的数据（选择平分名次排列：优先级从左到右排列（下拉选项））
    this.rankingSystemList2.push(this.rankingSystemList)
  },
  methods: {
    // 测试
    handleTest() {
      console.log('测试')
    },
    // 初始化阶段开始时间
    initStageStartDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionDetail.a_b_t * 1000 + 1000 * 60 + 1, // 最小范围 大于报名开始时间
        max: this.competitionDetail.c_e_t * 1000 - 1000 * 60 - 1, // 最大范围 小于比赛结束时间
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
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('阶段开始时间', typeof dateValue, dateValue)
          // 设置阶段开始时间（页面显示用）
          this.stageStartDate = dateValue
          // 设置阶段开始时间（提交数据用）
          this.formData.s_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''

          // 如果阶段结束时间存在且比阶段开始时间小（或相等）
          if (this.stageEndDate && this.stageEndDate <= this.stageStartDate) {
            // 清空阶段结束时间
            this.stageEndDate = ''
            this.formData.s_e_t = ''
          }
        },
      })
    },
    // 初始化阶段结束时间
    initStageEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionDetail.a_b_t * 1000 + 1000 * 60 + 1, // 最小范围 大于报名开始时间
        max: this.competitionDetail.c_e_t * 1000 - 1000 * 60 - 1, // 最大范围 小于比赛结束时间
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
          } else if (!this.stageStartDate) {
            // 如果还没有选择阶段开始时间
            layer.msg('请先选择阶段开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.stageStartDate.replace(/-/g, '/'))) {
            // 如果阶段结束时间小于阶段开始时间
            layer.msg('阶段结束时间要大于阶段开始时间')
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间')
            dateValue = ''
          }

          console.log('阶段开始时间', typeof dateValue, dateValue)
          // 设置阶段开始时间（页面显示用）
          this.stageEndDate = dateValue
          // 设置阶段开始时间（提交数据用）
          this.formData.s_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() / 1000 : ''
        },
      })
    },
    // 选择比赛制度 1=淘汰赛，2=循环赛，3=其他赛制
    handleSelectSystem(value) {
      if (this.formData.system === value) return
      this.formData.system = value
      this.system1Rule = ''
      this.system2Rule = ''
      this.formData.arithmetic = ''
      this.formData.system_memo = ''

      if (value === 3) {
        // 其他赛制
        this.formData.sai_num = ''
      }
      if (value === 1 || value === 3) {
        // 淘汰赛 其他赛制
        this.formData.win_score = ''
        this.formData.dogfall_score = ''
        this.formData.defeated_score = ''
        this.formData.waiver_score = ''
        this.formData.illegality_score = ''
        this.rankingSystemList2 = []
        this.rankingSystemList2.push(this.rankingSystemList)
        this.rankingSystemSelected = []
      }
    },
    // 选择平分名次排列：优先级从左到右排列（下拉选项）
    handleSelectRankingSystem(event, num) {
      const target = event.target || event.srcElement
      const value = target.value * 1

      // 存储选择的第 num 项值
      this.rankingSystemSelected[num] = value
      // 大于第 num 项的值删除掉
      this.rankingSystemSelected = this.rankingSystemSelected.filter((item, index) => index <= num)

      // 存储第 num 项下拉选项需要的数据
      this.rankingSystemList2[num + 1] = this.rankingSystemList.filter((i) => !this.rankingSystemSelected.includes(i.value))
      // 大于第 num + 1 项需要的数据删除掉
      this.rankingSystemList2 = this.rankingSystemList2.filter((item, index) => index <= num + 1)
    },
    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      arr.push(
        { label: '请选择阶段开始时间', validate: !this.formData.s_b_t },
        { label: '请选择阶段结束时间', validate: !this.formData.s_e_t },
        { label: '请选择比赛制度', validate: !this.formData.system }
      )
      if (this.formData.system === 1) {
        arr.push({ label: '请选择淘汰赛规则', validate: !this.system1Rule })
      } else if (this.formData.system === 2) {
        arr.push({ label: '请选择循环赛规则', validate: !this.system2Rule }, { label: '请选择循环赛算法', validate: !this.formData.arithmetic })
      } else if (this.formData.system === 3) {
        arr.push({ label: '请输入其他赛制备注内容', validate: !this.formData.system_memo })
      }
      arr.push(
        { label: '请输入分组数', validate: !this.formData.group_num },
        { label: '分组数必须是大于 0 的整数', validate: this.formData.group_num < 0 || parseInt(this.formData.group_num) < this.formData.group_num },
        { label: '请选择晋级/淘汰', validate: !this.formData.rank_or_week },
        { label: '请输入晋级/淘汰人数', validate: !this.formData.people_num },
        { label: '晋级/淘汰人数必须是大于 0 的整数', validate: this.formData.people_num < 0 || parseInt(this.formData.people_num) < this.formData.people_num },
        { label: '请选择参赛选手分组', validate: !this.formData.group_way },
        { label: '请选择参赛选手参赛号', validate: !this.formData.competition_num },
        { label: '请输入比赛形式补充说明', validate: !this.formData.group_memo },
        { label: '请选择先后手', validate: !this.formData.before_after }
      )

      if (this.formData.system === 1 || this.formData.system === 2) {
        // 淘汰赛或循环赛
        arr.push(
          { label: '请输入每台赛局数', validate: !this.formData.sai_num },
          { label: '每台赛局数必须是大于 0 的整数', validate: this.formData.sai_num < 0 || parseInt(this.formData.sai_num) < this.formData.sai_num }
        )
      }
      if (this.formData.system === 2) {
        // 循环赛
        arr.push(
          { label: '请输入胜利得分', validate: !this.formData.win_score },
          { label: '得分最多 1 位小数', validate: this.formData.win_score.toString().split('.')[1] && this.formData.win_score.toString().split('.')[1].length > 1 },

          { label: '请输入平局得分', validate: !this.formData.dogfall_score },
          { label: '得分最多 1 位小数', validate: this.formData.dogfall_score.toString().split('.')[1] && this.formData.dogfall_score.toString().split('.')[1].length > 1 },

          { label: '请输入失败得分', validate: !this.formData.defeated_score },
          { label: '得分最多 1 位小数', validate: this.formData.defeated_score.toString().split('.')[1] && this.formData.defeated_score.toString().split('.')[1].length > 1 },

          { label: '请输入弃权得分', validate: !this.formData.waiver_score },
          { label: '得分最多 1 位小数', validate: this.formData.waiver_score.toString().split('.')[1] && this.formData.waiver_score.toString().split('.')[1].length > 1 },

          { label: '请输入犯规得分', validate: !this.formData.illegality_score },
          { label: '得分最多 1 位小数', validate: this.formData.illegality_score.toString().split('.')[1] && this.formData.illegality_score.toString().split('.')[1].length > 1 },

          { label: '请至少选择 3 项平分名次排列规则', validate: this.rankingSystemSelected.length < 3 }
        )
      }

      const errorArr = arr.filter((item) => item.validate)
      if (errorArr.length) {
        layer.msg(errorArr[0].label)
      } else {
        return true
      }
    },
    // 下一步
    handleNextStep() {
      // 校验数据
      if (!this._validateFormData()) return

      if (this.formData.system === 1) {
        this.formData.rule = this.system1Rule
      } else if (this.formData.system === 2) {
        this.formData.rule = this.system2Rule
      }

      if (this.formData.system === 2) {
        // 循环赛
        this.formData.ranking_system = this.rankingSystemSelected.toString()
      }

      console.log('this.formData')
      console.table({ ...this.formData })

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
      })

      request({
        url: '/api/competition/push_stage',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')

            if (this.competitionStage.stage === this.competitionStage.stage_all) {
              // 如果是最后一个阶段
              // 跳转到个人赛奖励页面
              location.href = `/bangwen/competitionAwardPersonal.html?competition_id=${this.competitionStage.competition_id}`
            } else {
              // 还有下个阶段
              // 刷新当前页
              location.reload()
            }
          } else if (result.code === 201) {
            // 发布次数不足，跳转购买会员页面
            console.log('发布次数不足，跳转购买会员页面')
            layer.msg(result.msg)
          } else if (result.code === 202) {
            // 错误信息
            console.log('错误信息')
            layer.msg(result.msg)
          } else if (result.code === 203) {
            // 未绑定手机号
            console.log('未绑定手机号')
            layer.msg(result.msg)
          } else if (result.code === 205) {
            // 余额不足
            console.log('余额不足')
            layer.msg(result.msg)
          } else if (result.code === 206) {
            // 未交保证金
            console.log('未交保证金')
            layer.msg(result.msg)
            syalert.syopen('bondCont')
          } else if (result.code === 207) {
            // 未实名认证
            console.log('未实名认证')
            layer.msg(result.msg)
          } else if (result.code === 208) {
            // 未设置支付密码
            console.log('未设置支付密码')
            layer.msg(result.msg)
          }
        })
        .catch((error) => {
          console.log(error)
          layer.close(loadingIndex)
        })
    },
  },
})
