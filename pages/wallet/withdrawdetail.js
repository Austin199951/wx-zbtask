let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data: {
    detail_list: [],//账户明细列表
    page: 1,//页码
  },
  //页面初始加载
  onLoad() {
    this.getDetailList(1);//获取账户明细列表
  },
  //获取账户明细列表
  getDetailList(page) {
    var user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url + "wallet/fetchDetailList", {
      user_id: user_id, type: "withdraw", page: page
    }, (res) => {
      //拼接数组
      var oldDetailList = this.data.detail_list
      oldDetailList = oldDetailList.concat(res.data.data);

      this.setData({
        detail_list: oldDetailList
      });
    }, "POST");
  },

  //滑动到底部加载内容
  onReachBottom() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page
    });
    this.getDetailList(page);
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