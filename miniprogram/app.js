//注册小程序应用 app.js
App({
  onLaunch(options) {//当小程序初始化完成时,会触发onLaunch(全局只触发一次)
    const time = 1500;
    console.log('app.js ---onLaunch----'+JSON.stringify(options));
    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    // } else {
    //   wx.cloud.init({
    //     // env 参数说明：
    //     //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
    //     //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
    //     //   如不填则使用默认环境（第一个创建的环境）
    //     // env: 'my-env-id',
    //     traceUser: true,
    //   })
    // }
    wx.db = {};
    wx.db.locationUrl = () => {return `https://api.map.baidu.com/reverse_geocoding/v3`;}
    wx.db.movieUrl = () => {return `https://movie.douban.com/j/search_subjects?type=movie`;}
    wx.db.moviedataUrl = () => {return `https://movie.querydata.org/api`;}
    wx.db.tvUrl = () => {return `https://movie.douban.com/j/search_subjects?type=tv`;}
    wx.db.weaUrl = () => {return `https://v0.yiketianqi.com/api?version=v61&appid=79423783&appsecret=7To2pE3D`;}
    const info = wx.getSystemInfoSync();
    wx.db.statusBarHeight = info.statusBarHeight;
    info.platform == 'android' ? wx.db.navBarHeight = 48 : wx.db.navBarHeight = 44;
    wx.db.toast = (title,duration = time)=>{
      wx.showToast({
        title,
        duration,
        icon:'none'
      })
    }
  },

  // 生命周期函数--监听小程序显示,当小程序启动,或从后台进入前台显示,会触发onShow
  onShow(){
    console.log('app.js ---onShow----');
  },
  // 生命周期函数--监听小程序隐藏,当小程序从前台进入后台会触发onHide
  onHide() {
    console.log('app.js ---onHide----');
  }
})
