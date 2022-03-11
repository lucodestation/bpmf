baseUrl = 'http://bpmf.duowencaiwu.com' // 图片公共url

$.ajaxPrefilter(function (options) {
  // options.url = baseUrl + options.url
  // 设置headers请求头
  options.headers = {
    token: localStorage.getItem('token') || ''
  }
  // console.log(options.complete)
  if (window.XMLHttpRequest) {
    var xhr = new XMLHttpRequest();
  } else { //IE6及其以下版本浏览器
    var xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.onreadystatechange = function (res) {
    console.log(res)
  }
  // 全局统一挂载 complete 回调函数
  // options.complete = function (res) {
  //   if (res.responseJSON) {
  //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
  //     if (res.responseJSON.code == 502) {
  //       // 1. 强制清空 token
  //       localStorage.removeItem('token')
  //       // 2. 强制跳转到登录页面
  //       // location.href = '/login.html'
  //       syalert.syopen('alert1')
  //     }
  //   }
  // }
})

// ajax = options => {
//   // console.log('ajax options')
//   const token = localStorage.getItem('token')
//   if (token) {
//     if (options.data) {
//       options.data = {
//         ...options.data,
//         token,
//       }
//     } else {
//       options.data = { token }
//     }
//   }
//   // console.log(options)
//   $.ajax(options)
// }
