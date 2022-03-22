// 发布比赛

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

var encrypt = new JSEncrypt()
//公钥.
const publiukey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'

// 使用httpVueLoader
Vue.use(httpVueLoader)
Vue.use(ELEMENT)

new Vue({
  components: {
    // 将组建加入组建库
    'release-competition-team': 'url:/vueComponents/releaseCompetitionTeam.vue',
  },

  el: '#app',
  data() {
    return {
      // 赛事类型列表（从服务器获取）
      competitionCateList: [],

      // 赛事种类，0=个人赛，1=团队赛
      competitionType: 0,

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
        sponsor: '', // 赞助方
        service_tel: '', // 客服电话
        cover_picture: '', // 封面图 url
        affix: '', // 附件 url

        apply_info: '', // 报名信息：1=年龄，2=居住地址，3=自我介绍 ps:多个用英文逗号隔开
        contact_info: '', // 联系方式：1=qq,2=MSN,3=SKYPE,4=微信号 ps:多个用英文逗号隔开
        roles: '1,2,3', // 报名角色，1=选手，2=裁判，3=主裁判 ps:多个用英文逗号隔开，必须全选，传递1,2,3
        fee: '', // 报名费用，0=没有报名费，具体金额为每人报名费
        upper_limit: '', // 报名人数上限，0=没有上限，其他值为人数上限，最多不超过10000人
        team_where: 1, // 团队添加，1=组织者添加，2=队员自己填写采用队员总分制团队必须组织者添加
        team_list: '', // team_where=1时必传此参数，团队列表，多个用英文逗号隔开
      },

      // 开始时间
      // 如果分钟是 0 或 30，则开始时间再加 10 分钟
      startDate: new Date().getMinutes() === 0 || new Date().getMinutes() === 30 ? new Date(new Date().valueOf() + 1000 * 60 * 10) : new Date().valueOf(),

      // 报名开始时间
      signUpStartDate: '',
      // 报名结束时间
      signUpEndDate: '',
      // 比赛开始时间
      competitionStartDate: '',
      // 比赛结束时间
      competitionEndDate: '',

      // 封面图
      coverImage: {},
      // 附件列表
      affixList: [],

      // 报名费用输入框是否显示
      feeInputShow: true,
      // 报名人数上限输入框是否显示
      upperLimitInputShow: true,
      // 添加团队名称列表是否显示
      teamListShow: true,
      // 团队名称列表
      teamNameList: [{ id: 1, name: '' }],

      // 保证金弹框
      pay_type: '1', // 支付方式
      pwd: '', // 支付密码
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
    // 测试
    handleTest() {
      console.log('测试')
    },

    // 选择赛事分类-赛事种类（单选框）
    handleSelectCompetitionType(event) {
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.competitionType = value
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
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间', { icon: 0, time: 3000 })
            dateValue = ''
          } else if (date.minutes !== 0 && date.minutes !== 30) {
            // 分钟只能选择 00 或 30
            layer.msg('请选择具体时间', { icon: 0, time: 3000 })
            dateValue = ''
          }

          console.log('报名开始时间', typeof dateValue, dateValue)
          // 设置报名开始时间（页面显示用）
          this.signUpStartDate = dateValue
          // 设置报名开始时间（提交数据用）
          this.formData.a_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() : ''

          // 如果报名结束时间存在且比报名开始时间小（或相等）
          if (this.signUpEndDate && this.signUpEndDate <= this.signUpStartDate) {
            // 如果比赛开始时间存在且比 报名结束时间或报名开始时间小（或相等）
            if (this.competitionStartDate && (this.competitionStartDate <= this.signUpEndDate || this.competitionStartDate <= this.signUpStartDate)) {
              // 如果比赛结束时间存在且比 比赛开始时间或报名结束时间或报名开始时间小（或相等）
              if (
                this.competitionEndDate &&
                (this.competitionEndDate <= this.competitionStartDate || this.competitionEndDate <= this.signUpEndDate || this.competitionEndDate <= this.signUpStartDate)
              ) {
                // 清空比赛结束时间
                this.competitionEndDate = ''
                this.formData.c_e_t = ''
              }
              // 清空比赛开始时间
              this.competitionStartDate = ''
              this.formData.c_b_t = ''
            }
            // 清空报名结束时间
            this.signUpEndDate = ''
            this.formData.a_e_t = ''
          }
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
          } else if (!this.signUpStartDate) {
            // 如果还没有选择报名开始时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '请先选择报名开始时间',
              btn: [],
            })
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpStartDate.replace(/-/g, '/'))) {
            // 如果报名结束时间小于报名开始时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '报名结束时间要大于报名开始时间',
              btn: ['重新选择'],
            })
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
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
          this.signUpEndDate = dateValue
          this.formData.a_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() : ''

          if (this.competitionStartDate && this.competitionStartDate <= this.signUpEndDate) {
            if (this.competitionEndDate && (this.competitionEndDate <= this.competitionStartDate || this.competitionEndDate <= this.signUpEndDate)) {
              this.competitionEndDate = ''
              this.formData.c_e_t = ''
            }
            this.competitionStartDate = ''
            this.formData.c_b_t = ''
          }
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
          } else if (!this.signUpEndDate) {
            // 如果还没有选择报名结束时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '请先选择报名结束时间',
              btn: [],
            })
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpEndDate.replace(/-/g, '/'))) {
            // 如果比赛开始时间小于报名结束时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '比赛开始时间要大于报名结束时间',
              btn: ['重新选择'],
            })
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
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
          this.competitionStartDate = dateValue
          this.formData.c_b_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() : ''

          if (this.competitionEndDate && this.competitionEndDate <= this.competitionStartDate) {
            this.competitionEndDate = ''
            this.formData.c_e_t = ''
          }
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
          } else if (!this.competitionStartDate) {
            // 如果还没有选择比赛开始时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '请先选择比赛开始时间',
              btn: [],
            })
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.competitionStartDate.replace(/-/g, '/'))) {
            // 如果比赛开始时间小于报名结束时间
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '比赛结束时间要大于比赛开始时间',
              btn: ['重新选择'],
            })
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
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
          this.competitionEndDate = dateValue
          this.formData.c_e_t = dateValue ? new Date(dateValue.replace(/-/g, '/')).valueOf() : ''
        },
      })
    },

    // 初始化选择封面图
    initCoverImageFileChange() {
      layui.upload.render({
        elem: '#uploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        accept: 'images', // 指定允许上传时校验的文件类型
        acceptMime: '.jpg,.png,.bmp,.jpeg', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        exts: 'jpg|png|bmp|jpeg', // 允许上传的文件后缀。一般结合 accept 参数类设定。
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
              // 用于提交数据
              file,
              // 用于页面展示
              url: result,
            }
            console.log(this.coverImage)
          })
        },
      })
    },
    // 选择封面图
    handleCoverFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象
      const file = element.files[0]
      console.log(file)
      // .png,.jpg,.jpeg,.bmp
      if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
        layer.open({
          type: 0,
          icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
          title: '',
          content: `不支持 ${util.getExtensionName(file.name)} 文件`,
          btn: ['重新选择'],
        })
      }
    },
    // 选择附件
    handleAffixFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象数组
      const files = element.files

      // 存储符合规定的文件
      const tempArr = [...this.affixList]
      // 存储所选文件中不支持的扩展名
      const errorArr = []
      // 存储所选文件中超过指定大小的文件名
      const errorArr2 = []
      for (const item of files) {
        // 做多上传 5 个文件
        if (tempArr.length < 5) {
          const filesNameList = this.affixList.length ? this.affixList.map((i) => i.name) : []
          // （如果不存在文件名）禁止添加同名文件
          if (!filesNameList.includes(item.name)) {
            console.log(item)
            if (!['png', 'jpg', 'jpeg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(util.getExtensionName(item.name))) {
              if (!errorArr.includes(util.getExtensionName(item.name))) {
                errorArr.push(util.getExtensionName(item.name))
              }
            } else if (item.size > 2048 * 1024) {
              if (!errorArr2.includes(item.name)) {
                errorArr2.push(item.name)
              }
            } else if (tempArr.length < 5) {
              tempArr.push(item)
            }
          }
        }
      }

      console.log('tempArr', tempArr.length, tempArr)

      if (tempArr.length < 5 && errorArr.length) {
        console.log('errorArr', errorArr)
        layer.open({
          type: 0,
          icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
          title: '不受支持的文件类型',
          content: '您选择的 ' + [...errorArr] + ' 类型的文件不受支持',
          btn: ['重新选择'],
        })
      } else if (errorArr2.length) {
        console.log('errorArr2', errorArr2)
        layer.open({
          type: 0,
          icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
          title: '文件过大',
          content: '请选择 2M 以内的文件',
          btn: ['重新选择'],
        })
      }

      this.affixList = tempArr
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
        { label: '请输入赞助方', validate: !this.formData.sponsor },
        { label: '请输入赛事客服电话', validate: !this.formData.service_tel },
        { label: '请选择封面图', validate: !this.coverImage.url }
        // { label: '请选择附件', validate: !this.affixList.length },
        // { label: '请选择报名信息', validate: !this.formData.apply_info },
        // { label: '请选择联系方式', validate: !this.formData.contact_info },
        // { label: '请选择角色', validate: !this.formData.roles }
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
        layer.msg(errorArr[0].label)
      } else {
        return true
      }
    },
    // 下一步
    async handleNextStep(event) {
      console.log('发布比赛 未校验', this.formData)

      // 校验数据
      if (!this._validateFormData()) return

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        time: 10 * 1000, // 如果十秒还没关闭则自动关闭
      })

      // 上传封面图
      this.formData.cover_picture = await util
        .uploadFile({
          file: this.coverImage.file,
          fileName: this.coverImage.file.name,
        })
        .catch((error) => {
          console.log('上传封面图失败', error)
          layer.close(loadingIndex)
          layer.msg('上传封面图失败')
        })
      if (!this.formData.cover_picture) return

      // 上传附件
      const affixUrlArr = await util
        .uploadMultipleFile(
          this.affixList.map((item) => {
            console.log('affixList item', item)
            return {
              file: item,
              fileName: item.name,
            }
          })
        )
        .catch((error) => {
          console.log('上传附件失败', error)
          layer.close(loadingIndex)
          layer.msg('上传附件失败')
        })
      if (!affixUrlArr) return
      this.formData.affix = affixUrlArr.toString()

      if (this.teamListShow) {
        this.formData.team_list = this.teamNameList
          .filter((i) => i.name)
          .map((i) => i.name)
          .toString()
      }
      console.log('发布比赛 已校验', this.formData)

      // 发布赛事
      request({
        url: '/api/competition/push_match',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')

            const successIndex = layer.open({
              type: 0,
              icon: 1, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              closeBtn: 0, // 不显示关闭按钮
              title: false,
              content: result.msg,
              btn: ['确定'],
              yes() {
                console.log('点击了确定')
                layer.close(successIndex)
                // 跳转到个人中心发布赛事页面
                window.location.href = `/userCont/competition/releaseCompetition.html?competition_id=${result.data.competition_id}`
              },
            })
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

    // 保证金
    async onBzjClick() {
      console.log('aa')

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        time: 10 * 1000, // 如果十秒还没关闭则自动关闭
      })
      const res = await request({
        method: 'POST',
        url: '/api/Deposit/refer',
        data: { pay_type: this.pay_type },
      }).catch((error) => {
        console.log('error', error)
      })
      if (res && res.code == 200) {
        layer.close(loadingIndex)
        // this.cateList = res.data
        // this.formData.b_id = res.data[0].id;
        if (this.pay_type == '1') {
          encrypt.setPublicKey(publiukey)
          // 加密
          const pwd = encrypt.encrypt(this.pwd) //需要加密的内容
          const ress = await request({
            method: 'POST',
            url: '/api/Deposit/balancePay',
            data: { out_trade_no: res.data.out_trade_no, pay_pwd: pwd },
          })
          if (ress.code == 200) {
            layer.msg('支付成功')
            syalert.syhide('bondCont')
          } else {
            layer.msg(ress.msg)
          }
        }
        if (this.pay_type == '2') {
          const ress = await request({
            method: 'POST',
            url: '/api/Deposit/aliPay',
            data: { out_trade_no: res.data.out_trade_no },
          })
          if (ress.code == 200) {
            location.href = ress.data.code_url
            syalert.syhide('bondCont')
          }
        }
        if (this.pay_type == '3') {
          const ress = await request({
            method: 'POST',
            url: '/api/Deposit/wxPay',
            data: { out_trade_no: res.data.out_trade_no },
          })
          if (ress.code == 200) {
            location.href = ress.data.code_url
            syalert.syhide('bondCont')
          }
        }
      } else if (res) {
        layer.close(loadingIndex)
        layer.msg(res.msg)
      }
    },
  },
})
