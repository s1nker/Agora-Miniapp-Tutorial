const app = getApp()
const Utils = require('../../utils/util.js')

// pages/index/index.js.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // used to store user info like portrait & nickname
    userInfo: wx.getStorageSync("userInfo") || {},
    hasUserInfo: false,
    // whether to disable join btn or not
    disableJoin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 只有提供了该回调才会出现转发选项
   */
  onShareAppMessage() {

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
   * callback to get user info
   * using wechat open-type
   */
  onGotUserInfo: function (e) {
    console.log("getUserProfile");
    wx.getUserProfile({
      desc: "获取你的昵称、头像、地区及性别",
      success: (res) => {
        console.log('getUserProfile success', res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // this.userInfo = res.userInfo
        // this.hasUserInfo = true
        wx.setStorage({
          key: 'userInfo',
          data: res.userInfo,
        })
      },
      fail: function (err) {
        console.log("getUserProfile fail");
        console.log(err);
      }
    })
  },
  getPhoneNumber: function (e) {
    console.log("login");
    wx.login({
      success: (res) => {
        console.log("login success");
        if (res.code) {
          this.postLogin(e, res.code)
        }
      },
      fail: function (err) {
        console.log("login fail");
        console.log(err);
      }
    })
  },
  postLogin: function (phoneObject, code) { // 提交至后端
    var data = {
      encryptedData: phoneObject.detail.encryptedData,
      iv: phoneObject.detail.iv,
      code: code,
      userInfo: this.userInfo,
    }
    wx.request({
      method: 'post',
      url: 'https://api.archalpha.com/rest/pintos/wx/auth',
      data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.success == 0) {
          const result = res.data.result
          if (result.id > 0) {
            wx.setStorageSync("x-token", result.sessionToken);
          }
        } else {
          console.log(res)
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            mask: true
          })
        }
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
  onGoToDeviceList: function () {
    wx.navigateTo({
      url: `../devices/devices`
    });
  }
})