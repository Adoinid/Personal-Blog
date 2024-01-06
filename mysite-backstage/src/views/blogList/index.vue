<template>
  <div class="app-container">
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

      <el-table-column label="文章名称" width="200" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="文章图片预览"
            width="230"
            trigger="hover"
          >
            <!-- preview-src-list 开启图片预览功能，参数是一个数组 -->
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <!-- click 点击之后跳转到前台页面的具体文章内容页面中 -->
            <a
              href="#"
              slot="reference"
              @click.prevent="goToTitleHandle(scope.row)"
              >{{ scope.row.title }}</a
            >
            <!-- slot Poprver的插槽，reference属性可以将要显示的HTML显示出来 -->
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="文章描述" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column label="浏览数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>

      <el-table-column label="评论量" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>

      <el-table-column label="所属分类" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.category ? scope.row.category.name : "未分类" }}
        </template>
      </el-table-column>

      <el-table-column label="创建日期" width="230" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
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
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteBlog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- page-size 设置默认每页总条数 -->
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
import { getBlog, deleteBlog } from "@/api/blog.js";
import { formatDate } from "@/utils/formatDate.js";
import { server_URL, frontEnd_URL } from "@/urlConfig.js";
export default {
  data() {
    return {
      data: [],
      srcList: [], // 预览图链接数组
      eachPage: 5, // 每一页显示的条数
      currentPage: 1, // 当前页码，默认进来是第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pageCurrentPage: 1, // 当前页码数
    };
  },
  created() {
    this.fetchDate();
  },
  methods: {
    fetchDate() {
      getBlog(this.currentPage, this.eachPage).then((resp) => {
        this.data = resp.data.rows;
        for (const i of this.data) {
          i.createDate = formatDate(i.createDate); // 将每个文章中的时间戳转换成年月日格式，并且替换给原先对象中的createDate
          this.srcList.push(i.thumb); // 将thumb传递给 srcList 数组
        }

        // 以下是分页设置
        this.count = resp.data.total; // 重新赋值数据总数
        this.totalPage = Math.ceil(this.count / this.eachPage); // 重新设置总页数
        // 判断当前页数是否大于总页数
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchDate();
        }
      });
    },

    // 点击文章标题之后跳转到具体文章详情页
    goToTitleHandle(blogInfo) {
      window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
    },

    // 删除文章
    deleteBlog(blogInfo) {
      this.$confirm("删除此文章后评论也会一并删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 点击确定后进入，并且删除此篇文章，重新获取文章数据
          deleteBlog(blogInfo.id).then(() => {
            this.fetchDate();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          // 点击取消后进入
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑文章
    editBannerHandle({ id }) {
      this.$router.push(`/editBlog/${id}`);
    },
    // 设置分页
    sizeChangeHandle(numPage) {
      // 每页总条数改变时触发
      this.eachPage = parseInt(numPage);
      this.currentPage = 1; // 将当前页码重新设置为第一页
      this.pageCurrentPage = 1;
      this.fetchDate();
    },
    // 将当前的页数传出
    currentChangeHandle(numPage) {
      this.currentPage = parseInt(numPage); // 将接收到的页码数转为数字，给 currentPage 重新赋值
      this.fetchDate();
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

<style scoped></style>
