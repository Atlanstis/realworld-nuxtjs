/**
 * 插件使用：
 * https://www.nuxtjs.cn/guide/plugins
 */

import axios from 'axios'
const Cookie = process.client ? require('js-cookie') : undefined

// 创建请求对象
export const request = axios.create({
  baseURL: 'http://realworld.api.fed.lagounews.com/'
})

// 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
// 插件导出函数必须作为 default 成员
export default ({ store, redirect }) => {
  // 请求拦截器
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理,例如统一设置 token
  request.interceptors.request.use(
    (config) => {
      // 请求就会经过这里
      const { user } = store.state
      if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`
      }
      // 返回 config 请求配置对象
      return config
    },
    (error) => {
      // 如果请求失败(此时请求还没有发出去)就会进入这里
      return Promise.reject(error)
    }
  )

  request.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      const {
        request: { status }
      } = error
      if (status === 401) {
        // 未授权，清除用户信息，并前往登录页
        store.commit('setUser', null)
        Cookie.set('user', null)
        redirect({
          name: 'Login'
        })
        return
      }
      return Promise.reject(error)
    }
  )
}
