$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
var encrypt = new JSEncrypt()
//公钥.
const publiukey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'

new Vue({
  el: '#app',
  data() {
    return {
      // 表单数据
      formData: {
        type: '1',// 1教课，2学课
        title: '',// 标题
        b_id: '',// 服务分类id
        total_money: '',// 总金额
        is_trustee: '1',// 1托管，2不托管
        pay_num_type: '1',// 1一次性付清,2多次付清
        pay_num: '1',// 付款次数
        more_type: '1',// 1均分，2自定义金额
        win_type: '1',// 1单人中榜，2多人中榜
        win_num: '1',// 中榜人数
        task_start_time: '',// 任务开始时间
        task_end_time: '',// 任务结束时间
        signup_start_time: '',// 报名开始时间
        signup_end_time: '',// 报名结束时间
        detail: '',// 榜文详情
        image: '',// 封面（路径如：/uploads/20211216/6d39ccf1e51e8e21a0ba946de64cb8f0.jpg）
        files: '',// 文件（路径如：/uploads/20211216/6d39ccf1e51e8e21a0ba946de64cb8f0.jpg）
        mobile: '',// 手机号
        qq: '',// qq号
        email: '',// 邮箱号
        moneys: '',// 如果是多次付清的自定义金额，如10,5,5
      },
      monthnum: '',
      typeList: [{ id: 1, name: '教课' }, { id: 2, name: '学课' }],// 发布类型
      cateList: [],// 服务分类
      trusteeList: [{ id: 1, name: '托管' }, { id: 2, name: '不托管' }],// 酬金托管
      payList: [{ id: 1, name: '一次付清' }, { id: 2, name: '多次付清' }],// 支付方式
      moreList: [{ id: 1, name: '均分金额' }, { id: 2, name: '自定义金额' }],// 金额列表
      winList: [{ id: 1, name: '单人中榜' }, { id: 2, name: '多人中榜' }],// 中榜模式
      competitionSignUpStartTimeMinValue: new Date().valueOf(),
      ordeList: [],// 多次付清数据
      totalMoney: '',
      num: '',
      pay_type: '1',// 支付方式
      pwd: '',// 支付密码
      coverImage: {},// 封面图
      affixList: [],// 附件列表
    }
  },
  watch: {
    totalMoney: {
      handler(e, m) {
        if (this.totalMoney == '') {
          if (this.formData.pay_num_type == 2) {
            this.formData.pay_num_type = 1
          }
        }
        this.formData.total_money = this.totalMoney
        this.num = this.totalMoney * 100
        this.formData.moneys = ''
        this.getCouponSelected()
      }
    },
  },
  async created() {
    this.GetRequest()
    const res = await request({
      method: 'POST',
      url: '/api/Bangwen/cate'
    })
    if (res.code == 200) {
      this.cateList = res.data
      this.formData.b_id = res.data[0].id;
    }
    // 报名起始时间
    layui.laydate.render({
      elem: '#signUpStartDate', //指定元素
      theme: '#FF7F17', // 主题颜色
      btns: ['clear', 'confirm'], // 显示的按钮
      min: this.competitionSignUpStartTimeMinValue, // 最小范围
      // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
      change: (value, date) => { },
      // 点击清空、现在、确定都会触发
      done: (value, date) => {
        this.formData.task_start_time = value
        if (value) {
          initSignUpEndDate()
        }
      },
    })
    // 初始化报名结束时间
    const initSignUpEndDate = () => {
      // 报名结束时间
      layui.laydate.render({
        elem: '#signUpEndDate', //指定元素
        theme: '#FF7F17', // 主题颜色
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionSignUpStartTimeMinValue, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          let dateValue = value
          if (!value) {
            dateValue = ''
          } else if (new Date(this.formData.task_start_time) > new Date(dateValue)) {
            console.log('报名截止日期不能小于报名起始日期')
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '报名截止日期不能小于报名起始日期'
              , btn: ['重新选择']
            });
            dateValue = ''
          }
          this.formData.task_end_time = dateValue
        },
      })
    }
    // 报名起始时间
    layui.laydate.render({
      elem: '#startDate1', //指定元素
      theme: '#FF7F17', // 主题颜色
      btns: ['clear', 'confirm'], // 显示的按钮
      min: this.competitionSignUpStartTimeMinValue, // 最小范围
      // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
      change: (value, date) => { },
      // 点击清空、现在、确定都会触发
      done: (value, date) => {
        this.formData.signup_start_time = value
        if (value) {
          initSignUpEndDate1()
        }
      },
    })
    // 初始化报名结束时间
    const initSignUpEndDate1 = () => {
      // 报名结束时间
      layui.laydate.render({
        elem: '#endDate2', //指定元素
        theme: '#FF7F17', // 主题颜色
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.competitionSignUpStartTimeMinValue, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          let dateValue = value
          if (!value) {
            dateValue = ''
          } else if (new Date(this.formData.task_start_time) > new Date(dateValue)) {
            console.log('报名截止日期不能小于报名起始日期')
            layer.open({
              type: 0,
              icon: 0, // 0 警告，1 成功，2 错误，3 问号，4 锁，5 🙁，6 笑脸
              title: false,
              content: '报名截止日期不能小于报名起始日期'
              , btn: ['重新选择']
            });
            dateValue = ''
          }
          this.formData.signup_end_time = dateValue
        },
      })
    }
    // 初始化选择封面图
    this.initCoverImageFileChange()
  },
  methods: {
    // 初始化选择封面图
    initCoverImageFileChange() {
      layui.upload.render({
        elem: '#uploadCover', //绑定元素
        auto: false, // 是否选完文件后自动上传，默认 true
        // accept: 'image', // 指定允许上传时校验的文件类型
        // acceptMime: '.jpg,.png,.bmp,.jpeg,.webp', // 规定打开文件选择框时，筛选出的文件类型，值为用逗号隔开的 MIME 类型列表
        // exts: 'jpg|png|bmp|jpeg|webp', // 允许上传的文件后缀。一般结合 accept 参数类设定。
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
    // 点击支付方式判断
    getpaynumSelected() {
      if (this.totalMoney == '') {
        if (this.formData.pay_num_type == 2) {
          layer.msg('酬金额度不能为空')
          this.formData.pay_num_type = 1
        }
      }
      if (this.formData.pay_num_type == 1) {
        this.formData.pay_num = 1
        this.formData.more_type = 1
        this.formData.moneys = ''
      }
    },
    // 支付方式多次支付计算
    getCouponSelected() {
      let arr = []
      let num = 0
      let month = Math.floor(this.formData.total_money / this.formData.pay_num * 100) / 100  // 平分
      for (let i = 1; i <= this.formData.pay_num; i++) {
        num = num + month
        arr.push({ id: i, num: month })
      }
      // 判断平分数据和是否等于酬金额度，如果不相等最后一个价格重新计算
      if (num != this.formData.total_money) {
        arr[arr.length - 1].num = (month + (this.formData.total_money - num)).toFixed(2)
      }
      this.ordeList = arr
      let arr1 = []
      for (let i in arr) {
        arr1.push(arr[i].num)
      }
      this.formData.moneys = arr1.toString()
    },
    // 提交
    async onBtnClick() {

      if (!this.formData.title) return layer.msg('请输入标题')
      if (!this.formData.total_money) return layer.msg('请输入金额')
      if (!this.formData.detail) return layer.msg('请输入榜文详情')
      this.formData.image = await util
        .uploadFile({
          file: this.coverImage.file,
          fileName: this.coverImage.file.name,
        })
        .catch((error) => {
          console.log('上传封面图失败', error)
          layer.msg('上传封面图失败')
        })
      if (!this.formData.image) return

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
          layer.msg('上传附件失败')
        })
      if (!affixUrlArr) return
      this.formData.files = affixUrlArr.toString()
      if (this.formData.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.formData.mobile)) return layer.msg('请输入正确的手机号')
      }
      if (this.formData.qq) {
        var qq = "[1-9][0-9]{4,14}"
        if (!qq.test(this.formData.qq)) return layer.msg('请输入正确QQ号')
      }
      if (this.formData.email) {
        var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if (!email.test(this.formData.email)) return layer.msg('请输入正确邮箱')
      }
      // for (let i = 0; i <= this.ordeList.length; i++) {
      //   if (this.ordeList[i].num == 0 || this.ordeList[i].num == '') {
      //     return layer.msg('多次支付里面金额不能为空')
      //   }
      // }
      const res = await request({
        method: 'POST',
        url: '/api/Bangwen/pushBangwen',
        data: this.formData,
      })
      if (res.code == 200) {
        window.location.href = `/bangwen/success.html`
        layer.msg('发布成功')
        // this.cateList = res.data
        // this.formData.b_id = res.data[0].id;
      } else if (res.code == 206) {
        syalert.syopen('bondCont')
      } else {
        layer.msg(res.msg)
      }
    },
    // 保证金
    async onBzjClick() {
      const res = await request({
        method: 'POST',
        url: '/api/Deposit/refer',
        data: { pay_type: this.pay_type }
      })
      if (res.code == 200) {
        if (this.pay_type == '1') {
          encrypt.setPublicKey(publiukey)
          // 加密
          const pwd = encrypt.encrypt(this.pwd) //需要加密的内容
          const ress = await request({
            method: 'POST',
            url: '/api/Deposit/balancePay',
            data: { out_trade_no: res.data.out_trade_no, pay_pwd: pwd }
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
            data: { out_trade_no: res.data.out_trade_no }
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
            data: { out_trade_no: res.data.out_trade_no }
          })
          if (ress.code == 200) {
            location.href = ress.data.code_url
            syalert.syhide('bondCont')
          }
        }
      } else {
        layer.msg(res.msg)
      }
    },
    // 获取当前页面url
    GetRequest() {
      let url = location.search; //获取当前页面url
      let theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      if (theRequest.type) {
        this.formData.type = theRequest.type
      }
    },
  }
})
