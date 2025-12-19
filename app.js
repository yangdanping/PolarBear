import { getLoginCode, codeToToken, checkToken, checkSession } from './service/login.request';
import { TOKEN_KEY } from './constants/token-const';
App({
  // 小程序中参数`传值的方法
  // 1.通过data-属性传值
  // console.log(e.currentTarget.dataset);
  // 2.通过在节点上绑定id来传值
  // console.log(e.currentTarget.id);
  // 3.通过navigateTo/redreactTo页面传参(在onLoad参数options中取值)
  // wx.navigateTo({ url: `/pages/detail/detail?movie=${movie}`});
  // 4.通过storage传参
  // wx.setStorageSync(title, homeMovies);
  // 5.通过在app.js中定义globalData传值
  // globalData只用于保存和共享一些不会变的全局数据(如屏幕宽高),不能做到数据响应式
  // 外部通过 const app = getApp() 获取到globalData中的数据
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    deviceRadio: 0
  },

  //当小程序初始化完成时,会触发onLaunch(全局只触发一次)
  onLaunch() {
    // 1.获取设备基本信息
    const { screenWidth, screenHeight, statusBarHeight, platform } = wx.getSystemInfoSync();
    this.globalData.screenWidth = screenWidth; //设备屏幕宽度
    this.globalData.screenHeight = screenHeight; //设备导航栏高度
    this.globalData.statusBarHeight = statusBarHeight; // 状态栏高度
    this.globalData.navBarHeight = platform === 'android' ? 48 : 44; // 状态栏高度
    this.globalData.deviceRadio = screenHeight / screenWidth; //高比宽 小屏设备(iphone5/6) < 1.78
    console.log('设备屏幕宽度 -->', screenWidth, '设备导航栏高度 -->', statusBarHeight, '高比宽 -->', this.globalData.deviceRadio);

    // 2.用户登录(只获取用户唯一身份)
    this.handleLogin();

    // 定义全局数据
    wx.db = {};
    // wx.db.locationUrl = () => `https://api.map.baidu.com/reverse_geocoding/v3`;
    // wx.db.movieUrl = () => `https://movie.douban.com/j/search_subjects?type=movie`;
    wx.db.tvUrl = () => `https://movie.douban.com/j/search_subjects?type=tv`;
    // wx.db.moviedataUrl = () => `https://movie.querydata.org/api`;
    wx.db.moviedataUrl = () => `https://api.wmdb.tv/movie/api`;
    wx.db.weaUrl = () => `https://v0.yiketianqi.com/api?version=v61&appid=79423783&appsecret=7To2pE3D`;
  },
  // openid
  // openid表示用户在当前应用(小程序/公众号)的唯一标识,它是用户的唯一标识id,牵扯的支付,登录,授权等,同一个用户在多个应用中的openid可能不同
  async handleLogin() {
    const token = wx.getStorageSync(TOKEN_KEY);
    const checkResult = await checkToken();
    const isSessionExpire = await checkSession();
    console.log('checkResult', checkResult);
    console.log('checkSession', isSessionExpire);

    //若token过期或者不存在token,则进行重新登录
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction();
    } else {
      console.log('token和session没有过期,用户无需重新登录');
    }
  },
  // ---------------------------------------------------------------------------------------------
  async loginAction() {
    // 1.获取code(用户登录凭证,有效期5分钟。开发者需要在开发者服务器后台调用 code2Session，使用 code 换取 openid、unionid、session_key 等信息)
    const code = await getLoginCode();
    console.log('loginAction--------', code);
    // 2.将code发送给服务器
    const res = await codeToToken(code);
    console.log('loginAction请求得到token等信息', res);
    wx.setStorageSync(TOKEN_KEY, res.token);
  },
  // 生命周期函数--监听小程序显示,当小程序启动,或从后台进入前台显示,会触发onShow
  onShow() {
    console.log('app.js ---onShow----');
  },
  // 生命周期函数--监听小程序隐藏,当小程序从前台进入后台会触发onHide
  onHide() {
    console.log('app.js ---onHide----');
  }
});
