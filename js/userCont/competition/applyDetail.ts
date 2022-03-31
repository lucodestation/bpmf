// 个人中心 我参加的赛事 报名详情

$(function () {
  // // 引入头部
  $('.public-header').load('/components/PublicHeader.html')
  // // 引入底部
  $('.public-footer').load('/components/PublicFooter.html')
  // // 引入侧边栏
  $('.public-user').load('/components/CenterAside.html')
})

new Vue({
  el: '#app',
  data() {
    return {
      // 报名详情
      applyDetail: {},
    }
  },
  created() {
    // 解析 url 中的查询字符串
    const searchParams = Qs.parse(location.search.substr(1))

    // 报名详情
    request({
      url: '/api/Competitionattend/applyDetail',
      method: 'post',
      data: { apply_id: searchParams.apply_id },
    }).then((result) => {
      if (+result.code === 200) {
        this.applyDetail = result.data
      } else {
        layer.msg(result.msg)
      }
    })
  },
})
