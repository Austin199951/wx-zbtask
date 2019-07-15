let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    refundInst: [
      "1、退款金额的计算规则为总金额-已完成任务金额。",
      "2、当申请退款后不可以取消。",
      "3、退回的款项将会通过微信打款的方式退回。",
      "4、当任务中含有未完成订单或待审核订单，不允许发起退款操作，请等待订单过期后统一发起退款操作。",
      "5、为规范商家行为，任务退款必须在任务结束时间+任务自动退单时间+任务自动审核时间后才能发起。"
    ],
    task_id:"",//任务id
    task_info:{},//任务信息
    pay_info:{},//支付信息
    order_status:[],//订单状态
  },
  //监听页面显示
  onLoad(res){
    this.setData({
      task_id: res.task_id
    });
  },

  //监听页面显示
  onShow(){
    this.refund()
  },

  //退款信息
  refund(){
    let user_id = wx.getStorageSync("user_id"),
      task_id = this.data.task_id;

    utils.http(app.globalData.url + "drp/refund", { user_id: user_id, task_id: task_id},(res)=>{
      let webData = res.data.data;
      this.setData({
        task_info: webData.task,
        pay_info: webData.pay,
        order_status: webData.order_status
      });
    },"POST");
  },

  //确认退款
  confirm(){
    var user_id = wx.getStorageSync("user_id"),
        task_id = this.data.task_id;

    utils.http(app.globalData.url + "drp/refund_post", { user_id: user_id, task_id: task_id }, (res) => {
      if (res.data.statusCode == 200){
        wx.reLaunch({
          url: 'tasklist',
        })
      } else if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      }
    }, "POST");
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