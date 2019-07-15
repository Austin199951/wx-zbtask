let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    page:1,//页码
    redeem_log: [],//兑换记录列表
  },
  //页面初始加载
  onLoad(){
    this.getRedeemLog(1);//获取兑换记录
  },
  //获取兑换记录
  getRedeemLog(page) {
    var user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url +"shop/redeemLog",{ user_id: user_id, page: page},(res)=>{
      if (res.data.statusCode == 200){
        let webData = res.data.data,
            old_redeem_log = this.data.redeem_log;
            old_redeem_log = old_redeem_log.concat(webData);

        for (var i of webData){
          let point = parseInt(i.point_pay).toFixed(0); 
          i.point_pay = point;
        }

        this.setData({
          redeem_log: old_redeem_log
        });
      }
    },"POST");
  },

  //去兑换详情
  go_detail(res){
    let dom = res.currentTarget.dataset,
        is_pay = dom.is_pay,
        is_cs = dom.is_cs,
        order_id = dom.order_id;

    if (is_pay == 1 || is_cs == 1){
      wx.navigateTo({
        url: 'orderdetail?order_id=' + order_id,
      })
    }
  },

  //滑动到底部加载内容
  onReachBottom(){
    let page = this.data.page;
    page ++;
    this.setData({
      page:page
    });

    this.getRedeemLog(page);//获取兑换记录
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