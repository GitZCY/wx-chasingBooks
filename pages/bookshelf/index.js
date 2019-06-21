// pages/bookshelf/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //是否显示没有书籍
    falg: true,

    //本地图书
    loca: [],

    //书本数量
    loacLength: 0,

    border_clip: false,

    onIndex: [],
  },

  // 跳转页面
  goRead(e) {
    if (this.data.border_clip) {
      let arr = this.data.loca.length
      let newArr = new Array(arr)
      let index = e.currentTarget.dataset.index

      if (this.data.onIndex.length == 0) {
        newArr.splice(index, 1, index)
        this.setData({
          onIndex: newArr
        })
        console.log("第一次", newArr)
      } else {
        newArr = this.data.onIndex

        if (index == newArr[index]) {
          newArr.splice(index, 1, -1)
        } else {
          newArr.splice(index, 1, index)
        }

        this.setData({
          onIndex: newArr
        })
        console.log(this.data.onIndex)
      }

    } else {
      wx.navigateTo({
        url: '../readBook/index?read=' + e.currentTarget.dataset.read
      })
    }
  },

  //点击添加书籍  pages/classification/index
  addBook() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //设置标题
    wx.setNavigationBarTitle({
      title: "书架"
    })

  },

  longPress() {
    this.setData({
      border_clip: true
    })
  },

  onBox() {
    this.setData({
      border_clip: false,
      onIndex: []
    })
  },

  onBtn(e) {
    if (e.currentTarget.dataset.index == 1) {
      console.log(this.data.onIndex)  
      wx.getStorage({
        key: 'Bookshelf',
        success: (res)=> {
          console.log(res.data)   
          let books = res.data
          for (let i = 0; i < books.length; i++) { 
            if (this.data.onIndex[i] > -1) { 
              books.splice(i, 1)
              this.data.onIndex.splice(i, 1)
              --i
            }
          }
          this.setData({
            loca: books,
            onIndex: []
          })
          // 存储到本地
          this.setStorage(books)
        },
      })
    } else {
      this.setData({
        border_clip: false,
        onIndex: []
      })
    }
  },

  setStorage(info) {
    console.log('info',info)
    if(info.length == 0) {
      wx.removeStorage({
        key: 'Bookshelf',
      })
      this.setData({
        falg: true,
        border_clip: false
      })
    }else {
      wx.setStorage({
        key: 'Bookshelf',
        data: info,
      })
    }
    
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.getStorage({
      key: 'Bookshelf',
      success: (res) => {
        console.log("res", res)
        //判断是否有新书加入 
        if (this.loacLength != res.data.length) {
          this.setData({
            falg: false,
            loca: res.data,
            loacLength: res.data.length
          })
        } else {
          return
        }
      },
      fail: (res) => {
        this.setData({
          falg: true
        })
      },
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