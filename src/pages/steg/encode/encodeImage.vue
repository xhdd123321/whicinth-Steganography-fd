<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onBeforeUnmount, ref } from 'vue'
import stegApi from '@/service/api/steg'
import { ElMessage } from 'element-plus'
import { UploadFileInfo } from 'naive-ui'
import { useUserStore } from '@/store/userStore'
const userStore = useUserStore()
const goCD = ref((Date.now() - userStore.lastEncodeTime) / 1000 / userStore.limitSecond)
const goCDReady = ref((Date.now() - userStore.lastEncodeTime) / 1000 >= userStore.limitSecond)
const router = useRouter()
const resultUrl = ref('')
const formData = ref(new FormData())
const goReady = ref(false)
const loading = ref(false)
const uploadRef = ref()
const uploadRefOther = ref()
const isShare = ref(true)
const checkGoReady = () => {
  goReady.value = formData.value.has('carrier_file') && formData.value.has('data_file')
  return goReady.value
}
const beforeCarrierUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (data.file.file?.size || 0 > 20*1024*1024) {
    ElMessage.warning('上传文件不能超过10M')
    return false
  }
  formData.value.set('carrier_file', data.file.file as File)
  checkGoReady()
  return true
}
const beforeCarrierRemove = () => {
  formData.value.delete('carrier_file')
  checkGoReady()
  return true
}
const beforeDataRemove = () => {
  formData.value.delete('data_file')
  checkGoReady()
  return true
}
const beforeDataUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  formData.value.set('data_file', data.file.file as File)
  checkGoReady()
  return true
}
const updateShare = (value: boolean) => {
  isShare.value = value
}
const clearResult = () => {
  goReady.value = false
  uploadRef.value.clear()
  formData.value.delete('carrier_file')
  uploadRefOther.value.clear()
  formData.value.delete('data_file')
  resultUrl.value = ''
}
const encodeHandle = async () => {
  loading.value = true
  try {
    const res = await stegApi.encodeImage(formData.value, isShare.value)
    if (res.code === 0) {
      clearResult()
      enterGoCD()
      resultUrl.value = res.data?.url as string
      ElMessage.success('加密成功!')
    } else {
      console.log('code: ', res.code)
      console.log('msg: ', res.message)
      if (res.data?.err_msg) {
        res.message += ', detail: ' + res.data?.err_msg
      }
      ElMessage.warning(res.message)
    }
  } catch (err) {
    console.log('err: ', err)
    ElMessage.error('服务端异常, 错误信息 ' + err)
  }
  loading.value = false
}
const reset = () => {
  clearResult()
}

// 全局API冷却时间CD
const enterGoCD = () => {
  goCDReady.value = false
  userStore.updateLastEncodeTime()
  goCD.value = (Date.now() - userStore.lastEncodeTime) / 1000 / userStore.limitSecond
}
const timeGap = 0.1 / userStore.limitSecond
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
    <a-page-header title="Encode" subtitle="image" :show-back="false">
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
        <a-divider direction="vertical" type="solid" />
        <a-radio-group type="button" default-value="image">
          <a-radio value="image">image</a-radio>
          <a-radio value="doc" @click="router.push({ name: 'encodeDoc' })">doc</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <a-card class="step">
      <template #title>
        <span>step1: 选择载体图片</span>
      </template>
      <n-upload
        ref="uploadRef"
        class="upload-image"
        list-type="image-card"
        accept="image/png, image/jpeg"
        :max="1"
        :default-upload="false"
        :show-retry-button="false"
        @before-upload="beforeCarrierUpload"
        @remove="beforeCarrierRemove"
      />
    </a-card>
    <a-card class="step">
      <template #title>
        <span>step2: 选择隐藏图片</span>
      </template>
      <n-upload
        ref="uploadRefOther"
        class="upload-image"
        list-type="image-card"
        accept="image/png, image/jpeg"
        :max="1"
        :default-upload="false"
        :show-retry-button="false"
        @before-upload="beforeDataUpload"
        @remove="beforeDataRemove"
      />
    </a-card>
    <a-card class="step">
      <template #title>
        <span>step3: 开始加密</span>
        <n-divider vertical />
        <n-switch :round="false" :default-value="isShare" @update:value="updateShare">
          <template #checked> 公开 </template>
          <template #unchecked> 私有 </template>
        </n-switch>
      </template>
      <a-button
        v-if="goCDReady"
        :loading="loading"
        type="primary"
        shape="round"
        @click="encodeHandle"
        :disabled="!goReady"
        >GO</a-button
      >
      <a-progress v-else type="circle" :percent="goCD">
        <template v-slot:text="scope"> CD </template>
      </a-progress>
    </a-card>
    <a-card class="step" :loading="loading">
      <template #title>
        <span>step4: 查看并保存结果</span>
      </template>
      <a-empty v-if="resultUrl === ''" />
      <a-image v-else width="70%" class="result-image" :src="resultUrl" />
    </a-card>
  </div>
</template>

<style scoped>
@import url('@/style/common.css');
.step {
  margin-bottom: -1px;
}
</style>
