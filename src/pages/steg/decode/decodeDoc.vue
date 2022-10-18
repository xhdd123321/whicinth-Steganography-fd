<script setup lang="ts">
import { useRouter } from 'vue-router'
import {onBeforeUnmount, ref} from 'vue'
import stegApi from "@/service/api/steg";
import { ElMessage } from "element-plus";
import {UploadFileInfo} from "naive-ui";
const router = useRouter()
const formData = ref(new FormData())
const goReady = ref(false)
const loading = ref(false)
const resultDoc = ref('')
const uploadRef = ref()

const checkGoReady = () => {
  goReady.value = formData.value.has('carrier_file')
  return goReady.value
}
const beforeCarrierUpload = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  formData.value.set('carrier_file', data.file.file as File)
  checkGoReady()
  return true
}
const beforeCarrierRemove = () => {
  formData.value.delete('carrier_file')
  checkGoReady()
  return true
}
const clearResult = () => {
  goReady.value = false
  uploadRef.value.clear()
  formData.value.delete('carrier_file')
}
const decodeHandle = async () => {
  loading.value = true
  try {
    const res = await stegApi.decodeDoc(formData.value)
    if (res.code === 0) {
      clearResult()
      enterGoCD()
      resultDoc.value = res.data?.result_doc as string
      ElMessage.success("解密成功!")
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
  clearResult()
}

// 全局API冷却时间CD
import {useUserStore} from "@/store/userStore";
const userStore = useUserStore()
const goCD = ref(((Date.now() - userStore.lastDecodeTime)/1000) / userStore.limitSecond)
const goCDReady = ref(((Date.now() - userStore.lastDecodeTime)/1000) >= userStore.limitSecond)
const enterGoCD = () => {
  goCDReady.value = false
  userStore.updateLastDecodeTime()
  goCD.value = ((Date.now() - userStore.lastDecodeTime)/1000) / userStore.limitSecond
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
        title="Decode"
        subtitle="doc"
        :show-back="false"
    >
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
        <a-divider direction="vertical" type="solid"/>
        <a-radio-group type="button" default-value="doc">
          <a-radio value="image" @click="router.push({name:'decodeImage'})">image</a-radio>
          <a-radio value="doc">doc</a-radio>
          <a-radio value="intelligent" @click="router.push({name:'decodeIntelligent'})">intelij</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <a-card class="step">
      <template #title>
        <span>step1: 选择解密图片</span>
      </template>
      <n-upload
          ref="uploadRef"
          class="upload-image"
          list-type="image-card"
          accept="image/png, image/jpeg"
          :max=1
          :default-upload="false"
          :show-retry-button="false"
          @before-upload="beforeCarrierUpload"
          @remove="beforeCarrierRemove"
      />
    </a-card>
    <a-card class="step">
      <template #title>
        <span>step2: 开始解密</span>
      </template>
      <a-button v-if="goCDReady" :loading="loading" type="primary" shape="round" @click="decodeHandle" :disabled="!goReady">GO</a-button>
      <a-progress v-else type="circle" :percent="goCD">
        <template v-slot:text="scope" >
          CD
        </template>
      </a-progress>
    </a-card>
    <a-card class="step" :loading="loading">
      <template #title>
        <span>step3: 查看并保存结果</span>
      </template>
        <a-empty v-if="resultDoc === ''"/>
        <span v-else style="white-space: pre-wrap">
          <a-typography-paragraph copyable>
            {{resultDoc}}
          </a-typography-paragraph>
        </span>
    </a-card>
  </div>
</template>

<style scoped>
@import url("@/style/common.css");
.step {
  margin-bottom: -1px;
}
</style>