/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const systemManageRouter = [
  {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage/hostManage',
    name: 'systemManage',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        path: '/systemManage/hostManage',
        component: () => import('@/views/systemManage/hostManage.vue'),
        name: 'hostManage',
        meta: { title: '主机管理', icon: 'Operation', keepAlive: true },
      },
      {
        path: '/systemManage/userManage',
        component: () => import('@/views/systemManage/userManage.vue'),
        name: 'userManage',
        meta: { title: '用户管理', icon: 'User', keepAlive: true },
      },
      {
        path: '/systemManage/roleManage',
        component: () => import('@/views/systemManage/roleManage.vue'),
        name: 'roleManage',
        meta: { title: '角色管理', icon: 'Avatar', keepAlive: true },
      },
      {
        path: '/systemManage/authManage',
        component: () => import('@/views/systemManage/authManage.vue'),
        name: 'authManage',
        meta: { title: '权限管理', icon: 'Connection', keepAlive: true },
      },
    ],
  },
]

export default systemManageRouter
