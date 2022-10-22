<script setup lang="ts">
const headers = {
  Host: "api.tinify.com",
  Authorization: "YXBpJTNBZjZna0Jwajl3cHZEbUxHNmNHc0tQOUJONzN3bHJqTUg=",
};
</script>

<template>
  <div class="custom-zip">
    <a-upload
      action="https://api.tinify.com/shrink"
      :headers="headers"
      draggable
    />
  </div>
</template>

<style scoped>
.custom-zip {
  display: flex;
  justify-content: center;
}
</style>
