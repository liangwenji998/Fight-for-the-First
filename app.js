//app.js
App({
  globalData: {
    code: '',
    user: {},
    userInfo: null,
    http: 'http://118.25.156.182:8080/v1/open/',
    lev: [
      '已经没有可降的了，加油啊',
      '小白',
      '书童',
      '秀才',
      '举人',
      '探花',
      '榜眼',
      '状元',
      '恭喜你，高中状元'
    ],
    index: 0,
    id: '',
    shows:false,
    face: ''
  },
  onLaunch: function() {
    var that = this
    wx.login({
      //获取code
      success: function(res) { //获取code值
        that.globalData.code = res.code
        // console.log(res.code)
      }
    })
  },
  getId(e) {
    var that = this
    wx.request({
      url: that.globalData.http + 'three/manager/test1/' + e,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        that.globalData.id = res.data.id;
        that.globalData.face = res.data.baidu_token
      }
    })
  },
  level: function(e) {
    var that = this
    if (e >= 280) {
      that.globalData.index = 7
    } else if (e >= 210) {
      that.globalData.index = 6
    } else if (e >= 150) {
      that.globalData.index = 5
    } else if (e >= 100) {
      that.globalData.index = 4
    } else if (e >= 60) {
      that.globalData.index = 3
    } else if (e >= 30) {
      that.globalData.index = 2
    } else {
      that.globalData.index = 1
    }
  },
  getcode: function() { //全局获取 CODE值的方法
    var that = this
    wx.login({
      //获取code
      success: function(res) { //获取code值
        that.globalData.code = res.code
        // console.log(that.globalData.code)
      }
    })
  },
  update(e) {
    var that = this
    wx.request({
      url: that.globalData.http + 'three/manager/test1/' + that.globalData.code,
      method: 'POST',
      data: {
        avatar: e.avatarUrl,
        nike_name: e.nickName,
        country: e.country,
        privince: e.province,
        city: e.city,
        gender: e.gender,
        baidu_token: that.globalData.face,
      },
      success(res) {}
    })
  },
  getUserInfo: function(cb) {
    var that = this
    if (that.globalData.personInfo) {
      typeof cb == "function" && cb(taht.globalData.personInfo)
    } else {
      // 调用登录接口
      wx.login({
        success: function() {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function(res) {
              that.globalData.personInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.personInfo)
            }
          })
        }
      })
    }
  },
  bindGetUserInfo: function(e) {
    var that = this
    that.globalData.user = e.detail.userInfo
  },
})