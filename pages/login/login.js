//index.js
const app = getApp();
Page({
  data: {
    userInfo: {},
    imgUrl: './user-unlogin.png',
    isShow: false
  },

  onLoad() {
    // 生命周期函数--监听页面加载(页面一加载就会执行)
    console.log('login ---onLoad---');
    // 修改msg状态数据 语法this.setData({})
    //       console.log(this.data.msg);// this代表当前页面上的实例对象
    //     setTimeout(() => {
    //       this.setData({
    //         msg:'修改之后的数据'
    //       })
    //       console.log(this.data.msg);
    // }, 2000);
  },

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
    console.log('login ---onReady---');
  },

  onShow() {
    // 生命周期函数--监听小程序显示,当小程序启动,或从后台进入前台显示,会触发onShow
    console.log('login ---onShow---');
  },

  onHide() {
    // 生命周期函数--监听小程序隐藏,当小程序从前台进入后台会触发onHide
    console.log('login ---onHide---');
  },

  onUnload() {
    // 生命周期函数--监听页面卸载
    console.log('login ---onUnload---');
  },

  // 自定义的回调放置位置与生命周期函数平级
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        wx.setStorage({
          data: res,
          key: '登录信息'
        });
        this.setData({
          //this代表当前页面上的实例对象
          userInfo: res.userInfo,
          imgUrl: res.userInfo.avatarUrl,
          isShow: true
        });
      },
      fail: (e) => {
        console.log(e);
      }
    });
  }

  //   toFavor() {
  //     console.log('toFavor');
  //     wx.navigateTo({
  //         url: '/pages/favor/favor',
  //         success: res => {
  //         },
  //         fail: () => { }
  //     });
  // }
});
