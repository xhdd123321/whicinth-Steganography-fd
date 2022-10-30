<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import driftApi from "@/service/api/drift";
import { useUserStore } from "@/store/userStore";
const drift = ref("");
const userStore = useUserStore();
const goCD = ref((Date.now() - userStore.lastDriftTime) / 1000 / 2);
const goCDReady = ref((Date.now() - userStore.lastDriftTime) / 1000 >= 2);
const triggerButton = () => {
  enterGoCD();
};
const getDriftData = async () => {
  drift.value = "";
  try {
    const res = await driftApi.receiveDrift();
    if (res.code === 0) {
      drift.value = res.data?.url as string;
    } else {
      console.log("code: ", res.code);
      console.log("msg: ", res.message);
      if (res.data?.err_msg) {
        res.message += ", detail: " + res.data?.err_msg;
      }
      ElMessage.warning(res.message);
    }
  } catch (err) {
    console.log("err: ", err);
    ElMessage.error("服务端异常, 错误信息 " + err);
  }
};
const reset = () => {
  goCDReady.value = true;
  drift.value = "";
  goCD.value = 1;
};

onBeforeMount(() => {
  reset();
});

// 全局API冷却时间CD
const enterGoCD = () => {
  drift.value = "";
  goCDReady.value = false;
  userStore.updateLastDriftTime();
  goCD.value = (Date.now() - userStore.lastDriftTime) / 1000 / 2;
};
const timeGap = 0.1 / 2;
const updateCD = async () => {
  if (goCD.value > 1) {
    if (!goCDReady.value) {
      goCDReady.value = true;
      await getDriftData();
    }
  } else {
    goCD.value = goCD.value + timeGap;
  }
};
const timer = setInterval(updateCD, 100);
onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="card-content">
    <a-page-header title="Drift" subtitle="good luck !" :show-back="false">
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
      </template>
    </a-page-header>
    <div class="content-container">
      <a-card class="step">
        <a-space direction="vertical">
          <a-button type="primary" shape="round" @click="triggerButton"
            >Whi-cinth</a-button
          >
        </a-space>
      </a-card>
      <n-spin :show="!goCDReady" size="large">
        <a-card class="step">
          <a-empty
            v-if="drift === ''"
            description="随机获取一张信箱中的图片，可以保存下来解密看看里面藏了什么"
          />
          <a-image v-else width="70%" class="result-image" :src="drift" />
        </a-card>
        <template #description>
          你不知道你有多幸运({{ (100 * goCD).toFixed(0) }}%)
        </template>
      </n-spin>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/common.css");
</style>
