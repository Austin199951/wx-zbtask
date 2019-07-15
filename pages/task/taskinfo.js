let app = getApp(),
    utils = require("../../utils/util.js");
Page({
  data:{
    display:"none",
    taskDetail:[],//任务列表
    order_id:"",//任务id
    task_content: [],
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      order_id:res.id
    });
    this.fetchTask();//加载任务详情
  },
  //联系他
  contact () {
    this.setData({
      display: "block"
    });
  },
  //关闭按钮
  close() {
    this.setData({
      display: "none"
    });
  },

  //放弃任务
  giveUpTask() {
    let user_id = wx.getStorageSync("user_id"),
        order_id = this.data.order_id;

    utils.http(app.globalData.url + "task/dropTask", { user_id: user_id, order_id: order_id }, (res) => {
      if (res.data.statusCode == 200){
        utils.showLoading(res.data.statusMsg,"none");
        wx.navigateTo({
          url: 'mytasklist',
        })
      }
    });
  },

  //预览大图
  previewImage (e) {
    let current_img = e.target.dataset.img,
      task_content = this.data.task_content,
      get_img = [];

    //循环获取图片
    for (let i of task_content) {
      if (i["content_type"] == 2) {

        for (let j = 0; j < i.content.length; j++) {
          get_img.push(i.content[j].content2)
        }

      }
    }

    //查看大图
    wx.previewImage({
      current: current_img,
      urls: get_img
    })

  },
  //加载任务详情
  fetchTask() {
    let order_id = this.data.order_id,
        user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url + "task/taskInfo", { order_id: order_id, user_id: user_id }, (res) => {
      // 填充数据
      this.setData({
        taskDetail: res.data.data,
        task_content: res.data.data.task_info.task_content
      });
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