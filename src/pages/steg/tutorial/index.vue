<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IconStar } from "@arco-design/web-vue/es/icon";
const size = ref("large");
const windowsWidth = ref(0);
onMounted(() => {
  getWindowResize();
  window.addEventListener("resize", getWindowResize);
});
const getWindowResize = () => {
  windowsWidth.value = window.innerWidth;
};
const introData = [
  {
    value:
      "\tHello，这里是 “风信”，英文名 “whicinth” [waɪˈsɪnθ]，基于图片隐写LSB算法，我们提供了一种有趣的信息加密方式，以图片为载体，承载图片或文字信息，" +
      "你既可以用这种方式加密存储重要的秘钥信息，也可以用这种特别的方式完成信息的传递交互，" +
      "又或者你对网络安全很感兴趣，也可以用本站点测试CTF图片隐写，站点的前后端代码都开源在github仓库（虽然写的很烂哈哈)，感兴趣的同学欢迎一起交流学习~",
  },
];
const data = [
  {
    label: "加密-图片",
    value:
      "实现将图片数据加密进图片中, 载体图片仅支持PNG/JPG/JPEG，载体文件限制10M，隐藏文件根据载体分辨率计算，加密公共CD:10s",
  },
  {
    label: "加密-文字",
    value:
      "实现将文字数据加密进图片中, 文字长度限制为5000，载体文件限制10M，加密公共CD:10s",
  },
  {
    label: "解密-图片",
    value:
      "实现从图片中解密图片数据, 结果文件格式为PNG，单文件限制30M，解密公共CD:10s",
  },
  {
    label: "解密-文字",
    value:
      "实现从图片中解密文字数据, 文字长度限制为5000，单文件限制30M，解密公共CD:10s",
  },
  {
    label: "解密-智能",
    value:
      "实现从图片中智能识别是否存在图片或文字隐写, 并根据识别结果进行解密，单文件限制30M，解密公共CD:10s",
  },
  {
    label: "风信",
    value: "随机获取一张公开的加密过的图片, 看看别人在图片里藏了些什么~",
  },
  {
    label: "监控",
    value: "查看API调用统计和服务器运行状态, 根据进度条周期性刷新数据",
  },
];
const qaData = [
  {
    label: "Q：照片加密后文件太大导致浏览器waiting content超时 ?",
    value:
      "A：当前图像源站域名未部署CDN加速，部分地区loading速度可能较慢，且在图片中加密文件会导致文件大小迅速膨胀，后续站点会考虑对超过2M的文件进行压缩处理，当前可临时在图片压缩站点将图片压缩后再进行加密，可有效提升图片加载速度：https://tinypng.com/",
  },
  {
    label: "Q：连续发起加密/解密请求总是失败 ?",
    value:
      "A：站点由于服务器资源有限, 针对加密/解密接口分别作了ip限流, 每10s仅可发起一次加密/解密请求",
  },
  {
    label: "Q：xxx failed, 弹出橙色warn信息 ?",
    value: "A：加密的话可能是文件过大或过小, 解密可能是文件中不存在隐写数据",
  },
  {
    label: "Q：服务端异常，错误信息 undefined ?",
    value:
      "A：可能是后端服务挂了, 可以联系站点管理员排查问题, QQ：1071103563, WX：xhds123321",
  },
];
</script>

<template>
  <div class="card-content">
    <a-page-header title="Tutorial" subtitle="quick start" :show-back="false">
      <template #extra>
        <div>
          <a-space>
            <a-link
              href="https://github.com/xhdd123321/whicinth-steganography-fd"
              target="_blank"
              style="color: #313132"
            >
              <template #icon>
                <icon-github />
              </template>
              Front
            </a-link>
            <a-link
              href="https://github.com/xhdd123321/whicinth-steganography-bd"
              target="_blank"
              style="color: #313132"
            >
              <template #icon>
                <icon-github />
              </template>
              Back
            </a-link>
          </a-space>
        </div>
      </template>
    </a-page-header>
    <a-avatar-group style="margin-bottom: 3vh" :size="20 + windowsWidth / 40">
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-3))' }"
        >W</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-4))' }"
        >H</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-5))' }"
        >I</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-6))' }"
        >C</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-6))' }"
        >I</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-5))' }"
        >N</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-4))' }"
        >T</a-avatar
      >
      <a-avatar :style="{ backgroundColor: 'rgb(var(--arcoblue-3))' }"
        >H</a-avatar
      >
    </a-avatar-group>
    <a-card>
      <div class="content-container">
        <a-divider :margin="10"><icon-star /></a-divider>
        <a-descriptions
          :data="introData"
          :size="size"
          title="简介"
          :column="1"
        />
        <a-divider :margin="10"><icon-star /></a-divider>
        <a-descriptions
          :data="data"
          :size="size"
          title="系统模块"
          :column="1"
        />
        <a-divider :margin="10"><icon-star /></a-divider>
        <a-descriptions
          layout="vertical"
          :data="qaData"
          :size="size"
          title="常见问题"
          :column="1"
        />
      </div>
    </a-card>
  </div>
</template>

<style scoped>
@import url("@/style/common.css");
.content-container {
  margin: 3vh 7vw;
}
</style>
