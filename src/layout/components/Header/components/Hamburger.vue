<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <!-- <el-breadcrumb-item v-if="showHome" key="home" :to="{ path: '/' }">
        <div class="breadcrumb-item">
          <span class="breadcrumb-title">首页</span>
        </div>
      </el-breadcrumb-item> -->
      <!-- <el-breadcrumb-item v-for="(item, index) in matchedWithSession" :key="item.name">
        <span v-if="item.redirect === 'noRedirect' || index == matchedWithSession.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item> -->
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
  import { computed, ref, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const handleLink = (item) => {
    router.push({
      path: item.path,
    })
  }

  const matched = computed(() => route.matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false))
  const showHome = computed(() => route.matched[0].meta.title !== '首页')
  const matchedWithSession = ref([])
  // 判断是否为需要特殊处理的路由
  const isSpecialRoute = (path) => {
    const specialRoutes = [
      '/anonymous/ipSearchPage',
      '/anonymous/nameSearchPage',
      '/anonymous/infoSearchPage',
      '/anonymous/chainSearchPage',
    ]
    return specialRoutes.includes(path)
  }

  // 从 sessionStorage 中获取数据
  const getDataFromSession = (path) => {
    if (path == '/anonymous/ipSearchPage') {
      return JSON.parse(sessionStorage.getItem('curIp'))
    } else if (path == '/anonymous/nameSearchPage') {
      return JSON.parse(sessionStorage.getItem('curName'))
    } else if (path == '/anonymous/infoSearchPage') {
      return JSON.parse(sessionStorage.getItem('curPhone'))
    } else if (path == '/anonymous/chainSearchPage') {
      return JSON.parse(sessionStorage.getItem('curChain'))
    }
  }

  // 更新 matchedWithSession
  const updateMatchedWithSession = () => {
    matchedWithSession.value = matched.value.slice() // 复制 matched 的值

    // 检查是否有特殊路由
    const specialRouteIndex = matchedWithSession.value.findIndex((item) => isSpecialRoute(item.path))
    if (specialRouteIndex !== -1) {
      const specialRoute = matchedWithSession.value[specialRouteIndex]
      const data = getDataFromSession(specialRoute.path)
      if (data) {
        // 从 sessionStorage 中获取数据，放到 matchedWithSession 的最后面
        matchedWithSession.value.push({ ...specialRoute, meta: { title: data } })
      }
    }

    // // 重新计算 showHome
    // showHome.value = matchedWithSession.value[0].meta.title !== '首页'
  }

  // 切换路由时更新matchedWithSession
  watchEffect(() => {
    updateMatchedWithSession()
  })
</script>
