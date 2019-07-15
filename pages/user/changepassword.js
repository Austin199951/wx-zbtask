let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    oldPW:"",//旧密码
    newPW:"",//新密码
    confirmPW:""//确认密码
  },

  //确认修改
  confirm(){
    var oldPW = this.data.oldPW,
      newPW = this.data.newPW,
      confirmPW = this.data.confirmPW,
      user_id = wx.getStorageSync("user_id");

    if (newPW != confirmPW){
      utils.showLoading("两次密码不一致","none");
      return false;
    }

    utils.http(app.globalData.url + "user/changePassword", { old_password: oldPW, new_password:newPW,user_id: user_id}, (res) => {
      if (res.data.statusCode == -2) {
        utils.showLoading(res.data.statusMsg, "none");
        return false
      } else if (res.data.statusCode == 200){
        utils.showLoading(res.data.statusMsg, "none");
        wx.navigateBack({
          url:"index"
        })
      }
    }); 
  },
  //设置密码
  old_pw(res){
    this.setData({
      oldPW: res.detail.value
    });
  },
  new_pw(res) {
    this.setData({
      newPW: res.detail.value
    });
  },
  confirm_pw(res){
    this.setData({
      confirmPW: res.detail.value
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