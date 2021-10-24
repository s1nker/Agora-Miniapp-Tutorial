// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    detail: {},
    interval: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "设备详情"
    })
    console.log(options)
    const { uid } = options
    this.setData({
      uid,
    })
		this.getDevieInfo(uid)
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
    clearInterval(this.interval)
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
  getDevieInfo: function (doorUuid) { // 获取门锁
    const _self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'get',
      url: `https://api.archalpha.com/api/device/door/info/${doorUuid}`,
      header: {
        'content-type': 'application/json', // 默认值
        "x-pintos": wx.getStorageSync("x-token")
      },
      success(res) {
        if (res.data.success == 0) {
          const {
            result
          } = res.data
          _self.setData({
            detail: result
          })
          if (result.catEyeStorage) {
            _self.forgetSnapshot(doorUuid)
          }
        } else {
          wx.showToast({
            title: "获取不到该门锁",
            icon: 'none',
            mask: true
          })
        }
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
  // 轮询猫眼
  forgetSnapshot(doorUuid) {
    if (this.interval != null) {
      return
    }
    const _self = this
    const forgetSnapshot = () => {
      wx.request({
        method: 'get',
        url: `https://api.archalpha.com/api/device/door/snapshot-status/${doorUuid}`,
        header: {
          'content-type': 'application/json', // 默认值
          "x-pintos": wx.getStorageSync("x-token")
        },
        success(res) {
          if (!res.data.result) {
            return;
          }
          const { path, visual_data }= res.data.result
          const imgPath = `https://api.archalpha.com${path}?token=${wx.getStorageSync("x-token") || ""}`
          if (res.data.result?.type == 3) {
            wx.setStorageSync("agoraData", visual_data);
            wx.navigateTo({
              url: `../call/call?doorUuid=${doorUuid}&path=${imgPath}`,
            });
          }
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
    }
    setTimeout(() => {
      forgetSnapshot()
    }, 500)
    _self.interval = setInterval(() => {
      forgetSnapshot()
    }, 20000)
  },
})