let app = getApp(),
  utils = require("../../utils/util.js")


Page({
  data: {
    eye:true,
    getCode:"获取验证码",
    timeSta:0,//倒计时
    mobile:"",//手机号码
    verify: "",//校验码
    sms_code:"",//短信验证码
    new_pw:"",//新密码
    confirm_pw:"",//确认密麻麻
    img_url: "",//校验码
    verify_seed:"",//验证码种子
  },
  /*生命周期函数--监听页面加载*/
  onLoad() {
    this.get_img_url();//初始校验码
  },

  //开密码
  eye:function(){
    let eyestatue = this.data.eye;
    this.setData({ eye: !eyestatue}) 
  },

  //去登陆
  go_login(){
    wx.navigateBack({
      url:"login"
    })
  },

  //切换校验码
  get_img_url(){
    let time_stamp = Date.parse(new Date()) / 1000//时间戳
    let random = Math.random().toString(10).substr(2, 4)//随机数
    let verify_seed = time_stamp + random;

    this.setData({
      verify_seed:verify_seed,
      img_url: app.globalData.url + "Login/getCaptcha?verify_seed="+verify_seed
    });
  },


  //获取短信验证码
  getcode(){
    var mobile = this.data.mobile;

    utils.http(app.globalData.url + "Login/sendRegisterSMS", { mobile: mobile }, (res) => {
      console.log(res);
      if (res.data.statusCode == -2) {
        utils.showLoading(res.data.statusMsg, "none");
      } else if (res.data.statusCode == 200){
        this.remainTime();
      }
    });
  },

  //倒计时
  remainTime(){
    this.setData({ getCode: 59 });//初始时间

    var clear = setInterval(() => {
      var getCode = this.data.getCode;
      getCode--;

      //如果验证码小于等于0就重新获取
      if (getCode <= 0) {
        clearInterval(clear);
        getCode = "重新获取";
        this.setData({
          timeSta: 0
        })
      }

      this.setData({
        getCode
      });
    }, 1000);
  },

  
  //点击注册按钮
  register(){
    let mobile = this.data.mobile,
      password = this.data.new_pw,
      sms_code = this.data.sms_code,
      confirm_pw = this.data.confirm_pw;

    if (password != confirm_pw){
      utils.showLoading("两次密码不一致","none");
    }
    utils.http(app.globalData.url + "Login/register", { mobile: mobile, password: password, sms_code: sms_code},(res)=>{
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        utils.showLoading(res.data.statusMsg, "none");
        wx.navigateBack({
          url:"login"
        })
      }
    });
  },

  //设置input内容
  phone(res){
    this.setData({
      mobile: res.detail.value
    })
  },
  verifycode(res) {
    this.setData({
      verify: res.detail.value
    })
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