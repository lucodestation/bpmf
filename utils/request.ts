const baseURL = 'http://bpmf.duowencaiwu.com'

const request = axios.create({
  baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5 * 1000, // request timeout
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // console.log('请求拦截器', config)
    // console.log('config.params', config.params)
    // console.log('config.data', config.data)
    // 只要有 token 就带着
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
      if (config.method.toLowerCase() === 'get' || !config.method) {
        config.params = {
          ...config.params,
          token,
        }
      } else {
        config.data = {
          ...config.data,
          token,
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // console.log('响应拦截器', response)
    const data = response.data
    // 判断没有登录
    if (data.code == 502) {
      syalert.syopen('alert1')
    }
    return data
  },
  (error) => {
    // console.log('响应拦截器 error', response)
    const { status } = error.response
    if (status === 401) {
    } else if (status >= 500) {
    } else {
    }

    return Promise.reject(error)
  }
)
