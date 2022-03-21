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
      userList: [],// 应榜人列表
    }
  },
  created() {
    this.GetRequest()
    request({ method: 'POST', url: '/api/Bangwen/cate' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
      }
    })
    this.onNotice()
  },
  methods: {
    // 请求页面数据
    onNotice() {
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
      request({ url: '/api/Bangwenpush/attendList', method: 'post', data: { bangwen_id: this.id }, }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data
        }
      })
    },
    onDelClick() {
      syalert.syopen('noticeDelCont')
    },
    // 删除数据
    onDelqueryClick() {
      request({ url: '/api/Bangwenpush/delete', method: 'post', data: { bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('删除成功')
          syalert.syhide('noticeDelCont')
          window.history.go(-1)
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
    },
    // 点击中榜
    onZbClick(item) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('确定要中榜吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          that.onSelection(item)
        });
      });
    },
    // 点击中榜请求数据
    onSelection(item) {
      request({ url: '/api/Bangwenpush/select', method: 'post', data: { order_id: item.id, bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('中榜成功')
          this.onNotice()
        } else {
          layer.msg(res.msg)
        }
      })
    }
  }
})
