<script setup lang="ts">
import { useRouter } from "vue-router";
import { onBeforeUnmount, ref } from "vue";
import stegApi from "@/service/api/steg";
import { ElMessage } from "element-plus";
import { UploadFileInfo } from "naive-ui";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
const goCD = ref(
  (Date.now() - userStore.lastEncodeTime) / 1000 / userStore.limitSecond
);
const goCDReady = ref(
  (Date.now() - userStore.lastEncodeTime) / 1000 >= userStore.limitSecond
);
const router = useRouter();
const resultUrl = ref("");
const formData = ref(new FormData());
const goReady = ref(false);
const loading = ref(false);
const uploadRef = ref();
const uploadRefOther = ref();
const isShare = ref(true);
const maxCapacity = ref(0);
const dataSize = ref(0);
const checkGoReady = () => {
  goReady.value =
    maxCapacity.value > dataSize.value &&
    formData.value.has("carrier_file") &&
    formData.value.has("data_file");
  return goReady.value;
}
const beforeCarrierUpload = (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  if ((data.file.file?.size || 0) > 10 * 1024 * 1024) {
    ElMessage.warning("上传文件不能超过10M");
    return false;
  }
  // 计算图片容量
  const reader = new FileReader()
  reader.readAsDataURL(data.file.file as Blob);
  reader.onload = () => {
    const image = new Image();
    image.src = reader.result as string;
    image.onload = () => {
      maxCapacity.value = Number(
        ((image.width * image.height * 3) / 8388608).toFixed(3)
      );
      checkGoReady();
    }
  }
  formData.value.set("carrier_file", data.file.file as File);
  checkGoReady();
  return true;
}
const beforeCarrierRemove = () => {
  maxCapacity.value = 0;
  formData.value.delete("carrier_file");
  checkGoReady();
  return true;
}
const beforeDataRemove = () => {
  dataSize.value = 0;
  formData.value.delete("data_file");
  checkGoReady();
  return true;
}
const beforeDataUpload = (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  if ((data.file.file?.size || 0) > 10 * 1024 * 1024) {
    ElMessage.warning("上传文件不能超过10M");
    return false;
  }
  dataSize.value = Number(
    ((data.file.file?.size || 0) / 1024 / 1024).toFixed(3)
  );
  formData.value.set("data_file", data.file.file as File);
  checkGoReady();
  return true;
}
const updateShare = (value: boolean) => {
  isShare.value = value;
}
const clearResult = () => {
  maxCapacity.value = 0;
  dataSize.value = 0;
  goReady.value = false;
  uploadRef.value.clear();
  formData.value.delete("carrier_file");
  uploadRefOther.value.clear();
  formData.value.delete("data_file");
  resultUrl.value = "";
}
const encodeHandle = async () => {
  if (maxCapacity.value <= dataSize.value) {
    ElMessage.warning(
      "隐藏文件大小" +
        dataSize.value +
        "M，超过容量限制" +
        maxCapacity.value +
        "M"
    );
    return
  }
  loading.value = true;
  try {
    const res = await stegApi.encodeImage(formData.value, isShare.value);
    enterGoCD();
    if (res.code === 0) {
      clearResult();
      resultUrl.value = res.data?.url as string;
      ElMessage.success("加密成功!");
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
  loading.value = false;
}
const reset = () => {
  clearResult();
}

// 全局API冷却时间CD
const enterGoCD = () => {
  goCDReady.value = false;
  userStore.updateLastEncodeTime();
  goCD.value =
    (Date.now() - userStore.lastEncodeTime) / 1000 / userStore.limitSecond;
}
const timeGap = 0.1 / userStore.limitSecond;
const updateCD = async () => {
  if (goCD.value > 1) {
    goCDReady.value = true;
  } else {
    goCD.value = goCD.value + timeGap;
  }
};
const timer = setInterval(updateCD, 100);
onBeforeUnmount(() => {
  clearInterval(timer);
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
          <a-radio value="doc" @click="router.push({ name: 'encodeDoc' })"
            >doc</a-radio
          >
        </a-radio-group>
      </template>
    </a-page-header>
    <n-alert title="" type="info">
      上传图片前建议用<a-link
        href="https://tinypng.com/"
        status="warning"
        target="_blank"
        icon
        >图片压缩服务</a-link
      >压缩图片体积，可大幅提升处理速度
    </n-alert>
    <a-card class="step">
      <template #title>
        <span>step1: 选择载体图片</span>
        <n-divider v-show="maxCapacity" vertical />
        <a-tooltip
          content="分辨率越高，容量越高，与文件大小无关"
          position="top"
        >
          <a-tag v-show="maxCapacity" color="arcoblue"
            >容量{{ maxCapacity }}M</a-tag
          >
        </a-tooltip>
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
        <n-divider v-show="dataSize" vertical />
        <a-tag v-show="dataSize" v-if="maxCapacity > dataSize" color="green">
          <template #icon>
            <icon-check-circle-fill />
          </template>
          {{ dataSize }}M
        </a-tag>
        <a-tag v-show="dataSize" v-else color="red">
          <template #icon>
            <icon-close-circle-fill />
          </template>
          {{ dataSize }}M
        </a-tag>
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
        <n-switch
          :round="false"
          :default-value="isShare"
          @update:value="updateShare"
        >
          <template #checked> 公开 </template>
          <template #unchecked> 私有 </template>
        </n-switch>
      </template>
      <a-button
        v-if="goCDReady"
        :loading="loading"
        type="primary"
        shape="round"
        :disabled="!goReady"
        @click="encodeHandle"
        >GO</a-button
      >
      <a-progress v-else type="circle" :percent="goCD">
        <template #text> CD </template>
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
@import url("@/style/common.css");
.step {
  margin-bottom: -1px;
}
</style>
