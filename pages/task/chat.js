let app = getApp(),
  utils = require("../../utils/util.js");

Page({
  data:{
    msgData: [],//留言内容
    inputValue:"",//留言列表
    task_id:"",//任务id
    chat_info:[],
    chat_user_id:"",
    page:1,//页码
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      task_id: res.task_id,
      chat_user_id: res.chat_user_id
    });

    this.getChatInfo(1);
  },
  //页面显示
  onShow(){},

  //获取聊天信息
  getChatInfo(page){
    let user_id =wx.getStorageSync("user_id"),
        chat_user_id = this.data.chat_user_id;

    utils.http(app.globalData.url + "drp/getChatInfo", {
      page: page, task_id: this.data.task_id, user_id: user_id, chat_user_id: chat_user_id
    }, (res) => {
      if (res.data.statusCode == 200) {
        //数据拼接
        let webData = res.data.data,
          old_data = this.data.chat_info;

        old_data = old_data.concat(webData);
        this.setData({
          chat_info: old_data
        });
      }
    });
  },

  //发送内容
  sengMsg(e){
    var inputValue = this.data.inputValue,
        chat_msg = [],
        chat_user_id = this.data.chat_user_id,
        user_id = wx.getStorageSync("user_id");

        console.log(user_id);
    
    if (inputValue == ""){
      utils.showLoading("请输入要提问的内容","none");
    } else {
      utils.http(app.globalData.url + "drp/taskChat_post", {
        task_id: this.data.task_id, user_id: user_id, content: inputValue, chat_user_id: chat_user_id
      }, (res) => {
        chat_msg.push(res.data.data.return_content);
        this.getChatInfo(1);

        if (res.data.statusCode == -2){
          utils.showLoading(res.data.statusMsg,"none");
        }
      });
      
      //更新
      this.setData({
        inputValue: '',
        chat_info: chat_msg
      });
    }
  },

  //设置提问内容
  content(e){
    this.data.inputValue = e.detail.value
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
  onReachBottom() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page
    });

    this.getChatInfo(page);
  },
});