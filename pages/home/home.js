// pages/home/home.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},//用户基本信息
    answer:{},//答题数
    field:{},//领域
    record:{},//记录
    date:'',
    level: '',
    levUp:'',
    levDown:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var DATE = util.formatTime(new Date());
    this.setData({
      date: DATE,
    });
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
    var that = this
    wx.request({
      url: app.globalData.http + 'two/manager/findMeById/' + app.globalData.id,
      method: 'GET',
      success(res) {
        for (var i = 0 ; i < res.data.userDayAnswer.length ; i++) {
          if (res.data.userDayAnswer[i].answer_date == that.data.date) {
            res.data.userDayAnswer[i].answer_date = '今天'
          }
        }
        that.setData({
          userInfo: res.data.answerRanking,
          answer: res.data.totalCollcetSubject,
          field: res.data.answerRecord,
          record: res.data.userDayAnswer
        })
        app.level(res.data.answerRanking.total_score),
          that.setData({
            level: app.globalData.lev[app.globalData.index],
            levUp: app.globalData.lev[app.globalData.index + 1],
            levDown: app.globalData.lev[app.globalData.index - 1],
          })
      }
    })
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