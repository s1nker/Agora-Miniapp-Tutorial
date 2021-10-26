const AgoraMiniappSDK = require("../../lib/mini-app-sdk-production.js");
const APPID = require("../../utils/config.js").APPID;
const Utils = require('../../utils/util.js')

// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: '',
    count: 0,
    countInterval: null,
    timer: null,
    testEnv: true,
    APPID: '272238450a764397b0aa3a10acbdda58',
    playSrc: 'rtmp://58.200.131.2:1935/livetv/hunantv',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "设备列表"
    })
    const { path } = options
    this.role = "audience";
    // get pre-gened uid, this uid will be different every time the app is started
    this.uid = Utils.getUid();
    // store agora client
    this.client = null;
    this.setData({
      path,
    })
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
    clearInterval(this.countInterval)
    clearTimeout(this.timer)
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
  pickUp: function (e) {
    var self = this;
    const { type } = e.currentTarget.dataset
    // type == 2 挂断 type==1 接听
    if (type == 1) {
      wx.showLoading({
        title: "接听中...",
        mask: true,
      });
      // agora
      const agoraData = wx.getStorageSync("agoraData") || {}
      const {
        channel_name,
        id
      } = agoraData;
      this.initAgoraChannel(id, channel_name).then(url => {
        console.log(`channel: ${channel_name}, uid: ${id}`);
        // console.log(`pushing ${url}`);
        // let ts = new Date().getTime();
        //  if (this.isBroadcaster()) {
        // // first time init, add pusher media to view
        // this.addMedia(0, this.uid, url, {
        //   key: ts
        // });
        //  }
        // 展示接听时长
        self.countInterval = setInterval(() => {
          self.setData({
            count: self.count++,
          })
          self.count++;
          if (self.count === 59) {
            clearInterval(self.countInterval);
          }
        }, 1000);
        wx.hideLoading()
      }).catch(e => {
        console.log(`init agora client failed: ${JSON.stringify(e)}`);
        wx.showToast({
          title: `客户端初始化失败`,
          icon: 'none',
          duration: 5000
        });
      });
    }
    if (type == 2) {
      wx.showLoading({
        title: "挂断中...",
        mask: true,
      });
      if (self.timer) {
        clearTimeout(self.timer);
      }
      // agora
      const agoraData = wx.getStorageSync("agoraData") || {}
      const {
        id
      } = agoraData;
      self.client.unsubscribe(id, (url, rotation) => {
        console.log(`stream ${id} unsubscribed successful`);
        wx.hideLoading()
        wx.navigateBack()
      }, e => {
        console.log(`stream unsubscribed failed ${e} ${e.code} ${e.reason}`);
        wx.hideLoading()
        wx.navigateBack()
      });
    }
  },
  
  initAgoraChannel: function() {
    var self = this;
    return new Promise((resolve, reject) => {
      let client = {}
      console.log('start init');
      if (self.testEnv) {
        client = new AgoraMiniappSDK.Client({
          servers: ["wss://miniapp.agoraio.cn/117-21-184-29/api"]
        });
      } else {
        client = new AgoraMiniappSDK.Client()
      }
      //subscribe stream events
      console.log('subscribeEvents');
      self.subscribeEvents(client);
      // AgoraMiniappSDK.LOG.onLog = (text) => {
      // 	// callback to expose sdk logs
      // 	console.log(text);
      // };
      // AgoraMiniappSDK.LOG.setLogLevel(-1);
      self.client = client;
      console.log('init', self.client, APPID);
      self.client.init(APPID, () => {
        console.log(`client init success`);
        // pass key instead of undefined if certificate is enabled
        const agoraData = wx.getStorageSync("agoraData") || {}
        const {
          token,
          channel_name,
          id
        } = agoraData;
        console.log(token, channel_name, id);
        self.client.join(token, channel_name, id, () => {
          client.setRole('audience');
          console.log(`client join channel success`);
          resolve();
        }, e => {
          console.log(`client join channel failed: ${e.code} ${e.reason}`);
          reject(e)
        })
      }, e => {
        console.log(`client init failed: ${e} ${e.code} ${e.reason}`);
        reject(e);
      });
    });
  },
  playerStateChange: function (e) {
    console.log("live-player code:", e.detail.code);
  },
  subscribeEvents: function(client) {
    /**
     * sometimes the video could be rotated
     * this event will be fired with ratotion
     * angle so that we can rotate the video
     * NOTE video only supportes vertical or horizontal
     * in case of 270 degrees, the video could be
     * up side down
     */
    client.on("video-rotation", (e) => {
      console.log(`video rotated: ${e.rotation} ${e.uid}`)
      // setTimeout(() => {
      // 	const player = this.getPlayerComponent(e.uid);
      // 	player && player.rotate(e.rotation);
      // }, 1000);
    });
    /**
     * fired when new stream join the channel
     */
    client.on("stream-added", e => {
      let uid = e.uid;
      const ts = new Date().getTime();
      console.log(`stream ${uid} added`);
      /**
       * subscribe to get corresponding url
       */
      client.subscribe(uid, (url, rotation) => {
        console.log(`stream ${uid} subscribed successful`);
        let media = this.data.media || [];
        let matchItem = null;
        for (let i = 0; i < media.length; i++) {
          let item = this.data.media[i];
          if (`${item.uid}` === `${uid}`) {
            //if existing, record this as matchItem and break
            matchItem = item;
            break;
          }
        }
        console.log(`stream url: ${url}`)

        if (!matchItem) {
          //if not existing, add new media
          // this.addMedia(1, uid, url, {
          // 	key: ts,
          // 	rotation: rotation
          // })
          this.playSrc = url;
          this.setData({
            playSrc: url,
          }, () => {
            let context = wx.createLivePlayerContext("player", this);
            context.play();
          })
        } else {
          // if existing, update property
          // change key property to refresh live-player
          // this.updateMedia(matchItem.uid, {
          // 	url: url,
          // 	key: ts,
          // });
          this.playSrc = url;
          this.setData({
            playSrc: url,
          }, () => {
            let context = wx.createLivePlayerContext("player", this);
            context.play();
          })
        }
      }, e => {
        console.log(`stream subscribed failed ${e} ${e.code} ${e.reason}`);
      });
    });

    /**
     * remove stream when it leaves the channel
     */
    client.on("stream-removed", e => {
      let uid = e.uid;
      console.log(`stream ${uid} removed`);
      // this.removeMedia(uid);
    });

    /**
     * when bad thing happens - we recommend you to do a 
     * full reconnect when meeting such error
     * it's also recommended to wait for few seconds before
     * reconnect attempt
     */
    client.on("error", err => {
      let errObj = err || {};
      let code = errObj.code || 0;
      let reason = errObj.reason || "";
      console.log(`error: ${code}, reason: ${reason}`);
      let ts = new Date().getTime();
      if (code === 501 || code === 904) {
        // this.reconnect();
      }
    });

    /**
     * there are cases when server require you to update
     * player url, when receiving such event, update url into
     * corresponding live-player, REMEMBER to update key property
     * so that live-player is properly refreshed
     * NOTE you can ignore such event if it's for pusher or happens before
     * stream-added
     */
    client.on('update-url', e => {
      console.log(`update-url: ${JSON.stringify(e)}`);
      let uid = e.uid;
      let url = e.url;
      let ts = new Date().getTime();
      if (`${uid}` === `${this.uid}`) {
        // if it's not pusher url, update
        console.log(`ignore update-url`);
      } else {
        // this.updateMedia(uid, {
        // 	url: url,
        // 	key: ts,
        // });
      }
    });

    // token 过期
    // 开启此监听需要获取 2.4.7 版本 sdk
    // client.on("onTokenPrivilegeDidExpire", () => {
    //   console.log('当前 token 已过期，请更新 token 并重新加入频道')
    // }); 
  }
})