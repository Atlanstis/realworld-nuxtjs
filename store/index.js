/**
 * Nuxt.js 已集成 vuex，使用时需新建 store 文件夹（不可更名）
 * https://www.nuxtjs.cn/guide/vuex-store
 */

const cookieParser = process.server ? require('cookieparser') : undefined

// 在服务器渲染期间运行的都是一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
export const state = () => {
  return {
    user: null
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  }
}

export const actions = {
  // nuxtServerInit 是一个特殊的 action 方法
  // 会在服务器渲染期间自动调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      // 将 cookie 字符串转换成 JavaScript 对象
      const parsed = cookieParser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (e) {}
      commit('setUser', user)
    }
  }
}
