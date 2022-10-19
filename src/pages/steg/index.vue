<script setup lang="ts">
import CustomHeader from '@/components/CustomHeader.vue'
import { onBeforeMount, onMounted } from 'vue'
import { useUserStore } from '@/store/userStore'
const userStore = useUserStore()
onBeforeMount(() => {
  if (sessionStorage.getItem('store')) {
    userStore.setInfo(
      Object.assign({}, userStore.$state, JSON.parse(sessionStorage.getItem('store') || ''))
    )
  }

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('store', JSON.stringify(userStore.$state))
  })
})
</script>

<template>
  <div class="common-layout">
    <a-layout>
      <a-layout-header><CustomHeader /></a-layout-header>
      <a-layout-content><router-view /></a-layout-content>
      <a-layout-footer class="footer"
        >Powered by<a-link href="https://www.zhu-an.cn/">zhu-an</a-link></a-layout-footer
      >
    </a-layout>
  </div>
</template>

<style scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
}
.footer {
}
</style>
