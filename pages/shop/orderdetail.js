let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    order_id:"",//订单id
    order_info:{},//订单信息
    pay_info:{},//支付信息
    order_follow:[],//订单流水
    refund_info:{},//退款信息
    cs_info:[],
    accessid: "",//	阿里云的用户id，记录即可
    host	: "",//	阿里云的上传域名，记录即可
    policy	: "",//	阿里云的上传策略，记录即可
    signature	: "",//	阿里云的签名，记录即可
    callback	: "",//	阿里云的回调，记录即可
    dir	:"",//	阿里云的文件夹
    expire: "",//阿里云的过期时间戳
    file_name:"",//文件名
    picture:{},//图片
    return_msg:"none",//退换弹出框
    cover:"none",//遮幕
    return_info:"",//退换货信息
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      order_id: res.order_id
    });

    this.getSignPackage();//售后上传图片-获取签名包
  },
  //监听页面显示
  onShow() {
    this.getOrderDetail();//获取订单详情
  },

  //图片上传
  upload_pictures(){
    let that = this,
        picture = this.data.picture;

    if (picture.length >= 10) {
      utils.showLoading("最多可添加10张", "none");
      return false;
    } else {
      //获取文件名
      utils.http(app.globalData.src + "alioss/getFileName", { func: "redeem" }, (res) => {
        that.setData({
          file_name: res.data
        });
      }, "POST");


      wx.chooseImage({
        success(res) {
          let tempFilePaths = res.tempFilePaths,
              str = tempFilePaths[0],
              postfix = str.substr(str.lastIndexOf(".", str.lastIndexOf(".") +1 ));//处理文件后缀
          

          let that_data = that.data,
            formData = {
              "key": that_data.dir + that_data.file_name + postfix,
              OSSAccessKeyId: that_data.accessid,
              policy: that_data.policy,
              Signature: that_data.signature,
              success_action_status: 200,
              callback: that_data.callback
            };

          //上传
          wx.uploadFile({
            url: that_data.host, 
            filePath: tempFilePaths[0],
            name: 'file',
            formData: formData,
            success (res) {
              that.getImageInfo();
            }
          })
          
        },
      })
    }
  },

  //获取已上传未提交的图片
  getImageInfo(){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "shop/getImageInfo", {
      user_id: user_id, order_id: this.data.order_id
    }, (res) => {
      console.log(res.data.data);
      this.setData({
        picture: res.data.data.img_info
      });
    },"POST");
  },

  //售后上传图片-获取签名包
  getSignPackage(){
    let timestamp = Date.parse(new Date()) / 1000,
        expire = this.data.expire;

    if (expire < timestamp+3){
      utils.http(app.globalData.src + "alioss/getSignPackage", {
        func: "redeem", id: this.data.order_id
      }, (res) => {
        this.setData({
          accessid: res.data.accessid,//	阿里云的用户id，记录即可
          host: res.data.host,//	阿里云的上传域名，记录即可
          policy: res.data.policy,//	阿里云的上传策略，记录即可
          signature: res.data.signature,//	阿里云的签名，记录即可
          callback: res.data.callback,//	阿里云的回调，记录即可
          dir: res.data.dir,//	阿里云的文件夹
          expire: res.data.expire,//阿里云的过期时间戳
        });
      },"POST");
    }  
  },

  //获取订单详情
  getOrderDetail(){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "shop/orderDetail", { 
      user_id: user_id, order_id: this.data.order_id
    }, (res) => {
      if (res.data.statusCode == 200){
        let webData = res.data.data,
          point = webData.order_info.snapshot.point,
          total_fee = webData.pay_info.total_fee;

        webData.order_info.snapshot.point = parseInt(point).toFixed(0);//积分去掉小数
        webData.pay_info.total_fee = (parseFloat(total_fee) / 1000).toFixed(2);//支付金额保留两位小数点

        this.setData({
          order_info: webData.order_info,
          pay_info: webData.pay_info,
          order_follow: webData.order_follow,
          refund_info: webData.refund_info,
          cs_info: webData.cs_info
        });
      }
    }, "POST");
  },

  //确认退换货
  confirm(){
    let return_info = this.data.return_info;
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "shop/orderCustomService_post", {
      user_id: user_id, order_id: this.data.order_id, reason: return_info
    }, (res) => {
      if (res.data.statusCode == 200) {
        this.showHide("none", "none");
      } else if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      }
    }, "POST");
  },

  //确认收货
  finish(){
    var user_id = wx.getStorageSync("user_id");
    
    wx.showModal({
      title: '温馨提示',
      content: '确认已经收到货物并完成兑换流程，订单将会完结',
      success(res){
        if (res.confirm) {
          utils.http(app.globalData.url + "shop/finishOrder", {
            user_id: user_id, order_id: this.data.order_id
          }, (res) => {
            if (res.data.statusCode == 200) {
              this.getOrderDetail();//刷新订单详情
            }
          }, "POST");
        }
      },
    })
  },

  as_click(){
    this.showHide("block", "block");
  },

  //取消遮幕
  close(){
    this.showHide("none", "none");
  },
  //显示隐藏
  showHide(cover, return_msg){
    this.setData({
      cover: cover,
      return_msg: return_msg
    });
  },

  //设置退换货信息
  return_msg(res){
    this.setData({
      return_info:res.detail.value
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