Page({
  //做任务
  do_task(){
    wx.switchTab({
      url:"../share/homepage"
    })
  },
  //去积分商城
  go_shop(){
    wx.switchTab({
      url: "../shop/index"
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