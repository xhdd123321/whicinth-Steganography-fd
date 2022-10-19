<script setup lang="ts">
import {ElMessage} from "element-plus";
import {onBeforeUnmount, ref} from "vue";
import driftApi from "@/service/api/drift";
import {useRouter} from "vue-router";
const router = useRouter()
const drift = ref('')
const loading = ref(false)
import {useUserStore} from "@/store/userStore";
const userStore = useUserStore()
const goCD = ref(((Date.now() - userStore.lastDriftTime)/1000) / userStore.limitSecond)
const goCDReady = ref(((Date.now() - userStore.lastDriftTime)/1000) >= userStore.limitSecond)
const getDriftData = async () => {
  drift.value = ''
  loading.value = true
  try {
    const res = await driftApi.receiveDrift()
    if (res.code === 0) {
      enterGoCD()
      drift.value = res.data?.url as string
    } else {
      console.log("code: ", res.code)
      console.log("msg: ", res.message)
      if (res.data?.err_msg) {
        res.message += ', detail: ' + res.data?.err_msg
      }
      ElMessage.warning(res.message)
    }
  } catch (err) {
    console.log("err: ", err)
    ElMessage.error('服务端异常, 错误信息 ' + err)
  }
  loading.value = false
}
const reset = () => {
  drift.value = ''
  loading.value = false
}

// 全局API冷却时间CD
const enterGoCD = () => {
  goCDReady.value = false
  userStore.updateLastDriftTime()
  goCD.value = ((Date.now() - userStore.lastDriftTime)/1000) / userStore.limitSecond
}
const timeGap = 0.1/userStore.limitSecond
const updateCD = async () => {
  if (goCD.value > 1) {
    goCDReady.value = true
  } else {
    goCD.value = goCD.value + timeGap
  }
}
const timer = setInterval(updateCD, 100)
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="card-content">
    <a-page-header
        title="Drift"
        subtitle="good luck !"
        :show-back="false"
    >
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
      </template>
    </a-page-header>
    <a-card>
      <div class="content-container">
        <a-card class="step">
          <template #title>
            <span>接收未知的风信</span>
          </template>
          <a-button v-if="goCDReady" :loading="loading" type="primary" shape="round" @click="getDriftData">GO</a-button>
          <a-progress v-else type="circle" :percent="goCD">
            <template v-slot:text="scope" >
              CD
            </template>
          </a-progress>
        </a-card>
        <a-card class="step" :loading="loading">
          <template #title>
            <span>查看并保存结果</span>
          </template>
          <a-empty v-if="drift === ''"/>
          <a-image
              v-else
              width="70%"
              class="result-image"
              :src="drift"
          />
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
@import url("@/style/common.css");
</style>