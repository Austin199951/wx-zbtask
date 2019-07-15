var app = getApp(),
  utils = require("../../utils/util.js"),
  size = app.globalData.size;//条数

Page({
  data:{
    batchoper:false,
    checkBg:"../../images/check1.png",
    loadMore:"none", 
    task_join_list: [],//获取接单列表
    select_a: false,
    page:1,//页码
    task_id:"",//任务id
    voucher: "none",//凭证显示
    voucher_content: "",//凭证内容
    order_idx: "",//凭证id
    cover:"none",//这幕
    account:"",//驳回理由框
    regard:"none",
    checked_order_id:[],
    checked:false,//选中
  },
  //内容初始加载
  onLoad(res){
    this.setData({
      task_id: res.task_id
    });
    this.taskJoinList()//获取接单列表
  },

  //获取接单列表
  taskJoinList(){
    let page = this.data.page,
      user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url +"drp/taskJoinList",{ 
      user_id: user_id, page: page, size: size, task_id: this.data.task_id
    },(res)=>{
      this.setData({
        task_join_list:res.data.data
      })
    },"POST");
  },


  //获取凭证内容（快速审核）
  rapid_audit(res){
    let order_id = res.currentTarget.dataset.order_id,
      user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/getVoucherContent", {
      user_id: user_id, order_id: order_id
    }, (res) => {
      this.setData({
        voucher: "block",
        cover: "block",
        voucher_content: res.data.data,
        order_idx: order_id, 
      });
    },"POST");
  },

  //取消查看凭证内容
  cancel(){
    this.setData({
      voucher: "none",
      cover:"none"
    });
  },
  //拒绝凭证内容
  close(res){
    this.setData({
      regard: "block",
      voucher: "none"
    });
  },

  //确定
  sure(){
    var order_idx = this.data.order_idx,
      drp_note = this.data.account,
      user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/rejectVoucher_post", {
      user_id: user_id, order_id: order_idx, drp_note: drp_note
    }, (res) => {
      this.setData({
        regard: "none",
        voucher: "none",
        cover: "none"
      });
      this.taskJoinList();//刷新任务
    });
  },
  //关闭驳回理由
  call_off(){
    this.setData({
      regard: "none",
      voucher: "block"
    });
  },
  //通过凭证内容
  confirm(res){
    let order_idx = res.currentTarget.dataset.order_idx,
      user_id = wx.getStorageSync("user_id");
      
    utils.http(app.globalData.url + "drp/passVoucher_post", {
      user_id: user_id, order_id: order_idx
    }, (res) => {
      this.taskJoinList();//刷新任务
      this.setData({
        cover:'none',
        regard: "none",
        voucher: "none"
      });
    });
  },

  //批量操作
  batchOper(){
    let that = this;
    this.setData({
      //batchoper: true
      batchoper: (!that.data.batchoper),
    });
  },
  //设置驳回理由
  drp_note(res) {
    this.setData({
      account: res.detail.value
    });
  },

  //批量通过
  batch_voucher(){
    var user_id = wx.getStorageSync("user_id"),
        ids = this.data.checked_order_id,
        idsx = JSON.stringify(ids),
        that = this,
        batchoper = this.data.batchoper;


    if (ids.length == 0){
      utils.showLoading("至少选择一个订单","none");
    } else {
      utils.http(app.globalData.url + "drp/finishGroup", { user_id: user_id, ids: idsx}, (res) => {
        if (res.data.statusCode == 200){
          utils.showLoading(res.data.statusMsg,"none");
          this.setData({
            batchoper: (!that.data.batchoper)
          });
        }
      });
    }
  },
  //设置选中
  // change_checkbox(res){
  //   var key = res.currentTarget.dataset.key,
  //       checked = this.data.checked;

  //   checked[key] = true
  //   this.setData({
  //     checked: checked
  //   });
  // },

  //全选
  // check_all(){
  //   var checked = this.data.checked;
  //   this.setData({
  //     checked: (checked == false ? true : false)
  //   });
  // },

  //单个选择
  check(e) {
    var that = this,
        arr1 = [],
        order_id = that.data.checked_order_id,
        join_list = that.data.task_join_list,//获取所有数据
        index = e.currentTarget.dataset.id;

    join_list[index].checked = !join_list[index].checked;//勾选

    if (join_list[index].checked == false){
      order_id.pop(join_list[index].order_id);
    } else {
      order_id.push(join_list[index].order_id);
    }

    for (let i = 0; i < join_list.length; i++) {
      if (join_list[i].checked) {//如果选中
        arr1.push(join_list[i])
      }
    }

    //设置内容
    that.setData({
      checked_order_id: order_id,
      task_join_list: join_list,
      middlearr: arr1
    })
  },

  //全选
  check_all() {
    let that = this,
      orderid = [],
      arr = that.data.task_join_list,
      arr2 = [];

    console.log(arr.length);

    for (let i = 0; i < arr.length; i++) {
      orderid.push(arr[i].order_id)//把所有order_id选中

      if (arr[i].checked == true) { //如果
        arr2.push(arr[i]);
      } else {
        arr[i].checked = true;
        arr2.push(arr[i]);
      }
    }

    //设置已选内容
    that.setData({
      checked_order_id: orderid,
      select_a: (!that.data.select_a),
      task_join_list: arr2,
      middlearr: arr2,
    })
  },

  //取消全选
  decheck_all() {
    let that = this,
      arr = that.data.task_join_list,
      arr1 = [];

    for (let i = 0; i < arr.length; i++) {
      arr[i].checked = false;
      arr1.push(arr[i]);
    }
    that.setData({
      select_a: (!that.data.select_a),
      task_join_list: arr1,
      middlearr: [],
      checked_order_id:[]
    })
  },

  //图片预览
  preview_picture(res){
    let v_img = res.currentTarget.dataset.v_img,
      voucher_info = this.data.voucher_content.voucher_info,
      new_voucher = [];

    //循环取出图片再拼到一个数组里面
    for (var i of voucher_info){
      new_voucher.push(i.v_img)
    }

    wx.previewImage({
      current: v_img,
      urls: new_voucher,
    })
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