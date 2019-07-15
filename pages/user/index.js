let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    userList: [
      { listUrl: "../task/mytasklist", icon: "/images/task_icon.png", listName: '我的推广'},
      // { listUrl: "boxprizeactivity", icon: "/images/point_icon.png", listName: '我的积分' },
      { listUrl: "editinfo", icon: "/images/edit_info.png", listName: '信息修改' },
      { listUrl: "changepassword", icon: "/images/edit_pw.png", listName: '修改密码'},
      { listUrl: "../index/contactus", icon: "/images/service.png", listName: '联系客服'},
    ],
    userMsg:[],
  },
  //监听页面显示
  onShow(){
    this.getUserInfo();//获取用户信息
    var user_id = wx.getStorageSync("user_id");
    //判断如果没有用户id就跳去登陆
    if (user_id != "") {
      app.globalData.is_login = 1;
      return false;
    } else if (app.globalData.is_login == 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return false;
    }
  },
  onLoad(){
    this.getUserInfo();//获取用户信息
  },

  //获取用户信息
  getUserInfo(){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "user/getUserInfo", { user_id: user_id},(res) => {
      this.setData({
        userMsg:res.data.data
      });
    });
  },

  //退出
  logout(){
    var user_id = wx.getStorageSync("user_id");
    wx.removeStorageSync("user_id");
    wx.switchTab({
      url: '../share/homepage',
    })
    app.globalData.is_login = 0;
  },

  //分享
  onShareAppMessage() {
    let share_img = wx.getStorageSync("share_img"),//分享图片
      share_title = wx.getStorageSync("share_title");//分享标题

    return {
      title: share_title,
      path: '/pages/share/homepage',
      imageUrl: share_img
    }
    wx.showShareMenu({
      withShareTicket: false
    })
  }
})