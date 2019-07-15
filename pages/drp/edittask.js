let sourceType = [['camera'], ['album'], ['camera', 'album']],
    sizeType = [['compressed'], ['original'], ['compressed', 'original']],
    app = getApp(),
    utils = require("../../utils/util.js"),
    dateTimePicker = require("../../utils/dateTimePicker.js");

Page({
  data: {
    step: [
      { step_icon: "../../images/character.png", step_name: "文字", step_top: "step_top", step_type:"text"},
      { step_icon: "../../images/picture.png", step_name: "图片", step_top: "", step_type: "img"},
      { step_icon: "../../images/hyperlink.png", step_name: "超链接", step_top: "step_top", step_type: "link"}
    ],
    showView:false,
    preview:false,
    getTaskType: [],//任务分类
    task_type_id:0,
    display:"none",
    character:false,
    addimg: false,
    hyperlink:false,
    step1: "block",//发布需求第一步
    step2: "none",//发布需求第二步
    countIndex: 10,
    count: [1,2,3,4,5,6,7,8,9,10],
    picture:[],
    astrict_time: "",//任务限时
    astrict_num: "",//任务限接次数
    task_num: "",//任务数量
    task_reward: "",//每个任务赏金
    dateTimeArray: null,//开始时间数组
    startDateTime: null,//开始时间
    selected_startDateTimeArr: [],//选择开始时间数组
    selected_endDateTimeArr: [],//选择结束时间数组
    endDateTimeArray: null,//结束时间数组
    endDateTime:null,//结束时间
    task_id:'',//任务id
    getTaskSteps:[],//获取任务步骤
    getStepInfo:[],//获取要修改的步骤信息
    step_type:"",//步骤类型
    accessid:"",//阿里云的用户id，记录即可
    host:"",//阿里云的上传域名，记录即可
    policy:"",//阿里云的上传策略，记录即可
    signature:"",//阿里云的签名，记录即可
    callback:"",//阿里云的回调，记录即可
    dir:"",//阿里云的文件夹
    expire:"",//
    file_name:"",//文件名称
    drp_id:"",///商家id
    step_name:"",//任务名称
    content_one:"",
    content_two:"",
    step_id:"",
    task_id_x:"",
    caption:"",//任务标题
    startTime:"",//开始时间
    endTime:"",//结束时间
    task_type_idx:"",
    minimum_reward:"block",
    reward:"none",
    rate_config: [], 
    task_money: "", drp_money:"",
    new_type:"old_step",
    remind:false,
    preview_content:"",//预览内容
    need_pay: "",//总费
    verify_time:"",//自动审核时间
    task_refund:"",//多少时间才能发起任务退款
    step_no:1,//第几个步骤
    examine_time:""
  },
  //提交提醒
  sure(){
    var examine_time = this.data.examine_time,
        astrict_time = this.data.astrict_time,
        _this = this,
        task_num = this.data.task_num,
        astrict_num = this.data.astrict_num,
        task_reward = this.data.task_reward,
        needPay = parseFloat(task_num * task_reward).toFixed(2);
    
    if (astrict_time == "") {
      utils.showLoading("任务限时不能为空", "none");
    } else if (examine_time == "") {
      utils.showLoading("审核限时不能为空", "none");
    } else if (task_num == ""){
      utils.showLoading("任务数量不能为空", "none");
    } else if (task_reward == ""){
      utils.showLoading("任务赏金不能为空", "none");
    } else if (astrict_num == ""){
      utils.showLoading("限接次数不能为空", "none");
    } else {
      var end_date = this.data.endTime,
        expire_hour = parseFloat(astrict_time * 3600),
        pass_hour = parseFloat(examine_time * 3600),
        end_dateTimeStamp = Date.parse(new Date(end_date.replace(/-/g, '/')).toString()),
        result = (parseInt(end_dateTimeStamp / 1000) + expire_hour + pass_hour) * 1000;


      var date = new Date(result);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = _this.zeroize(date.getDate()) + " ";

      let h = _this.zeroize(date.getHours()) + ':';
      let m = _this.zeroize(date.getMinutes()) + ':';
      let s = _this.zeroize(date.getSeconds()),
        task_r = Y + M + D + h + m + s;

      this.setData({
        display: "block",
        need_pay: needPay,
        verify_time: examine_time,
        task_refund: task_r,
        remind: (!_this.data.remind)
      });
    } 
  },

  //自动补零
  zeroize(n){
    if(n < 10){
      return "0" + n;
    } else {
      return n
    }
  },

  //页面初始加载
  onLoad(res) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTimeArray: obj1.dateTimeArray,
      startDateTime: obj1.dateTime,
      endDateTimeArray: obj1.dateTimeArray,
      endDateTime: obj1.dateTime,
      task_id: res.task_id,
    });
    //初始化开始时间
    var s_y = this.data.dateTimeArray[0][this.data.startDateTime[0]],
        s_m = this.data.dateTimeArray[1][this.data.startDateTime[1]],
        s_d = this.data.dateTimeArray[2][this.data.startDateTime[2]],
        s_h = this.data.dateTimeArray[3][this.data.startDateTime[3]],
        s_mi = this.data.dateTimeArray[4][this.data.startDateTime[4]],
        start_selectedArr = this.data.selected_startDateTimeArr,
        initial_start_time = this.data.dateTimeArray[0][this.data.startDateTime[0]] + "-" + this.data.dateTimeArray[1][this.data.startDateTime[1]] + "-" + this.data.dateTimeArray[2][this.data.startDateTime[2]] + " " + this.data.dateTimeArray[3][this.data.startDateTime[3]] + ":" + this.data.dateTimeArray[4][this.data.startDateTime[4]];;

    start_selectedArr[0] = s_y;
    start_selectedArr[1] = s_m;
    start_selectedArr[2] = s_d;
    start_selectedArr[3] = s_h;
    start_selectedArr[4] = s_mi;

    //初始化结束时间
    var e_y = this.data.dateTimeArray[0][this.data.endDateTime[0]],
      e_m = this.data.dateTimeArray[1][this.data.endDateTime[1]],
      e_d = this.data.dateTimeArray[2][this.data.endDateTime[2]],
      e_h = this.data.dateTimeArray[3][this.data.endDateTime[3]],
      e_mi = this.data.dateTimeArray[4][this.data.endDateTime[4]],
      end_selectedArr = this.data.selected_endDateTimeArr,
      initial_end_time = this.data.dateTimeArray[0][this.data.endDateTime[0]] + "-" + this.data.dateTimeArray[1][this.data.endDateTime[1]] + "-" + this.data.dateTimeArray[2][this.data.endDateTime[2]] + " " + this.data.dateTimeArray[3][this.data.endDateTime[3]] + ":"+this.data.dateTimeArray[4][this.data.endDateTime[4]];

    end_selectedArr[0] = e_y;
    end_selectedArr[1] = e_m;
    end_selectedArr[2] = e_d;
    end_selectedArr[3] = e_h;
    end_selectedArr[4] = e_mi;

    this.setData({
      end_selectedArr: end_selectedArr,
      start_selectedArr: start_selectedArr,
      startTime: initial_start_time,
      endTime: initial_end_time,
    });

    
    this.getTaskSteps(res.task_id);//获取任务步骤列表
    var _this=this;
    this.editTask(function(res){
      _this.getSignPackage(function () { console.log('on load get sign package'); });//获取签名包
    });//修改新建任务-页面
    this.calcMoney(this.data.task_reward);
    
    if (res.task_id != -1){
      this.setData({
        minimum_reward: "none",
        reward: "block"
      });
    }
  },

  onShow(){
    this.getTaskCategory(3);
  },


  //获取费率
  editTask(callback){
    var task_id = this.data.task_id,
        user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/editTask", { 
      user_id: user_id, task_id: task_id
    },(res)=>{
      let webData = res.data.data;
      this.setData({
        rate_config: webData.rate_config,
        drp_id: webData.drp_info.drp_id,
      });
      if (task_id != -1){
        this.setData({
          drp_money: webData.task_info.drp_money,
          task_money: webData.task_info.task_money,
          astrict_time: webData.task_info.expire_hour,
          caption: webData.task_info.task_name,
          examine_time: webData.task_info.pass_hour,
          astrict_num: webData.task_info.allowjoin_time,
          task_num: webData.task_info.maxjoin_man,
          task_reward: webData.task_info.task_fee,
          endTime: webData.task_info.end_time
        });
      }
      callback();
    });
  },
  
  //图片上传
  upload_pictures(res) {
    var that = this,
        step_id = this.data.step_id,
        drp_id = this.data.drp_id,
      task_id = this.data.task_id,
        picture = this.data.picture,
        new_type = this.data.new_type;

    if(new_type =="new_step"){
      step_id = -1;
    }
    console.log(task_id, drp_id);
    

    if (picture.length >= 10){
      utils.showLoading("最多可添加10张","none");
      return false;
    } else {
      //上传图片-获得文件名
      utils.http(app.globalData.src + "alioss/getFileName", { func: "task", drp_id: drp_id }, (res) => {
        this.setData({
          file_name: res.data
        });
      });

      //上传图片
      wx.chooseImage({
        count: this.data.count[this.data.countIndex],
        success(res) {//成功调用
          let tempFilePaths = res.tempFilePaths;
            that.getSignPackage(()=>{
              console.log("upload after sign package")
              let str = tempFilePaths[0];
              var suffix = str.substr(str.lastIndexOf('.', str.lastIndexOf('.') + 1));

              //上传图片
              let upload_param = {
                key: that.data.dir + that.data.file_name + suffix,
                policy: that.data.policy,
                OSSAccessKeyId: that.data.accessid,
                Signature: that.data.signature,
                success_action_status: 200,
                callback: that.data.callback,
                'x:step_id': step_id,
                'x:task_id': task_id,
                id: drp_id
              };
              console.log(upload_param);

              wx.uploadFile({
                url: that.data.host,
                filePath: tempFilePaths[0],
                name: 'file',
                formData: upload_param,
                success(res) {
                  that.getStepPhoto(step_id);
                }
              })


              ///拼接图片
              picture.unshift(tempFilePaths[0]);
              that.setData({
                picture: picture
              })




            });//获取签名包

            
          }
      })
    }
  },
  
  //上传图片-获取签名包
  getSignPackage(callback){
    var drp_id = this.data.drp_id;
    let timestamp = Date.parse(new Date()) / 1000
    let expire = this.data.expire;
    console.log("getSignPackage=======>drp_id:",drp_id);

    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    if (expire < timestamp + 3) {
      utils.http(app.globalData.src + "alioss/getSignPackage", { 
        func: 'task', id: drp_id, step_id: "${x:step_id}", task_id: "${x:task_id}"
      }, (res) => {
        this.setData({
          accessid: res.data.accessid,
          callback: res.data.callback,
          dir: res.data.dir,
          host: res.data.host,
          policy: res.data.policy,
          signature: res.data.signature,
          expire: res.data.expire
        });
        
      },"POST");
    }
    callback()
  },


  //任务开始时间
  taskStartTimeColumn(e) {
    var arr = this.data.startDateTime,
        dateArr = this.data.dateTimeArray,
    selectedArr = this.data.selected_startDateTimeArr;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    selectedArr[e.detail.column] = dateArr[e.detail.column][e.detail.value]//获取当前选择时间
    let dateTimeStr = this.concatDateTime(selectedArr);//拼接成字符串
    
    if (dateTimeStr) {
      console.log(dateTimeStr);
    }

    this.setData({
      dateTimeArray: dateArr,
      startDateTime: arr,
      selected_startDateTimeArr: selectedArr,
      startTime: dateTimeStr
    });

  },
  //任务结束时间
  taskEndTimeColumn(e){
    var arr = this.data.endDateTime,
        dateArr = this.data.endDateTimeArray,
        selectedArr = this.data.selected_endDateTimeArr;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);


    selectedArr[e.detail.column] = dateArr[e.detail.column][e.detail.value];//获取当前选择时间
    let dateTimeStr = this.concatDateTime(selectedArr);//拼接成字符串

    this.setData({
      endDateTimeArray: dateArr,
      endDateTime: arr,
      selected_endDateTimeArr: selectedArr,
      endTime: dateTimeStr
    });

    if (dateTimeStr) {
      console.log(dateTimeStr);
    }
  }, 

  //获取任务步骤列表
  getTaskSteps(task_id){
    var user_id = wx.getStorageSync("user_id");
    utils.http(app.globalData.url + "drp/getTaskSteps", { user_id: user_id, task_id: task_id }, (res) => {
      this.setData({
        getTaskSteps:res.data.data
      });
    });
  },

  //修改任务步骤
  editTaskStep(res){
    let step_id = res.currentTarget.dataset.step_id,
        that = this,
        content_type = res.currentTarget.dataset.content_type,
        task_id = this.data.task_id,
        key = res.currentTarget.dataset.key;
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/getStep", { user_id: user_id, task_id: task_id, step_id: step_id }, (res) => {
      let step_info = res.data.data.step_info,
          step_content = res.data.data.step_content;
      
      this.setData({
        task_id_x: step_info.task_id,
        step_id: step_info.step_id,
        step_name: step_info.step_name,
      });
      if (content_type != "img"){
        this.setData({
          content_one: step_content.content1,
          content_two: step_content.content2
        });
      }
    });

    this.getStepPhoto(step_id);
    this.windowStep(that,content_type)
    this.setData({
      display:"block",
      new_type:"old_step",
      step_type: content_type
    });
  },
  //设置输入内容

  //判断弹窗步骤显示
  windowStep(that,step_type){
    switch (step_type) {
      case "text":
        that.setData({
          character: (!that.data.character)
        });
        break;
      case "link":
        that.setData({
          hyperlink: (!that.data.hyperlink)
        });
        break;
      case "img":
        that.setData({
          addimg: (!that.data.addimg)
        });
        break;
    }
  },
  //新建步骤
  new_step(res) {
    let that = this,
      getTaskSteps = this.data.getTaskSteps,
      step_num = getTaskSteps.length + 1,
      step_type = res.currentTarget.dataset.step_type;


    this.windowStep(that, step_type);
    that.setData({
      step_no: step_num,
      step_name: "",
      content_one: "",
      content_two: "",
      picture: [],
      display: 'block',
      new_type:"new_step",
      step_type: step_type,
    });
  },
  
  //确认修改步骤
  confirmEditStep(res){
    var dom = res.currentTarget.dataset,
        step_type = dom.step_type,
        step_id = this.data.step_id,
        task_id = this.data.task_id,
        new_type = dom.new_type;


    switch (new_type){
      case"old_step":
        this.editStep(task_id, step_id, step_type);
      break;
      case "new_step":
        this.editStep(task_id, -1, step_type);
    }
  },

  //修改添加步骤
  editStep(task_id,step_id,step_type){
    var title = this.data.step_name,
        content_one = this.data.content_one,
        content_two = this.data.content_two;
    var user_id = wx.getStorageSync("user_id");  

      utils.http(app.globalData.url + "drp/editStep_post", {
        user_id: user_id, task_id: task_id, step_id: step_id, content1: content_one, content2: content_two, title: title, type: step_type,
      }, (res) => {
        if (res.data.statusCode == -2){
          utils.showLoading(res.data.statusMsg, "none");
          return false;
        } if (res.data.statusCode == 200) {
          this.getTaskSteps(task_id);//刷新任务列表
          this.getStepPhoto(step_id);//刷新上传未提交的图片
          utils.showLoading(res.data.statusMsg, "none");
          
          this.setData({
            display: "none",
            hyperlink: false,
            addimg: false,
            character: false
          });
        }
    }, "POST");
},
  //设置输入内容
  tasktit(res){
    this.setData({
      step_name:res.detail.value
    });
  },
  taskcont(res){
    this.setData({
      content_one:res.detail.value
    });
  },
  linkcaption(res){
    this.setData({
      step_name: res.detail.value
    });
  },
  hyperlink(res){
    this.setData({
      content_one: res.detail.value
    });
  },
  hyperlinkurl(res){
    this.setData({
      content_two: res.detail.value
    });
  },
  img_step_name(res){
    this.setData({
      step_name: res.detail.value
    });
  },

  //删除步骤
  delStep(res){
    var task_id = this.data.task_id,
        step_id = res.currentTarget.dataset.step_id,
        that = this;
    var user_id = wx.getStorageSync("user_id");

    wx.showModal({
      title: '温馨提示',
      content: '确认要删除么？',
      success (res) {
        if (res.confirm) {
          utils.http(app.globalData.url + "drp/delStep", {
            user_id: user_id, step_id: step_id, task_id: task_id
          }, (res) => {
            that.getTaskSteps(task_id);//更新任务步骤列表
            utils.showLoading(res.data.statusMsg,"none");
          });
        }
      }
    })
  },

  //提交任务
  submit(){
    let task_id = this.data.task_id,
      expire_hour = this.data.astrict_time,//任务限时
      pass_hour = this.data.examine_time,//审核限时
      allowjoin_time = this.data.astrict_num,//任务限接次数
      maxjoin_man = this.data.task_num,//任务数量
      task_fee = this.data.task_reward;//每个任务赏金

    var end_time = this.data.endTime,//结束时间
      start_time = this.data.startTime,//开始时间
      task_name = this.data.caption,//任务名称
      task_type_idx = this.data.task_type_idx, //任务类型
      user_id = wx.getStorageSync("user_id");
      
    utils.http(app.globalData.url + "drp/editTask_post", { 
      user_id: user_id, task_id: task_id, task_name: task_name, task_fee: task_fee, allowjoin_time: allowjoin_time, maxjoin_man: maxjoin_man, pass_hour: pass_hour, expire_hour: expire_hour, start_time: start_time, end_time: end_time, task_type: task_type_idx
    }, (res) => {
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg,"none");
      } else if (res.data.statusCode == 200){
        wx.reLaunch({
          url: 'tasklist',
        })
      }
    },"POST");
  },

  
  //上传图片-获得图片
  getStepPhoto(step_id){
    var task_id = this.data.task_id,
        user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/getStepPhoto", {
      task_id: task_id, user_id: user_id, step_id: step_id 
    }, (res) => {
      this.setData({
        picture:res.data.data
      });    
    }, "POST");
  },
  
  //删除
  del(res){
    var c_id = res.currentTarget.dataset.c_id,
        that = this,
        user_id = wx.getStorageSync("user_id"),
        step_id = res.currentTarget.dataset.step_id;

    wx.showModal({
      title: '温馨提示',
      content: '确认要删除么？',
      success(res){
        if(res.confirm){
          utils.http(app.globalData.url + "drp/delStepPhoto", { user_id: user_id, c_id: c_id}, (res) => {
            utils.showLoading("删除成功", 'none');
            that.getStepPhoto(step_id);//刷新图片
          },"POST");
        }
      }
    })
  },

  //下一步
  next(){
    let caption = this.data.caption,
      getTaskSteps = this.data.getTaskSteps;
    
    if (caption == ""){
      utils.showLoading("请输入任务标题","none");
      return false
    } else if (getTaskSteps == "") {
      utils.showLoading("请输入任务介绍", "none");
      return false
    } else {
      this.setData({
        step1: "none",
        step2: "block"
      });
    }
    
  },

  //订单位置调整
  adjust(res){
    var adjust_type = res.currentTarget.dataset.adjust_type,
        key = res.currentTarget.dataset.key,
        getTaskSteps = this.data.getTaskSteps;

    switch (adjust_type){
      case "upward"://向上
        if (key <= 0) {
          utils.showLoading("已经是第一项了", "none");
        } else {
          this.swapDom(getTaskSteps[key].step_id, getTaskSteps[key - 1].step_id);
        }
        
        break;
      case "down"://向下
        if (key >= getTaskSteps.length-1) {
          utils.showLoading("已经是最后一项了", "none");
        } else {
          this.swapDom(getTaskSteps[key + 1].step_id, getTaskSteps[key].step_id);
        }
        break;
    }
  },
  
  //设置位置
  swapDom(step_one_id, step_two_id){
    var task_id = this.data.task_id,
        user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/swapStep", { 
      user_id: user_id, step_one_id: step_one_id, step_two_id: step_two_id
    }, (res) => {
      if (res.data.statusCode == 200){
        this.getTaskSteps(task_id);//刷新内容
      }
    }, "POST");
  },

  //拼接时间数组
  concatDateTime(input_arr){
    if (input_arr.length >= 5) {
        return input_arr[0] + "-" + input_arr[1] + "-" + input_arr[2] + " " + input_arr[3] + ":" + input_arr[4]
      }
      return false;
  },
  //设置任务标题
  task_caption(res){
    this.setData({
      caption:res.detail.value
    });
  },
  //上一步
  prev:function(){
    this.setData({
      step2: "none",
      step1: "block"
    });
  },
  // 添加步骤按钮点击
  add_steps:function(){
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    });
  },

  

  // 选择任务类型
  task_type (res) {
    let getTaskType = this.data.getTaskType;
    this.setData({
      task_type_id: res.detail.value,
      task_type_idx: getTaskType[res.detail.value].cat_id
    })
    console.log(res);
  },

  //获取任务类型
  getTaskCategory(p_id){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "drp/getTaskCategory",{user_id: user_id, p_id: p_id},(res)=>{
      this.setData({
        getTaskType: res.data.data,
        task_type_idx: res.data.data[0].cat_id
      });
    });
  },
  //关闭添加步骤
  close () {
    this.setData({
      display: 'none',
      hyperlink: false,
      addimg:false,
      character:false,
      remind:false
    });
  },
 


  // 点击预览
  preview_click(res){
    var that = this;
    var user_id = wx.getStorageSync("user_id");
    
    utils.http(app.globalData.url + "drp/previewTask", {
      user_id: user_id, task_id: this.data.task_id
    }, (res) => {
      this.setData({
        preview_content:res.data.data
      });
    });

    that.setData({
      display: 'block',
      preview: (!that.data.preview)
    });
  },
  
  //预览取消
  cancel:function(){
    this.setData({
      display: 'none',
      preview: false
    });
  },

  //设置输入内容
  hour(res) {
    this.setData({
      astrict_time: res.detail.value
    });
  },
  astrictnum(res) {
    this.setData({
      astrict_num: res.detail.value
    });
  },
  examinetime(res) {
    this.setData({
      examine_time: res.detail.value
    });
  },
  tasknum(res) {
    this.setData({
      task_num: res.detail.value
    });
  },
  taskreward(res) {
    let money = parseFloat(res.detail.value).toFixed(2);
    this.setData({
      task_reward: res.detail.value,
    });
    //判断输入商家
    if (money < 0.3 || this.data.task_reward == ""){
      this.setData({
        minimum_reward:"block",
        reward: "none"
      });
    } else {
      this.setData({
        reward: "block",
        minimum_reward: "none",
      });
    }
    this.calcMoney(money)
  },
  calcMoney(money){
    let rate_config = this.data.rate_config;
    let parent_money = (parseFloat(money) * parseFloat(rate_config.commission_rate) / 100).toFixed(2);
    if(parent_money < 0.01) {
      parent_money = 0.01
    }
    let child_money = parseFloat(money - parent_money).toFixed(2);
    this.setData({
      drp_money: parent_money,
      task_money: child_money
    })
  },

  //需求预览里面的图片预览
  preview_img(res){
    var cur_img = res.currentTarget.dataset.img,
        new_preview = [],
        preview_content = this.data.preview_content;

    for (let i of preview_content){
      if (i.content_type == 2){
        for(let j of i.content){
          new_preview.push(j.content2);
        }
      }
    }

    wx.previewImage({
      current: cur_img,
      urls: new_preview,
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
})

