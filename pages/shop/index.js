let app = getApp(), 
    utils = require("../../utils/util.js");

Page({
  data:{
    page:1,//页码
    good_list:[],//商品列表
  },
  //页面初始加载
  onLoad(){
    this.getGoodList(1);
  },
  onShow() {
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
  //获取商品列表
  getGoodList(page) {
    var user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url + "shop/goodList", { user_id: user_id, page: page},(res)=>{
      if (res.data.statusCode == 200){
        let old_good_list = this.data.good_list,
            webData = res.data.data;
            
        for (var i of webData){
          let point = parseInt(i.point).toFixed(0);
          i.point = point;
          
          console.log("把积分取整", point);
        }
       
        old_good_list = old_good_list.concat(webData);

        this.setData({
          good_list: old_good_list
        });
      }
    },"POST");
  },

  //滑动到底部加载内容
  onReachBottom(){
    let page =this.data.page;
    page ++;
    this.setData({
      page:page
    });

    this.getGoodList(page);
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