//获取应用实例
const app = getApp()
Page({//设置fires中的值
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    session_key: '',
    code: '',
    pd: ''
  },
  //事件处理函数
  onLoad: function() {//自动开始加载的函数
    if (app.globalData.userInfo) {  //判断第一次授权后第二次是否可以直接登录
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          // console.log(res.userInfo)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    } 
  },
  onShow:function(){
    var that = this;
    app.getcode();//异步获取code
    wx.request({     //查看是否有重复的POENid
      url: app.globalData.http + 'three/manager/test2/' + app.globalData.code, //后端用户信息接
      method: "PUT",
      success: function (res) {//成功的时候的回调
        if (res.data == true) {//到时候看返回值进行T/F判断
          that.setData({
            pd: 'true'
          })
        } else {
          that.setData({
            pd: 'false'
          })
        }
      },
      fail:function(res){
        console.log(res)
      }
    })//请求结束
  },
  getUserInfo(e) {//点击按钮后授权-----只有用户第一次登录的时候才可以发现这个按钮
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },
  denglu() {//跳转登录的按钮
    wx.navigateTo({
      url: '../denglu/denglu',
    })
  },
  zhuce() {//跳转注册按钮
    wx.navigateTo({
      url: '../index/index'
    })
  },
  getuser:function(e){//点击跳转  或者  登录 后来 今昔对全局变量的赋值
    var that =  this ; 
    app.bindGetUserInfo(e);//触发全局变量
  }
})