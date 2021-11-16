// pages/list/list.js
Page({
  data: {
    movies:[],
    title:'',
    isLogin:null
  },
  onLoad(options) {
    // wx.setNavigationBarTitle({
    //   title: options.title,
    // });
    this.setData({ title:options.title})
    console.log(wx.getStorageSync('登录信息'));
    if(wx.getStorageSync('登录信息')){
      this.setData({
        isLogin:true
      })
      if(wx.getStorageSync('登录缓存') === null){
      wx.setStorage({
        data: this.data.isLogin,
        key: '登录缓存',
      })
    }
    }
      wx.getStorage({//这里用异步
        key:options.title,
        success:res=>{
          console.log(res);
          this.setData({
            movies:res.data
          })
        }
      });
  },
})