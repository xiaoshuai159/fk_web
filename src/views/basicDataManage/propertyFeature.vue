<template>
  <div class="app-container demo-tabs">
    问题管理页面
    <el-button @click="testToPage">点我去前台首页</el-button>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onBeforeMount } from 'vue'
  import service from '@/api/request'
  import router from '@/routers'
  const testToPage = () => {
    router.push({ name: 'problemList' })
  }
</script>
<style lang="scss" scoped></style>
