<template>
  <div class="login-qrcode">
    <h2 class="title">问题反馈系统</h2>
    <vue-qr text="https://github.com/zouzhibin/vue-admin-perfect"></vue-qr>
  </div>
</template>

<script lang="ts" setup>
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
</script>

<style lang="scss" scoped>
  @import '../index';
</style>
