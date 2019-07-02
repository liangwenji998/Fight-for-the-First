const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: "",
    src: "", //图片的链接
    token: "",
    base64: "",
    msg: "",
    uid: null,
    filePath: '',
    code: ''
  },
  onLoad() {
    var that = this
    app.getcode();
    wx.request({ //请求百度的token值
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
  },
  //拍照
  takePhoto() {
    var that = this;
    app.getcode();
    that.setData({
      code: app.globalData.code
    })
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 16; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1); //随机生成同一个UUID
    }
    var uuid = s.join("");
    that.setData({
      uid: uuid
    })
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'LOW',
      success: (res) => {
        that.setData({
          src: res.tempImagePath //获取图片
        })
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: that.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
              base64: res.data //返回的格式
            })
            wx.request({
              url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + that.data.token,
              method: 'POST',
              data: {
                image_type: 'BASE64',
                image: that.data.base64,
                group_id: '1149363708', //自己建的用户组id
                user_id: that.data.uid, //这里用户身份证 that.data.openid  that.data.uid
                user_info: that.data.userid //这里获取用户昵称
              },
              header: {
                'Content-Type': 'application/json' // 默认值
              },
              success(res) { //微信js字符串请使用单引号
                wx.showToast({
                  title: '注册成功',
                  icon: 'success',
                  duration: 5000
                })
                app.getUserInfo(function(personInfo) { //调用app中的方法把变量补齐
                  wx.request({
                    url: app.globalData.http + 'three/manager/'+that.data.code, //填数据库接受用户信息的url
                    method: 'POST',//根据后端的
                    data: {
                      avatar: personInfo.avatarUrl,
                      nike_name: personInfo.nickName,
                      country: personInfo.country,
                      privince:personInfo.province,
                      city: personInfo.city,
                      gender: personInfo.gender,
                      baidu_token: that.data.uid
                    },
                    header: {
                      'Content-Type': 'application/json', // 默认值
                    },
                    success(res){
                      wx.navigateTo({
                        url: '../first/first',
                      })
                    }
                  })
                });
              }
            })
          }
        })
      } //拍照成功结束
    }) //调用相机结束
  },
})
