let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    log_id:"",//明细id
    detailList:[],//明细列表
  },

  //页面初始加载
  onLoad(res){
    this.setData({
      log_id: res.log_id
    });
    this.logDetail();//获取提现明细详情
  },
  //提现明细详情
  logDetail(){
    var user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url + "wallet/logDetail", { user_id: user_id, log_id: this.data.log_id},(res)=>{
      this.setData({
        detailList:res.data.data
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
})