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
    }
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

