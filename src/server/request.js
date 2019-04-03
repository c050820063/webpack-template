import axios from 'axios'

const qs = require('querystring')
const baseURL = ''

const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken
const removePending = (config) => {
  for (const p in pending) {
    if (pending[p].u === `${config.url}&${config.method}`) { // 当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}
axios.interceptors.request.use(function (config) {
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new CancelToken((c) => {
    // 添加ajax标识
    pending.push({
      u: `${config.url}&${config.method}`,
      f: c,
    })
  })
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (res) {
  return res
}, function (err) {
  if (err && err.response) {
    err.response.config.loading && err.response.config.loading.close()
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '没有权限，拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      case 510:
        err.message = '文件不存在'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
  }
  // 错误处理
  if (err.message) {

  }
  return Promise.reject(err)
})

export default function httpRequest (options) {
  options.method = options.method || 'get'
  const ajaxObj = {
    method: options.method,
    baseURL: options.baseURL || baseURL,
    url: options.url,
    timeout: options.timeout || 30000,
    loading: options.loading || false,
    headers: {
      'Content-type': options.type === 'json' ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded',
      // 'Authorization': getToken() || undefined,
    },
    params: options.method.toLowerCase() === 'get' ? options.data : undefined,
    data: options.method.toLowerCase() !== 'get' ? options.type === 'json' ? JSON.stringify(options.data) : qs.stringify(options.data) : undefined,
  }
  return new Promise((resolve, reject) => {
    axios(ajaxObj).then(res => {
      // code200,把data.data传入回调，拿不到data.msg
      // resolve(res.data)
      // return
      if (res.data.resCode === 0) {
        resolve(res.data.resData)
      } else {
        // code!==200,弹出data.msg
        if (res.data.resMsg) {
          // 错误处理
        }
        reject(res.data)
      }
    }, err => {
      reject(err)
    })
  })
}

export const get = function (options) {
  return httpRequest({
    method: 'get',
    ...options,
  })
}

export const post = function (options) {
  return httpRequest({
    method: 'post',
    ...options,
  })
}

export const fileRequest = function (options) {
  options.method = options.method || 'post'
  const ajaxObj = {
    method: options.method,
    baseURL: options.baseURL || baseURL,
    url: options.url,
    timeout: options.timeout || 300000,
    headers: {
      // 'Content-type': 'application/json;charset=UTF-8'
      // 'Authorization': options.token || undefined,
    },
    params: options.method.toLowerCase() === 'get' ? options.data : undefined,
    data: options.method.toLowerCase() !== 'get' ? options.data : undefined,
    responseType: 'blob',
  }
  return new Promise((resolve, reject) => {
    axios(ajaxObj).then(res => {
      const data = res.data
      if (!data) {
        return
      }
      let fileName = res.headers['content-disposition']
      if (fileName && fileName.length >= 2) {
        fileName = fileName.split('=')[1]
      }
      fileName = decodeURIComponent(fileName)
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容ie11
        try {
          const blobObject = new Blob([data])
          window.navigator.msSaveOrOpenBlob(blobObject, fileName)
        } catch (e) {
          console.log(e)
        }
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      resolve()
    }, err => {
      reject(err)
    }).catch(function () {
      console.log('promise reject err')
    })
  })
}

export const imgRequest = function (options) {
  options.method = options.method || 'get'
  const ajaxObj = {
    method: options.method,
    baseURL: options.baseURL || baseURL,
    url: options.url,
    timeout: options.timeout || 30000,
    headers: {
      // 'Content-type': 'application/json;charset=UTF-8'
      'Authorization': options.token || undefined,
    },
    params: options.method.toLowerCase() === 'get' ? options.data : undefined,
    data: options.method.toLowerCase() !== 'get' ? options.data : undefined,
    responseType: 'blob',
  }
  return new Promise((resolve, reject) => {
    axios(ajaxObj).then(res => {
      const data = res.data
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      resolve(url)
    }, err => {
      reject(err)
    }).catch(err => {
      console.log(err)
    })
  })
}
