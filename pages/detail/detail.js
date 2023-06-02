Page({
  data: {
    film:[],
    filmInfo:{},
    actor:{},
    title:'',
    isLogin:null,
    filmId:''
  },
  onLoad(options) {
    // wx.setNavigationBarTitle({
    //   title: movie.title,
    // });
    // console.log(wx.getStorageSync('登录信息'));
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
    this.loadData(options);
  },
  loadData(options){
    const film = options.movie ? JSON.parse(options.movie) : JSON.parse(options.tv);
    const url = film.url;
    const filmId = url.substring(film.url.indexOf('/',30)+1, url.length - 1);
    this.setData({filmId});
    wx.request({
      url: wx.db.moviedataUrl(),
      header:{'content-type':'json'},
      data:{
        id:filmId
      },
      success:res=>{
        console.log(res);
        this.setData({
          filmInfo:res.data.data[0],
          actor:res.data.actor[0].data[0]
        })
        console.log(this.data.filmInfo);
        console.log(this.data.actor);
      }
    })
    this.setData({
      title:film.title,
      film,
    })
  },
  toFavor(){
    wx.navigateTo({
      url: `/pages/favor/favor?film=${JSON.stringify(this.data.film)}`,
    })
  }
})