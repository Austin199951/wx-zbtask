let app = getApp(),
    utils = require("../../utils/util.js");
    
Page({
  data:{
    page:1,//页码
    msg_list:[],//消息列表
  },
  onShow() {
    var user_id = wx.getStorageSync("user_id");
    //判断如果没有用户id就跳去登陆
    if (user_id != "") {
      app.globalData.is_login = 1;
      return false;
    } else if (app.globalData.is_login == 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return false;
    }
    this.getMsgList(1);
  },

  //查看信息
  view_msg(res){
    let dom = res.currentTarget.dataset,
      message_id = dom.message_id,
      key = dom.key,
      msg_list = this.data.msg_list;
    var user_id = wx.getStorageSync("user_id");

    wx.navigateTo({
      url: '../wallet/detail',
    });
    msg_list[key].is_read = 1;
    
    utils.http(app.globalData.url + "msg/readMsg", { user_id: user_id, message_id: message_id }, (res) => {
      this.setData({
        msg_list: msg_list
      });
    }, "POST");
  },

  //获取信息列表
  getMsgList(page){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url +"msg/msgList",{user_id: user_id, page: page}, (res) => {
      if (res.data.statusCode == 200){
        let msg_list = this.data.msg_list;
            msg_list = msg_list.concat(res.data.data);

        this.setData({
          msg_list: msg_list
        });
      }
      
    }, "POST");
  },
  onPullDownRefresh(){
    utils.showLoading("刷新成功","none");
  },

  //页面滑动到底部加载内容
  onReachBottom(){
    let page = this.data.page;
    page++;
    this.setData({
      page:page
    });

    this.getMsgList(page);
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