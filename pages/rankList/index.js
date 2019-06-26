// pages/rankList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //无数据时
    flag: false,

    //选项栏列表
    tabList: ["周榜", "月榜", "总榜"],

    //标签index
    active: 0,

    //请求拼接
    id: '',
    monthRank: '',
    totalRank: '',

    // 当前榜单的全部图书
    allList: []
  },

  //顶部选项栏
  onChange(info) {
    let active = this.data.active
    this.setData({
      allList: [],
      active: info.detail.index,
    })
    setTimeout(()=>{
      if (info.detail.title == "周榜") {
        this.requireList(this.data.id)
      }
      else if (info.detail.title == "月榜") {
        this.requireList(this.data.monthRank)
      }
      else if (info.detail.title == "总榜") {
        this.requireList(this.data.totalRank)
      }
    }, 500)
    // if(info.detail.title == "周榜") {
    //   this.requireList(this.data.id)
    // }
    // else if(info.detail.title == "月榜") {
    //   this.requireList(this.data.monthRank)
    // }
    // else if(info.detail.title == "总榜"){
    //   this.requireList(this.data.totalRank)
    // }
  },

  // 请求当前榜单数据
  requireList(info) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://api.zhuishushenqi.com/ranking/' + info,
      success: res => {
        if (res.data.ranking == null) {
          
          this.setData({
            allList: [],
            flag: true
          })
          wx.hideLoading()
          return
        }else {
          this.setData({
            flag: false
          })
        }
        this.setData({
          allList: res.data.ranking.books
        })
        wx.hideLoading()
      }
    })
  },

  // 跳转页面
  goRead(e) {
    wx.navigateTo({
      url: '../readBook/index?read=' + e.currentTarget.dataset.read
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //设置标题
    wx.setNavigationBarTitle({
      title: options.name
    })

    //设置请求数据
    this.setData({
      id: options.id,
      monthRank: options.monthRank,
      totalRank: options.totalRank
    })
    this.requireList(options.id)
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