var sourceType = [['camera'], ['album'], ['camera', 'album']],
    sizeType = [['compressed'], ['original'], ['compressed', 'original']],
    app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    countIndex:1,
    count: [1],
    user_info:[],//用户信息
    accessid:"",//	阿里云的用户id，记录即可
    host:"",//阿里云的上传域名，记录即可
    policy:'',//	阿里云的上传策略，记录即可
    signature:"",//	阿里云的签名，记录即可
    callback:"",//	阿里云的回调，记录即可
    dir:"",//	阿里云的文件夹
    expire:"",
    file_name:"",//文件名称
    head_img_url:"",//头像
    username:"",//用户名称
    email:"",//电子邮箱
  },
  //页面初始加载
  onShow(res){
    this.getUserInfo();//获取用户信息
    this.getSignPackage();//获取图片签名包
  },
  //查看图片
  upload_img() {
    var that = this;

    utils.http(app.globalData.src + "alioss/getFileName",{func:"user"},(res)=>{
      this.setData({
        file_name: res.data
      });
    },"POST");

    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
      success: (res)=> {
        let tempFilePaths = res.tempFilePaths;
        let str = tempFilePaths[0];
        var suffix = str.substr(str.lastIndexOf('.', str.lastIndexOf('.') + 1));

        that.getSignPackage();//获取图片签名包

        let formData = {
          key: that.data.dir + that.data.file_name + suffix,
          OSSAccessKeyId: that.data.accessid,
          policy: that.data.policy,
          Signature: that.data.signature,
          success_action_status: 200,
          callback: that.data.callback
        }

        wx.uploadFile({
          url: that.data.host, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],//只拿第一个图片
          name: 'file',
          formData: formData,
          success(){
            that.setData({
              head_img_url: tempFilePaths[0]
            });
          }
        });

      }
    })
  },

  //获取图片签名包
  getSignPackage(){
    let timestamp = Date.parse(new Date()) / 1000,
      expire = this.data.expire,
      user_id = wx.getStorageSync("user_id");

    if (expire < timestamp +3 ) {
      //每次上传图片都要判断一下expire是否超出当前时间了，如果还有3秒就过期了就需要重新获取一次
      utils.http(
        app.globalData.src + "alioss/getSignPackage", {
          id: user_id, func:"user"
        },(res) => {
          let webData = res.data;
            this.setData({
              accessid: webData.accessid,//	阿里云的用户id，记录即可
              host: webData.host,//阿里云的上传域名，记录即可
              policy: webData.policy,//	阿里云的上传策略，记录即可
              signature: webData.signature,//	阿里云的签名，记录即可
              callback: webData.callback,//	阿里云的回调，记录即可
              dir: webData.dir,//	阿里云的文件夹
              expire: webData.expire,
            });
      },"POST");
    }
  },

  //获取用户信息
  getUserInfo(){
    var user_id = wx.getStorageSync("user_id");
      
    utils.http(app.globalData.url +"user/getUserInfo",{user_id:user_id},(res)=>{
      let webData = res.data.data;

      this.setData({
        user_info: webData.user_info,
        head_img_url: webData.user_info.head_img_url,
        username: webData.user_info.username,
        email: webData.user_info.email
      });
    },"POST");
  },


  //确认修改信息
  save_edit(){
    var email = this.data.email,
        username = this.data.username;
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "user/editInfo_post", { 
      user_id: user_id, username: username, email: email
    }, (res) => {
      if (res.data.statusCode == 200){
        wx.navigateBack({
          url:"index"
        })
        utils.showLoading(res.data.statusMsg, "none");
      }
      
    }, "POST");
  },

  //清空输入内容
  close(res) {
    let num = res.currentTarget.dataset.num,
        email = this.data.email,
        username = this.data.username;

    switch (num){
      case "1":
        username = "";
        break;
      case "2":
        email = "";
        break;
    }
    //console.log("username", username,"email", email,"完成");

    this.setData({
      username: username,
      email: email
    });
  },

  //设置输入内容
  nickname(res){
    this.setData({
      username:res.detail.value
    });
  },
  mailbox(res){
    this.setData({
      email: res.detail.value
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