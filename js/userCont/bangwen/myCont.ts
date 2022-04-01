$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
Vue.use(ELEMENT)
new Vue({
  el: '#app',
  data() {
    return {
      id: '',// 应榜订单id
      bangwen_id: '',// 榜文id
      cateList: [],// 棋分类
      noticeCont: '',// 详情内容
      name: '',// 棋名
      selectList: [],// 阶段列表数据
      terminateTaskVisible: false,// 终止任务是否显示
      check_content: '',// 反馈内容
      check_phone: '',// 联系方式
      status: '',
      checknum: 0
    }
  },
  created() {
    this.GetRequest()
    // 分类列表
    request({ method: 'POST', url: '/api/Bangwen/cate' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
      }
    })
    // 详情内容
    request({ url: '/api/Bangwenattend/attendDetail', method: 'POST', data: { attend_id: this.id }, }).then((res) => {
      if (res.code == 200) {
        res.data.detail.map((item, k) => {
          item.num = k + 1
        })
        res.data.blList = this.group(res.data.detail, 3)
        this.noticeCont = res.data
      }
    })
    // 开始学习后阶段
    // request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.bangwen_id }, }).then((res) => {
    //   if (res.code == 200) {
    //     res.data.map(item => {
    //       item.detail.map((items, k) => {
    //         items.num = k + 1
    //         item.blList = this.group(item.detail, 3)
    //       })
    //     })
    //     this.selectList = res.data
    //   }
    // })
  },
  methods: {
    // 数组重构
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    },
    // 点击开始学课
    async onBeginTeachClick(item) {
      const ress = await request({ method: 'POST', url: '/api/Bangwenattend/outBeginTeach', data: { order_id: item.id }, })
      if (ress.code == 200) {
        // this.timeDown()
        layer.msg('发送成功')
      } else {
        layer.msg(ress.msg)
      }
    },
    // onBeginTeachClick(item) {
    //   request({ url: '/api/Bangwenattend/outBeginTeach', method: 'POST', data: { order_id: item.id }, }).then((res) => {
    //     if (res.code == 200) {
    //       // this.noticeCont = res.data
    //     } else {
    //       layer.msg(res.msg)
    //     }
    //   })
    //   // request({ url: '/api/Bangwenattend/outBeginTeach', method: 'POST', data: { order_id: item.id } }).then((res) => {
    //   //   if (res.code == 200) {
    //   //     // res.data.map(item => {
    //   //     //   item.detail.map((items, k) => {
    //   //     //     items.num = k + 1
    //   //     //     item.blList = this.group(item.detail, 3)
    //   //     //   })
    //   //     // })
    //   //     // this.selectList = res.data
    //   //     // console.log(this.selectList)
    //   //   }
    //   // })
    // },
    // 终止原因弹框是否同意协议
    ondjclick() {
      this.checknum = this.checknum == 0 ? 1 : 0
    },
    // 终止原因关闭弹框
    onQueryClick() {
      this.terminateTaskVisible = false
      this.check_content = ''
      this.check_phone = ''
      this.status = ''
      this.checknum = 0
    },
    // 终止原因弹框提交数据
    onzzyyClick() {
      if (this.checknum == 0) return layer.msg('请阅读并同意协议')
      if (!this.check_content) return layer.msg('请输入反馈内容')
      if (!this.status) return layer.msg('请选择是否要平台介入')
      if (!this.check_phone) return layer.msg('请输入手机号')
      if (this.check_phone) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.check_phone)) return layer.msg('请输入正确的手机号')
      }
      request({ url: '/api/Bangwenpush/checkReferEnd', method: 'POST', data: { check_content: this.check_content, check_phone: this.check_phone, status: this.status }, }).then((res) => {
        if (res.code == 200) {
          layer.msg('提交成功')
          this.terminateTaskVisible = false
          this.check_content = ''
          this.check_phone = ''
          this.status = ''
          this.checknum = 0
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
      this.name = theRequest.name
      this.bangwen_id = theRequest.bangwen_id
    },
  }
})
