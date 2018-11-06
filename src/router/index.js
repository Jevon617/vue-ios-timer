import Vue from 'vue'
import Router from 'vue-router'
import render from '@/components/render/render'
import demo from '@/pages/demo'
import scrolldemo from '@/pages/scroll-demo'
import timerdemo from '@/pages/timer-demo'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'demo',
      component: demo
    },
    {
    	path : '/render',
    	name : 'render',
    	component : render
    },
    {
      path : '/scrolldemo',
      name : 'scrolldemo',
      component : scrolldemo
    },
    {
      path : '/timerdemo',
      name : 'timerdemo',
      component : timerdemo
    }
  ]
})
