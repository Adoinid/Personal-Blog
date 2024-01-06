import request from "@/utils/request.js";

export function getUrl() {
  return request({
    url: '/api/about',
    method: 'get',
  })
}

export function editAbout(data) {
  return request({
    url: '/api/about',
    method: 'post',
    data,
  })
}
