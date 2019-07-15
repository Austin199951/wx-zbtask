var app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    getCode:"获取验证码",
    startTime:0,
    realName:"",
    idCard:"",
    bankCard:"",
    mobile:"",
    msgCode:""
  },
  realname(res) {
    this.data.realName = res.detail.value
  },
  idcard(res) {
    this.data.idCard = res.detail.value
  },
  bankcard(res) {
    this.data.bankCard = res.detail.value
  },
  mobile(res) {
    this.data.mobile = res.detail.value
  },
  msgcode(res) {
    this.data.msgCode = res.detail.value
  },

  //确定添加
  confirmation(res){
    var realName = this.data.realName,
      idCard = this.data.idCard,
      bankCard = this.data.bankCard,
      mobile = this.data.mobile,
      msgCode = this.data.msgCode;
    if (msgCode == "") {
      utils.showLoading("请输入短信验证码", "none");
    }
    if (mobile == "") {
      utils.showLoading("请输入手机号", "none");
    }
    if (bankCard == "") {
      utils.showLoading("请输入银行卡号", "none");
    }
    if (idCard == "") {
      utils.showLoading("请输入身份证号", "none");
    }
    if (realName == "") {
      utils.showLoading("请输入真是姓名", "none");
    }
    
  },
  //获取验证码
  getcode(){
    this.setData({
      getCode:59
    });

    var clear = setInterval (()=>{
      var getCode = this.data.getCode;
      getCode --;
      if (getCode <= 0) {
        clearInterval(clear);
        getCode = "重新获取";
        this.setData({
          startTime: 0
        })
      }
      this.setData({
        getCode
      });
    },1000);
  },
});