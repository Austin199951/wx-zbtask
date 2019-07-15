Page({
  data: {
    index: 0,
    balance: [
      { balanceUrl: "detail", balanceNmae: "账户明细" },
      { balanceUrl: "withdrawdetail", balanceNmae: "提现记录" },
    ],
    user_money: "",//账目余额
  },
  //页面初始加载
  onLoad(res){
    this.setData({
      user_money: res.user_money
    });
  },
  //收入转出切换
  outInCome(res){
    var id = res.currentTarget.dataset.index;
    this.setData({
      index: id
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