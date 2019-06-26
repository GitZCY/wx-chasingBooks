// pages/search/index.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: false,

    load: true,

    search_flag: false,

    imghidden: false,

    //延迟显示
    delay: false,

    //当前输入的文本
    value: '',

    //顶部文本
    tabbar: '',

    //历史记录
    allstor: [],

    // 所有搜索热词
    hotlist: [],

    // 随机搜索热词
    randomHot: [],

    //模糊搜索
    vague: [],

    //滚动距离
    scoolY: 50 + "rpx",

    //记录滚动距离
    record: "",

    //返回按钮的显示
    image_bign: false,

    image_opacity: false
  },

  // 搜索热词
  requireHot() {
    wx.request({
      url: 'https://novel.juhe.im/search-hotwords',
      success: (res) => {
        this.setData({
          hotlist: res.data.searchHotWords
        })
        this.randomWord()
      }
    })
  },

  //随机搜索词
  randomWord() {
    let list = this.data.hotlist
    let ran = []
    for (let i = 0; i < 15; i++) {
      let num = parseInt(Math.random() * 100)
      if (ran.indexOf(list[num]) == -1) {
        ran.push(list[num])
      } else {
        i--
      }
    }
    this.setData({
      randomHot: ran,
      load: false
    })
  },

  //模糊搜索请求  http://api.zhuishushenqi.com/book/fuzzy-search?query=%E6%96%97%E7%BD%97
  vagueRequire() {
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/fuzzy-search?query=' + this.data.value,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        this.setData({
          vague: res.data.books
        })
      },
    })
  },

  // 点击换一批
  replace() {
    this.randomWord()
  },

  //监听搜索框
  onChange(e) {
    clearTimeout(time)
    if (e.detail.value.length == 0) {
      this.setData({
        flag: false
      })
    } else {
      this.setData({
        flag: true
      })
    }
    let now = e.detail.value.length
    this.setData({
      value: e.detail.value,
      tabbar: e.detail.value
    })

    let time = setTimeout(() => {
      if (now == this.data.value.length) {
        this.vagueRequire()
      }
    }, 800)
  },
  
  //路由跳转看书页面
  goRead(e) {
    this.onSearch()
    wx.navigateTo({
      url: '../readBook/index?read=' + e.currentTarget.dataset.read
    })
  },

  //点击模糊搜索列表
  onList(e) {
    this.setData({
      value: e.currentTarget.dataset.read,
      tabbar: e.currentTarget.dataset.read
    })
    this.onSearch()
  },

  //点击搜索按钮
  onSearch(e) {
    if(this.data.value.length == 0) {
      return
    }
    this.setData({
      value: '',
      flag: false,
      search_flag: true,
      image_bign: true,
      image_opacity: true
    })
    //设置标题
    wx.setNavigationBarTitle({
      title: "与" + this.data.tabbar + "相关的书籍"
    })
    setTimeout(() => {
      this.setData({
        imghidden: true,
        delay: true
      })
    }, 500)
    wx.getStorage({
      key: 'history',
      success: (res) => {
        this.setStorage(res)
      },
      fail: () => {
        this.setStorage()
      }
    })
  },

  //存储到本地
  setStorage(res) {
    let stor = []
    if (res) {
      if (res.data.indexOf(this.data.tabbar) == -1) {
        stor.push(...(res.data), this.data.tabbar)
      } else {
        return
      }
    } else {
      stor.push(this.data.tabbar)
    }
    wx.setStorage({
      key: 'history',
      data: stor,
    })
    this.setData({
      allstor: stor
    })
  },

  // 点击返回箭头
  returnImage() {
    this.setData({
      vague: [],
      search_flag: false,
      imghidden: false,
      delay: false,
    })

    //设置标题
    wx.setNavigationBarTitle({
      title: "搜索"
    })
  },

  //点击搜索热词下的内容
  onHot(e) {
    this.setData({
      value: e.currentTarget.dataset.word,
      tabbar: e.currentTarget.dataset.word,
    })
    setTimeout(() => {
      this.setData({
        imghidden: true
      })
    }, 200)
    this.vagueRequire()
    this.onSearch()
  },

  //删除
  onDelete() {
    if (this.data.allstor.length == 0) {
      return
    }
    Dialog.confirm({
      message: '是否清空搜索历史？'
    }).then(() => {
      wx.removeStorage({
        key: 'history',
        success: (res) => {
          this.setData({
            allstor: []
          })
        },
      })
    }).catch(() => {

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取本地
    wx.getStorage({
      key: 'history',
      success: (res) => {
        this.setData({
          allstor: res.data
        })
      },
      fail: () => {

      }
    })

    //设置标题
    wx.setNavigationBarTitle({
      title: "搜索"
    })
    //请求热词
    this.requireHot()
  },

  //页面滚动
  onPageScroll: function(e) {
    // clearTimeout(time)
    // this.setData({
    //   record: e.scrollTop,
    //   imghidden: false,
    // })

    // let time = setTimeout(() => {
    //   if (e.scrollTop == this.data.record) {
    //     this.setData({
    //       imghidden: true,
    //     })
    //   }
    // }, 200)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示 search_flag
   */
  onShow: function() {
    this.setData({
      flag: false,
      image_bign: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})