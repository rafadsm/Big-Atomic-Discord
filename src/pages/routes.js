import login from '@/pages/login'
import home from '@/pages/home'

export default [
  {
    path: '/',
    name: 'login',
    component: login,
  },
  {
    path: '/home',
    name: 'home',
    component: home,
  }
]