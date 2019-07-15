let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    check:false,
    index:0,
    service:false,
    getcode: "获取验证码",
    timeSta: 0,
    mobile:"",//手机号码
    pw:"",//密码
  },
  //去首页看看
  go_homepage(){
    wx.switchTab({
      url: '../share/homepage'
    })
  },
  //微信登陆
  wx_login(){
    wx.login({
      success(res) {
        let code = res.code;
        
        utils.http(app.globalData.url + "login/programLogin", { code: code }, (res) => {
          let webData = res.data.data;

          if (res.data.statusCode == -2){
            wx.navigateTo({
              url: 'bindmobile',
            })
          } else if (res.data.statusCode == 200){
            wx.setStorageSync("user_id", res.data.data.user_id);
          }
          if (webData.drp_id == '') {//如果还没有注册成为商家
            wx.reLaunch({
              url: '../user/drpapply',
            })
          } 
          if (webData.drp_id != '' && res.data.statusCode == 200) {
            wx.reLaunch({
              url: '../drp/tasklist',
            })
          }
        });
      }
    })
  },

  // 控制是否同意协议
  toggleCheck(){
     var check = this.data.check;
     this.setData({check:!check})
  },
  // 控制显示的输入内容
  showlogin(res){ 
    var index = res.currentTarget.dataset.index;
    this.setData({
      index:index
    });    
  },
  
  //《众帮服务协议》
  popservice(){
    this.setData({service:true});  
  },
  //关闭协议
  closeService(){
    this.setData({ service: false });
  },

  //账号密码登录
  login (res) {
    let pw = this.data.pw,
        mobile = this.data.mobile;

    utils.http(app.globalData.url + "login/login", { mobile: mobile, password:pw},(res)=>{
      let webData = res.data.data;

      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        utils.showLoading(res.data.statusMsg, "none");
        wx.setStorageSync("utoken", webData.utoken);
        wx.setStorageSync("user_id", webData.user_id);
      } 
      if (webData.drp_id == '') {//如果还没有注册成为商家
        wx.reLaunch({
          url: '../user/drpapply',
        })
      } 
      if (webData.drp_id != '' && res.data.statusCode == 200) {
        wx.reLaunch({
          url: '../task/mytasklist',
        })
      }
    });
  },


  //设置输入内容
  mobile: function (res) {
    this.setData({
      mobile: res.detail.value
    });
  },
  password: function (res) {
    this.setData({
      pw: res.detail.value
    });
  },

  //获取验证码
  getCode:function(res){
    this.setData({
      getcode:59
    });
    var clear = setInterval(() => {
      var getcode = this.data.getcode;
      getcode--;
      if (getcode <= 0) {
        clearInterval(clear);
        getcode = "重新获取";
        this.setData({
          timeSta: 0
        })
      }
      this.setData({
        getcode
      })
    }, 1000);
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