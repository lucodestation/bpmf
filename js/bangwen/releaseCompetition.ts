// 发布比赛

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

new Vue({
  el: '#app',
  data() {
    return {
      // 赛事类型列表（从服务器获取）
      competitionCateList: [],

      // 表单数据
      formData: {
        competition_type: 0, // 赛事种类，0=个人赛，1=团队赛
        category_id: 1, // 赛事类型，1=围棋，2=象棋，3=五子棋，4=国际象棋，5=其他
        category_memo: '', // 赛事类型补充说明，赛事类型是“其他”时才填写
        competition_name: '', // 赛事名称
        stage: 1, // 比赛阶段总数，1~5，如果采用队员总分制，则只能是 1
        is_total_points: 0, // 是否采用队员总分制：0=否，1=是
        way: 0, // 比赛方式：0=线下场地，1=线上游戏平台
        way_memo: '', // 比赛方式补充说明
        join_type: 1, // 参与类型：1=自由参与，2=批准参与
        a_b_t: '', // 报名开始时间，时间戳（秒），步长 半小时
        a_e_t: '', // 报名结束时间，时间戳（秒）
        c_b_t: '', // 比赛开始时间，时间戳（秒）
        c_e_t: '', // 比赛结束时间，时间戳（秒）
        description: '', // 赛事描述
        cover_picture: '', // 封面图 url
        affix: '', // 附件 url

        apply_info: '', // 报名信息：1=年龄，2=居住地址，3=自我介绍 ps:多个用英文逗号隔开
        contact_info: '', // 联系方式：1=qq,2=MSN,3=SKYPE,4=微信号 ps:多个用英文逗号隔开
        roles: '', // 报名角色，1=选手，2=裁判，3=主裁判 ps:多个用英文逗号隔开，必须全选，传递1,2,3
        fee: '', // 报名费用，0=没有报名费，具体金额为每人报名费
        upper_limit: 0, // 报名人数上限，0=没有上限，其他值为人数上限，最多不超过10000人
        team_where: 1, // 团队添加，1=组织者添加，2=队员自己填写采用队员总分制团队必须组织者添加
        team_list: '', // team_where=1时必传此参数，团队列表，多个用英文逗号隔开
      },

      // 开始时间
      // 如果分钟是 0 或 30，则开始时间再加 10 分钟
      startDate: new Date().getMinutes() === 0 || new Date().getMinutes() === 30 ? new Date(new Date().valueOf() + 1000 * 60 * 10) : new Date().valueOf(),

      // 封面图
      coverImage: {},
      // 附件列表
      affixList: [],

      // 报名费用输入框是否显示
      feeInputShow: true,
      // 报名人数上限输入框是否显示
      upperLimitInputShow: false,
      // 添加团队名称列表是否显示
      teamListShow: true,
      // 团队名称列表
      teamNameList: [{ id: 1, name: '' }],
    }
  },
  mounted() {
    // 获取赛事类型列表
    request({
      url: '/api/Competition/get_category_list',
    }).then((result) => {
      console.log('赛事类型列表', result)
      if (+result.code == 200) {
        this.competitionCateList = result.data
      } else {
      }
    })

    // 初始化日期时间选择器
    // 初始化报名开始时间
    this.initSignUpStartDate()
    // 初始化报名结束时间
    this.initSignUpEndDate()
    // 初始化比赛开始时间
    this.initCompetitionStartDate()
    // 初始化比赛结束时间
    this.initCompetitionEndDate()

    // 初始化选择封面图
    this.initCoverImageFileChange()
  },
  methods: {
    // 选择赛事分类-赛事种类（单选框）
    handleSelectCompetitionType(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.formData.competition_type = value
    },
    // 选择赛事类型（单选框）
    handleSelectCompetitionCate(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.formData.category_id = value
    },
    // 选择是否采用队员总分制（单选框）
    handleSelectCompetitionTotalPointes(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.formData.is_total_points = value
      if (value === 1) {
        this.formData.stage = 1
      }
    },
    // 选择比赛方式（单选框）
    handleSelectCompetitionWay(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.formData.way = value
    },
    // 选择赛事描述-赛事种类（单选框）
    handleSelectJoinType(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.formData.join_type = value
    },

    // 初始化报名开始时间
    initSignUpStartDate() {
      layui.laydate.render({
        elem: '#signUpStartDate', //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
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
          } else if (new Date(dateValue) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 })
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间', { icon: 0, time: 3000 })
            dateValue = ''
          }

          console.log('报名开始时间', dateValue)
          this.formData.a_b_t = dateValue
        },
      })
    },
    // 初始化报名结束时间
    initSignUpEndDate() {
      console.log('初始化报名结束时间')
      layui.laydate.render({
        elem: '#signUpEndDate', //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
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
          } else if (!this.formData.a_b_t) {
            // 如果还没有选择报名开始时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '请先选择报名开始时间',
              btn: [],
            })
            dateValue = ''
          } else if (new Date(dateValue) <= new Date(this.formData.a_b_t)) {
            // 如果报名结束时间小于报名开始时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '报名结束时间要大于报名开始时间',
              btn: ['重新选择'],
            })
            dateValue = ''
          } else if (new Date(dateValue) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 })
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间', { icon: 0, time: 3000 })
            dateValue = ''
          }

          console.log('报名结束时间', dateValue)
          this.formData.a_e_t = dateValue
        },
      })
    },
    // 初始化比赛开始时间
    initCompetitionStartDate() {
      layui.laydate.render({
        elem: '#competitionStartDate', //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
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
          } else if (!this.formData.a_e_t) {
            // 如果还没有选择报名结束时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '请先选择报名结束时间',
              btn: [],
            })
            dateValue = ''
          } else if (new Date(dateValue) <= new Date(this.formData.a_e_t)) {
            // 如果比赛开始时间小于报名结束时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '比赛开始时间要大于报名结束时间',
              btn: ['重新选择'],
            })
            dateValue = ''
          } else if (new Date(dateValue) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 })
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间', { icon: 0, time: 3000 })
            dateValue = ''
          }

          console.log('比赛开始时间', dateValue)
          this.formData.c_b_t = dateValue
        },
      })
    },
    // 初始化比赛结束时间
    initCompetitionEndDate() {
      layui.laydate.render({
        elem: '#competitionEndDate', //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
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
          } else if (!this.formData.c_b_t) {
            // 如果还没有选择比赛开始时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '请先选择比赛开始时间',
              btn: [],
            })
            dateValue = ''
          } else if (new Date(dateValue) <= new Date(this.formData.c_b_t)) {
            // 如果比赛开始时间小于报名结束时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '比赛结束时间要大于比赛开始时间',
              btn: ['重新选择'],
            })
            dateValue = ''
          } else if (new Date(dateValue) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 })
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间', { icon: 0, time: 3000 })
            dateValue = ''
          }

          console.log('比赛结束时间', dateValue)
          this.formData.c_e_t = dateValue
        },
      })
    },

    // 初始化选择封面图
    initCoverImageFileChange() {
      layui.upload.render({
        elem: '#uploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        accept: 'image', // 指定允许上传时校验的文件类型
        acceptMime: '.jpg,.png,.bmp,.jpeg,.webp', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        exts: 'jpg|png|bmp|jpeg|webp', // 允许上传的文件后缀。一般结合 accept 参数类设定。
        size: 0, // 设置文件最大可允许上传的大小，单位 KB，0 表示不限制
        multiple: false, // 是否允许多文件上传, 默认 false
        // 选择文件回调
        choose: (result) => {
          console.log(result)
          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
          result.preview((index, file, result) => {
            // console.log(index) //得到文件索引
            // console.log(file) //得到文件对象
            // console.log(result) //得到文件base64编码，比如图片

            this.coverImage = {
              file,
              url: result,
            }
            console.log(this.coverImage)
          })
        },
      })
    },
    // 选择附件
    handleAffixFileChange(event) {
      const element = event.target || event.srcElement
      const files = element.files

      window.URL = window.URL || window.webkitURL
      const tempArr = []
      const errorArr = new Set()
      for (const item of files) {
        const filesNameList = this.affixList.length ? this.affixList.map((i) => i.name) : []
        // （如果不存在文件名）禁止添加同名文件
        if (!filesNameList.includes(item.name)) {
          if (!['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
            errorArr.add(util.getExtensionName(item.name))
          } else if (tempArr.length < 5) {
            tempArr.push({
              file: item,
              name: item.name,
              url: window.URL.createObjectURL(item),
            })
          }
        }
      }
      if (errorArr.size) {
        layer.open({
          type: 0,
          icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
          title: '不受支持的文件类型',
          content: '您选择的 ' + [...errorArr] + ' 类型的文件不受支持',
          btn: ['重新选择'],
        })
      }

      if (this.affixList.length > 5) {
        tempArr.length = 5 - this.affixList.length
      }
      this.affixList.push(...tempArr)
      element.value = ''
      console.log({ ...this.affixList })
    },
    // 删除附件
    handleDeleteAffix(index) {
      this.affixList = this.affixList.filter((item, ind) => index !== ind)
    },

    // 选择报名信息（复选框）（年龄、居住地址、自我介绍）
    handleSelectApplyInfo(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.apply_info.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.apply_info = arr.toString()
    },
    // 选择联系方式（复选框）（QQ、MSN、SKYPE、微信号）
    handleSelectContactInfo(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.contact_info.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.contact_info = arr.toString()
    },
    // 选择角色（复选框）（选手、裁判、主裁判）
    handleSelectRoles(event) {
      const target = event.target || event.srcElement
      const value = target.value
      let arr = this.formData.roles.split(',').filter((i) => i !== '')
      if (arr.includes(value)) {
        // 已有则删除
        arr = arr.filter((i) => i !== value)
      } else {
        // 没有则添加
        arr.push(value)
      }
      this.formData.roles = arr.toString()
    },
    // 选择报名费用（单选框）
    handleSelectFee(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value) {
        // 有
        this.feeInputShow = true
        this.formData.fee = ''
      } else {
        // 无
        this.feeInputShow = false
        this.formData.fee = 0
      }
    },
    // 选择报名人数上限（单选框）
    handleSelectUpperLimit(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value) {
        // 有
        this.upperLimitInputShow = true
        this.formData.upper_limit = ''
      } else {
        // 无
        this.upperLimitInputShow = false
        this.formData.upper_limit = 0
      }
    },
    // 选择添加团队（单选框）
    handleSelectTeamWhere(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      if (value === 1) {
        // 组织者添加
        this.formData.team_where = 1
        this.teamListShow = true
      } else if (value === 2) {
        // 各队员自己添加
        this.formData.team_where = 2
        this.teamListShow = false
      }
    },
    // 删除团队名称
    handleDeleteTeamName(index) {
      this.teamNameList.splice(index, 1)
    },
    // 添加团队名称
    handleAddTeamName() {
      const maxId = Math.max(...this.teamNameList.map((i) => i.id))
      this.teamNameList.push({ id: maxId + 1, name: '' })
    },

    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      if (this.formData.category_id === 5) {
        arr.push({ label: '请输入赛事类型补充说明', validate: !this.formData.category_memo })
      }

      arr.push({ label: '请输入赛事名称', validate: !this.formData.competition_name })

      if (this.formData.is_total_points) {
        arr.push({ label: '队员总分制的比赛阶段总数必须为 1', validate: this.formData.stage !== 1 })
      } else {
        arr.push({ label: '比赛阶段总数必须是 1~5 的整数（包括 1 和 5 ）', validate: ![1, 2, 3, 4, 5].includes(this.formData.stage) })
      }

      if (this.formData.way === 1) {
        arr.push({ label: '请输入比赛方式补充说明', validate: !this.formData.way_memo })
      }

      arr.push(
        { label: '请选择报名开始时间', validate: !this.formData.a_b_t },
        { label: '请选择报名结束时间', validate: !this.formData.a_e_t },
        { label: '请选择比赛开始时间', validate: !this.formData.c_b_t },
        { label: '请选择比赛结束时间', validate: !this.formData.c_e_t },
        { label: '请输入赛事描述', validate: !this.formData.description.trim() },
        { label: '请选择封面图', validate: !this.coverImage.url },
        { label: '请选择附件', validate: !this.affixList.length },
        { label: '请选择报名信息', validate: !this.formData.apply_info },
        { label: '请选择联系方式', validate: !this.formData.contact_info },
        { label: '请选择角色', validate: !this.formData.roles }
      )

      if (this.feeInputShow) {
        arr.push({ label: '请输入报名费用', validate: !this.formData.fee }, { label: '报名费用必须大于 0', validate: this.formData.fee <= 0 })
      }

      if (this.upperLimitInputShow) {
        arr.push(
          { label: '请输入报名人数上限', validate: !this.formData.upper_limit },
          { label: '报名人数上限必须是大于 0 的整数', validate: this.formData.upper_limit <= 0 || this.formData.upper_limit % 1 !== 0 }
        )
      }

      if (this.teamListShow) {
        const tempArr = this.teamNameList.filter((i) => i.name)
        arr.push({ label: '请输入团队名称', validate: !tempArr.length })
      }

      const errorArr = arr.filter((item) => item.validate)
      if (errorArr.length) {
        layer.msg(errorArr[0].label, { icon: 0, time: 3000 })
      } else {
        return true
      }
    },
    // 下一步
    handleNextStep(event) {
      if (!this._validateFormData()) return
      // if (this.formData.team_where === 1) {
      //   this.formData.team_list = this.teamNameList
      //     .filter((i) => i.name)
      //     .map((i) => i.name)
      //     .toString()
      // }
      // var formData = new FormData()
      // formData.append('file', this.coverImage.file)
      // console.log(formData.get('file'))

      // console.log('OSS', OSS)

      // const client = new OSS({
      //   // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      //   region: 'oss-cn-beijing',
      //   // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      //   accessKeyId: 'LTAI4GDaFivfzrgrQxzncZHT',
      //   accessKeySecret: 'OY9GL3QKj6D78EwkdojkZY132vbLEA',
      //   // 从STS服务获取的安全令牌（SecurityToken）。
      //   stsToken: 'yourSecurityToken',
      //   // 填写Bucket名称。
      //   bucket: 'bpmf',
      // })

      // // client.put('test.txt', formData).then((r) => console.log(r))
    },
  },
})
