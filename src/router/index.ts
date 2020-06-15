import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Signup from '../views/Signup/Signup.vue'
import MessagingTab from '../components/Chat/MessagingTab.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Signin/Signin.vue')
  },
  {
    path: '/app',
    redirect: '/app/friends',
    name: 'Chat',
    component: () => import('../views/Chat/Chat.vue'),
    children: [
      {
        path: 'friends',
        component: () => import('../components/Chat/FriendsTab.vue')
      },
      {
        path: ':uid',
        component: () => import('../components/Chat/MessagingTab.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
