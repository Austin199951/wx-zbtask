var app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data: {
    taskList:[],
    display: "none",
    keyword:"",
    views:-1,//综合
    searchVal:"",//搜索内容
    task_type:"",
    task_money:-1,//价格
    start_time:-1,//时间
    getCatInfo: [],//获取分类
    classifyIcon:true,//隐藏分类图标
    taskIcon:false,
    cat_name:"分类",
    catid:""
  },
  /*生命周期函数--监听页面加载*/
  onLoad(res) {
    let pass_keyword = res.keyword || "",
    pass_taskType = res.task_type || -1,
    views = this.data.views;

    if(pass_keyword!=""){
      views = 1
      pass_taskType = -1
    }

    //获取搜索传过来的值并设置
    this.setData({
      catid: pass_taskType,
      views:views,
      cat_name: res.cat_name,
      keyword:pass_keyword,
      searchVal: res.keyword,
      task_type: pass_taskType,
    });

    this.getCatInfo();//获取分类图标
    this.fetchTasksAjax(pass_keyword,pass_taskType);//加载筛选列表
  },

  //导航筛选
  screen_nav (res){
    let type_nav = res.currentTarget.dataset.type_nav,
        that = this,
        task_type = this.data.task_type,
        task_money = this.data.task_money,
        start_time = this.data.start_time,
        views = this.data.views,
        taskIcon = this.data.taskIcon,
        classifyIcon = this.data.classifyIcon;

    switch (type_nav) {
      case "views":
        task_money = start_time = task_type = -1
        views = 1
        break;

      case "task_money":
        views = start_time = task_type = -1
        task_money = (task_money == 1) ? 0 : 1;
        break;

      case 'start_time':
        views = task_money = task_type = -1
        start_time == 1 ? (start_time = 0) : (start_time = 1)
        break;
    }
    
    this.setData({
      views: views,
      start_time: start_time,
      task_money: task_money,
      task_type: task_type,
      classifyIcon:true,
      taskIcon:false,
      keyword: '1',
      cat_name:"分类",
      catid:""
    });
    this.fetchTasksAjax("",task_type);//加载筛选列表
  },
  

  //搜索按钮
  confirmSearch() {
    let searchVal = this.data.searchVal || "";
    
    if (searchVal == "") {
      utils.showLoading("请输入搜索内容", "none");
      return false;
    } else {
      this.fetchTasksAjax(searchVal, "-1");
    }
  },

  //加载搜索筛选列表
  fetchTasksAjax(keyword,task_type){
    var //keyword = this.data.searchVal ,
      //task_type = this.data.task_type,
      task_money = this.data.task_money,
      start_time = this.data.start_time,
      views = this.data.views;

    utils.http(app.globalData.url + "home/fetchTasksAjax", { keyword: keyword, task_type: task_type, task_money: task_money, start_time: start_time, views: views}, (res) => {
      this.setData({
        taskList:res.data.data
      });
    });
  },

  //设置数据内容
  searchInp(res) {
    this.setData({
      searchVal: res.detail.value
    });
  },

  //获取分类图标
  getCatInfo() {
    utils.http(app.globalData.url + "discovery/getCatInfo", "", (res) => {
      let webData = res.data.data,
        catname = this.data.cat_name,
        task_type = this.data.task_type;
  
      for (let i of webData) {
        if (i.cat_id == task_type){
          catname = i.cat_name
        }
      }

      this.setData({
        getCatInfo: webData,
        cat_name: catname
      });
      
    });
  },

  //点击分类
  classify(){
    let taskIcon = this.data.taskIcon,
      classifyIcon = this.data.classifyIcon,
      that = this;
    this.setData({
      taskIcon: (!that.data.taskIcon),
      classifyIcon: (!that.data.classifyIcon),
      keyword: '',
      start_time: -1,
      task_money: -1,
      views: -1,
    });
  },

  //选分类
  selectTask(res){
    var taskIcon = this.data.taskIcon,
      classifyIcon = this.data.classifyIcon,
      that = this,
      cat_name =res.currentTarget.dataset.cat_name,
      taskList = this.data.taskList,
      cat_id = res.currentTarget.dataset.cat_id,
      catid = this.data.catid;
    
    if (taskList.length > 0){
      taskList = []
    }
    this.fetchTasksAjax("", cat_id);
      
    this.setData({
      catid: cat_id,
      taskList: taskList,
      cat_name: cat_name,
      taskIcon: (!that.data.taskIcon),
      classifyIcon: (!that.data.classifyIcon),
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