let app = getApp(),
    md5 = require('../../utils/md5.js'),
    utils = require("../../utils/util.js");

Page({
  data:{
    truename:"",
    idcard:"",//
    mobile:'',//手机号
  },
  //页面初始加载
  onLoad(){
    this.getRealName();
  },
  //获取实名认证信息实名认证
  getRealName(){
    var user_id = wx.getStorageSync("user_id");
    //     user_id_str = String(wx.getStorageSync("user_id")),
    //     utoken = md5.hex_md5(user_id_str + "bxj"),
    //     timestamp = Date.parse(new Date()) / 1000,
    //     timestamp_str = String(timestamp),
    //     token = md5.hex_md5(user_id_str + timestamp_str + "zbtask" + utoken);

    // console.log("user_id=", user_id_str, "timestamp=", timestamp_str, "zbtask","utoken=", utoken);
    // console.log("token=",token);

    utils.http(app.globalData.url + "user/realName", { user_id: user_id }, (res) => {
      if (res.data.data != ""){
        this.setData({
          mobile: res.data.data.mobile
        });
      }
    }, "POST");  
  },

  //确认提交
  confirm(){
    var truename = this.data.truename,
        idcard = this.data.idcard,
        user_id = wx.getStorageSync("user_id");

    
    utils.http(app.globalData.url +"user/realName_post",{
      user_id: user_id, real_name: truename, id_card: idcard
    },(res)=>{
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        wx.reLaunch({
          url: '../drp/tasklist',
        })
      }
    }, "POST");    
  },
  //设置输入内容
  true_name(res){
    this.setData({
      truename:res.detail.value
    });
  },
  id_card(res) {
    this.setData({
      idcard: res.detail.value
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
})