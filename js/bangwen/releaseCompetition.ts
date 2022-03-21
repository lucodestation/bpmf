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
console.log('httpVueLoader', httpVueLoader)
Vue.use(httpVueLoader)

new Vue({
  components: {
    // 将组建加入组建库
    'release-personal-competition': 'url:/vueComponents/releasePersonalCompetition.vue',
  },

  el: '#app',
  data() {
    return {
      // 赛事种类，0=个人赛，1=团队赛
      competitionType: 0,

      // 保证金弹框
      pay_type: '1', // 支付方式
      pwd: '', // 支付密码
    }
  },
  mounted() {
    console.log('xxxxxxxx')
  },
  methods: {
    // 测试
    handleTest() {
      console.log('测试')
    },

    // 选择赛事分类-赛事种类（单选框）
    handleSelectCompetitionType(event) {
      console.log(event)
      const target = event.target || event.srcElement
      const value = target.value * 1
      this.competitionType = value
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
