let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    store_cn: "",//店铺名
    linkman: "",//联系人
    wechat: "",//微信
    qq: "",//qq
  },
  //确定
  confirm(){
    var store_cn = this.data.store_cn,
      linkman = this.data.linkman,
      wechat = this.data.wechat,
      qq = this.data.qq,
      user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "user/drpApply_post", { 
      user_id: user_id, drp_name: store_cn, contact: linkman, wechat: wechat,qq:qq
    }, (res) => {
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } 
      
      if (res.data.data.user_real == -1){
        wx.reLaunch({
          url: '../wallet/realname',
        })
      } else if (res.data.data.user_real == 1){
        wx.reLaunch({
          url: '../drp/tasklist',
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
  store_name(res){
    this.setData({
      store_cn:res.detail.value
    });
  },
  contacts(res) {
    this.setData({
      linkman: res.detail.value
    });
  },
  store_wx(res) {
    this.setData({
      wechat: res.detail.value
    });
  },
  store_qq(res) {
    this.setData({
      qq: res.detail.value
    });
  },
})