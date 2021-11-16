Page({
  data: {
    film:{},
    Localfilm:[]
  },
  onLoad(options) {
    const film = JSON.parse(options.film);
    this.setData({film});
    console.log(this.data.film);
    wx.setStorage({
      key: this.data.film.title,//key保证得是唯一的
      data: this.data.film,//在缓存时就保存起来,用到的时候
      success:res=>{
        console.log(res);
      }
    })
    this.data.film && this.data.Localfilm.push(film);
    this.setData(this.data)
    console.log(this.data.Localfilm);
  },
  // loadLocalData(){
    
  // }
})