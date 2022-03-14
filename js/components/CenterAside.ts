
new Vue({
  el: '#CenterAside',
  data() {
    return {
      CenterAside: ''
    }
  },
  created() {
    var url = window.location.pathname.substr(1) //获取当前页面url
    let url1 = url.substr(0, 4)
    url = url.substr(0, url.length - 5)
    this.CenterAside = url
  },
})
