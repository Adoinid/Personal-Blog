// 所有的工具函数都写在这里
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  // 将时间戳转换成年月日时分秒
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // 星期
  const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const week = weekArr[date.getDay()];
  return `${year}-${month}-${day} ${hour}:${minute}:${seconds} ${week}`
}
