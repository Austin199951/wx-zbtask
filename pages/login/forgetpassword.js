let app = getApp(),
    utils = require("../../utils/util.js");
Page({
  data: {
    eye: true,
    pw1:'',
    pw2:'',
    getcode: "获取验证码",
    timeSta: 0,
    mobile:"",//手机号码
    sms_code:"",//短信验证码
    new_pw:"",//新密码
    confirm_pw:"",//确认密码
  },
  //页面初始加载
  onLoad(res) {

  },

  eye: function () {
    let eyestatue = this.data.eye;
    this.setData({ eye: !eyestatue })
  },
  setpw1:function(e){
    this.data.pw1 = e.detail.value;
  },
  setpw2:function(e){
    this.data.pw2 = e.detail.value;
  },

  //确认
  resetpw(){
    let mobile = this.data.mobile,
      password = this.data.new_pw,
      sms_code = this.data.sms_code,
      confirm_pw = this.data.confirm_pw;
    
    if (mobile != confirm_pw){
      utils.showLoading("两次密码不一致","none");
    }
    utils.http(app.globalData.url + "Login/forgetPassword", {
       mobile: mobile, sms_code: sms_code, password: password
    },(res)=>{
      console.log(res);
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg, "none");
      } else if (res.data.statusCode == 200){
        wx.reLaunch({
          url: 'login',
        })
      }
    });
    
  },
  
  
  //获取验证码
  getCode:function(){
    var mobile = this.data.mobile;

    utils.http(app.globalData.url + "Login/sendForgetSMS", { mobile: mobile }, (res) => {
      console.log(res);
      if (res.data.statusCode == -2) {
        utils.showLoading(res.data.statusMsg, "none");
      } else if (res.data.statusCode == 200) {
        this.remainTime();
      }
    });
  },

  //倒计时
  remainTime() {
    this.setData({ getcode: 59 });//初始时间

    var clear = setInterval(() => {
      var getcode = this.data.getcode;
      getcode--;

      //如果验证码小于等于0就重新获取
      if (getcode <= 0) {
        clearInterval(clear);
        getcode = "重新获取";
        this.setData({
          timeSta: 0
        })
      }

      this.setData({
        getcode
      });
    }, 1000);
  },

  //设置输入框
  phone(res){
    this.setData({
      mobile:res.detail.value
    });
  },
  smscode(res) {
    this.setData({
      sms_code: res.detail.value
    });
  },
  newpw(res) {
    this.setData({
      new_pw: res.detail.value
    });
  },
  confirmpw(res) {
    this.setData({
      confirm_pw: res.detail.value
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