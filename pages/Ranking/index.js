// pages/Ranking/index.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {

    flag_male: false,
    flag_female: false,

    //榜单
    maleArr: [],
    femaleArr: [],

    //别人家的榜单
    male_others: [],
    female_others: []
  },

  open() {
    this.setData({
      flag_male: !this.data.flag_male
    })
  },

  openFemale() {
    this.setData({
      flag_female: !this.data.flag_female
    })
  },

  // 请求所有榜单
  requireAll() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  
    wx.request({
      url: 'http://api.zhuishushenqi.com/ranking/gender',
      method: {
        method: "GET"
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log('res', res)
        let spl_male = res.data.male.slice(0, 7)
        let spl_female = res.data.female.slice(0, 7)
        let spl_others_male = res.data.male.slice(7)
        let spl_others_female = res.data.female.slice(7)
        this.setData({
          maleArr: spl_male,
          femaleArr: spl_female,
          male_others: spl_others_male,
          female_others: spl_others_female
        })
        console.log('this.data.maleArr', this.data.maleArr)
        console.log('this.data.femaleArr', this.data.femaleArr)
        console.log('this.data.male_others', this.data.male_others)
        console.log('this.data.female_others', this.data.female_others)
        wx.hideLoading()
      }
    })
  },

  // 跳转到榜单页面
  goList(e) {
    console.log("dataset",e.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/rankList/index?id=${e.currentTarget.dataset.listid}&name=${e.currentTarget.dataset.item}
&monthRank=${e.currentTarget.dataset.monthrank}&totalRank=${e.currentTarget.dataset.totalrank}`
    })
  },

  goLista(e) {
    console.log("dataset", e.currentTarget.dataset)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //设置标题
    wx.setNavigationBarTitle({
      title: "排行"
    })

    //请求所有榜单
    this.requireAll()
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