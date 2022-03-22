$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
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
        this.noticeCont = res.data
      }
    })
    // 开始学习后阶段
    request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.bangwen_id }, }).then((res) => {
      if (res.code == 200) {
        res.data.map(item => {
          item.detail.map((items, k) => {
            items.num = k + 1
            item.blList = this.group(item.detail, 3)
          })
        })
        this.selectList = res.data
        console.log(this.selectList)
      }
    })
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
