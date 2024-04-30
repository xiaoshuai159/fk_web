import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'
// 创建axios实例 进行基本参数配置
const service = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  // 设置接口访问超时时间
  timeout: 3000000, // request timeout，
  // 跨域时候允许携带凭证
  // withCredentials: true,
})

//  request interceptor 接口请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    /**
     * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
     * token 存储在本地储存中（storage）、vuex、pinia
     */
    const userStore = useUserStore()
    const token: string = userStore.token
    // 自定义请求头
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error: AxiosError) => {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(error)
  },
)

//  response interceptor 接口响应拦截
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (response.data.data.code == 401) {
      console.log(response)
      const userStore = useUserStore()
      const router = useRouter()
      const TagsViewStore = useTagsViewStore()
      const PermissionStore = usePermissionStore()
      // Token 失效，执行相应的操作，例如跳转到登录页
      // 这里你可以使用路由进行页面跳转，或者其他逻辑处理
      // 例如使用 element-plus 的 Message 组件显示提示信息
      ElMessage.error('Token 失效，请重新登录')
      // await userStore.logout()
      await router.push({ path: '/login' })
      TagsViewStore.clearVisitedView()
      PermissionStore.clearRoutes()
    }
    // 直接返回res，当然你也可以只返回res.data
    // 系统如果有自定义code也可以在这里处理
    return response
  },
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      console.log(error)

      const userStore = useUserStore()
      const router = useRouter()
      const TagsViewStore = useTagsViewStore()
      const PermissionStore = usePermissionStore()
      // Token 失效，执行相应的操作，例如跳转到登录页
      // 这里你可以使用路由进行页面跳转，或者其他逻辑处理
      // 例如使用 element-plus 的 Message 组件显示提示信息
      ElMessage.error('Token 失效，请重新登录')
      // await userStore.logout()
      await router.push({ path: '/login' })
      TagsViewStore.clearVisitedView()
      PermissionStore.clearRoutes()
    }
    return Promise.reject(error)
  },
)

// /**
//  * @description 显示错误消息
//  * opt 传入参数
//  * err 错误信息
//  * type 消息类型
//  * duration 消息持续时间
//  */
// function showErrMessage(opt, err, type: any = 'error', duration = 5000) {
//   ElMessage({
//     message: err.msg,
//     type: type,
//     duration: duration,
//   });
// }

export default service
