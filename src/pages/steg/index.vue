<script setup lang="ts">

import CustomHeader from "@/components/CustomHeader.vue";
</script>

<template>
  <div class="common-layout">
    <a-layout>
      <a-layout-header><CustomHeader /></a-layout-header>
      <a-layout-content><router-view /></a-layout-content>
      <a-layout-footer class="footer">Powered by<a-link href="https://www.zhu-an.cn/">zhu-an</a-link></a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.common-layout{
  width: 100vw;
  height: 100vh;
}
.footer {
}
</style>