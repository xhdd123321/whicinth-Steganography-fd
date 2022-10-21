<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import sysApi from "@/service/api/sys";
import { ElMessage } from "element-plus";
const decode_intelligent_num = ref(0);
const encode_image_num = ref(0);
const encode_doc_num = ref(0);
const decode_image_num = ref(0);
const decode_doc_num = ref(0);
const drift_count = ref(0);
const percent = ref(0.0);

const getApiData = async () => {
  try {
    const res = await sysApi.getApiStatistic();
    if (res.code === 0) {
      decode_intelligent_num.value = res.data?.decode_intelligent_num as number;
      encode_image_num.value = res.data?.encode_image_num as number;
      encode_doc_num.value = res.data?.encode_doc_num as number;
      decode_image_num.value = res.data?.decode_image_num as number;
      decode_doc_num.value = res.data?.decode_doc_num as number;
      drift_count.value = res.data?.drift_count as number;
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

const updateData = async () => {
  if (percent.value > 1.05) {
    await getApiData();
    percent.value = 0;
  } else {
    percent.value = percent.value + 0.02;
  }
};
getApiData();
const timer = setInterval(updateData, 100);
onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="card-content">
    <a-page-header title="Monitor" subtitle="site-info" :show-back="false">
      <template #extra>
        <a-progress
          :percent="percent"
          style="width: 20vw"
          size="medium"
          :show-text="false"
          :animation="false"
        />
      </template>
    </a-page-header>
    <a-card>
      <div class="content-container">
        <a-row style="padding: 5vh">
          <a-col :flex="1">
            <a-statistic
              title="加密-图片"
              :value="encode_image_num"
              show-group-separator
            >
              <template #suffix>次</template>
            </a-statistic>
          </a-col>
          <a-col :flex="1">
            <a-statistic
              title="加密-文字"
              :value="encode_doc_num"
              show-group-separator
            >
              <template #suffix>次</template>
            </a-statistic>
          </a-col>
          <a-col :flex="1">
            <a-statistic
              title="解密-图片"
              :value="decode_image_num"
              show-group-separator
            >
              <template #suffix>次</template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-row style="padding: 5vh">
          <a-col :flex="1">
            <a-statistic
              title="解密-文字"
              :value="decode_doc_num"
              show-group-separator
            >
              <template #suffix>次</template>
            </a-statistic>
          </a-col>
          <a-col :flex="1">
            <a-statistic
              title="解密-智能"
              :value="decode_intelligent_num"
              show-group-separator
            >
              <template #suffix>次</template>
            </a-statistic>
          </a-col>
          <a-col :flex="1">
            <a-statistic title="信箱" :value="drift_count" show-group-separator>
              <template #suffix>封</template>
            </a-statistic>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
@import url("@/style/common.css");
</style>
