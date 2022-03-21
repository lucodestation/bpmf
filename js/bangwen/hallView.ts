$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      id: '',// id
      newsCont: '',
      formData: {
        bangwen_id: '',// 榜文id
        total_money: '',// 报价
        descri: '',// 应榜描述
        files: '',// 文件路径，多个用逗号隔开
        pay_num_type: '1',// 1一次付清，2多次付清
        pay_num: '',// 支付次数
        more_type: '1',// 1均分，2自定义金额
        moneys: '',// 多次支付的自定义金额，如1.00,50.00,3.00
      },
      payList: [{ id: 1, name: '一次付清' }, { id: 2, name: '多次付清' }],// 支付方式
      moreList: [{ id: 1, name: '均分金额' }, { id: 2, name: '自定义金额' }],// 金额列表
      num: '',
      ordeList: [],// 多次付清数据
      totalMoney: '',// 报价
      content: '',// 举报内容
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
      url: '/api/Bangwen/bangwenDetail',
      data: { bangwen_id: this.id },
    })
    if (res) {
      this.newsCont = res.data
    }
  },
  methods: {
    // 收藏
    onCollClick() {
      request({
        url: '/api/Bangwen/collect',
        method: 'post',
        data: { bangwen_id: this.id },
      }).then((res) => {
        if (res.code == 200) {
          layer.msg(res.msg)
          request({
            url: '/api/Bangwen/bangwenDetail',
            method: 'post',
            data: { bangwen_id: this.id },
          }).then((ress) => {
            this.newsCont = ress.data
          })
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 立即举报
    onReportClick() {
      if (!this.content) return layer.msg('请输入举报内容')
      request({
        url: '/api/Bangwen/report',
        method: 'post',
        data: { bangwen_id: this.id, content: this.content },
      }).then((res) => {
        if (res.code == 200) {
          layer.msg('举报成功')
          syalert.syhide('reportCont')
          this.content = ''
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 点击支付方式判断
    getpaynumSelected() {
      if (this.totalMoney == '') {
        if (this.formData.pay_num_type == 2) {
          layer.msg('报价不能为空')
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
    // 提交数据
    onBtnClick() {
      let arr1 = []
      let num = 0
      for (let i in this.ordeList) {
        arr1.push(this.ordeList[i].num)
        num = Number(num) + Number(this.ordeList[i].num)
      }
      this.formData.moneys = arr1.toString()
      console.log(num.toFixed(0))
      console.log(this.formData)
      if (!this.formData.total_money) return layer.msg('请输入报价')
      if (!this.formData.descri) return layer.msg('请输入描述')
      request({
        url: '/api/Bangwen/attend',
        method: 'post',
        data: this.formData,
      }).then((res) => {
        if (res.code == 200) {
          syalert.syhide('bangCont')
          request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: { bangwen_id: this.id } }).then((ress) => {
            if (ress.code == 200) {
              this.newsCont = ress.data
            } else {
              layer.msg(res.msg)
            }
          })
        } else {
          layer.msg(res.msg)
        }
      })
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
      this.id = theRequest.id
      this.formData.bangwen_id = theRequest.id
    },
  }
})

