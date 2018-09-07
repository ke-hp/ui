import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Home from '@/pages/Home'
import Command from '@/pages/Command'
import Login from '@/pages/Login'
import Search from '@/pages/Search'
import RandomChart from '@/pages/RandomChart'
import MacGroup from '@/pages/MacGroup'
import MakeGroup from '@/pages/MakeGroup'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.use(Router)
Vue.use(ElementUI)
Vue.component('icon', Icon)

const routes = [{
  path: '/login',
  component: Login,
  name: Login
}, {
  path: '/',
  component: RandomChart,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/home',
  component: Home,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/command',
  component: Command,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/search',
  component: Search,
  meta: {
    requiresAuth: true
  }
}, {
  path: '/macGroup/:name/:num',
  component: MacGroup,
}, {
  path: '/makeGroup',
  component: MakeGroup,
}];
const router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

export default router
