$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
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
      num: ''
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

  },
  methods: {
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
        // this.cateList = res.data
        // this.formData.b_id = res.data[0].id;
      } else {
        layer.msg(res.msg)
      }
    }
  }
})
