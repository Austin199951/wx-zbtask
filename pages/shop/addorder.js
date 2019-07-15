let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    good_id:"",//商品id
    address_info:{},//地址信息
    good_info:{},//商品信息
    user_info:{},//用户信息
    msg: "",//留言信息
    add_id:"",//地址id
  },

  //监听页面展示
  onShow(res){
    this.getAddOrder();//获取下单信息
  },
  //页面初始加载
  onLoad(res) {
    this.setData({
      good_id: res.good_id,
      add_id: res.add_id
    });
  },

  //下订单-页面
  getAddOrder(){
    var user_id = wx.getStorageSync("user_id");
      
    utils.http(app.globalData.url +"shop/addOrder",{
      user_id: user_id, good_id: this.data.good_id, address_id: this.data.add_id
    },(res)=>{
      let webData = res.data.data,
          good_info = webData.good_info;
          good_info.point = parseInt(good_info.point).toFixed(0); 

      this.setData({
        address_info: webData.address_info,
        good_info: good_info,
        user_info: webData.user_info,
        add_id:-1
      });

      if (webData.address_info != null){
        this.setData({
          add_id: webData.address_info.add_id
        });
      }
    },'POST');
  },

  //确认支付
  confirm_pay(){
    let that = this,
      good_id = this.data.good_id,
      msg = this.data.msg,
      add_id = this.data.add_id;
    var user_id = wx.getStorageSync("user_id");

    wx.showModal({
      title: '温馨提示',
      content: '确认订单后积分不会再返还',
      success(res){
        if(res.confirm){
          utils.http(app.globalData.url + "shop/addOrder_post", {
            user_id: user_id, good_id: good_id, address_id: add_id, msg: msg
          }, (res) => {
            if (res.data.statusCode == 200){
              utils.showLoading(res.data.statusMsg, "none");
            } else if (res.data.statusCode == -2){
              utils.showLoading(res.data.statusMsg, "none");
            }
          }, 'POST');
        }
      },
    })
  },

  //绑定输入留言
  message(res){
    this.setData({
      msg:res.detail.value
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
});