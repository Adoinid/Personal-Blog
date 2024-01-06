import request from "@/utils/request.js";

// 获取 project 数据
export function getProject() {
  return request({
    url: '/api/project',
    method: 'get',
  })
}

// 设置 project 数据
export function setProject(id, data) {
  return request({
    url: `/api/project/${id}`,
    method: 'put',
    data
  })
}


// 删除 project
export function delProject(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'delete',
  })
}

// 新增 pproject
export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}
