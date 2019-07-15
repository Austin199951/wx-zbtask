let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    loadMore:"none",
    getChatUserInfo:[],
    page:1,
    task_id:"",//任务id
  },
  onLoad(res){
    this.setData({
      task_id:res.task_id
    });

    this.getChatUserInfo(1);
  },

  //监听页面显示
  onShow(){
    
  },

  //获取用户留言列表
  getChatUserInfo(page){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/taskChatUserInfo", {
      page: page, task_id: this.data.task_id, user_id: user_id 
    }, (res) => {
      if (res.data.statusCode == 200){
        let webData = res.data.data,
          old_data = this.data.getChatUserInfo;
          old_data = old_data.concat(webData);

        this.setData({
          getChatUserInfo: old_data
        });
      }
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
  },

  //滑动到底部加载内容
  onReachBottom () {
    let page = this.data.page;
    page++;
    this.setData({
      page:page
    });

    this.getChatUserInfo(page);
  },
});