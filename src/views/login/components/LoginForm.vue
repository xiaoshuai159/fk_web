<template>
  <div class="login-title">
    <h2 class="title">问题反馈系统</h2>
  </div>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item label="" prop="username">
      <el-input
        v-model="ruleForm.username"
        placeholder="请输入用户名"
        auto-complete="on"
        style="position: relative"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="passwd">
      <el-input
        v-model="ruleForm.passwd"
        placeholder="请输入密码"
        auto-complete="on"
        :type="passwordType"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'passwd' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <!-- 添加验证码输入框 -->
    <!-- <el-form-item label="" prop="captcha">
      <el-input
        v-model="ruleForm.captcha"
        placeholder="请输入验证码"
        auto-complete="off"
        style="position: relative"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><PictureFilled /></el-icon>
        </template>
        <template #suffix>
          <img :src="getCaptchaImgUrl()" alt="验证码" class="captcha-input__img" @click="refreshCaptcha" />
        </template>
      </el-input>
    </el-form-item> -->

    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import axios from 'axios'
  import type { FormInstance } from 'element-plus'
  import { ElNotification } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { getTimeStateStr } from '@/utils/index'

  const router = useRouter()
  const UserStore = useUserStore()
  const ruleFormRef = ref<FormInstance>()
  const passwordType = ref('password')
  const loading = ref(false)

  const rules = reactive({
    passwd: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    username: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  })

  // 表单数据
  const ruleForm = reactive({
    username: '',
    passwd: '',
    // captcha: '',
  })
  // 验证码 start -----------------
  // let captchaImgUrl = ref('/api/v1/verify_code?time' + new Date())
  // const getCaptchaImgUrl = () => {
  //   return captchaImgUrl.value
  // }
  // const refreshCaptcha = () => {
  //   fetchNewCaptchaImage()
  // }
  // const fetchNewCaptchaImage = () => {
  //   setTimeout(() => {
  //     console.log(new Date().toLocaleString())
  //     captchaImgUrl.value = '/api/v1/verify_code?time' + new Date().toLocaleString()
  //   }, 300)
  // }
  // 验证码 end -----------------
  // 显示密码图标
  const showPwd = () => {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
  }

  const submitForm = (formEl: FormInstance | undefined) => {
    // if(ruleForm.username == 'admin'){
    //   router.push("/home")
    //   return
    // }else {
    //   router.push("/")
    //   return
    // }

    if (!formEl) return
    formEl.validate((valid) => {
      console.log(valid)

      if (valid) {
        loading.value = true
        // 登录
        setTimeout(async () => {
          try {
            await UserStore.login(ruleForm)
            await router.push({
              path: '/home',
            })
            ElNotification({
              title: getTimeStateStr(),
              message: '欢迎登录',
              type: 'success',
              duration: 3000,
            })
          } catch (error) {
            console.log('Error:', error.message)
            ElNotification({
              title: getTimeStateStr(),
              message: `${error.message}` + '，请重新输入！',
              type: 'error',
              duration: 3000,
            })
          } finally {
            loading.value = false // 无论成功或失败都将 loading 设为 false
          }
        }, 1000)
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .captcha-input__img {
    cursor: pointer;
    margin-left: 10px;
    width: 100px; /* 根据实际情况调整 */
    height: auto; /* 根据实际情况调整 */
  }
</style>
