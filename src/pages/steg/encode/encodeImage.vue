<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import stegApi from "@/service/api/steg";
import {ElMessage} from "element-plus";
const uploadRef = ref()
const router = useRouter()
const resultUrl = ref('')
const formData = ref(new FormData())
const goReady = ref(false)
const loading = ref(false)
const checkGoReady = () => {
  goReady.value = formData.value.has('carrier_file') && formData.value.has('data_file')
  return goReady.value
}
const beforeCarrierUpload = (file: File) => {
  formData.value.set('carrier_file', file)
  checkGoReady()
  return file
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
const beforeDataUpload = (file: File) => {
  formData.value.set('data_file', file)
  checkGoReady()
  return file
}
const encodeHandle = async () => {
  loading.value = true
  try {
    const res = await stegApi.encodeImage(formData.value)
    if (res.code === 0) {
      resultUrl.value = res.data?.url as string
      ElMessage.success("加密成功!")
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
  router.go(0)
}
</script>

<template>
  <div class="card-content">
    <a-page-header
        title="Encode"
        subtitle="image"
        :show-back="false"
    >
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
        <a-divider direction="vertical" type="solid"/>
        <a-radio-group type="button" default-value="image">
          <a-radio value="image">image</a-radio>
          <a-radio value="doc" @click="router.push({name:'encodeDoc'})">doc</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <a-card class="step">
      <template #title>
        <span>step1: 选择载体图片</span>
      </template>
      <a-upload
          ref="uploadRef"
          class="upload-image"
          list-type="picture-card"
          accept="image/png, image/jpeg"
          limit="1"
          :auto-upload="false"
          :show-retry-button="false"
          image-preview
          :on-before-upload="beforeCarrierUpload"
          :on-before-remove="beforeCarrierRemove"
      />
    </a-card>
    <a-card class="step">
      <template #title>
        <span>step2: 选择隐藏图片</span>
      </template>
      <a-upload
          class="upload-image"
          list-type="picture-card"
          accept="image/png, image/jpeg"
          limit="1"
          :auto-upload="false"
          :show-retry-button="false"
          image-preview
          :on-before-upload="beforeDataUpload"
          :on-before-remove="beforeDataRemove"
      />
    </a-card>
    <a-card class="step">
      <template #title>
        <span>step3: 开始加密</span>
      </template>
      <a-button :loading="loading" type="primary" shape="round" @click="encodeHandle" :disabled="!goReady">GO</a-button>
    </a-card>
    <a-card class="step" :loading="loading">
      <template #title>
        <span>step4: 查看并保存结果</span>
      </template>
      <a-empty v-if="resultUrl === ''"/>
      <a-image
          v-else
          width="70%"
          class="result-image"
          :src="resultUrl"
      />
    </a-card>
  </div>
</template>

<style scoped>
.card-content {
  padding: 1vh 10vw;
}
.upload-image {
  justify-content: center
}
.step {
  margin-bottom: -1px;
}
</style>