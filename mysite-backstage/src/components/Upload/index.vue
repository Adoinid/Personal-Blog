<template>
  <div>
    <div class="block">{{ uploadTitle }}</div>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: ["uploadTitle", "value"],
  computed: {
    // 计算属性，计算最终的图片地址
    imageUrl() {
      if (this.value) {
        return this.value;
      }
    },
    headers() {
      return {
        Authorization: "Bearer " + localStorage.getItem("adminToken"), // 拿到本地保存的 token
      };
    },
  },
  methods: {
    // 更换图片
    handleAvatarSuccess(resp) {
      if (!resp.code && resp.data) {
        // 说明上传成功，服务器给我们返回了图片上传后的图片地址
        this.$emit("input", resp.data);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
