let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    status:1,//订单状态
    myTasks:[],//我的推广
    page:1,//页码
  },
  //生命周期函数--监听页面加载
  onShow(res) {
    this.getMyTask(1,1);
  },

  //头部导航切换
  tasklistBtn(res) {
    let status = res.currentTarget.dataset.status,
      myTasks = this.data.myTasks,
      page = this.data.page;

    //如果任务列表大于0就重置这个数组
    if (myTasks.length > 0){
      myTasks = []
    }

    this.setData({
      status: status,
      myTasks: myTasks,
      page: 1
    });
    this.getMyTask(1,status);
  },

  //获取我的推广任务
  getMyTask(page,status){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "task/myTasksAjax", { page: page, status: status, user_id: user_id }, (res) => {
      var myTasksOld = this.data.myTasks;
        myTasksOld = myTasksOld.concat(res.data.data);

      if (res.data.statusCode == 200) {
        this.setData({
          myTasks: myTasksOld
        });
      }
    });
  },

  //滑动到底部加载
  onReachBottom(){
    let page = this.data.page,
        status = this.data.status;
    page++;
    this.setData({
      page:page
    });
    this.getMyTask(page, status);
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