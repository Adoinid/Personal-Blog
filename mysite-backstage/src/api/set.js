import request from "@/utils/request.js";

export function getSettings() {
  return request.get("/api/setting");
}

export function uploadSetting(data) {
  return request({
    url: '/api/setting',
    method: 'put',
    data,
  })
}
