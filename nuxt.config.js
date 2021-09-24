/**
 * Nuxt.js 配置文件
 */
module.exports = {
  router: {
    linkActiveClass: 'active',
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
                path: '/profile/:username',
                name: 'Profile',
                component: resolve(__dirname, 'pages/profile')
              },
              {
                path: '/settings',
                name: 'Settings',
                component: resolve(__dirname, 'pages/settings')
              },
              {
                path: '/editor',
                name: 'Editor',
                component: resolve(__dirname, 'pages/editor')
              },
              {
                path: '/article/:slug',
                name: 'Article',
                component: resolve(__dirname, 'pages/article')
              }
            ]
          }
        ]
      )
    }
  },

  server: {
    host: '0.0.0.0',
    port: '3000'
  },

  //注册插件
  plugins: ['~/plugins/request.js', '~/plugins/dayjs.js']
}
