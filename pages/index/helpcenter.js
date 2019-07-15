let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    help_list:{},//帮助列表
  },
  //监听页面初始加载
  onShow(){
    this.getHelpList();
  },
  //获取帮助列表
  getHelpList(){
    var user_id = wx.getStorageSync("user_id");
    utils.http(app.globalData.url +"help/helpList",{user_id:user_id},(res)=>{
      this.setData({
        help_list: res.data.data
      });
    },"POST");
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
});