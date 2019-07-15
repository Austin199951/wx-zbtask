let app = getApp(),
    utils = require("../../utils/util.js");

Page({
  data:{
    region: [],//地址
    customItem: '全部',
    address_id:"",//地址id
    contact:"",//收货人
    mobile:"",//手机号码
    address:"",//详细地址
    full_address:"",//地址
    index:0,//
    region_cover:"none",//地区这幕
    cur_choice:"选择省份/地区",//初始提示
    province_id: "",//省
    city_id: "",//市
    street_id: "",//区
    province: "请选择",//已选择省
    city: "",//已选择市
    street: "",//已选择街道
    selected:"none",//已选择
    addressArr:[]
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      address_id: res.add_id
    });

    this.getEditAddress();//新建修改地址
  },

  //新建修改地址-获取地区
  getRegion(parent_id){
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "shop/getRegion", { user_id: user_id, parent_id: parent_id}, (res) => {
      let webData = res.data.data;
      if (webData.length == 0) {
        this.setData({
          region_cover: "none"
        });
      }

      this.setData({
        region: webData
      });

    }, "POST");
  },

  //点击返回父级
  region_parent(res){
    var parent_id = res.currentTarget.dataset.parent_id,
        city = this.data.city,
        street = this.data.street,
        province_id = this.data.province_id,
        that = this,
      cur_choice = this.data.cur_choice,
        addressArr = this.data.addressArr;
      
    switch (parent_id){
      case "1":
        city = "";
        street = "";
        that.getRegion(1);
        addressArr = []
        that.setData({
          addressArr: addressArr
        });
        cur_choice ="选择省份/地区";
        break;
      case "2":
        street = "";
        cur_choice = "请选择城市";
        that.getRegion(province_id);
        break;
    }

    addressArr.pop(addressArr, 1)
    this.setData({
      city: city,
      cur_choice: cur_choice,
      street: street,
      full_address: addressArr
    });
    console.log(addressArr);
  },

  //点击选择地区
  choose_area(res){
    let dom = res.currentTarget.dataset,
        index = dom.index,
        region_name = dom.region_name,
        region_id = dom.region_id,
        region_type = dom.region_type,
        province_id = this.data.province_id,
        city_id = this.data.city_id,
        street_id = this.data.street_id,
        cur_choice = this.data.cur_choice,
        province = this.data.province,
        city = this.data.city,
        street = this.data.street,
        that = this.data.that,
        addressArr = this.data.addressArr;

    switch (region_type) {
      case 1:
        province_id = region_id;
        cur_choice  = "选择城市";
        province = region_name;
        city = "请选择";
        addressArr.push(region_name);
        break;
      case 2:
        city_id = region_id;
        cur_choice = "选择区县";
        city = region_name;
        street = "请选择";
        addressArr.push(region_name);
        break;
      case 3:
        street_id = region_id;
        street = region_name;
        addressArr.push(region_name);
        break;
    } 
    
    

    this.setData({
      index: index,
      province: province,
      street: street,
      city: city,
      province_id: province_id,
      street_id: street_id,
      city_id: city_id,
      cur_choice: cur_choice,
      selected:"block",
      full_address: addressArr
    });
    this.getRegion(region_id);//获取地区
    console.log("addressArr",addressArr);
  },

  //关闭地区选择
  close_region(){
    this.setData({
      region_cover: "none"
    });
  },

  //弹出地区
  select_region(){
    this.setData({
      region_cover: "block",
      full_address: "",
      province_id: "",
      street_id: "",
      city_id: "",
      province:"请选择",
      city:"",
      street:"",
      addressArr:[],
      cur_choice:"选择省份/地区"
    });
    this.getRegion(1);//获取地区
  },
  //更改地址
  bindRegionChange(res){
    this.setData({
      region: res.detail.value,
      full_address: res.detail.value
    });
  },

  //保存地址
  conserve(){
    let this_data = this.data;
    var user_id = wx.getStorageSync("user_id");
    //console.log(this_data.province_id, this_data.city_id, this_data.street_id);

    utils.http(app.globalData.url + "shop/editAddress_post", {
      user_id: user_id, add_id: this_data.address_id, address: this_data.address, contact: this_data.contact, mobile: this_data.mobile, province_id: this_data.province_id, city_id: this_data.city_id, street_id: this_data.street_id
    }, (res) => {
      if (res.data.statusCode == -2){
        utils.showLoading(res.data.statusMsg, "none");
      } else if (res.data.statusCode == 200){
        wx.navigateBack({
          url:"useraddress"
        })
      }
    }, "POST");
  },

  //新建修改地址-页面
  getEditAddress(){
    var address_id = this.data.address_id;
    var user_id = wx.getStorageSync("user_id");

    utils.http(app.globalData.url + "shop/editAddress", {
      user_id: user_id, address_id: address_id
    }, (res) => {
      let webData = res.data.data;
      if (address_id != -1){
        this.setData({
          contact: webData.contact,
          address: webData.address,
          mobile: webData.mobile,
          full_address: webData.full_address
        });
      }
    }, "POST");
  },

  //删除地址
  del_addr(){
    let that = this; 
    var user_id = wx.getStorageSync("user_id");

    wx.showModal({
      title: '温馨提示',
      content: '确认要删除么？',
      success(res) {
        if (res.confirm) {
          utils.http(app.globalData.url + "shop/delAddress", {
            user_id: user_id, address_id: that.data.address_id
          }, (res) => {
            if (res.data.statusCode == 200) {
              wx.navigateBack({
                url: "useraddress"
              })
            }
          }, "POST");
        }
      }
    })
  },

  //设置输入内容
  receiver(res){
    this.setData({
      contact: res.detail.value
    });
  },
  tel(res) {
    this.setData({
      mobile: res.detail.value
    });
  },
  detail_addr(res) {
    this.setData({
      address: res.detail.value
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