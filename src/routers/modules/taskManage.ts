/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const taskManageRouter = [
  {
    path: '/taskManage',
    component: Layout,
    redirect: '/taskManage/bugScript',
    name: 'taskManagePage',
    meta: {
      title: '任务管理',
      icon: 'MessageBox',
    },
    children: [
      {
        path: '/taskManage/bugScript',
        component: () => import('@/views/taskManage/bugScript.vue'),
        name: 'bugScript',
        meta: { title: '漏洞探测脚本管理', icon: 'Cpu', keepAlive: true },
      },
      {
        path: '/taskManage/taskConfig',
        component: () => import('@/views/taskManage/taskConfig.vue'),
        name: 'taskConfig',
        meta: { title: '任务配置', icon: 'Wallet', keepAlive: true },
      },
    ],
  },
]

export default taskManageRouter
