// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //顶部选项的bgc
    changbgc_top: 0,
    changbgc_bottom: 0,

    //请求主题歌单类别
    name: null,

    //性别
    sex: null,

    //hot
    type: 'hot',

    //东方玄幻
    list: '',

    //偏移位置
    start: 0,

    first_top: ["热门", "新书", "好评", "完结"],
    first_bottom: ["全部"],

    //当前搜索的图书
    currentBook: [],

    //无图书时
    falg: false,
  },

  //点击顶部按钮
  changeBg(e) {
    if (e.currentTarget.dataset['opsition'] == "top") {
      if (this.data.changbgc_top == e.currentTarget.dataset['topindex']) {
        return
      }
      switch (e.currentTarget.dataset['item']) {
        case "热门":
          this.agen('hot');
          break;
        case "新书":
          this.agen('new');
          break; 
        case "好评":
          this.agen('reputation');
          break;
        case "完结":
          this.agen('over');
          break;
      }
      this.setData({
        changbgc_top: e.currentTarget.dataset['topindex'],
      }) 
    }

    if (e.currentTarget.dataset['opsition'] == "bottom") {
      if (this.data.changbgc_bottom == e.currentTarget.dataset['bottomindex']) {
        return
      }
      this.setData({
        changbgc_bottom: e.currentTarget.dataset['bottomindex'],
        list: e.currentTarget.dataset['item'],  
      })
      if (e.currentTarget.dataset.item == "全部") {
        this.all("hot")
      }
    }
    this.setData({
      currentBook: [],
      start: 0
    }) 
    this.requireList()
  },

  //函数复用顶部按钮请求
  agen(info) {
    this.setData({
      type: info,
    })
  },

  //点击全部按钮发送请求
  all(info) {
    this.setData({
      type: info,
      list: '',
    })
  },

  // 请求数据的方法 二级分类
  sendRequire() {
    let _this = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://api.zhuishushenqi.com/cats/lv2',
      data: {

      },
      method: {
        method: "GET"
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        Object.getOwnPropertyNames(res.data).forEach(function (key) {
          if (key == _this.data.sex) {
            for(let i = 0; i < res.data[key].length; i++) {
              if (res.data[key][i].major == _this.data.name) {
                let all_bottom = _this.data.first_bottom
                all_bottom.push(...(res.data[key][i].mins))
                _this.setData({
                  first_bottom: all_bottom
                })
              }
            }
          }
        })
      }
    })
  },

  //请求主题书单
  requireList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/by-categories',
      data: { 
        gender: this.data.sex,
        type: this.data.type,
        major: this.data.name,
        minor: this.data.list,
        start: this.data.start
      },
      method: {
        method: "GET"
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let moreBooks = this.data.currentBook
        moreBooks.push(...(res.data.books))
        this.setData({
          currentBook: moreBooks,
          start: res.data.books.length
        })
        if (moreBooks.length == 0) {
          this.setData({
            falg: true
          })
        }else{
          this.setData({
            falg: false
          })
        }
        
        wx.hideLoading()
      }
    })
  },

  //路由跳转看书页面
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
    //拿到上个页面的参数
    this.setData({
      name: options.item,
      sex: options.sex
    })

    //设置标题
    wx.setNavigationBarTitle({
      title: this.data.name
    })

    //请求数据 二级分类
    this.sendRequire()
    this.requireList()
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
    this.requireList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})