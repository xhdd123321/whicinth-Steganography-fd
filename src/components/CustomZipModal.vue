<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from "vue";
import { UploadFileInfo } from "naive-ui";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";
import stegApi from "@/service/api/steg";
import { ICompressRespData } from "@/service/api/steg_types";
const userStore = useUserStore();
const goCD = ref((Date.now() - userStore.lastCompressTime) / 1000 / 5);
const goCDReady = ref((Date.now() - userStore.lastCompressTime) / 1000 >= 5);
const router = useRouter();
const formData = ref(new FormData());
const goReady = ref(false);
const loading = ref(false);
const result: ICompressRespData = reactive({
  input: {
    size: 0,
    type: "",
  },
  output: {
    size: 0,
    type: "",
    width: 0,
    height: 0,
    ratio: 0.0,
    url: "",
  },
  err_msg: undefined,
});
const uploadRef = ref();
const dataSize = ref(0);
const checkGoReady = () => {
  goReady.value = formData.value.has("pre_file");
  return goReady.value;
};
const beforePreUpload = (data: {
  file: UploadFileInfo;
  fileList: UploadFileInfo[];
}) => {
  if ((data.file.file?.size || 0) > 75 * 1024 * 1024) {
    ElMessage.warning("上传文件不能超过75M");
    return false;
  }
  dataSize.value = Number(
    ((data.file.file?.size || 0) / 1024 / 1024).toFixed(3)
  );
  formData.value.set("pre_file", data.file.file as File);
  checkGoReady();
  return true;
};
const beforePreRemove = () => {
  dataSize.value = 0;
  formData.value.delete("pre_file");
  checkGoReady();
  return true;
};
const clearApiResult = () => {
  result.input.size = 0;
  result.input.type = "";
  result.output.size = 0;
  result.output.type = "";
  result.output.width = 0;
  result.output.height = 0;
  result.output.ratio = 0.0;
  result.output.url = "";
  result.err_msg = undefined;
};
const clearResult = () => {
  dataSize.value = 0;
  goReady.value = false;
  uploadRef.value.clear();
  formData.value.delete("pre_file");
  clearApiResult();
};
const compressHandle = async () => {
  loading.value = true;
  try {
    const res = await stegApi.compressImage(formData.value);
    enterGoCD();
    if (res.code === 0) {
      clearResult();
      result.input.size = Number(
        ((res.data?.input.size || 0) / 1024 / 1024).toFixed(2)
      );
      result.input.type = res.data?.input.type || "";
      result.output.size = Number(
        ((res.data?.output.size || 0) / 1024 / 1024).toFixed(2)
      );
      result.output.type = res.data?.output.type || "";
      result.output.width = res.data?.output.width || 0;
      result.output.height = res.data?.output.height || 0;
      result.output.ratio = (res.data?.output.ratio || 0.0) * 100;
      result.output.url = res.data?.output.url || "";
      result.err_msg = undefined;
      ElMessage.success("压缩成功!");
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

// 全局API冷却时间CD
const enterGoCD = () => {
  goCDReady.value = false;
  userStore.updateLastCompressTime();
  goCD.value = (Date.now() - userStore.lastCompressTime) / 1000 / 5;
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
  <div class="custom-zip">
    <a-card class="step">
      <a-row>
        <n-upload
          ref="uploadRef"
          class="upload-image"
          list-type="image-card"
          accept="image/png, image/jpeg"
          :max="1"
          :default-upload="false"
          :show-retry-button="false"
          @before-upload="beforePreUpload"
          @remove="beforePreRemove"
        />
      </a-row>
      <a-row class="upload-image" style="margin-top: 1vh">
        <a-button
          v-if="goCDReady"
          :loading="loading"
          type="primary"
          shape="round"
          :disabled="!goReady"
          @click="compressHandle"
          >Compress</a-button
        >
        <a-progress
          v-else
          :percent="goCD"
          style="padding-right: 20vw; padding-left: 20vw"
        >
          <template #text> CD </template>
        </a-progress>
      </a-row>
    </a-card>
    <a-card class="step" :loading="loading">
      <template #title>
        <span>压缩结果（请手动保存结果）</span>
      </template>
      <a-row>
        <a-col :span="12">
          <a-empty v-if="!result.output.url" />
          <a-image
            v-else
            width="75%"
            class="result-image"
            :src="result.output.url"
          />
        </a-col>
        <a-col :span="12">
          <a-row style="padding: 1vh 0 1vh 0" justify="start">
            <a-col :span="2">
              <span>size</span>
            </a-col>
            <a-col :span="22" v-show="result.output.url">
              <span>{{ result.input.size }}M -> {{ result.output.size }}M</span>
            </a-col>
          </a-row>
          <a-row style="padding: 1vh 0 1vh 0" justify="start">
            <a-col :span="2">
              <span>type</span>
            </a-col>
            <a-col :span="22" v-show="result.output.url">
              <span>{{ result.input.type }} -> {{ result.output.type }}</span>
            </a-col>
          </a-row>
          <a-row style="padding: 1vh 0 1vh 0" justify="start">
            <a-col :span="2">
              <span>ratio</span>
            </a-col>
            <a-col :span="22" v-show="result.output.url">
              <span>{{ result.output.ratio }}%</span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<style scoped>
@import url("@/style/common.css");
.custom-zip {
  text-align: center;
}
</style>
