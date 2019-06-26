// pages/classification/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storage: false, 
    list: ["男生", "女生", "出版"],
    male: [],
    female: [],
    publish: [],

    // 存储是否显示左侧红色边框
    borderleft: 0,

    toView: '',

    // scrollTop: 0,
  },

  //请求分类数据方法
  request() {
    let _this = this
    wx.request({
      url: 'http://api.zhuishushenqi.com/cats/lv2/statistics',
      data: {
        
      },
      method: {
        method: "GET"
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        //存储到本地
        wx.setStorage({
          key: "classification",
          data: res.data
        })
        // 设置data
        _this.setData({
          male: res.data.male,
          female: res.data.female,
          publish: res.data.press
        })
        wx.hideLoading()
      }
    })
  },

  //改变左侧边框处
  changeborder(e) {
    this.setData({
      borderleft: e.currentTarget.dataset['index']
    })
    if (e.currentTarget.dataset.item == "男生") {
      this.setData({
        toView: "man"
      })
    } else if (e.currentTarget.dataset.item == "女生") {
      this.setData({
        toView: "woman"
      })
    }else{
      this.setData({
        toView: "pub"
      })
    } 
  },

  //点击分类列表中各项并跳转
  category(e) {
    wx.navigateTo({
      url: "../category/index?item=" + e.currentTarget.dataset.item.name + "&sex=" + e.currentTarget.dataset.sex
    })
  },

  // getDom() {
  //   wx.createSelectorQuery().select('.sex_male').fields({
  //     dataset: true,
  //     size: true,
  //     scrollOffset: true,
  //     properties: ['scrollX', 'scrollY'],
  //     computedStyle: ['margin', 'backgroundColor'],
  //     context: true,
  //   }, function (res) {
  //     console.log(res)
  //   }).exec()
  // },
  
  //获取节点1 
  // query(id) {
  //   let querys = wx.createSelectorQuery()
  //   querys.select(id).boundingClientRect()
  //   querys.exec((res)=> {
  //     console.log(id+"距离顶部高度",res[0].top);
  //     // console.log(this.data.scrollTop)
  //     // wx.pageScrollTo({
  //     //   scrollTop: res[0].top,
  //     //   duration: 1500
  //     // })
  //     this.setData({
  //       scrollTop: res[0].top
  //     })
  //   })  
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    //设置标题
    wx.setNavigationBarTitle({
      title: "分类"
    })

    //拿取本地存储
    wx.getStorage({
      key: 'classification',
      success(res) {
        _this.setData({
          storage: true,
          male: res.data.male,
          female: res.data.female,
          publish: res.data.press
        })
        wx.hideLoading()
      }
    })

    // 请求分类
    setTimeout(()=>{
      if (this.data.storage) {
        return
      } else {
        this.request()
      }
    }, 50)
  },

  onPageScroll: function (e) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})