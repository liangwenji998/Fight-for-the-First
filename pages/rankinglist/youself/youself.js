// pages/rankinglist/youself/youself.js
var util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},//用户基本信息
    answer: {},//答题数
    field: {},//领域
    record: {},//记录
    level:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var lev = [];
    var DATE = util.formatTime(new Date());
    this.setData({
      date: DATE,
    });
    wx.request({
      url: app.globalData.http + 'two/manager/findMeById/' + options.id,
      method: 'GET',
      data:{
        id: options.id
      },
      header: {
        'Content-Type': 'application/xml',
      },
      success: function (res) {
        for (var i = 0; i < res.data.userDayAnswer.length; i++) {
          if (res.data.userDayAnswer[i].answer_date == that.data.date) {
            res.data.userDayAnswer[i].answer_date = '今天'
          }
          app.level(res.data.userDayAnswer[i].day_total_score)
          lev.push(app.globalData.lev[app.globalData.index])
        }
        that.setData({
          userInfo: res.data.answerRanking,
          answer: res.data.totalCollcetSubject,
          field: res.data.answerRecord,
          record: res.data.userDayAnswer,
          level: lev
        })
      }
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