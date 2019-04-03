// 防抖
export const debounce = (fn, wait = 500) => {
  let timeout = null
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

// 节流
export function throttle (fn, delay = 500) {
  let timer = null
  let startTime = Date.now()
  return function () {
    const curTime = Date.now()
    const remaining = delay - (curTime - startTime)
    clearTimeout(timer)
    if (remaining <= 0) {
      fn()
      startTime = Date.now()
    } else {
      timer = setTimeout(fn, remaining)
    }
  }
}
