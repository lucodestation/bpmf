$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
  $('.public-user').load('/components/CenterAside.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      pushList: [],// 列表数据
      liveCont: '',// 点击列表详情
    }
  },
  mounted() {
    this.onpushList()
  },
  methods: {
    // 列表数据
    onpushList() {
      request({ url: '/api/Live/pushList', method: 'POST', data: { page: 1, pagenum: 10, type: '' } }).then((res) => {
        if (res.code == 200) {
          res.data.data.map(item => {
            var date1 = new Date((item.end_time + ':00').replace(/\-/g, "/"));    //开始时间
            var date2 = new Date(item.start_time.replace(/\-/g, "/") + ':00');    //结束时间
            var date3 = date1.getTime() - date2.getTime(); //时间差秒
            //计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000))
            //计算出小时数
            var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            // var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
            // var seconds = Math.round(leave3 / 1000)
            item.fen = days * 24 * 60 + hours * 60 + minutes
          })
          this.pushList = res.data.data
        }
      })
    },
    // 点击开始直播
    onBroadcast(item) {
      this.liveCont = item
      setTimeout(() => {
        syalert.syopen('liveCont')
      }, 1000);
    },
    // 确定直播
    onBtnClick() {
      request({ url: '/api/Live/beginLive', method: 'POST', data: { live_id: this.liveCont.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg("直播已开始");
          syalert.syhide('liveCont')
          this.onpushList()
        }
      })
    },
    // 取消直播
    onQuery(item) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('确定要取消直播吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          that.querySelect(item)
        });
      });
    },
    // 点击结束直播请求数据
    querySelect(item) {
      request({ url: '/api/Live/cancelLive', method: 'post', data: { live_id: item.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('取消直播成功')
          this.onpushList()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 结束直播
    onEndClick(item) {
      let that = this
      layui.use('layer', function () {
        layer.confirm('确定要结束直播吗?', {
          btn: ['确定', '取消']//按钮
        }, function (index) {
          that.cancelSelect(item)
        });
      });
    },
    // 点击结束直播请求数据
    cancelSelect(item) {
      request({ url: '/api/Live/stopLive', method: 'post', data: { live_id: item.id } }).then((res) => {
        if (res.code == 200) {
          layer.msg('结束直播成功')
          this.onpushList()
        } else {
          layer.msg(res.msg)
        }
      })
    },
    // 复制地址
    copyUrl() {
      this.copyContent = this.$refs.copytext.innerText;//也可以直接写上等于你想要复制的内容
      var input = document.createElement("input"); // 直接构建input
      input.value = this.copyContent; // 设置内容
      console.log(input.value);
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      layer.msg("复制成功");
    }
  }
})
