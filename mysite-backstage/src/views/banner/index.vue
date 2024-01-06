<template>
  <div class="app-container">
    <!-- 首页组件 -->
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
      <el-table-column label="标题" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editBannerHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 上传组件 -->
    <el-dialog title="请编辑信息" :visible.sync="dialogVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 中图 -->
              <Upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <!-- 大图 -->
              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner.js";
import Upload from "@/components/Upload";
export default {
  data() {
    return {
      data: [],
      dialogVisible: false, // 设置上传组件的显示与隐藏
      form: {
        midImg: "",
        bigImg: "",
        title: "",
        id: "",
        description: "",
      },
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
      getBanner().then((resp) => {
        this.data = resp.data;
      });
    },
    editBannerHandle(bannerInfo) {
      // 1.将bannerInfo的数据给 form， 2.打开dialog
      this.form = { ...bannerInfo };
      this.dialogVisible = true;
    },
    editBannerConfirm() {
      // 从表单里面拿到用户修改的数据，发送到服务器
      // api文档中表明无论用户修改几条数据，都需要发送三条数据给服务器
      let arr = [...this.data]; // 将三条数据保存到arr中
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == this.form.id) {
          // 判断三条数据中的那一条和需要修改的数据的id相同，相同则将要修改的数据给数据库中id相同的一条
          arr[i] = this.form;
        }
      }
      setBanner(arr).then((resp) => {
        /**
         * 1. 将 dialog 设置为false
         * 2. 提示用户修改成功
         * 3. 重新获取服务器数据
         */
        this.dialogVisible = false;
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.fetchData();
      });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
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
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
