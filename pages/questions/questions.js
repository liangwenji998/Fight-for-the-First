const app = getApp()

Page({
  data: {
    userInfo: {}, //用户基本信息
    answer: {}, //答题数
    field: {}, //领域
    height: 0,
    record: {}, //记录
    level: ''
  },
  //事件处理函数
  onLoad: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
  },
  onShow: function() {
    var that = this
    wx.request({
      url: app.globalData.http + 'two/manager/findMeById/' + app.globalData.id,
      method: 'GET',
      success(res) {
        that.setData({
          userInfo: res.data.answerRanking,
          answer: res.data.totalCollcetSubject,
          field: res.data.answerRecord,
          record: res.data.userDayAnswer
        })
        app.level(res.data.answerRanking.total_score)
        that.setData({
          level: app.globalData.lev[app.globalData.index]
        })
      }
    })
  },
  level: function() {
    wx.navigateTo({
      url: 'lv/lv',
    })
  },
  dati: function() {
    wx.navigateTo({
      url: 'ti/ti',
    })
  },
  administer() {
    wx.navigateTo({
      url: 'administer/administer',
    })
  }
})