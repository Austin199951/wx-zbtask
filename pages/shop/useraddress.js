let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    add_list:[],//地址列表
    good_id:"",//商品Id
  },
  onLoad(res){
    this.setData({
      good_id: res.good_id
    });
  },
  //点击选择地址
  address_select(res){
    let add_id = res.currentTarget.dataset.add_id,
        good_id = this.data.good_id;

    wx.redirectTo({
      url: 'addorder?add_id=' + add_id + '&&good_id=' + good_id,
    })
  },
  //页面显示
  onShow(res){
    this.getAddList();
  },
  //获取地址列表
  getAddList(){
    var user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url +"shop/addList",{ user_id: user_id},(res)=>{
      this.setData({
        add_list: res.data.data
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