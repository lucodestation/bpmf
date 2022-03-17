$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      id: '',
      cateList: [],// 棋分类
      noticeCont: '',// 详情内容
      name: '',// 棋名
    }
  },
  created() {
    this.GetRequest()
    request({ method: 'POST', url: '/api/Bangwen/cate' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
      }
    })
    request({ url: '/api/Bangwen/bangwenDetail', method: 'post', data: { bangwen_id: this.id }, }).then((res) => {
      if (res.code == 200) {
        this.noticeCont = res.data
        for (let i in this.cateList) {
          if (this.cateList[i].id == res.data.b_id) {
            this.name = this.cateList[i].name
          }
        }
      }
    })
  },
  methods: {
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
    },
  }
})
