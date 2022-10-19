<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'
import stegRoute from '@/router/modules/steg'

const route: RouteLocationNormalizedLoaded = useRoute()
const menusList = stegRoute.children.slice(1)
const activeTabName: ComputedRef = computed(() => route.name)
</script>

<template>
  <div class="custom-header">
    <el-menu :default-active="activeTabName" class="el-menu" router mode="horizontal">
      <template v-for="(item, index) in menusList">
        <el-sub-menu v-if="item.children" :key="item.path" :index="item.name" :route="item">
          <template #title>
            <span>{{ item.meta.title || item.name }}</span>
          </template>
          <el-menu-item
            v-for="(child, chi) in item.children"
            v-show="child.component"
            :key="child.path"
            :index="child.name"
            :route="child"
          >
            <span>{{ child.meta.title || child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :key="item.path" :index="item.name" :route="item">
          <span>{{ item.meta.title || item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.custom-header {
}
.el-menu {
  justify-content: center;
}
</style>
