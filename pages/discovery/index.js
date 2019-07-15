let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    getCatInfo: [],
    getSlide:[]
  },
  /*生命周期函数--监听页面加载*/
  onLoad (options) {
    this.getSlide();//加载轮播
    this.getCatInfo()//获取分类图标
  },
  onShow(){
    var user_id = wx.getStorageSync("user_id");
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

  //加载轮播
  getSlide(){
    utils.http(app.globalData.url + "discovery/getSlide", "", (res) => {
      this.setData({
        getSlide: res.data.data
      });
    });
  },
  //获取分类图标
  getCatInfo() {
    utils.http(app.globalData.url + "discovery/getCatInfo", "", (res) => {
      this.setData({
        getCatInfo: res.data.data
      });
    });
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