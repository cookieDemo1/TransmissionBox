import Vue from 'vue'
import Router from 'vue-router'
import Bus from '@/bus'

Vue.use(Router)

const router = new Router({
  mode: 'history',//hash history
  routes: [
    {
      path: '/',
      name: 'layouts',
      redirect: '/device/manage',
      component: () => import('@/layouts'),
      children: [
        {
          path: '/overview',
          name: 'overview',
          component: () => import('_views/overview'),
          meta: {
            title: '设备总览',
          },
        },
        {
          path: '/device/manage',
          name: 'device',
          component: () => import('_views/device_manage'),
          meta: {
            title: '设备管理',
          },
        },
        {
          path: '/device/manage/video',
          name: 'video',
          component: () => import('_views/device_manage/video'),
          meta: {
            title: '实时监控',
          },
        },
        {
          path: '/police/manage',
          name: 'police_manage',
          component: () => import('_views/police_manage'),
          meta: {
            title: '报警管理',
          },
        },
        {
          path: '/police/manage/detail',
          name: 'police_manage_detail',
          component: () => import('_views/police_manage/police_detail'),
          meta: {
            title: '报警详情',
          },
        },
        {
          path: '/authority_manage',
          name: 'authority',
          component: () => import('_views/authority_manage'),
          meta: {
            title: '权限管理',
          },
        },
        {
          path: '/log_manage',
          name: 'log_manage',
          component: () => import('_views/log_manage'),
          meta: {
            title: '操作日志',
          },
        },
        {
          path: '/log_system',
          name: 'log_system',
          component: () => import('_views/log_system'),
          meta: {
            title: '系统日志',
          },
        },
        {
          path: '/firmware_upgrade',
          name: 'firmware_pgrade',
          component: () => import('_views/firmware_upgrade'),
          meta: {
            title: '固件管理',
          },
        }
      ],
    },
    {
      path: '/login_signup',
      component: () => import('_views/login_signup'),
      name: 'login_signup',
      meta: {
        title: '登录注册',
      },
    },
  ],
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0,
      }
    }
  },
})
/**
 * 路由拦截
 * 不是所有版块都需要鉴权的,所以需要鉴权的在路由meta添加添加一个字段needLogin,
 * 设置为true的时候就必须走鉴权,像登录页这些不要,是可以直接访问的!
 */
router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.path === '/login_signup' || to.path === '/home' || to.path === '/') {
    next()
    return
  }
  let authorization = to.query.token || localStorage.getItem('Authorization')
  let phone = to.query.phone
  let username = to.query.name || phone
  if (authorization) {
    // localStorage.setItem('Authorization', authorization)
    // if (phone) {
    //   localStorage.setItem('Phone', phone)
    //   localStorage.setItem('UserName', username)
    // }
    next()
  } else {
    localStorage.clear()
    Bus.$message.error('登录失效')
    next({
      path: '/login_signup?isLogin=1&from=' + to.fullPath,
    })
  }
    //next()
})

export default router
