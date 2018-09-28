import Vue from 'Vue'
import Router from 'VueRouter'
import index from '@/components/index'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    }
  ]
})
