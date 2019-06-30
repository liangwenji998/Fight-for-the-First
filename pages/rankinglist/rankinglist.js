// pages/rankinglist/rankinglist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    level: [],
    number: [],
    num: 1,
    top: 0,
    id: '',
    page: true,
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var lev = []
    var variable = that.data.list
    wx.request({
      url: app.globalData.http + 'two/manager/page',
      method: 'POST',
      data: {
        Authorization: '1',
        pageNumber: that.data.num
      },
      header: { //头部返回信息
        'content-type': 'application/json',
        Authorization: 1
      },
      success: function(res) {
        if (that.data.page === false) {

        } else {
          that.setData({
            page: false
          })
          if (res.data.data.length === 0) {
            wx.showToast({
              title: '暂无更多数据',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              num: that.data.num - 1
            })
          } else {
            wx.hideToast()
            for (var x = 0; x < res.data.data.length; x++) {
              variable.push(res.data.data[x])
            }
            that.setData({
              list: variable,
            })
            for (var i = 0; i < that.data.list.length; i++) {
              app.level(that.data.list[i].total_score)
              lev.push(app.globalData.lev[app.globalData.index])
            }
            that.setData({
              level: lev,
            })
          }
        }
      }
    })
  },
  details(e) {
    wx.navigateTo({
      url: 'youself/youself?id=' + e.currentTarget.dataset.id
    })
  },
  paging() {
    var that = this
    if (that.data.num < 5) {
      that.setData({
        num: that.data.num + 1,
        page: true
      })
      wx.showToast({
        title: '加载第' + that.data.num + '页',
        icon: 'loading',
        duration: 20000
      })
      that.onShow()
    }
  },
  assignment(e) {
    var that = this
    that.setData({
      id: e.detail.value
    })
  },
  query() {
    var that = this
    if (that.data.id !== '') {
      wx.navigateTo({
        url: 'youself/youself?id=' + that.data.id
      })
    }
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
  onShareAppMessage: function(res) {
    if (res.from != 'button') {
      return {
        title: '转发',
        path: '/pages/rankinglist/rankinglist',
      }
    }
  }
})