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
      selectList: [],// 中榜列表
      terminateTaskVisible: false,// 终止任务弹框是否显示
      reason: '',// 终止原因
      phone: '',// 联系方式
      order_id: ''
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
    this.onselectList()
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
    },
    // 取消中榜
    onQueryClick(id) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('确定要取消中榜吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          that.cancelSelect(id)
        });
      });
    },
    // 点击取消中榜请求数据
    cancelSelect(item) {
      request({ url: '/api/Bangwenpush/cancelSelect', method: 'post', data: { order_id: item, bangwen_id: this.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('中榜成功')
          this.onNotice()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 此处是学棋榜文，不托管  开始学习
    onStudyClick(id) {
      request({ url: '/api/bangwenpush/beginLearnUnmanaged', method: 'post', data: { order_id: id } }).then((res) => {
        if (res.code == 200) {
          // layer.msg('中榜成功')
          // this.onselectList()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    onselectList() {
      request({ url: '/api/Bangwenpush/selectList', method: 'POST', data: { bangwen_id: this.id }, }).then((res) => {
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
    // 点击终止任务
    onterminateTaskClick(id) {
      this.order_id = id
      this.terminateTaskVisible = true
    },
    // 点击终止任务关闭按钮
    onterminateTaskQuery() {
      this.order_id = ''
      this.terminateTaskVisible = false
    },
    // 点击终止任务请求数据
    onzzClick() {
      request({ url: '/api/Bangwenpush/pushReferEnd', method: 'POST', data: { order_id: this.order_id, reason: this.reason, phone: this.phone }, }).then((res) => {
        if (res.code == 200) {

        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 数组重构
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    },
  }
})
