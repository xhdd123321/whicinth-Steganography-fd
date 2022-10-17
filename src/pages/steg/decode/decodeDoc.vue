<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import stegApi from "@/service/api/steg";
import { ElMessage } from "element-plus";
const router = useRouter()
const formData = ref(new FormData())
const goReady = ref(false)
const loading = ref(false)
const resultDoc = ref('')
const checkGoReady = () => {
  goReady.value = formData.value.has('carrier_file')
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
const clearResult = () => {
  resultDoc.value = ''
}
const decodeHandle = async () => {
  clearResult()
  loading.value = true
  try {
    const res = await stegApi.decodeDoc(formData.value)
    if (res.code === 0) {
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
  router.go(0)
}
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
          <a-radio value="intelligent" @click="router.push({name:'decodeIntelligent'})">intelligent</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <a-card class="step">
      <template #title>
        <span>step1: 选择解密图片</span>
      </template>
      <a-upload
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
        <span>step2: 开始解密</span>
      </template>
      <a-button :loading="loading" type="primary" shape="round" @click="decodeHandle" :disabled="!goReady">GO</a-button>
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