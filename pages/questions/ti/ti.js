// pages/questions/ti/ti.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timu: '',
    id:'',
    type: '',
    options:'',
    anm:null,
    back:'',
    grade:'0'
  },
  judge(){
    
  },
  answer:function(e){
    var that = this
    var missionArr = that.data.options;
    if( that.data.anm == null ){
      that.setData({
        anm:0
      })
    wx.request({
      url: app.globalData.http + 'one/manager/submitAnswers/{user_id}',
      method: 'POST',
      data: {
        id:app.globalData.id,
        answer: e.currentTarget.dataset.text,
        topicid: that.data.id
      },
      header: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          back: res.data.comment_answer,
          anm: res.data.is_right,
          grade: res.data.total_score
        })
        that.start(that.data.anm)
        for (let i in missionArr) { 
          //遍历列表数据      
          if (i == e.currentTarget.dataset.index) {
            //根据下标找到目标,改变状态  
            if (missionArr[i].option == res.data.comment_answer) {//如果请求的答案和用户选择的答案一致
              missionArr[i].id = true;
            } else{
              missionArr[i].id = false;
            }
          }
        }
        that.setData({
          options: missionArr
        })
      },
    })
    }
  },
  start: function (e) {
    var that = this
    if (e == 0) {
      that.setData({
        anm: true
      })
    } else if (e == 1) {
      that.setData({
        anm: false
      })
    } else {
      that.setData({
        anm: 0
      })
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 100
    });
    animation.opacity(0).translate(0, -30).step()
    that.setData({
      ani: animation.export(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      duration: 1000000000
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
  denglu(){
    wx.redirectTo({
      url:'ti',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.request({
      url: app.globalData.http + 'one/manager/random', //后端用户信息接
      method: "GET",
      header: { //头部返回信息
        'content-type': 'application/json'
      },
      success: function (res) { //成功的时候的回调
        wx.hideToast({})
        that.setData({
          id:res.data.id,
          timu: res.data.content,
          type: res.data.knowledgeArea,
          options: res.data.questionOptions,
        })
        let dataList = that.data.options; //获取到的数据
        dataList.forEach((item) => {
          item.optionContent = item.optionContent.substring(2); //要截取字段的字符串
        })
        that.setData({
          options: dataList //数据源
        })
        wx.request({
          url: app.globalData.http + 'two/manager/findMeById/' + app.globalData.id,
          method: 'GET',
          success(res){
            that.setData({
              grade: res.data.answerRanking.total_score
            })
          }
        })
      }
    }) //请求结束
  },
})