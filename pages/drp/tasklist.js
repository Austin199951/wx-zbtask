let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    tasklist: ["全部", "未开始", "进行中", "已完成"],
    id:0,
    cover:"none",
    page: 1, //页码
    task_cn:"",//任务名
    hint:"",//提示语
    loading:"none",//加载图标
    getTaskList: [],//获取任务列表
  },
  // 监听页面显示
  onLoad(res){
    var _this=this;
    this.getUserInfo(()=>{
      _this.getTaskList(1);//获取任务列表
    });
  },
  
  //获取用户信息
  getUserInfo(callback){
    var user_id = wx.getStorageSync("user_id");
    console.log(user_id);
    //判断如果没有用户id就跳去登陆
    if (user_id != "") {
      app.globalData.is_login = 1;

      utils.http(app.globalData.url + "user/getUserInfo", { user_id: user_id }, (res) => {
        if (res.data.data.real_info == null) {
          wx.reLaunch({
            url: '../wallet/realname',
          })
        }
        callback();
      });

    } else if (app.globalData.is_login == 0) {
      wx.reLaunch({
        url: '../login/login',
      })
    }
  },

  //切换任务上下架
  toggleTask(res){
    var task_id = res.currentTarget.dataset.task_id,
        is_key = res.currentTarget.dataset.is_key,
        user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/toggleTask", { user_id: user_id, task_id: task_id}, (res) => {
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        this.getTaskInfo(is_key);//刷新状态
      }
    });
  },

  cancel(){
    this.setData({
      cover:"none"
    });
  },

  //任务支付
  pay_click(res){
    var dom = res.currentTarget.dataset,
        task_id = dom.task_id,
        user_id = wx.getStorageSync("user_id"),
        that = this,
        task_name = dom.task_name,
        is_key = dom.is_key;

    wx.login({
      success(res){
        let code = res.code;
        utils.http(app.globalData.url + "pay/payTask", {
          user_id:user_id, code: code, task_id: task_id 
        }, (res) => {

          let webData = JSON.parse(res.data.data);
          
          //如果成功
          if (res.data.statusCode == 200){
            wx.requestPayment({
              timeStamp: webData.timeStamp,
              nonceStr: webData.nonceStr,
              package: webData.package,
              signType: webData.signType,
              paySign: webData.paySign,

              success(res) {//支付成功
                console.log("支付成功", res);
                utils.showLoading("支付成功", "none");
                that.getTaskInfo(is_key);//刷新状态

                that.setData({
                  task_cn: task_name,
                  cover:"block"
                });
              },
              fail(res) {//支付成功
                utils.showLoading("支付成功", "none");
                console.log("支付失败", res);
              },
              complete(res) {//支付成功
                console.log("完成支付", res);
                that.getTaskInfo(is_key);//刷新状态
                utils.showLoading("完成支付", "none");
              }
            })
          }
        });
      }
    })
  },

  //查看用户留言
  comments(res){
    var dom = res.currentTarget.dataset,
        task_id = dom.task_id,
        key = dom.key,
        getTaskList = this.data.getTaskList;

    getTaskList[key].drp_read = 1;
    this.setData({
      getTaskList: getTaskList
    });
    wx.navigateTo({
      url: 'taskchat?task_id=' + task_id,
    })
  },

  //新建任务
  new_task(){
    var user_id = wx.getStorageSync("user_id");
    //判断如果没有用户id就跳去登陆
    if (user_id != "") {
      app.globalData.is_login = 1;
      wx.navigateTo({
        url: "edittask?task_id=" + -1
      });

      return false;
    } else if (app.globalData.is_login == 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return false;
    }
  },

  //刷新任务状态
  getTaskInfo(key){
    var getTaskList = this.data.getTaskList,
        user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/getTaskInfo", {
      user_id: user_id, task_id: getTaskList[key]['task_id']
    }, (res) => {
      if (res.data.statusCode == 200) {
        let webData = res.data.data,
            task_to_update = "getTaskList[" + key + "]";

        webData.is_hidden = true;

        this.setData({
          [task_to_update]: webData
        });
      } else if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg, "none");
      }
    });
  },

  //获取任务列表
  getTaskList(page){
    let size = app.globalData.size,
      user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/getTaskList", {
      user_id: user_id, page: page, size: size
    }, (res) => {

      let webData = res.data.data;
      for (var i of webData) {
        i.is_hidden = true;
      }

      //拼接数组
      let old_task_list = this.data.getTaskList;
          old_task_list = old_task_list.concat(webData);

      this.setData({
        getTaskList: old_task_list
      });
    });
  },

  //导航tab切换
  tasklistBtn(res){
    var id = res.currentTarget.dataset.id;
    this.setData({
      id: id
    });
  },

  //更多操作
  more_open(res){
    var dom = res.currentTarget.dataset,
        key = dom.key,
        is_refund = dom.is_refund;

    if (this.data.getTaskList[key].is_refund != 1){
      this.displayDiding(key);
    } else if (is_refund == 1){
      utils.showLoading("请先激活任务","none");
    }
  },
  //任务删除
  del_task(res){
    var user_id = wx.getStorageSync("user_id"),
      dom = res.currentTarget.dataset,
      task_id = dom.task_id

    utils.http(app.globalData.url + "drp/delTask", {
      user_id: user_id, task_id: task_id
    }, (res) => {
      if (res.data.statusCode == 200){
        utils.showLoading(res.data.statusMsg, "none");
        this.getTaskList(1);
        utils.showLoading("删除成功", "none");
        wx.reLaunch({
          url: 'tasklist',
        })
        
      } else if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg, "none");
      }
    });  
  },

  //激活任务
  activate_task(res){
    var user_id = wx.getStorageSync("user_id"),
      dom = res.currentTarget.dataset,
      key = dom.key,
      task_id = dom.task_id;

    utils.http(app.globalData.url + "drp/activateTask", {
      user_id: user_id, task_id: task_id
    }, (res) => {
      if (res.data.statusCode == 200) {
        utils.showLoading(res.data.statusMsg, "none");
        this.getTaskInfo(key);
      }
    }); 
  },

  //取消更多操作
  close (res) {
    let is_key = res.currentTarget.dataset.is_key;
    this.displayDiding(is_key);
  },

  //显示隐藏
  displayDiding(key){
    var task_list = "getTaskList[" + key + "].is_hidden",
        is_hide = !this.data.getTaskList[key].is_hidden;

    this.setData({
      [task_list]: is_hide
    });
  },

  //下拉刷新任务
  onReachBottom(){
    let page = this.data.page;
    page++;
    this.setData({
      page:page
    })
    this.getTaskList(page);
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
  //退出
  logout() {
    var user_id = wx.getStorageSync("user_id");
        wx.removeStorageSync("user_id");

    wx.reLaunch({
      url: '../login/login',
    })
    app.globalData.is_login = 0;
  },

  //下拉刷新状态
  onPullDownRefresh(res){
    utils.showLoading('loading...',"loading");
    var _this = this;
    
    setTimeout(() => {
      _this.setData({
        getTaskList: []
      });
      _this.getUserInfo(() => {
        _this.getTaskList(1);//获取任务列表
      });
      wx.stopPullDownRefresh();
      utils.hideLoading();
    }, 1000);
    
  },

  //监听页面滚动
  // onPageScroll(res){
  //   let scrollTop = res.scrollTop,
  //       that = this;

  //   wx.getSystemInfo({
  //     success (res) {
  //       if (res.windowHeight - scrollTop < 100) {
  //         that.setData({
  //           loading:"block"
  //         });
  //       }
  //     }
  //   })
  // }
})