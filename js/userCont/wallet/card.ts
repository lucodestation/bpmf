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
        name: '',// 姓名
        number: '',// 卡号
        bank_name: '',// 开户行
        mobile: '',// 手机号码
        code: '',// 验证码
      },
      codeTxt: '获取验证码',
      second: 60,
      cardList: [],// 列表
      title: '添加银行卡'
    }
  },
  created() {
    this.onCardlist()
  },
  methods: {
    // 获取列表
    async onCardlist() {
      const res = await request({
        method: 'POST',
        url: '/api/Bankcard/list',
      })
      if (res.code == 200) {
        res.data.map(item => {
          item.num = item.number.substr(0, 4) + ' **** **** ' + item.number.substring(item.number.length - 3)
        })
        this.cardList = res.data
      }
    },
    // 获取验证码
    async onCode() {
      if (!this.formData.mobile) return layer.msg('请输入手机号')
      if (this.formData.mobile) {
        var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ //11位手机号码正则
        if (!reg_tel.test(this.formData.mobile)) return layer.msg('请输入正确的手机号')
      }
      let data = { mobile: this.formData.mobile }
      const ress = await request({
        method: 'POST',
        url: '/api/Login/sendCode',
        data: data,
      })
      if (ress.code == 200) {
        this.timeDown()
        layer.msg('发送成功')
      } else {
        layer.msg(ress.msg)
      }
    },
    // 编辑
    onEditClick(item) {
      this.formData.name = item.name
      this.formData.number = item.number
      this.formData.bank_name = item.bank_name
      this.formData.mobile = item.mobile
      this.formData.card_id = item.id
      this.title = '编辑银行卡'
      syalert.syopen('add_bank')
    },
    // 提交
    async onAddClick() {
      if (!this.formData.name) return layer.msg('请输入姓名')
      if (!this.formData.number) return layer.msg('请输入银行卡号')
      if (this.formData.number) {
        var reg_tel = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
        if (!reg_tel.test(this.formData.number)) return layer.msg('请输入正确的银行卡号')
      }
      if (!this.formData.bank_name) return layer.msg('请输入开户银行')
      if (!this.formData.code) return layer.msg('请输入短信验证码')
      if (this.title == '添加银行卡') {
        const res = await request({
          method: 'POST',
          url: '/api/Bankcard/add',
          data: this.formData,
        })
        if (res.code == 200) {
          this.onCardlist()
          layer.msg('添加成功')
          syalert.syhide('add_bank');
        } else {
          layer.msg(res.msg)
        }
      } else {
        const res = await request({
          method: 'POST',
          url: '/api/Bankcard/edit',
          data: this.formData,
        })
        if (res.code == 200) {
          this.onCardlist()
          this.title = '添加银行卡'
          layer.msg('编辑成功')
          syalert.syhide('add_bank');
        } else {
          layer.msg(res.msg)
        }
      }
      this.formData = {
        name: '',// 姓名
        number: '',// 卡号
        bank_name: '',// 开户行
        mobile: '',// 手机号码
        code: '',// 验证码
      }
    },
    timeDown() {
      this.result = setInterval(() => {
        --this.second
        this.codeTxt = this.second + 'S'
        if (this.second < 0) {
          clearInterval(this.result)
          this.sending = true
          this.disabled = false
          this.second = 60
          this.codeTxt = '获取验证码'
        }
      }, 1000)
    },
    // 删除银行卡
    onDelClick(item) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('您确定要删除该银行卡吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          layer.close(index);
          that.onDelete(item)
        });
      });
    },
    // 删除数据
    async onDelete(item) {
      const ress = await request({
        method: 'POST',
        url: '/api/Bankcard/delete',
        data: { card_id: item.id }
      })
      if (ress.code == 200) {
        layer.msg('删除成功')
        this.onCardlist()
      } else {
        layer.msg(ress.msg)
      }
    }
  }
})
