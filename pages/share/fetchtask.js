let app = getApp(), 
  utils = require("../../utils/util.js");
  
Page({
  data: {
    taskDetail:[],
    task_content:[],
    display:"none",
    task_id:"",
    order_id:"",//任务 id
  },
  //联系他
  contact () {
    this.setData({
      display: "block"
    });
  },
  close(){
    this.setData({
      display: "none"
    });
  },

  //预览大图
  previewImage(e){
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

  //页面初始化
  onLoad(res) {
    //获取传过来的id并设置
    let task_id = res.id;
    this.setData({task_id: task_id});
    
    this.fetchTask();//加载任务详情
  },

  //加载任务详情
  fetchTask(){
    let task_id = this.data.task_id;

    utils.http(app.globalData.url + "home/fetchTask", { id: task_id }, (res) => {
      // 填充数据
      this.setData({
        taskDetail:res.data.data,
        task_content: res.data.data.task_info.task_content
      });
      console.log(res.data.data);
    });
  },

  //复制链接
  copyurl(res){
    let c_url = res.currentTarget.dataset.c_url;
    wx.setClipboardData({
      data: c_url,
    })
  },
  //接任务
  takeTask() {
    let user_id = wx.getStorageSync("user_id"),
      task_id = this.data.task_id,
      order_id = this.data.order_id;
    utils.http(app.globalData.url + "task/takeTask", { user_id: user_id, task_id: task_id }, (res) => {

      if (res.data.statusCode == -2) {//如果状态码等于-2 表示"超出该推广个人可接次数限制"
        utils.showLoading(res.data.statusMsg, "none");
      } else if (res.data.err == 0) {//如果等于0,操作成功，跳我的推广

      } else if (res.data.err == 1) {//还没上传凭证，跳转到上传凭证

      } else if (res.data.statusCode == 200) {
        utils.showLoading(res.data.statusMsg, "none");
        this.setData({
          order_id: res.data.data.order_id
        });
        wx.navigateTo({
          url: '../task/mytasklist?order_id' + order_id,
        })
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
  }
})