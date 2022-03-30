// 赛事详情
// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

Vue.use(ELEMENT)

const encrypt = new JSEncrypt()

// 支付密码页面
const walletPwdPage = '/userCont/wallet/pwd.html'
// 我的钱包页面（余额不足需要充值跳到这个页面）
const walletAccountPage = '/userCont/wallet/account.html'
// 实名认证页面
const setupRealNamePage = '/userCont/setup/realName.html'
// 我参加的赛事页面
const myParticipatedCompetition = '/userCont/competition/myParticipatedCompetition.html'

const applyDetail = new Vue({
  el: '#app',
  data() {
    return {
      // 当前 tab 0=对阵安排 1=赛事详情
      currentTab: 0,
      // 赛事信息
      competitionInfo: {},
      // 阶段信息
      stageInfo: [],
      // 当前阶段索引
      currentStateIndex: 0,
      // 奖励信息
      awardInfo: {},
      // 广告位列表
      adverList: [],

      // 举报对话框是否显示
      reportDialogVisible: false,
      // 举报内容
      reportContent: '',

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
        role_id: '',
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
      personalIDFileList: [],
      // 附件文件列表
      affixFileList: [],

      // 报名 - 支付金额
      applyPayAmount: 0,
      // 报名 - 支付订单号
      applyPayOrderNo: '',

      // 报名 - 钱包对话框是否显示
      applyWalletPayDialogVisible: false,
      // 支付密码
      applyPayPassword: '',
      // 报名 - 支付宝对话框是否显示
      applyAlipayPayDialogVisible: false,
      // 报名 - 微信对话框是否显示
      applyWechatPayDialogVisible: false,
    }
  },
  // 过滤器
  filters: {
    // 奖金
    bonus(value) {
      // console.log('过滤器', '奖金')
      if (value > 9999 && value % 10000 === 0) {
        return value / 10000 + '万'
      }
      return value * 1 + '元'
    },
    // 时间戳转成日期（xxxx-xx-xx xx:xx）
    timestampToDate(value) {
      // console.log('过滤器', '时间戳转成日期')
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
      // console.log('过滤器', '破同分规则')
      // console.log(
      //   value
      //     .split(',')
      //     .map((item) => arr[+item])
      //     .join('、')
      // )
      return value
        .split(',')
        .map((item) => arr[+item])
        .join('、')
    },
    // 从url中获取文件名（获取的文件名不包括时间戳和-）
    affixUrlFileName(value) {
      // console.log('过滤器', '从url中获取文件名')
      const arr = value.split('/')
      const fileName = arr[arr.length - 1]
      return fileName.substr(fileName.indexOf('-') + 1)
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
      // this.handleOpenApplyDialog()
    }

    // 加载赛事广告位
    request({
      url: '/api/Competitionindex/adverList',
      method: 'post',
      data: { competition_id: searchParams.competition_id },
    }).then((result) => {
      if (+result.code === 200) {
        this.adverList = result.data
      }
    })
  },
  methods: {
    // 分享
    handleShare() {
      const input = document.createElement('input') // 直接构建input
      input.value = window.location.href // 设置内容（要复制到剪贴板的内容）
      document.body.appendChild(input) // 添加临时实例
      input.select() // 选择实例内容
      const copyResult = document.execCommand('Copy') // 执行复制
      console.log('copyResult', copyResult)
      document.body.removeChild(input) // 删除临时实例
      layer.msg('链接已复制到剪切板')
    },
    // 关闭举报对话框
    handleCloseReportDialog() {
      this.reportDialogVisible = false
      this.reportContent = ''
    },
    // 提交举报
    handleSubmitReport() {
      if (this.reportContent === '') {
        layer.msg('请输入举报内容')
        return
      }

      layer.msg('开发中...')

      console.log('举报内容', this.reportContent)
    },
    // 打开报名对话框
    async handleOpenApplyDialog() {
      // this.applyDialogVisible = true
      // return

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
    // 选择身份证明
    handleIdentificationFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象数组
      const files = element.files
      // 限制文件个数
      const fileNumber = 3

      window.URL = window.URL || window.webkitURL

      // 存储符合规定的文件
      const tempArr = [...this.personalIDFileList]
      // 存储所选文件中不支持的扩展名
      const errorArr = []
      // 存储所选文件中超过指定大小的文件名
      const errorArr2 = []
      for (const item of files) {
        // 限制个数 fileNumber 个
        if (tempArr.length < fileNumber) {
          const filesNameList = this.personalIDFileList.length ? this.personalIDFileList.map((i) => i.name) : []
          // （如果不存在文件名）禁止添加同名文件
          if (!filesNameList.includes(item.name)) {
            console.log(item)
            if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(item.name))) {
              // 限制扩展名
              if (!errorArr.includes(util.getExtensionName(item.name))) {
                errorArr.push(util.getExtensionName(item.name))
              }
            } else if (item.size > 1024 * 1024 * 10) {
              // 限制大小 10M
              if (!errorArr2.includes(item.name)) {
                errorArr2.push(item.name)
              }
            } else if (tempArr.length < fileNumber) {
              console.log('添加文件')
              tempArr.push({
                // 用于提交数据
                file: item,
                name: item.name,
                // 用于页面展示
                url: window.URL.createObjectURL(item),
              })
              if (this.applyDialogData.i_image) {
                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                this.applyDialogData.i_image = ''
              }
            }
          }
        }
      }

      console.log('tempArr', tempArr.length, tempArr)

      if (tempArr.length < fileNumber && errorArr.length) {
        console.log('errorArr', errorArr)
        layer.msg(`不支持 ${[...errorArr]} 文件`)
      } else if (errorArr2.length) {
        console.log('errorArr2', errorArr2)
        layer.msg(`请选择 10M 以内的文件`)
      }

      this.personalIDFileList = tempArr
      element.value = ''
      console.log({ ...this.personalIDFileList })
    },
    // 删除身份证明
    handleDeleteIdentificationFile(index) {
      this.personalIDFileList.splice(index, 1)
      if (this.applyDialogData.i_image) {
        // 如果有 url，说明上传过了，改变附件的时候把 url 删除
        this.applyDialogData.i_image = ''
      }
    },
    // 选择文件
    handleAffixFileChange(event) {
      const element = event.target || event.srcElement
      // 获取文件对象数组
      const files = element.files
      // 限制文件个数
      const fileNumber = 6

      window.URL = window.URL || window.webkitURL

      // 存储符合规定的文件
      const tempArr = [...this.affixFileList]
      // 存储所选文件中不支持的扩展名
      const errorArr = []
      // 存储所选文件中超过指定大小的文件名
      const errorArr2 = []
      for (const item of files) {
        // 限制个数 fileNumber 个
        if (tempArr.length < fileNumber) {
          const filesNameList = this.affixFileList.length ? this.affixFileList.map((i) => i.name) : []
          // （如果不存在文件名）禁止添加同名文件
          if (!filesNameList.includes(item.name)) {
            console.log(item)
            if (!['pdf', 'doc', 'docx'].includes(util.getExtensionName(item.name))) {
              // 限制扩展名
              if (!errorArr.includes(util.getExtensionName(item.name))) {
                errorArr.push(util.getExtensionName(item.name))
              }
            } else if (item.size > 1024 * 1024 * 2) {
              // 限制大小 2M
              if (!errorArr2.includes(item.name)) {
                errorArr2.push(item.name)
              }
            } else if (tempArr.length < fileNumber) {
              console.log('添加文件')
              tempArr.push({
                // 用于提交数据
                file: item,
                name: item.name,
              })
              if (this.applyDialogData.affix) {
                // 如果有 url，说明上传过了，改变附件的时候把 url 删除
                this.applyDialogData.affix = ''
              }
            }
          }
        }
      }

      console.log('tempArr', tempArr.length, tempArr)

      if (tempArr.length < fileNumber && errorArr.length) {
        console.log('errorArr', errorArr)
        layer.msg(`不支持 ${[...errorArr]} 文件`)
      } else if (errorArr2.length) {
        console.log('errorArr2', errorArr2)
        layer.msg(`请选择 2M 以内的文件`)
      }

      this.affixFileList = tempArr
      element.value = ''
      console.log({ ...this.affixFileList })
    },
    // 删除文件
    handleDeleteAffixFile(index) {
      this.affixFileList.splice(index, 1)
      if (this.applyDialogData.affix) {
        // 如果有 url，说明上传过了，改变附件的时候把 url 删除
        this.applyDialogData.affix = ''
      }
    },
    // 验证要提交的数据
    _validateApplyDialogData() {
      const arr = []

      arr.push(
        { label: '请选择角色', validate: !this.applyDialogData.role_id },
        { label: '请输入其他平台比赛账号', validate: !this.applyDialogData.account_number },
        { label: '请输入姓名', validate: !this.applyDialogData.username }
      )
      if (+this.applyDialogInfo.team_where === 1) {
        arr.push({ label: '请选择所在团队', validate: !this.applyDialogData.team })
      } else if (+this.applyDialogInfo.team_where === 2) {
        arr.push({ label: '请输入代表队', validate: !this.applyDialogData.team })
      }
      arr.push({ label: '请输入手机号', validate: !this.applyDialogData.tel }, { label: '手机号格式不正确', validate: !util.validateMobile(this.applyDialogData.tel) })
      if (this.applyDialogData.role_id === 1) {
        arr.push({ label: '请选择技术水平', validate: !this.applyDialogData.skill_id }, { label: '请选择技术等级', validate: !this.applyDialogData.level_id })
      }
      arr.push(
        { label: '请选择省份', validate: !this.applyDialogData.province },
        { label: '请选择城市', validate: !this.applyDialogData.city },
        { label: '请选择区县', validate: !this.applyDialogData.area },
        { label: '请选择身份证明图片', validate: !this.personalIDFileList.length }
      )

      if (this.applyDialogInfo.fee > 0) {
        arr.push({ label: '请选择支付方式', validate: !this.applyDialogData.pay_way })
      }
      arr.push({ label: '请阅读并同意《玻坡摸佛榜文（需求）规则》', validate: !this.agreedAgreement })

      const errorArr = arr.filter((item) => item.validate)
      if (errorArr.length) {
        layer.msg(errorArr[0].label)
      } else {
        return true
      }
    },
    // 提交申请报名
    async handleSubmitApply() {
      if (!this._validateApplyDialogData()) return

      console.table({ ...this.applyDialogData })
      // return

      this.applyDialogData.competition_id = this.applyDialogInfo.competition_id

      // 如果有 url 说明已经上传过了，没有时才去上传
      if (!this.applyDialogData.i_image) {
        // 上传图片
        const imageUrlArr = await util
          .uploadMultipleFile(
            this.personalIDFileList.map((item) => {
              console.log('personalIDFileList item', item)
              return {
                file: item.file,
                fileName: item.name,
              }
            })
          )
          .catch((error) => {
            console.log('上传图片失败', error)
            layer.msg('上传图片失败')
          })
        if (!imageUrlArr) return
        this.applyDialogData.i_image = imageUrlArr.toString()
      }

      // 如果有 url 说明已经上传过了，没有时才去上传
      if (!this.applyDialogData.affix) {
        // 上传附件
        const affixUrlArr = await util
          .uploadMultipleFile(
            this.affixFileList.map((item) => {
              console.log('affixFileList item', item)
              return {
                file: item.file,
                fileName: item.name,
              }
            })
          )
          .catch((error) => {
            console.log('上传图片失败', error)
            layer.msg('上传图片失败')
          })
        if (!affixUrlArr) return
        this.applyDialogData.affix = affixUrlArr.toString()
      }

      // 提交报名信息
      const result = await request({
        url: '/api/competition/apply_submit',
        method: 'post',
        data: this.applyDialogData,
      })

      console.log(result)
      if (+result.code === 200) {
        if (!result.data.pay_check) {
          // 无需付费
          this.$alert('<div style="text-align: center; font-size: 20px;">' + result.msg + '</div>', '', {
            confirmButtonText: '确定',
            showClose: false,
            dangerouslyUseHTMLString: true,
            confirmButtonClass: 'orange-button-bg',
            callback: () => {
              // 刷新当前页
              window.location.reload()
            },
          })
        } else {
          // 需要付费
          // 支付金额
          this.applyPayAmount = result.data.total_money
          // 支付订单号
          this.applyPayOrderNo = result.data.out_trade_no

          if (+result.data.pay_way === 1) {
            // 钱包支付
            console.log('钱包支付')

            // 判断是否设置了支付密码
            const userInfoResult = await request({ url: '/api/Mine/info' })
            if (+userInfoResult.code === 200 && +userInfoResult.data.is_set_paypwd === 0) {
              // 未设置支付密码
              this.$alert('<div style="text-align: center; font-size: 20px;">请先设置支付密码</div>', '', {
                confirmButtonText: '确定',
                showClose: false,
                dangerouslyUseHTMLString: true,
                confirmButtonClass: 'orange-button-bg',
                callback: () => {
                  // 在新窗口中打开页面
                  // 打开设置支付密码页面
                  window.open(walletPwdPage)
                },
              })
              return
            }

            // 打开钱包支付对话框
            this.applyWalletPayDialogVisible = true
          } else if (+result.data.pay_way === 2) {
            // 支付宝支付
            console.log('支付宝支付')
            // 支付宝支付
            this._applyAlipayPay()
          } else if (+result.data.pay_way === 3) {
            // 微信支付
            console.log('微信支付')
            this._applyWechatPay()
          }
        }
      } else {
        layer.msg(result.msg)
      }
    },
    // 关闭报名钱包支付对话框
    handleCloseApplyWalletPayDialog() {
      // 跳转到我参加的赛事页面
      window.location.href = myParticipatedCompetition
    },
    // 提交报名钱包支付
    async handleSubmitApplyWalletPay() {
      if (!this.applyPayPassword) layer.msg('请输入支付密码')

      // 对密码进行加密
      encrypt.setPublicKey(publiukey)
      const payPassword = encrypt.encrypt(this.applyPayPassword) //需要加密的内容

      const payResult = await request({
        url: '/api/pay/pay_by_balance',
        method: 'post',
        data: {
          out_trade_no: this.applyPayOrderNo,
          total_money: this.applyPayAmount,
          pay_pwd: payPassword,
        },
      })
      console.log('payResult', payResult)

      if (+payResult.code === 200) {
        this.$alert('<div style="text-align: center; font-size: 20px;">支付成功</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 刷新当前页
            window.location.reload()
          },
        })
      } else if (+payResult.code === 5) {
        // 余额不足
        this.$alert('<div style="text-align: center; font-size: 20px;">余额不足，请充值</div>', '', {
          confirmButtonText: '确定',
          showClose: false,
          dangerouslyUseHTMLString: true,
          confirmButtonClass: 'orange-button-bg',
          callback: () => {
            // 在新窗口中打开页面
            // 我的钱包页面
            window.open(walletAccountPage)
          },
        })
      } else {
        layer.msg(payResult.msg)
      }
    },

    // 报名支付宝支付
    async _applyAlipayPay() {
      this.applyAlipayPayDialogVisible = true

      // 支付宝支付
      // 这里不需要接收返回值，因为啥都没返回
      // 二维码是把请求域名加上请求路径再加上请求参数来生成的
      await request({
        url: '/api/pay/pay_by_ali',
        params: { out_trade_no: this.applyPayOrderNo, total_money: this.applyPayAmount },
      })

      // 警告：this.alipayPayDialogVisible = true 不能放到这里

      const alipayPayQrcodeElement = document.getElementById('applyAlipayPayQrcode')
      // 清除之前生成的二维码
      alipayPayQrcodeElement.innerHTML = ''
      // 生成二维码
      const alipayPayQrcode = new QRCode(alipayPayQrcodeElement, {
        width: 260,
        height: 260,
      })
      // 生成 query 字符串（不带 ?）
      const queryString = Qs.stringify({
        out_trade_no: this.applyPayOrderNo,
        token: localStorage.getItem('token'),
      })
      const codeUrl = baseURL + '/api/pay/pay_by_ali?' + queryString
      alipayPayQrcode.makeCode(codeUrl)

      // 启动获取赛事信息计时器
      // this._startGetCompetitionDetailTimer()
    },
    // 关闭报名支付宝支付对话框
    handleCloseApplyAlipayPayDialog() {
      // 跳转到我参加的赛事页面
      window.location.href = myParticipatedCompetition
    },

    // 报名微信支付
    _applyWechatPay() {
      this.applyWechatPayDialogVisible = true

      // 微信支付
      request({
        url: '/api/pay/pay_by_wx',
        method: 'post',
        data: {
          out_trade_no: this.applyPayOrderNo,
          total_money: this.applyPayAmount,
        },
      }).then((result) => {
        if (result.code === 200) {
          // 警告：this.wechatPayDialogVisible = true 不能放到这里

          const wechatPayQrcodeElement = document.getElementById('applyWechatPayQrcode')
          // 清除之前生成的二维码
          wechatPayQrcodeElement.innerHTML = ''
          // 生成二维码
          const wechatPayQrcode = new QRCode(wechatPayQrcodeElement, {
            width: 260,
            height: 260,
          })
          wechatPayQrcode.makeCode(result.data.code_url)

          // 启动获取赛事信息计时器
          // this._startGetCompetitionDetailTimer()
        }
      })
    },
    // 关闭报名微信支付对话框
    handleCloseApplyWechatPayDialog() {
      // 跳转到我参加的赛事页面
      window.location.href = myParticipatedCompetition
    },
  },
})
