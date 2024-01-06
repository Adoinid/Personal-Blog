<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table
      :data="data"
      border
      style="width: 100%"
      :header-cell-style="{ 'text-align': 'center' }"
      v-loading="listLoading"
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="scope">
          <el-image :src="scope.row.avatar" style="width: 50px"></el-image>
        </template>
      </el-table-column>

      <el-table-column label="昵称" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column label="评论文章" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.blog.title }}
        </template>
      </el-table-column>

      <el-table-column label="评论内容" align="center" width="350">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column label="评论日期" align="center" width="250">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
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
              @click="delMessageHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 30px"
      background
      :page-size="eachPage"
      :page-sizes="[5, 10, 20]"
      layout="prev, pager, next, ->, sizes, jumper,  total"
      :total="count"
      :current-page.sync="pageCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      Handle
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getMessages, delMessage } from "@/api/comment.js";
import { formatDate } from "@/utils/formatDate.js";
export default {
  data() {
    return {
      listLoading: false,
      data: [],
      eachPage: 5, // 每一页显示的条数
      currentPage: 1, // 当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pageCurrentPage: 1, // 当前页码数
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getMessages(this.currentPage, this.eachPage).then((resp) => {
        this.listLoading = false;
        this.data = resp.data.rows;
        for (const item of this.data) {
          item.createDate = formatDate(item.createDate);
        }
        // 以下是分页设置
        this.count = resp.data.total; // 重新赋值数据总数
        this.totalPage = Math.ceil(this.count / this.eachPage); // 重新设置总页数
        // 判断当前页数是否大于总页数
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    delMessageHandle({ id }) {
      this.$confirm("是否确认删除此评论", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delMessage(id).then(() => {
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
    // 设置分页
    sizeChangeHandle(numPage) {
      // 每页总条数改变时触发
      this.eachPage = parseInt(numPage);
      this.currentPage = 1; // 将当前页码重新设置为第一页
      this.pageCurrentPage = 1; // 在设置之后将页码重新设置为第一页
      this.fetchData();
    },
    // 将当前的页数传出
    currentChangeHandle(numPage) {
      this.currentPage = parseInt(numPage); // 将接收到的页码数转为数字，给 currentPage 重新赋值
      this.fetchData();
    },
    prevClickHandle() {
      this.currentPage -= 1;
    },
    nextClickHandle() {
      this.currentPage += 1;
    },
  },
};
</script>

<style></style>
