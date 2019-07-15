var md5 = require('md5.js'),
    app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//http请求
const http = (url, data, callback,method="GET") => {
    showLoading("加载中...", 'none');

  //获取全局变量
  let user_id = String(wx.getStorageSync("user_id")),
      timestamp = Date.parse(new Date()) / 1000,
      timestamp_str = String(timestamp),
      utoken = wx.getStorageSync("utoken"),
      token = md5.hex_md5(user_id + timestamp_str + "zbtask" + utoken);

  // console.log(user_id, timestamp_str,"zbtask", utoken);
  // console.log(token);

    if (data.user_id != "") {
      data.timestamp = timestamp_str
      data.token = token
    }

    wx.request({
      url: url,
      data: data,
      method:method,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        hideLoading()
        callback(res)
      },

      fail(res) {
        //显示网络故障
        showLoading("网络故障", 'none')
      }
    })
  }

//显示提示语
const showLoading = function showLoading(msg, icon) {
  wx.showToast({
    title: msg,
    icon: icon
  })
}

//隐藏提示语
const hideLoading = function hideLoading() {
  wx.hideToast();
}

//暴漏方法
module.exports = {
    formatTime: formatTime,
    showLoading: showLoading,
    hideLoading: hideLoading,
    http: http
}