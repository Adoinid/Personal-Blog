<template>
  <div class="app-container">
    <el-input
      placeholder="请输入要添加的分类，并在右边选择分类等级"
      v-model="input"
      class="input-with-select"
    >
      <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
        <el-option label="4" value="4"></el-option>
        <el-option label="5" value="5"></el-option>
      </el-select>
    </el-input>
    <el-button
      slot="append"
      type="primary"
      style="margin-left: 20px"
      @click="addBlogTypeHandle"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="data"
      border
      style="width: 100%"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="博客类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="文章数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.articleCount }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="delBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改分类信息 -->
    <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="博客类别">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="文章等级">
          <el-select v-model="form.order">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOneBlogTypeHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogType,
  addBlogType,
  delBlogType,
  updateOneBlogType,
  findOneBlogType,
} from "@/api/blogType.js";
export default {
  data() {
    return {
      input: "",
      select: "1",
      data: [], // 接收服务器数据
      listLoading: false, // 是否正在获取数据
      form: {
        name: "",
        order: "",
      },
      dialogFormVisible: false, // 修改表格信息是否显示
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // 查看文章分类
      getBlogType().then((resp) => {
        // 请求文章数据
        this.listLoading = true;
        this.data = resp.data;
      });
    },
    // 添加文章分类
    addBlogTypeHandle() {
      if (this.input) {
        // 判断是否填写博客类别
        addBlogType({ name: this.input, order: this.select }).then(() => {
          this.fetchData();
          this.$message.success("添加分类成功");
          this.input = "";
        });
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    // 删除文章分类
    delBlogTypeHandle({ id }) {
      this.$confirm(
        "删除该分类后，该分类下面的所有文章将变为未分类状态，是否继续?",
        "是否删除此文章分类",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delBlogType(id).then(() => {
            this.fetchData();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑文章分类
    editBlogTypeHandle({ id }) {
      // 1. 回填到表单    2. 打开 dialog
      findOneBlogType(id).then((res) => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },
    // 确认修改文章分类
    updateOneBlogTypeHandle() {
      updateOneBlogType({ id: this.form.id, data: this.form }).then(() => {
        this.fetchData(); // 重新请求数据
        this.$message.success("更新数据成功"); // 提示用户更改成功
        this.dialogFormVisible = false; // 将 dialog 隐藏
      });
    },
  },
};
</script>

<style scoped>
.input-with-select {
  width: 400px;
  margin-bottom: 20px;
}
</style>
