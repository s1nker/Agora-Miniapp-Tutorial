// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "设备列表"
    })
    this.getUserDeviceList()
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
  
  },
  getUserDeviceList() { // 获取用户的设备列表
    const _self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'get',
      url: 'https://api.archalpha.com/api/device/list',
      header: {
        'content-type': 'application/json', // 默认值
        "x-pintos": wx.getStorageSync("x-token")
      },
      success(res) {
        const result = res.data.result || []
        _self.setData({
          list: result,
        })
        wx.hideLoading()
      },
      fail(e) {
        console.log(e)
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          mask: true
        })
      }
    })
  },
  onGoToDetail: function (e) {
    console.log(e.currentTarget.dataset.uid)
    wx.navigateTo({
      url: `../device-detail/device-detail?uid=${e.currentTarget.dataset.uid}`
      // url: `../call/call?uid=${e.currentTarget.dataset.uid}`
    });
  }
})