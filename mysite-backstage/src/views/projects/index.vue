<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="加载数据中"
      border
      fit
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 项目名称 -->
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <!-- 项目描述 -->
      <el-table-column label="项目描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>

      <!-- 预览图 -->
      <el-table-column label="预览图" align="center" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.thumb" style="width: 120px"></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <!-- Github -->
          <el-tooltip
            class="item"
            effect="dark"
            content="Github"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="iconfont icon-github"
              class="github"
              circle
              size="mini"
              @click="openGitHubHandle(scope.row)"
            ></el-button>
          </el-tooltip>

          <!-- 编辑 -->
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

    <!-- 编辑对话框 -->
    <el-dialog
      title="请编辑该项目信息"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <el-form :model="form">
        <!-- 项目名称 -->
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <!-- 项目描述 -->
        <el-form-item label="项目描述（每一项描述以英文逗号分割）">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <!-- 项目链接 -->
        <el-form-item label="项目链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>

        <!-- github 地址 -->
        <el-form-item label="Github 地址">
          <el-input v-model="form.github"></el-input>
        </el-form-item>

        <!-- 预览图 -->
        <el-form-item label="">
          <Upload v-model="form.thumb" />
        </el-form-item>

        <!-- 项目等级 -->
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 确认和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, setProject, delProject } from "@/api/project.js";
import Upload from "@/components/Upload";
export default {
  data() {
    return {
      data: [], // 存储数据库拿到的数据
      listLoading: false,
      srcList: [],
      form: {
        name: "",
        description: "",
        order: 1,
        github: "",
        url: "",
        thumb: "",
      },
      dialogFormVisible: false, // 一开始编辑对话框不可见
    };
  },
  components: {
    Upload,
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getProject().then(({ data }) => {
        this.listLoading = false;
        this.data = data;
      });
    },
    // 打开 Github
    openGitHubHandle(projectInfo) {
      window.open(projectInfo.github);
    },
    // 删除按钮
    delBlogTypeHandle({ id }) {
      this.$confirm("确定要删除此项目吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProject(id).then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑按钮
    editBlogTypeHandle(projectInfo) {
      this.dialogFormVisible = true;
      this.fetchData(); // 获取项目数据
      this.form = {
        ...projectInfo,
        description: projectInfo.description.toString(),
      }; // 将项目数据给 form，填入 dialog 中
    },
    // 确认修改
    confirmEditProjectHandle() {
      let obj = { ...this.form };
      obj.description = this.form.description.split(",");
      obj.order = parseInt(this.form.order);

      setProject(obj.id, obj).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.proName:hover {
  color: rgb(163, 163, 163);
}
.github {
  background-color: rgb(163, 163, 163);
  border: 1px solid rgb(163, 163, 163);
}
</style>
