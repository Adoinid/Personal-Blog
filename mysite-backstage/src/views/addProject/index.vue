<template>
  <div class="app-container">
    <!-- 项目名称 -->
    <div class="block">项目名称</div>
    <el-input v-model="form.name" placeholder="请输入项目的名称"></el-input>
    <!-- 项目描述（每一项描述以英文逗号分割） -->
    <div class="block">项目描述（每一项描述以英文逗号分割）</div>
    <el-input
      v-model="form.description"
      placeholder="请输入项目的描述，每一项描述以英文逗号分割"
    ></el-input>

    <!-- 项目链接 -->
    <div class="block">项目链接</div>
    <el-input v-model="form.url" placeholder="请输入项目链接"></el-input>

    <!-- Github 地址 -->
    <div class="block">Github 地址</div>
    <el-input v-model="form.github" placeholder="请输入Github地址"></el-input>

    <!-- 预览图 -->
    <Upload uploadTitle="预览图" v-model="form.thumb" />

    <!-- 项目等级 -->
    <div class="block">
      <el-form>
        <el-form-item label="项目等级">
          <el-select v-model="form.order">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addProjectHandle">添 加</el-button>
    </div>
  </div>
</template>

<script>
import { addProject } from "@/api/project.js";
import Upload from "@/components/Upload";
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        order: 1,
        url: "",
        thumb: "",
        github: "",
      },
    };
  },
  components: {
    Upload,
  },
  methods: {
    addProjectHandle() {
      let obj = { ...this.form };
      obj.description = obj.description.split(","); // 将 description 分割成一个数组
      obj.order = parseInt(obj.order); // 将 order 转换为 Number 类型
      addProject(obj).then(() => {
        this.$router.push("/projectsList");
        this.$message.success("添加成功");
      });
    },
  },
};
</script>

<style>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>
