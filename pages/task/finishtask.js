let sourceType = [['camera'], ['album'], ['camera', 'album']],
    sizeType = [['compressed'], ['original'], ['compressed', 'original']],
    app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    picture: [],//上传图片
    countIndex:10,
    count: [1,2,3,4,5,6,7,8,9,10],
    desc:"",//描述
    accessid:"",
    host:"",
    policy:"",
    signature:"",
    callback:"",
    dir:"",
    expire:0,
    web_filename:"",
    order_id: "",//订单id
    voucher_info: [],//上传凭证记录
  },

  //初始加载
  onLoad(res) {
    this.setData({
      order_id: res.order_id
    });

    this.checkSignPackage();//获取签名包
    this.finishTask();//获取初始上传信息
    this.getImageInfo();//获取已上传没有提交图片
  },

  //获取已上传没有提交图片
  getImageInfo(){
    var user_id = wx.getStorageSync("user_id");
    utils.http(app.globalData.url + "task/getImageInfo", { order_id: this.data.order_id, user_id: user_id }, (res) => {
      this.setData({
        picture: res.data.data.img_info
      });
    });
  },

  //获取初始上传信息
  finishTask(){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "task/finishTask", { order_id: this.data.order_id, user_id: user_id }, (res) => {
      this.setData({
        voucher_info: res.data.data.voucher_info
      })
      console.log(res.data.data.voucher_info);
    });
  },

  //图片上传
  add_images(){
    var that = this
    //获得文件名
    utils.http(app.globalData.src + "alioss/getFileName", { func: "order" }, (filename_res) => {
      that.setData({
        web_filename: filename_res.data
      });
    },"POST");
    

    //上传图片
    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
      success (res) {
        //在res中取文件名
        let tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        
        if (tempFilePaths.length >1){
          utils.showLoading("只能选择一张图","none");
        } else {

          that.checkSignPackage();
          let str = tempFilePaths[0];
          var suffix = str.substr(str.lastIndexOf('.', str.lastIndexOf('.') + 1));

          wx.uploadFile({
            url: that.data.host, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],//只拿第一个图片
            name: 'file',
            formData: {
              key: that.data.dir + that.data.web_filename + suffix,
              OSSAccessKeyId: that.data.accessid,
              policy: that.data.policy,
              Signature: that.data.signature,
              success_action_status:200,
              callback: that.data.callback,
            },
            success (upload_res){
              console.log(upload_res)
              //执行getImageInfo接口刷新图片
              that.getImageInfo();
            }
          })

          let picture = that.data.picture;
          picture.unshift(tempFilePaths[0]);
          
          that.setData({
            picture: picture
          })
        }
      }
    })
  },

  //获取签名包
  checkSignPackage(){
    let timestamp = Date.parse(new Date()) / 1000
    let expire=this.data.expire;


    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    if (expire < timestamp + 3) {
      utils.http(app.globalData.src + "alioss/getSignPackage", {
         func: "order", id: this.data.order_id
      },(res)=>{
        let webData = res.data;
        this.setData({
          accessid: webData['accessid'],
          host: webData['host'],
          policy: webData['policy'],
          signature: webData['signature'],
          callback: webData['callback'],
          dir: webData['dir'],
          expire: webData['expire'],
        });

      }, "POST");
    }
    return true;
  },

  

  //删除
  del(res){
    let voucher_id = res.currentTarget.dataset.voucher_id,
        user_id = wx.getStorageSync("user_id"),
        that = this;

    wx.showModal({
      title: '温馨提示',
      content: '确认要删除么？',
      success:function(res){
        if(res.confirm){
          utils.http(app.globalData.url + "task/delImage", { voucher_id: voucher_id, user_id: user_id }, (res) => {
            that.getImageInfo();
            utils.showLoading("删除成功", 'none');
          });
        } else {
          utils.showLoading("取消删除", 'none');
        }
      }
    })
  },


  //确定
  confirm(){
    let desc = this.data.desc,
        picture = this.data.picture,
        order_id = this.data.order_id,
        user_id = wx.getStorageSync("user_id");

      utils.http(app.globalData.url + "task/finishTask_post", { order_id: order_id, user_id: user_id,content: desc }, (res) => {
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        utils.showLoading(res.data.statusMsg, "none");
        wx.navigateTo({
          url: 'mytasklist?status='+3,
        })
      }
    }, "POST");
  },

  //设置描述内容
  voucherDesc(res){
    this.setData({
      desc: res.detail.value
    });
  },

  //预览图片
  previewImage(res){
    let current = res.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.picture
    })
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