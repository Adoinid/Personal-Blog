import request from "@/utils/request";

export function getBlog(page = '1', limit = '10') {
  return request({
    url: "/api/blog",
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

// 删除文章
export function deleteBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete',
  })
}

// 发布文章
export function addBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data
  })
}

// 修改文章
export function editBlog(blogInfo) {
  return request({
    url: `/api/blog/${blogInfo.id}`,
    method: 'put',
    data: blogInfo.data,
  })
}

// 根据 id 找到要修改的文章
export function findOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'get',
  })
}
