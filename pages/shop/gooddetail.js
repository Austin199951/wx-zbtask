let app = getApp(), 
    utils = require("../../utils/util.js"),
    WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    good_id:"",//商品id
    good_detail:{},//商品内容
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      good_id: res.good_id
    });

    this.getGoodDetail(res.good_id);
  },
  //获取商品详情
  getGoodDetail(good_id){
    var user_id = wx.getStorageSync("user_id");
    utils.http(app.globalData.url +"shop/goodDetail", { user_id: user_id, good_id: good_id},(res)=>{
      let webData = res.data.data,
          point = parseInt(webData.point).toFixed(0);
          webData.point = point;
      var desc = webData.desc;

      this.setData({
        good_detail: webData
      });
      WxParse.wxParse('desc', 'html', desc, this, 5);
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