let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    mobile:"",
    pw:"",
    code:"",
    union_id: ""
  },
  //页面初始加载
  onLoad(res){
    let that = this;
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        });
      }
    })
  },

  //绑定手机号
  confirm(){
    var mobile = this.data.mobile,
      password = this.data.pw,
      code = this.data.code;
      
    utils.http(app.globalData.url + "login/bindMobile", {
      mobile: mobile, password: password, code: code 
    }, (res) => {

      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        wx.navigateBack({
          url:"login"
        })
      }
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
  },

  //设置输入内容
  mobile(res){
    this.setData({
      mobile:res.detail.value
    });
  },
  password(res){
    this.setData({
      pw: res.detail.value
    });
  }
});