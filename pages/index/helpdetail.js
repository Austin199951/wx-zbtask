let app = getApp(),
  utils = require("../../utils/util.js"),
  WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    id: "",//详细内容id
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      id:res.id
    });
    this.getHelpDetail(res.id);//获取帮助详细内容
  },
  //获取帮助详细内容
  getHelpDetail(id){
    var user_id = wx.getStorageSync("user_id");
    utils.http(app.globalData.url + "help/helpDetail", { user_id: user_id, article_id: id},(res)=>{
      let content = res.data.data.content;
      WxParse.wxParse('article', 'html', content, this, 5);
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