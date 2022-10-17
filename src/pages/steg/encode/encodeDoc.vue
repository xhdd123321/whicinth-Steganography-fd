<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import stegApi from "@/service/api/steg";
import { ElMessage } from "element-plus";
const router = useRouter()
const resultUrl = ref('')
const formData = ref(new FormData())
const goReady = ref(false)
const loading = ref(false)
const docData = ref('')
const checkGoReady = () => {
  goReady.value = formData.value.has('carrier_file') && docData.value.length > 0
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
const docChange = () => {
  checkGoReady()
}
const encodeHandle = async () => {
  loading.value = true
  try {
    formData.value.set('data_doc', docData.value)
    const res = await stegApi.encodeDoc(formData.value)
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
        subtitle="doc"
        :show-back="false"
    >
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
        <a-divider direction="vertical" type="solid"/>
        <a-radio-group type="button" default-value="doc">
          <a-radio value="image" @click="router.push({name:'encodeImage'})">image</a-radio>
          <a-radio value="doc">doc</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <a-card class="step">
      <template #title>
        <span>step1: 选择载体图片</span>
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
        <span>step2: 输入隐藏文字</span>
      </template>
      <a-textarea v-model="docData" @change="docChange" class="data-doc" placeholder="Please enter something" :max-length="500" auto-size allow-clear show-word-limit />
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
.data-doc {
  width: 50vw;
}
</style>