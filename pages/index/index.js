//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },

  //事件处理函数
  bindViewTap: function() {
    
  },

  onLoad: function () {   
    // wx.request({
    //   url: '', 
    //   data: {
        
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res)
    //   }
    // })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
