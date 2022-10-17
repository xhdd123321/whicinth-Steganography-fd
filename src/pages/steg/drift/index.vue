<script setup lang="ts">
import {ElMessage} from "element-plus";
import {ref} from "vue";
import driftApi from "@/service/api/drift";
import {useRouter} from "vue-router";
const router = useRouter()
const drift = ref('')
const loading = ref(false)
const getDriftData = async () => {
  drift.value = ''
  loading.value = true
  try {
    const res = await driftApi.receiveDrift()
    if (res.code === 0) {
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
          <a-button :loading="loading" type="primary" shape="round" @click="getDriftData">GO</a-button>
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
.card-content {
  padding: 1vh 10vw;
}
</style>