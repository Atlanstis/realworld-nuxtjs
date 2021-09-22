/**
 * Nuxt.js 配置文件
 */
module.exports = {
  router: {
    // 自定义路由表规则
    extendRoutes(routes, resolve) {
      // 清除基于 pages 目录生成的路由表规则
      routes.splice(0)
      // 重置路由
      routes.push(
        ...[
          {
            path: '/',
            component: resolve(__dirname, 'pages/layout'),
            children: [
              {
                path: '',
                name: 'Home',
                component: resolve(__dirname, 'pages/home')
              },
              {
                path: '/login',
                name: 'Login',
                component: resolve(__dirname, 'pages/login')
              },
              {
                path: '/register',
                name: 'Register',
                component: resolve(__dirname, 'pages/login')
              },
              {
                path: '/profile',
                name: 'Profile',
                component: resolve(__dirname, 'pages/profile')
              }
            ]
          }
        ]
      )
    }
  }
}