// pages/article/index.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //禁止滚动
    // stop: true,

    //当前书本名字
    bookName: '',

    //当前背景颜色下标
    active_bg: 0,

    //行间距下标
    active_li: 1,

    flag: false,
    
    //目录
    cat: false,

    //当前请求的章节index
    chapters_index: 0,

    //存储请求过的章节用来比大小
    storage: [],

    //所有章节
    allChapters: null,

    //文章内容
    bookContent: [],

    //文章内容和标题
    allContent: null,

    bgc: ['white', 'black', 'beige', 'pink', 'tan'],

    lineheight: [
      { title: "small", url: "/images/small.png", onurl: "/images/onsmall.png"},
      { title: "center", url: "/images/center.png", onurl: "/images/oncenter.png"},
      { title: "big", url: "/images/big.png", onurl: "/images/onbig.png"},
    ],

    // 标题字体大小
    titleSize: '',

    //字体大小
    fontSize: '',

    //行间距
    lineHeight: '',

    //背景颜色
    backGround: '',

    //字体颜色
    fontColor: '',
    titleColor: '',

    //是否是从外部点击目录进来
    onChapters: false
  },
  
  //请求目录
  requireBookList(id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://api.zhuishushenqi.com/mix-atoc/' + id +'?view=chapters',
      success: (res) => {
        this.setData({
          allChapters: res.data.mixToc.chapters
        })
        if (this.data.onChapters) {
          this.requireBookContent("remove")
          this.setData({
            onChapters: false
          })
        }else {
          this.requireBookContent()
        }
        
        console.log("allChapters", this.data.allChapters)
      },
      fail: (res) => {

      },
    })
  },

  //请求书本内容
  requireBookContent(flag) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let info = this.data.allChapters[this.data.chapters_index]
    console.log("chapters_index", info)
    console.log("这个", typeof (parseInt(this.data.chapters_index) ) )
    let url = escape(info.link)
    let nowBookContent = []
    wx.request({
      url: "http://chapter2.zhuishushenqi.com/chapter/" + url,
      success: (res)=> {
        //保存请求过的下标  storage
        let arr = this.data.storage
        if (this.data.chapters_index < arr[0]) {
          arr.unshift(this.data.chapters_index)
        } else {
          arr.push(this.data.chapters_index)
        }
        this.setData({
          storage: arr
        })
        console.log("arr", this.data.storage)
        let newarr = []
        // console.log("内容", res.data.chapter)
        let str = res.data.chapter.body.split(/\n/g)
        // console.log("str",str)
        nowBookContent.push(info.title, str)
        console.log("asass", nowBookContent)
        let content = this.data.bookContent
        if(flag == "Front") {
          content.push(nowBookContent)
          this.setData({
            bookContent: content
          })
        }else if (flag == "after"){
          content.unshift(nowBookContent)
          this.setData({
            bookContent: content
          })
        }else if (flag == "remove"){
          newarr.push(nowBookContent)
          this.setData({
            bookContent: newarr
          })
          
        }else {
          content.push(nowBookContent)
          this.setData({
            bookContent: content
          })
        } 
        wx.hideLoading()
        console.log("nowBookContent", this.data.bookContent)
      },
      fail: function(res) {

      }, 
      complete: function () {
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  //点击box
  disNone() {
    this.setData({
      flag: !this.data.flag,
      cat: false,
      // stop: true
    })
  },
  
  //返回按钮
  goBack() {
    wx.navigateBack({
      delta: 1
    })
    // this.query()
  },

  //字体加/减
  changeSize(e) {
    let info = e.currentTarget.dataset.size
    let size = this.data.fontSize
    if (info == "down") {
      if (size <= 30) {
        return
      }
      size = size - 2
    }else {
      if (size >= 46) {
        return
      }
      size = size + 2
    }
    this.setData({
      fontSize: size
    })
  },

  //背景颜色
  changeColor(e) {
    let info = e.currentTarget.dataset.color
    let index = e.currentTarget.dataset.active
   
    if(info == 'black') {
      this.setData({
        titleColor: "white",
        fontColor: "#F0F0F0",
      })
    }else{
      this.setData({
        titleColor: "black",
        fontColor: "#323232",
      })
    }
    this.setData({
      backGround: info,
      active_bg: index
    })
  },

  //改变行高
  changeLine(e) {
    let info = e.currentTarget.dataset.index
    let line = 0
    if(info == 0) {
      line = 70
    }else if(info == 1) {
      line = 100
    }else {
      line = 130
    }
    this.setData({
      lineHeight: line,
      active_li: info
    })
  },

  //目录按钮
  onCatchtap() {
    this.setData({
      cat: true,
    })
  },
  
  //点击目录列表
  onChapters(e) {
    let index = e.currentTarget.dataset.index
    let msgList = this.data.bookContent.length - 1
    console.log("msg-" + msgList, this.data.bookContent)
    this.setData({
      chapters_index: index,
      cat: false,
      flag: false,
      storage: [],
    })
    console.log("这个",this.data.toView)
    this.requireBookContent("remove")
    
    wx.pageScrollTo({
      scrollTop: 1,
      duration: 0
    })
  },

  scrollUpper() {
    let storageIndex = this.data.storage
    let num = 0
    console.log(storageIndex)
    if (storageIndex[0] == 0) {
      Toast('当前已是第一章~');
      // wx.stopPullDownRefresh() //停止下拉刷新
      return
    } else {
      num = storageIndex[0] - 1
      this.setData({
        chapters_index: num
      })
    }
    this.requireBookContent("after")
  },

  //获取节点
  // query() {
  //   let querys = wx.createSelectorQuery()
  //   querys.select('.catalog_bright').boundingClientRect()
  //   querys.exec((res)=> {
  //     // console.log(res);
  //     // console.log(this.data.scrollTop)
  //     // wx.pageScrollTo({
  //     //   scrollTop: res.top,
  //     //   duration: 1500
  //     // })
  //     this.setData({
  //       scrollTop: res[0].top,
  //     })
  //   })
  // },

  //获取节点 有用
  // query(id) {
  //   let querys = wx.createSelectorQuery()
  //   querys.select(id).boundingClientRect()
  //   querys.exec((res)=> {
  //     console.log(id+"距离顶部高度",res);
      // console.log(this.data.scrollTop)
      // wx.pageScrollTo({
      //   scrollTop: res[0].top,
      //   duration: 1500
      // })
      // this.setData({
      //   scrollTop: res[0].top
      // })
    // })  
  // },

  /**
   * 生命周期函数--监听页面加载   bookName
   */
  onLoad: function (options) {
    
    this.setData({
      titleSize: 48,
      fontSize: 40,
      lineHeight: 100,
      backGround: "white",
      titleColor: "black",
      fontColor: "#323232",
      bookName: options.bookName
    })

    if (options.bookId && options.active) {
      console.log("you", options.bookId, options.active)
      console.log("类型",typeof (options.active))
      let num = 0
      if(typeof(options.active) == "string") {
        num = parseInt(options.active)
        this.setData({
          chapters_index: num,
          onChapters: true
        })
      }else {
        this.setData({
          chapters_index: options.active,
          onChapters: true
        })
      }
      
      console.log('下标呀', this.data.chapters_index)
      this.requireBookList(options.bookId)     
    }else {
      this.requireBookList(options.bookId)
    }   

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
   * 页面上拉触底事件的处理函数 allChapters
   */
  onReachBottom: function () {
    let storageIndex = this.data.storage
    console.log("触底",storageIndex)
    let chapters = this.data.allChapters.length - 1
    let num = 0
    if (storageIndex[storageIndex.length - 1] == chapters) {
      Toast('当前已是最后一章~');
      return
    } else {
      num = storageIndex[storageIndex.length - 1] + 1
      this.setData({
        chapters_index: num
      })
    }
    this.requireBookContent("Front")
  },
  //页面滚动
  onPageScroll: function (e) {
    if (e.scrollTop == 0) {
      console.log("到顶了")
      this.scrollUpper()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})