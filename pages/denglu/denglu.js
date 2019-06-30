const app = getApp();
Page({
  data: {
    base64: "",
    token: "",
    msg: "",
    code: '',
    uid: ''
  },
  onLoad() {
    var that = this
    app.getId(app.globalData.code)
    app.getcode()
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', //是真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: 'axASVHZPBFHHdCEQTGbMoQxh', //用你创建的应用的API Key
        client_secret: 'ondC0SL5bZff7pcNGjKEDPB2f1gRbbGr' //用你创建的应用的Secret Key
      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          token: res.data.access_token //获取到token
        })
      }
    })
    app.getUserInfo(function(personInfo) {
      app.update(personInfo)
    })
  },
  //拍照并编码
  takePhoto() {
    //拍照
    var that = this;
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      duration: 10000000
    })
    that.setData({
      code: app.globalData.code
    })
    wx.createCameraContext().takePhoto({
      quality: 'HIGH',
      success: (res) => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/face/v3/multi-search?access_token=' + that.data.token,
              method: 'POST',
              data: {
                image: res.data,
                image_type: 'BASE64',
                liveness_control: 'HIGH',
                max_face_num: 10,
                group_id_list: '1149363708' //自己建的用户组id
              },
              header: {
                'Content-Type': 'application/json' // 默认值
              },
              success(res) {
                if (res.data.error_code === 222202) {
                  wx.showToast({
                    title: '未检测到人脸',
                    icon: 'none',
                    duration: 2000
                  })
                } else if (res.data.result.face_num > 1) {
                  wx.showToast({
                    title: '请单人操作',
                    icon: 'none',
                    duration: 2000
                  })
                } else if (res.data.result.face_list[0].user_list[0].user_id != app.globalData.face) {
                  wx.showToast({
                    title: '请勿操作他人账户',
                    icon: 'none',
                    duration: 2000
                  })
                } else if (res.data.error_code === 223120) {
                  wx.showToast({
                    title: '未通过活体检测',
                    icon: 'none',
                    duration: 2000
                  })
                } else if (res.data.error_code === 222207) {
                  wx.showToast({
                    title: '人脸不匹配',
                    icon: 'none',
                    duration: 2000
                  })
                } else if (res.data.error_code === 0) {
                  that.setData({ //从百度获取的
                    msg: res.data.result.face_list[0].user_list[0].score
                  })
                  wx.hideToast({})
                  if (that.data.msg > 80) {
                    wx.showToast({
                        title: '验证通过',
                        icon: 'success',
                        duration: 2000
                      }),
                      wx.switchTab({
                        url: '../questions/questions'
                      })
                  } else {
                    wx.showToast({
                      title: '人脸不匹配',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              }
            });
          },
        })
      },
    })
  }
})