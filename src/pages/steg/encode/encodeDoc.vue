<script setup lang="ts">
import { useRouter } from "vue-router";
import { onBeforeUnmount, ref } from "vue";
import stegApi from "@/service/api/steg";
import { ElMessage } from "element-plus";
import { UploadFileInfo } from "naive-ui";
import { useUserStore } from "@/store/userStore";
import CutomZipModal from "@/components/CustomZipModal.vue";
import CustomZipModal from "@/components/CustomZipModal.vue";
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
const docData = ref("");
const uploadRef = ref();
const isShare = ref(true);
const maxCapacity = ref(0);
const dataSize = ref(0);
const zipVisible = ref(false);
const exitZip = () => {
  zipVisible.value = false;
};
const checkGoReady = () => {
  goReady.value =
    maxCapacity.value > dataSize.value &&
    formData.value.has("carrier_file") &&
    docData.value.length > 0;
  return goReady.value;
};
const beforeCarrierUpload = (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  if ((data.file.file?.size || 0) > 10 * 1024 * 1024) {
    ElMessage.warning("上传文件不能超过10M");
    return false;
  }
  // 计算图片容量
  const reader = new FileReader();
  reader.readAsDataURL(data.file.file as Blob);
  reader.onload = () => {
    const image = new Image();
    image.src = reader.result as string;
    image.onload = () => {
      maxCapacity.value = Number(
        ((image.width * image.height * 3) / 8388608).toFixed(3)
      );
      checkGoReady();
    };
  };
  formData.value.set("carrier_file", data.file.file as File);
  checkGoReady();
  return true;
};
const beforeCarrierRemove = () => {
  maxCapacity.value = 0;
  formData.value.delete("carrier_file");
  checkGoReady();
  return true;
};
const docChange = () => {
  dataSize.value = Number(
    ((docData.value.length * 3) / 1024 / 1024).toFixed(5)
  );
  checkGoReady();
};
const updateShare = (value: boolean) => {
  isShare.value = value;
};
const clearResult = () => {
  maxCapacity.value = 0;
  dataSize.value = 0;
  goReady.value = false;
  docData.value = "";
  uploadRef.value.clear();
  formData.value.delete("carrier_file");
  resultUrl.value = "";
};
const encodeHandle = async () => {
  if (maxCapacity.value <= dataSize.value) {
    ElMessage.warning(
      "隐藏文字大小" +
        dataSize.value +
        "M，超过容量限制" +
        maxCapacity.value +
        "M"
    );
    return;
  }
  loading.value = true;
  try {
    formData.value.set("data_doc", docData.value);
    const res = await stegApi.encodeDoc(formData.value, isShare.value);
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
};
const reset = () => {
  clearResult();
};

const triggerZip = () => {
  zipVisible.value = true;
};
// 全局API冷却时间CD
const enterGoCD = () => {
  goCDReady.value = false;
  userStore.updateLastEncodeTime();
  goCD.value =
    (Date.now() - userStore.lastEncodeTime) / 1000 / userStore.limitSecond;
};
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
});
</script>

<template>
  <div class="card-content">
    <a-page-header title="Encode" subtitle="doc" :show-back="false">
      <template #extra>
        <a-button status="warning" @click="reset">Reset</a-button>
        <a-divider direction="vertical" type="solid" />
        <a-radio-group type="button" default-value="doc">
          <a-radio value="image" @click="router.push({ name: 'encodeImage' })"
            >image</a-radio
          >
          <a-radio value="doc">doc</a-radio>
        </a-radio-group>
      </template>
    </a-page-header>
    <n-alert title="" type="info">
      上传图片>2M建议用<a-link
        href="https://tinypng.com/"
        status="warning"
        target="_blank"
        icon
        >图片压缩服务</a-link
      >压缩图片体积，否则处理速度可能较慢
      <a-button type="primary" @click="triggerZip">Open Drawer</a-button>
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
        <span>step2: 输入隐藏文字</span>
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
      <a-textarea
        v-model="docData"
        class="data-doc"
        placeholder="Please enter something"
        :max-length="5000"
        auto-size
        allow-clear
        show-word-limit
        @change="docChange"
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
  <a-drawer
    height="65vh"
    :visible="zipVisible"
    placement="top"
    :closable="false"
    :footer="false"
    @cancel="exitZip"
    unmountOnClose
  >
    <template #title> ZIP </template>
    <div><CustomZipModal /></div>
  </a-drawer>
</template>

<style scoped>
@import url("@/style/common.css");
.step {
  margin-bottom: -1px;
}
.data-doc {
  width: 50vw;
}
</style>
