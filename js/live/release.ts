$(function () {
  $('.public-header').load('/components/PublicHeader.html')
  $('.public-footer').load('/components/PublicFooter.html')
})
new Vue({
  el: '#app',
  data() {
    return {
      // 表单数据
      formData: {
        type: '1',// 1课程直播，2赛事直播
        join_type: '1',// 1申请进入（需要发布者审核），2全网公开，3会员公开，4设置密码
        c_id: '',// 分类
        title: '',// 标题
        start_time: '',// 开始时间
        end_time: '',// 结束时间
        descri: '',// 描述
        image: '',// 封面图
        password: '',// 密码进入，此值必传
      },
      cateList: [],// 棋类型
      startDate: new Date().valueOf(),// 如果分钟是 0 或 30，则开始时间再加 10 分钟
      signUpStartDate: '',  // 报名开始时间
      signUpEndDate: '', // 报名结束时间
      coverImage: {},// 头像临时
      push_url: ''
    }
  },
  mounted() {
    // 直播分类
    request({ url: '/api/Live/liveCates', method: 'POST' }).then((res) => {
      if (res.code == 200) {
        this.cateList = res.data
        this.formData.c_id = res.data[0].id
      }
    })
    // 开始时间
    this.initSignUpStartDate(this.$refs.signUpStartDate)
    // 结束时间
    this.initSignUpEndDate(this.$refs.signUpEndDate)
  },
  methods: {
    // 开始时间
    initSignUpStartDate(elem) {
      console.log(elem)
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          // console.log(value) //得到日期生成的值，如：2022-03-09 00:00
          // console.log(date) //得到日期时间对象：{year: 2022, month: 3, date: 9, hours: 0, minutes: 0, seconds: 0}
          let dateValue = value
          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          }
          // console.log('报名开始时间', typeof dateValue, dateValue)
          // 设置报名开始时间（页面显示用）
          this.signUpStartDate = dateValue
          // 设置报名开始时间（提交数据用）
          this.formData.start_time = dateValue
          // 如果报名结束时间存在且比报名开始时间小（或相等）
          if (this.signUpEndDate && this.signUpEndDate <= this.signUpStartDate) {
            // 清空报名结束时间
            this.signUpEndDate = ''
            this.formData.end_time = ''
          }
        },
      })
    },
    // 结束时间
    initSignUpEndDate(elem) {
      layui.laydate.render({
        elem, //指定元素
        theme: '#FF7F17', // 主题颜色
        type: 'datetime', // 选择器类型
        format: 'yyyy-MM-dd HH:mm', // 返回值格式
        btns: ['clear', 'confirm'], // 显示的按钮
        min: this.startDate, // 最小范围
        // 日期被切换回调（时间切换不触发，但文档说时间切换也会触发）
        change: (value, date) => { },
        // 点击清空、现在、确定都会触发
        done: (value, date) => {
          let dateValue = value
          if (!dateValue) {
            // 点击了清空
            console.log('点击了清空', dateValue)
          } else if (!this.signUpStartDate) {
            // 如果还没有选择报名开始时间
            layer.msg('请先选择开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date(this.signUpStartDate.replace(/-/g, '/'))) {
            // 如果报名结束时间小于报名开始时间
            layer.msg('结束时间要大于开始时间')
            dateValue = ''
          } else if (new Date(dateValue.replace(/-/g, '/')) <= new Date()) {
            // 选择的时间小于当前时间（可能没有选择“时间”直接点击的确定）
            console.log('选择的时间小于当前时间')
            layer.msg('选择的时间不能小于当前时间')
            dateValue = ''
          }
          console.log('报名结束时间', dateValue)
          this.signUpEndDate = dateValue
          this.formData.end_time = dateValue
        },
      })
    },
    // 上传头像
    handleCoverFileChange: function (event) {
      var element = event.target || event.srcElement;
      // 获取文件对象
      var file = element.files[0];
      console.log(file);
      // .png,.jpg,.jpeg,.bmp
      if (!['png', 'jpg', 'jpeg', 'bmp'].includes(util.getExtensionName(file.name))) {
        layer.msg("\u4E0D\u652F\u6301 ".concat(util.getExtensionName(file.name), " \u6587\u4EF6"));
        return;
      }
      window.URL = window.URL || window.webkitURL;
      this.coverImage = {
        // 用于提交数据
        file: file,
        // 用于页面展示
        url: window.URL.createObjectURL(file),
      };
    },
    // 提交申请
    async onAddClick() {
      if (this.formData.join_type == 4) {
        if (!this.formData.password) return layer.msg('请输入设置密码');
        if (this.formData.password.length != 6) return layer.msg('密码长度为6位');
      }
      if (!this.formData.title) return layer.msg('请输入直播讲解主题');
      if (!this.formData.start_time) return layer.msg('请选择开始时间');
      if (!this.formData.end_time) return layer.msg('请选择结束时间');
      if (!this.formData.descri) return layer.msg('请输入直播内容');
      // if (!this.formData.image) return layer.msg('请上传直播头像');
      // 加载中
      const loadingIndex = layer.load(1, {
        shade: [0.5, '#000'], // 0.1透明度的白色背景
        time: 10 * 1000, // 如果十秒还没关闭则自动关闭
      })
      // 上传封面图
      this.formData.image = await util
        .uploadFile({
          file: this.coverImage.file,
          fileName: this.coverImage.file.name,
        })
        .catch((error) => {
          console.log('上传直播头像', error)
          layer.close(loadingIndex)
          layer.msg('上传直播头像')
        })
      if (!this.formData.image) return

      request({ url: '/api/Live/push', method: 'POST', data: this.formData, }).then((res) => {
        layer.close(loadingIndex)
        if (res.code == 200) {
          this.push_url = res.data.push_url
          this.formData = {
            type: '1',// 1课程直播，2赛事直播
            join_type: '1',// 1申请进入（需要发布者审核），2全网公开，3会员公开，4设置密码
            c_id: '',// 分类
            title: '',// 标题
            start_time: '',// 开始时间
            end_time: '',// 结束时间
            descri: '',// 描述
            image: '',// 封面图
            password: '',// 密码进入，此值必传
          }
          syalert.syopen('liveCont')
        } else {
          layer.msg(result.msg)
        }
      }).catch((error) => {
        console.log(error)
        layer.close(loadingIndex)
      })
    },
    copyUrl() {
      // var aa = document.getElementById('url')
      // aa.select()
      // document.execCommand('Copy')
      // window.clipboardData.setData('Text', this.push_url)
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
