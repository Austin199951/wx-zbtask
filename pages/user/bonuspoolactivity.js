var that,
    animation = wx.createAnimation();

function update(content) {
  animation.translateY(-30).step({ duration: 300, timingFunction: 'ease-in' });
  animation.opacity(0).translateY(30).step({ duration: 1, timingFunction: 'step-start' });
  animation.opacity(1).translateY(0).step({ duration: 300, timingFunction: 'ease-out' });

  that.setData({
    animationData: animation.export()
  })

  setTimeout(that.setData.bind(that, { content: content }),300);
}

Page({
  data: {
    content: '欢迎回来'
  },
  onLoad() {
    that = this
    var generateRandomNumber = () => Math.floor(Math.random() * 1900 + 1) // 生成1到1999的随机数
    setInterval(() => { update('你获得了' + generateRandomNumber() + '个金币') }, 2000)
  }
});