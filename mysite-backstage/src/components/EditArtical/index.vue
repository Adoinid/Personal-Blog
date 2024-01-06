<template>
  <div class="app-container">
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <Editor
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
      :options="editorOptions"
    />
    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input type="textarea" :rows="6" v-model="form.description"></el-input>
    <!-- 文章头图 -->
    <Upload uploadTitle="文章头图" v-model="form.thumb" />
    <!-- 选择分类 -->
    <div class="block">文章分类</div>
    <el-select v-model="form.select" slot="prepend" placeholder="请选择">
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <!-- 发布按钮 -->
    <div class="block">
      <el-button type="primary" @click="addArticleHandle">{{
        btnContent
      }}</el-button>
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload";
import { getBlogType } from "@/api/blogType";
import { addBlog, editBlog, findOneBlog } from "@/api/blog";
import "@toast-ui/editor/dist/i18n/zh-cn";
export default {
  props: ["mode"],
  data() {
    return {
      form: {
        title: "", // 文章标题
        editorText: "", // 用户编辑的文章内容
        description: "", // 用户编辑的文章描述
        select: "", // 文章分类
        thumb: "", // 文章图片
      },
      blogType: [], // 文章分类的内容
      imageUrl: "", // 图片在服务器上面的地址
      editorOptions: {
        language: "zh-CN",
      }, // markdown 文本编辑器提示修改为中文简体
      btnContent: "发布文章",
    };
  },
  created() {
    getBlogType().then(({ data }) => {
      this.blogType = data;
    });
    if (this.mode === "edit") {
      // 一进来的时候，就拿到传递过来的 id，根据这个 id 获取到这篇文章的内容，回填到表单
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        // 接下来，将这个内容回填至表单
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
      });
      this.btnContent = "确认修改";
    }
  },
  components: {
    Editor,
    Upload,
  },
  methods: {
    addArticleHandle() {
      // 添加文章的步骤 1. 获取表单的内容  2. 发送请求
      // 使用toast-ui中的方法获取表单中的内容
      let html = this.$refs.toastuiEditor.invoke("getHTML"); // 从 markdown 文档中获取 html 结构
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown"); // 从 markdown 输入框中获取 markdown 结构

      // 将服务器需要的内容组装起来
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        htmlContent: html,
        markdownContent: markdown,
        toc: [], // toc 传递一个空数组到服务器，之后服务器根据 markdown 的内容来生成一个toc
        thumb: this.form.thumb,
      };
      if (obj.title && obj.description && obj.categoryId && obj.htmlContent) {
        if (this.mode === "edit") {
          editBlog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
            this.$message.success("文章修改成功");
          });
        } else {
          addBlog(obj).then(() => {
            this.$router.push("/blogList");
            this.$message.success("添加文章成功");
          });
        }
      } else {
        this.$message.error("文章内容填写不完整，请填写完整");
      }
    },
  },
};
</script>

<style scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>
