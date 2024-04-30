<template>
  <div>
    <div
      style="
        background-image: url('src/assets/image/bannerPicture1.jpg');
        background-size: cover;
        color: white;
        font-weight: 600;
        height: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 34px;
      "
    >
      网站使用问题反馈
    </div>
    <!-- <el-header class="me-area">      
      <el-row class="me-header">
        <el-col :span="4" class="me-header-left"></el-col>
        <el-col :span="16">
          <el-menu
            :router="true"
            menu-trigger="click"
            active-text-color="#5FB878"
            :default-active="activeIndex"
            mode="horizontal"
            style="transform: translateY(2px)"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/">问题反馈</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="4">
          <el-menu
            :router="true"
            menu-trigger="click"
            mode="horizontal"
            active-text-color="#5FB878"
            style="line-height: 60px; height: 60px"
          > -->
    <!-- <template v-if="true">
              <el-menu-item index="/login">
                <el-button link type="primary">后台</el-button>
              </el-menu-item>
            </template> -->
    <!-- <template v-if="!user.login">
              <el-menu-item index="/login">
                <el-button link type="primary">登录</el-button>
              </el-menu-item>
              <el-menu-item index="/register">
                <el-button type="text">注册</el-button>
              </el-menu-item>
            </template> -->
    <!-- <el-submenu index>
                <template slot="title">
                  <img class="me-header-picture" :src="user.avatar" />
                </template>
                <el-menu-item index @click="logout">退出</el-menu-item>
              </el-submenu> -->
    <!-- </el-menu>
        </el-col>
      </el-row>
    </el-header> -->
    <div class="app-container" style="padding: 0">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import service from '@/api/request'
  let user = reactive({
    login: true,
  })
  const router = useRouter()
  const activeIndex = ref(router.currentRoute.value.path)

  router.afterEach((to, from) => {
    activeIndex.value = to.path
  })

  const logout = () => {}
</script>
<style lang="scss" scoped>
  .me-area {
    background-color: #fff;
  }

  .el-header {
    // position: fixed;
    z-index: 1024;
    min-width: 100%;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, 0.1), 0 0 0 1px hsla(0, 0%, 7%, 0.1);
  }

  .el-menu--horizontal {
    border-bottom: 0px;
  }

  :deep(.el-menu--horizontal > .el-menu-item.is-active) {
    border-bottom: 2px solid #5d9fff !important;
    color: #5d9fff !important;
  }
</style>
