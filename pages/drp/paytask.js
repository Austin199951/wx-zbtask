Page({
  data:{
    paytask: [
      { payName: "任务名称：", payNum: "55555" },
      { payName: "每人允许参与次数：", payNum: "3次" },
      { payName: "最大参与人数：", payNum: "3" },
      { payName: "任务佣金：", payNum: "8元" },
      { payName: "推荐人佣金：", payNum: "8元" },
      { payName: "任务共：", payNum: "8元" }
    ]
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