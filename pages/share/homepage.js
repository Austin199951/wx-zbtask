let app = getApp(), 
  utils = require("../../utils/util.js");

Page({
  data: {
    getSlide: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicatorColor:"#b9b9b9",
    activeColor:"white",
    taskList: [],
    filterArr: ["最新", "高价", "简单"],
    id:0,
    signBox: [
      "周一", "周二", "周三", "周四", "周五", "周六", "周日"
    ],
    signExplain: [
      "1、每天签到可获取现金奖励，连续签到一周最高可获取3-5元",
      "2、每天签到可获取积分奖励，连续签到一周最高可获取28分",
      "3、每周一刷新签到积分和及奖励", "4、若中断签到，连续签到记录将重新计算，积分和红包奖励按照第一天重新计算",
      "5、本次积分签到奖励仅限于本次活动",
    ],
    getCatInfo:[],
    display:"none",
    signBg:"../../images/right.png",
    loadMore:"none",
    search:false,
    allClassify:true,
    homepage:false,
    searchVal:"",
    searchArr:[],
    getTag:[],
    is_up: -1,// 是否置顶
    is_easy: -1, // 是否简单
    is_high:-1, // 是否高价;
    page:1, //页码
    keywords:"",//关键字
    cushyJob:[]//今日美差事
  },
  onLoad(res) {
    this.getSlide();//加载轮播图
    this.getCatInfo();//获取分类图标
    this.getSearchHist();//获取历史记录
    this.getTag();//获取热门标签
    this.fetchTasksAjax(1, 0);//加载任务列表
    this.fetchTasksAjax(1, 4);//加载任务列表
    this.getShareInfo();//获取微信分享


    var user_id = wx.getStorageSync("user_id");
    if (user_id != "") {
      app.globalData.is_login = 1;
      return false;
    }
  }, 

  onShow(){
    this.fetchTasksAjax(1, 0);//加载任务列表
    this.fetchTasksAjax(1, 4);//加载任务列表
  },
  //获取微信分享
  getShareInfo(){
    utils.http(app.globalData.url + "home/getShareInfo", "", (res) => {
      wx.setStorageSync("share_img", res.data.data.img);
      wx.setStorageSync("share_title", res.data.data.title)
    });
  },
  //去积分商城
  go_shop(){
    wx.switchTab({
      url:"../shop/index"
    })
  },
  //去做任务
  do_tasks(res){
    //判断如果没有用户id就跳去登陆
    var task_id = res.currentTarget.dataset.task_id,
      user_id = wx.getStorageSync("user_id");

    if (app.globalData.is_login == 0) {
      wx.navigateTo({
        url: '../login/login',
      })
      return false;
    } else {
      wx.navigateTo({
        url: 'fetchtask?id=' + task_id,
      })
      return false;
    }
  },

  //筛选
  termFilter(res) {
    let id = res.currentTarget.dataset.id,
      taskList = this.data.taskList,
      page = this.data.page;
    
    page = 1
    if (taskList.length > 0){
      let taskList = new Array();
      this.fetchTasksAjax(1,id);

      this.setData({
        id: id,
        taskList: taskList
      });
    } 
  },
  //签到
  sign(){
    this.setData({
      display: "block"
    });
  },
  sign_in(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      index: index,
      signBg: "../../images/cur.png"
    });
  },
  cancel(){
    this.setData({
      display: "none"
    })
  },

  //点击搜索框
  searchBox(res){
    this.setData({
      search: true,
      signIcon:true,
      allClassify: false,
      homepage: true
    });
  },


  //删除历史
  del(res){
    var keyword = res.currentTarget.dataset.hist_name;
    this.delSearchHist(keyword);
  },

  //返回
  goBack:function(res){
    this.setData({
      search: false,
      signIcon: false,
      allClassify: true,
      homepage: false 
    });
  },
  
  //点击搜索
  confirmSearch(){
    let searchVal = this.data.searchVal;
    
    if (searchVal == ""){
      utils.showLoading("请输入搜索内容","none");
      return false;
    } else {
      this.pushSearchHist(searchVal);
      wx.navigateTo({
        url: 'searchresult?keyword=' + searchVal,
      })
    }
  },
  //热搜标签
  hoSsearch(res){
    let tag_name = res.currentTarget.dataset.tag_name;
    wx.navigateTo({
      url: 'searchresult?keyword=' + tag_name,
    })
  },
  // 历史记录
  historyR(res){
    let history_name = res.currentTarget.dataset.history_name;
    wx.navigateTo({
      url: 'searchresult?keyword=' + history_name,
    })
  },

  //设置搜索内容
  searchInp(res) {
    this.setData({
      searchVal: res.detail.value
    });
  },
  //获取历史记录
  getSearchHist() {
    var searchArr = wx.getStorageSync("search");
    if (searchArr == undefined || searchArr =="" ) {
      searchArr = [];
    }
    this.setData({
      searchArr: searchArr
    });
  },

  //向数组头部塞入一个搜索内容
  pushSearchHist(keyword) {
    let searchArr = this.data.searchArr;
    if (keyword == '') { return }//先检测一下是否存在这个keyword

    this.delSearchHist(keyword)
    //console.log('kkk:'+searchArr)
    searchArr.unshift(keyword)
    this.setData({
      searchArr: searchArr
    });
    this.saveSearchHist()
  },

  //删除历史
  delSearchHist(keyword) {
    let searchArr = wx.getStorageSync("search");
    for (var i = 0; i < searchArr.length; i++) {
      if (searchArr[i] == keyword) {
        searchArr.splice(i, 1)
      }
    }

    this.setData({
      searchArr: searchArr
    });
    this.saveSearchHist()
  },
  //保存历史
  saveSearchHist() {
    let searchArr = this.data.searchArr;
    if (searchArr.length > 10) { searchArr.length = 10 }
    wx.setStorageSync("search", searchArr)
  },


  
  //滑动到底部的时候
  onReachBottom () {
    let page = this.data.page,
      id = this.data.id,
      taskList = this.data.taskList;
    
    page ++;
    this.setData({
      page: page
    });
    this.fetchTasksAjax(page,id)
  },

  //任务列表
  fetchTasksAjax(page,select){
    let is_high = this.data.is_high,
      is_up = this.data.is_up,
      is_easy = this.data.is_easy,
      keyword = this.data.keywords,
      size = app.globalData.size;

    if (select == 0) {
      is_up = -1,
      is_easy = -1,
      is_high = -1
    } else if (select == 1) {
      is_up = -1,
      is_easy = -1,
      is_high = 1
    } else if (select == 2) {
      is_up= -1,
      is_easy= 1,
      is_high= -1
    } else if (select == 4){
      is_up = 1,
      is_easy = -1,
      is_high = -1
    }
     
    utils.http(app.globalData.url + "home/fetchTasksAjax", { is_up: is_up, is_easy: is_easy, is_high: is_high, page: page, size: size, keyword: keyword }, (res) => {
      
      if (select == 4){
        this.setData({
          cushyJob: res.data.data,
        });
      } else {
        var taskListOld = this.data.taskList
        taskListOld = taskListOld.concat(res.data.data)
        this.setData({
          taskList: taskListOld,
        });
      }
    });
  },

  //加载轮播图
  getSlide(){
    utils.http(app.globalData.url + "home/getSlide", "", (res) => {
        this.setData({
          getSlide:res.data.data
        });
    });
  },

  //获取分类图标
  getCatInfo(){
    utils.http(app.globalData.url + "discovery/getCatInfo", "", (res) => {
      this.setData({
        getCatInfo: res.data.data
      });
    });
  },

  
  //获取热门标签
  getTag() {
    utils.http(app.globalData.url + "home/getTag", "", (res) => {
      this.setData({
        getTag: res.data.data
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
})