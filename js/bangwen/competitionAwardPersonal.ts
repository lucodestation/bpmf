// 发布比赛个人赛赛事奖励

// 引入头部
$('.public-header').load('/components/PublicHeader.html')
// 引入底部
$('.public-footer').load('/components/PublicFooter.html')

var encrypt = new JSEncrypt()
//公钥.
const publiukey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSjs8JJr/Nyb+nOG77agUDf7uTc+kswdVEXbU8v5EL98brAw7fu4dQc1vkh1KSXqiC9EC7YmJzkkFoXUzTH2pvvDlqUuCwtdmXOsq/b1JWKyEXzQlPIiwdHnAUjGbmHOEMAY3jKEy2dY2I6J+giJqo8B2HNoR+zv3KaEmPSHtooQIDAQAB-----END PUBLIC KEY-----'

Vue.use(ELEMENT)

new Vue({
  el: '#app',
  data() {
    return {
      competitionId: '',
      formData: {
        competition_id: '', // 赛事id
        award_type: 1, // 冠亚季
        champion_num: '', // 冠军数量
        champion_money: '', // 冠军奖励金额
        runner_up_num: '', // 亚军数量
        runner_up_money: '', // 亚军奖励金额
        third_winner_num: '', // 季军数量
        third_winner_money: '', // 季军奖励金额
        memo: '', // 奖金备注
        total_money: 0, // 奖金总金额
        trusteeship: '', // 1=托管，2=不托管  备注：选择托管的时候显示支付方式选择，选择不托管不用显示支付方式选择
        pay_way: '', // trusteeship=1的时候传此参数，1=我的钱包，2=支付宝，3=微信
      },
      // 冠军奖金
      championAward: 0,
      // 亚军奖金
      runnerUpAward: 0,
      // 季军奖金
      thirdWinnerAward: 0,
    }
  },
  created() {
    const searchParams = Qs.parse(location.search.substr(1))
    this.competitionId = searchParams.competition_id * 1
    this.formData.competition_id = searchParams.competition_id * 1
  },
  computed: {
    champion() {
      return { num: this.formData.champion_num, money: this.formData.champion_money }
    },
    runnerUp() {
      return { num: this.formData.runner_up_num, money: this.formData.runner_up_money }
    },
    thirdWinner() {
      return { num: this.formData.third_winner_num, money: this.formData.third_winner_money }
    },
  },
  watch: {
    champion(newValue) {
      if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
        // 都是正整数
        this.championAward = newValue.num * newValue.money
      } else {
        this.championAward = 0
      }
      this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward
    },
    runnerUp(newValue) {
      if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
        // 都是正整数
        this.runnerUpAward = newValue.num * newValue.money
      } else {
        this.runnerUpAward = 0
      }
      this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward
    },
    thirdWinner(newValue) {
      if (newValue.num > 0 && newValue.money > 0 && parseInt(newValue.num) === newValue.num && parseInt(newValue.money) === newValue.money) {
        // 都是正整数
        this.thirdWinnerAward = newValue.num * newValue.money
      } else {
        this.thirdWinnerAward = 0
      }
      this.formData.total_money = this.championAward + this.runnerUpAward + this.thirdWinnerAward
    },
  },
  methods: {
    // 测试
    handleTest() {
      console.log('测试')
    },
    // 验证要提交的数据
    _validateFormData() {
      const arr = []

      arr.push(
        { label: '请输入冠军数量', validate: !this.formData.champion_num },
        { label: '数量必须是大于 0 的整数', validate: this.formData.champion_num < 0 || parseInt(this.formData.champion_num) < this.formData.champion_num },
        { label: '请输入冠军奖励金额', validate: !this.formData.champion_money },
        { label: '奖励金额必须是大于 0 的整数', validate: this.formData.champion_money < 0 || parseInt(this.formData.champion_money) < this.formData.champion_money },

        { label: '请输入亚军数量', validate: !this.formData.runner_up_num },
        { label: '数量必须是大于 0 的整数', validate: this.formData.runner_up_num < 0 || parseInt(this.formData.runner_up_num) < this.formData.runner_up_num },
        { label: '请输入亚军奖励金额', validate: !this.formData.runner_up_money },
        { label: '奖励金额必须是大于 0 的整数', validate: this.formData.runner_up_money < 0 || parseInt(this.formData.runner_up_money) < this.formData.runner_up_money },

        { label: '请输入季军数量', validate: !this.formData.third_winner_num },
        { label: '数量必须是大于 0 的整数', validate: this.formData.third_winner_num < 0 || parseInt(this.formData.third_winner_num) < this.formData.third_winner_num },
        { label: '请输入季军奖励金额', validate: !this.formData.third_winner_money },
        { label: '奖励金额必须是大于 0 的整数', validate: this.formData.third_winner_money < 0 || parseInt(this.formData.third_winner_money) < this.formData.third_winner_money },

        { label: '请选择奖金托管方式', validate: !this.formData.trusteeship }
      )

      if (this.formData.trusteeship === 1) {
        arr.push({ label: '请选择支付方式', validate: !this.formData.pay_way })
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

      console.table({ ...this.formData })

      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
      })

      request({
        url: '/api/competition/push_award',
        method: 'post',
        data: this.formData,
      })
        .then((result) => {
          layer.close(loadingIndex)
          console.log(result)
          if (result.code === 200) {
            // 发布成功
            console.log('发布成功')

            // 跳转到个人赛发布赛事成功页面
            location.href = `/bangwen/releaseCompetitionSuccess.html?competition_id=${this.competitionId}`
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
