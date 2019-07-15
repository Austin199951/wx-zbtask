let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    cover:"none",//这幕
    money: "",//提现金额
    user_money: "",//金额
    alipay: "",//支付宝账号
    wechat: "",//微信账号
    rate_config:"",//费率
    arrival_account: "none",//到帐提示
    actual_money: "",//实际到账
    actual: true,//是否像是实际到账文字
    rate:"",
    min_money:"",
    min_charge:"",
  },
  onLoad(res){
    this.setData({
      user_money: res.user_money
    });
    this.getWithdraw();
  },
  //提现页面信息
  getWithdraw(){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url +"wallet/withdraw",{user_id:user_id},(res)=>{
      let webData = res.data.data;
      this.setData({
        rate_config: webData.rate_config,
        alipay: webData.user_info.zfb_account,
        wechat: webData.user_info.wx_account,
        rate: parseFloat(webData.rate_config.withdraw_rate)/100,
        min_money: parseFloat(webData.rate_config.withdraw_min_money),
        min_charge: parseFloat(webData.rate_config.withdraw_charge)
      });
    },"POST");
  },
  
  //设置输入
  alipay_x(res){
    this.setData({
      alipay:res.detail.value
    });
  },
  wechat_x(res) {
    this.setData({
      wechat: res.detail.value
    });
  },

  //选择银行卡
  chooseBank(res){
    var text= res.currentTarget.dataset.text,
        image = res.currentTarget.dataset.image;
    this.setData({
      debit: [
        { bankIcon: image, bankName: text}
      ],
      cover: "none"
    });
  },


  //全部提现
  withdrawal(res){
    var user_money = this.data.user_money;
    this.setData({
      money: user_money,
      actual: false
    });
    this.calcMoney(user_money);
  },

  //确定提现
  confirmWithdrawal(res){
    var money = this.data.money,
        alipay = this.data.alipay,
        wechat = this.data.wechat;
    var user_id = wx.getStorageSync("user_id");

    if (alipay == "" || wechat == ""){
      utils.showLoading("请留下备用提现方式", "none");
      return false;
    } else {
      utils.http();
      utils.http(app.globalData.url + "wallet/withdraw_post", { 
        money: money, user_id: user_id, zfb_account: alipay, wx_account: wechat
      }, (res) => {
        if (res.data.statusCode == -2){
          utils.showLoading(res.data.statusMsg,"none");
        } else if (res.data.statusCode == 200){
          this.setData({
            cover:"block",
            arrival_account:"block",
          });
        }
      },"POST");
    }
  },
  //设置提现金额
  withdrawMoney(res){
    if (res.detail.value >= 5){
      this.setData({
        actual:false
      });
    } else if (res.detail.value == ""){
      this.setData({
        actual: true
      });
    }
    this.setData({
      money: res.detail.value
    });
    this.calcMoney(res.detail.value);
  },  

  calcMoney(money){
    var money = parseFloat(money);
        money = parseInt(money * 100)/100;

    var  min_money = this.data.min_money;
    var  money_charge = this.data.money_charge;
    var  rate = this.data.rate;
    var min_charge = this.data.min_charge;

    if (money >= min_money) {//如果当前输入的金额大于最小金额
      var money_get;
      var money_charge = parseInt(rate * money * 100) / 100;
      if (money_charge <= min_charge) {
        money_get = money - min_charge;
      } else {
        money_get = money - money_charge;
      }
      this.setData({
        actual_money: parseInt(money_get * 100)/100
      })
    }
  },
  //确定
  sure(){
    wx.switchTab({
      url: '../user/index',
    })
  },

  //取消银行卡选择
  close(){
    this.setData({
      cover: "none"
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