Page({
  //删除
  del:function(){
    wx.showModal({
      title: '确认要删除么？',
      content: '',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: '',
            data: '',
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          console.log(res);
        }
      }
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