import Vue from 'vue'
import Router from 'vue-router'
import index from './views/index.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: index,
    },
    {
      path: '/home',
      component: () => import('./views/home.vue'),
    },
    {
      path: '/test',
      component: () => import('./views/test.vue'),
    },
  ],
})

export default router
