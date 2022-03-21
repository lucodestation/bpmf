$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      cateList: [],// 榜文分类
      cateId: '',// 榜文分类id
      navList: [{ id: '', title: '全部' }, { id: 1, title: '教课' }, { id: 2, title: '学课' }],// 服务模式
      type: '',// 服务模式id
      payList: [{ id: '', title: '不限' }, { id: 1, title: '一次付清' }, { id: 2, title: '多次付清' }],// 支付方式
      payId: '',// 支付方式id
      winList: [{ id: '', title: '不限' }, { id: 1, title: '单人中榜' }, { id: 2, title: '多人中榜' }],// 中榜模式
      winId: '',// 中榜id
      trusteeList: [{ id: '', title: '不限' }, { id: 1, title: '托管' }, { id: 2, title: '不托管' }],// 酬金托管
      trusteeId: '',// 酬金托管id
      minList: [{ id: '', title: '不限', min: '', max: '' }, { id: 1, title: '100以下', min: '0', max: '100' }, { id: 2, title: '100-500', min: '100', max: '500' }, { id: 3, title: '500-1000', min: '500', max: '1000' }],// 酬金额度
      minId: '',
      min: '',
      max: '',
      sortList: [{ id: '', title: '默认' }, { id: 1, title: '最新' }, { id: 2, title: '酬金从高到低排' }, { id: 3, title: '酬金从低到高排' },],// 排序
      sortId: '',// 排序id
      bangList: [],
    }
  },
  async created() {
    this.GetRequest()
    // if (this.$route.query.type) {
    //   this.type = this.$route.query.type
    // }
    // 榜文分类
    const res = await request({
      method: 'POST',
      url: '/api/Bangwen/cate',
    })
    if (res.code == 200) {
      this.cateList = res.data
      this.cateList.unshift({ id: '', name: '全部' })
    }
    setTimeout(() => {
      this.onBangwenlist()
    }, 500);
  },
  methods: {
    // 点击筛选分类
    onCateClick(e) {
      this.cateId = e
      this.onBangwenlist()
    },
    // 点击服务模式
    onNavClick(e) {
      this.type = e
      this.onBangwenlist()
    },
    // 点击支付方式
    onPayClick(e) {
      this.payId = e
      this.onBangwenlist()
    },
    // 点击中榜模式
    onWinClick(e) {
      this.winId = e
      this.onBangwenlist()
    },
    // 点击酬金托管
    onTrustClick(e) {
      this.trusteeId = e
      this.onBangwenlist()
    },
    // 点击酬金额度
    onMinClick(e) {
      this.minId = e.id
      this.min = e.min
      this.max = e.max
      this.onBangwenlist()
    },
    // 点击排序
    onSortClick(e) {
      this.sortId = e
      this.onBangwenlist()
    },
    // 列表数据
    async onBangwenlist() {
      const res = await request({
        method: 'POST',
        url: '/api/Bangwen/list',
        data: { page: 1, pagenum: 7, b_id: this.cateId, type: this.type, pay_num_type: this.payId, win_type: this.winId, is_trustee: this.trusteeId, min: this.min, max: this.max, sort: this.sortId },
      })
      if (res.code == 200) {
        this.bangList = res.data.data
      }
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
      this.type = theRequest.type
    },
  }
})
