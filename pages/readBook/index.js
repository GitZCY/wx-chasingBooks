// pages/readBook/index.js
import tools from "../../utils/tools.js"
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Page({
  data: {
    //显示目录
    flag_list: false,

    //目录内容
    list: false,

    // 显示白层
    dis: true,

    //当前图书
    currentbook: [],

    //书图片
    image: '',
   
    //书名
    bookname: '',

    //作者
    user: '',

    //此书所属分类
    book_briefs: '',

    //介绍
    strs: '',

    //简介类别
    briefs: [],

    //字数
    contlength: 0,

    //评分
    scores: 0,

    //评分人数
    scores_user: 0,

    //读者留存
    retains: 0,

    //追书人数
    chasings: 0,

    //目录
    catalog: '',

    //作者名下书籍
    userBooks: [],

    value: 3.3,

    flag: false,

    //所有目录列表
    allChapters: ''
  },

  //请求图书
  requireBook(name) {
    wx.request({
      url: 'http://api.zhuishushenqi.com/book/' + name,
      success: (res)=> {
        console.log("当前图书",res)
        //设置简介
        let str = res.data.longIntro.replace(/↵/g, "<text>\n</text>")
        //外部导入的字数方法
        let leng = tools.countLength(res.data.wordCount)
        //分数方法
        let score = tools.scores(res.data.rating.score)
        //追书人数
        let chasing = tools.userLeng(res.data.latelyFollower)

        //设置当前图书 书名 作者 书本所属分类 简介 类别 字数 评分的分数 评分人数
        //读者留存 追书人数 书图片
        this.setData({
          currentbook: res.data,
          bookname: res.data.title,
          user: res.data.author,
          book_briefs: res.data.majorCate,
          strs: str,
          briefs: res.data.tags,
          contlength: leng,
          scores: score,
          scores_user: res.data.rating.count,
          retains: res.data.retentionRatio,
          chasings: chasing,
          image: "http://statics.zhuishushenqi.com" + res.data.cover,
          catalog: res.data.lastChapter,
        }) 
        console.log(this.data.user)
        //请求作者名下书籍
        this.requireUserbook(res.data.author)
      }
    })
  },

  // 请求名下书籍
  requireUserbook(user) {
    wx.request({
      url: 'http://novel.juhe.im/author-books?author=' + user,
      success: (res)=> { 
        this.setData({
          userBooks: res.data.books,
          dis: false
        })
        console.log("this", this.data.userBooks)
        wx.hideLoading()
      }
    })
  },

  down() {
    this.setData({
      flag: !this.data.flag
    })
  },

  //目录
  oncatalog() { 
    // this.requireBookList(this.data.currentbook._id)
    this.setData({
      flag_list: true
    })
    setTimeout(()=>{
      this.setData({
        list: true
      })
    }, 490)
  },

  //请求目录
  requireBookList(id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://api.zhuishushenqi.com/mix-atoc/' + id + '?view=chapters',
      success: (res) => {
        this.setData({
          allChapters: res.data.mixToc.chapters,
        })
        // console.log("allChapters", this.data.allChapters)
        console.log("次数", this.data.currentbook._id)
      },
      fail: (res) => {

      },
    })
  },

  //加入书架
  joinBookshelf() {
    wx.getStorage({
      key: 'Bookshelf',
      success: (res)=> {
        this.storage(res)
      },
      fail: ()=> {
        this.storage()
      },
    })
  },

  //存储
  storage(res) {
    console.log(res)
    let stor = []
    if(res) {
      for (let i = 0; i < res.data.length; i++) {
        console.log("data",res.data)
        if (res.data[i]._id != this.data.currentbook._id) {
          if (i == res.data.length - 1) {
            stor.push(...(res.data), this.data.currentbook)
            Toast('成功加入书架~');
          }
        } else {
          Toast('您已加入过书架哦~');
          return
        }
      }
      wx.setStorage({
        key: 'Bookshelf',
        data: stor
      })
    }else{
      stor.push(this.data.currentbook)
      wx.setStorage({
        key: 'Bookshelf',
        data: stor
      })
      Toast('成功加入书架~');
    }
  },

  //开始阅读
  playRead() {
    let bookId = this.data.currentbook._id
    let bookName = this.data.currentbook.title
    wx.navigateTo({
      url: '../article/index?bookId=' + bookId + '&bookName=' + bookName
    })
  },  

  //目录返回按钮
  back() {
    this.setData({
      flag_list: false,
      list: false
    })
  },

  //点击目录列表
  onChapters(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../article/index?bookId=' + e.currentTarget.dataset.bookid + "&active=" + e.currentTarget.dataset.index +
        "&bookName=" + this.data.bookname
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("shuju", options)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.requireBook(options.read)
    this.requireBookList(options.read)
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
    this.setData({
      dis: true
    })
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