import { defineStore } from 'pinia'
import service from '@/api/request'
export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userState',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null,
    // 登录用户信息
    userInfo: {},
    // 角色
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : [],
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    // 登录
    async login(userInfo) {
      const { username, passwd } = userInfo
      const formData = new FormData()
      formData.append('username', username)
      formData.append('passwd', passwd)
      // formData.append('vcode', captcha)
      return new Promise(async (resolve, reject) => {
        const { data: res } = await service.post('/ManageApi/v1/login_in', formData)
        if (res.code == 200) {
          this.token = res.token
          this.userInfo = res.data
          await this.getRoles()
          resolve(username)
        } else {
          console.log(res.data)
          reject(new Error(res.data)) // 将错误信息传递给外部
        }
      })
    },
    // 获取用户授权角色信息，实际应用中 可以通过token通过请求接口在这里获取用户信息
    getRoles() {
      return new Promise((resolve, reject) => {
        // 获取权限列表 默认就是超级管理员，因为没有进行接口请求 写死
        this.roles = ['admin']
        localStorage.roles = JSON.stringify(this.roles)
        resolve(this.roles)
      })
    },
    // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
    getInfo(roles) {
      return new Promise((resolve, reject) => {
        this.roles = roles
        resolve(roles)
      })
    },
    // 退出
    logout() {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData()
        console.log(this.userInfo)

        formData.append('user_info', this.userInfo.user_id)
        const { data: res } = await service.post('/api/v1/login_out', formData)
        if (res.code == 200) {
          this.token = null
          this.userInfo = {}
          this.roles = []
          resolve(null)
        } else {
          resolve(null)
        }
      })
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'userState',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
