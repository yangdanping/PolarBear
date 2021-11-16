Page({
//页面的初始数据
  data: {
    isLogin:false,
    latitude:0,
    longitude:0,
    swiperImg:[
      "../../images/swiper_img/1.jpg",
      "../../images/swiper_img/2.jpg",
      "../../images/swiper_img/3.jpg",
      "../../images/swiper_img/4.jpg"
    ],
    allMovies:[
      {//一个row对应一个{}
        title:'影院热映',
        tag:'热门',
        movies:[]
      },
      {
        title:'最新上映',
        tag:'最新',
        movies:[]
      },
      {
        title:'豆瓣高分',
        tag:'豆瓣高分',
        movies:[]
      },
      {
        title:'豆瓣top250',
        tag:'经典',
        movies:[]
      },
      {
        title:'冷门佳片',
        tag:'冷门佳片',
        movies:[]
      }
    ],
    myAddress:'',
    isAdress:false,
    audioCtx:null,
    isPlayingMusic: false,
    ishind:false,
    radioItems:[
      {
        value:'recommend',
        name:'热门',
        check:true
      },
      {
        value:'time',
        name:'最新',
        check:null
      },
      {
        value:'rank',
        name:'评价',
        check:null
      }
    ],
    isRadio:[],
    chooseIndex:0
  },
  onLoad(){//生命周期函数--监听页面加载
      console.log('home ---onLoad---');
      this.play();
      this.loadCity();//这个回调函数到时就是loadCity()中的参数
      this.loadLocalDate();
      for(let i = 0;i<this.data.allMovies.length;i++){
        this.loadData(i);
      }
      console.log(this.data);
  },
  onShow(){
    console.log('home ---onShow---');
  },
  loadLocalDate(){
    for(let i = 0;i < this.data.allMovies.length;i++){
      let obj = this.data.allMovies[i];
      obj.movies = wx.getStorageSync(obj.title);//从缓存wx.setStorage中拿到以及缓存的数据
    }
    this.setData(this.data);
  },
  loadData(index){
    wx.db.toast('正在获取影片信息...');
    wx.request({
      url: wx.db.movieUrl(),
      data:{
        tag:this.data.allMovies[index].tag,
        page_limit:35
      },
      header:{'content-type':'json'},
      success: res => {
        const obj = this.data.allMovies[index];
        let allMovies = res.data.subjects;//allMovies此时是数组
        obj.movies = [];
        for(let i in allMovies){
          this.updataMoive(allMovies[i]);
        }
        obj.movies = allMovies;
        this.setData(this.data);
        wx.setStorage({//将movies数组缓存到本地
          key: obj.title,//key保证得是唯一的
          data: obj.movies,//在缓存时就保存起来,用到的时候
        })
      },
      fail:()=>{wx.db.toast(`获取${this.data.allMovies[index].title}失败`);}
    })
  },
  loadCity(){
    wx.getLocation({
      success:res=>{
        console.log(res);//获取到经纬度,拿到经纬度获取到城市信息找到附近的电影院,看它上映了哪些电影
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        wx.request({ 
          url: wx.db.locationUrl(),
          data:{
            output:'json',
            coordtype:'wgs84ll',
            ak:'WmUYUjO78mGRz01TiGqW0UX8CxOtrQ8R',
            location:`${res.latitude},${res.longitude}`//字符串拼接// location:res.latitude + ',' + res.longitude,
          },
          success:res=>{
            let myAddress = res.data.result.formatted_address;
            this.setData({
              myAddress,
              isAdress:true
            });
          },
          fail:()=>{ wx.db.toast('获取城市失败');}
        })
      },
      fail:()=>{wx.db.toast('获取位置失败');}
    })
  },
  updataMoive(movie){
    let stars = movie.rate,oncount = 0,offcount = 0;
        if (stars == 0) return;//0分或还没出分直接显示暂无评分
        movie.stars = {};//为allMovie添加stars对象,存放判断星数的三个属性
        movie.stars.on = movie.stars.half = movie.stars.off = 0;
        oncount = parseInt(stars) / 2;
        offcount = 5 - parseInt(stars) / 2;
        if(parseInt(oncount)){
          for(let i = 0;i < parseInt(oncount);i++){
            movie.stars.on++;
          }
        }
        oncount === parseInt(oncount) + 0.5 ? movie.stars.half++ : null;
        if(offcount !== 0.5 ){
          for(let i = 0;i < parseInt(offcount);i++){
            movie.stars.off++;
          }
        }
  },
  
  viewMore(e){
    const index = e.currentTarget.dataset.index;
    const obj = this.data.allMovies[index];
    wx.navigateTo({
      url: `/pages/list/list?title=${obj.title}&url=${obj.tag}`,
    })
  },
  getMap(){
    const latitude = this.data.latitude;
    const longitude = this.data.longitude;
    const myAddress = this.data.myAddress;
    wx.navigateTo({
      url: `/pages/map/map?latitude=${latitude}&longitude=${longitude}&myAddress=${myAddress}`
    })
  },
  play(){
    if(!this.data.isPlayingMusic){
    console.log("play");
    this.data.audioCtx || this.setData({audioCtx:wx.createInnerAudioContext()});
    let audioCtx = this.data.audioCtx;
    audioCtx.src="https://cxywyq.top:3000/static/music/ydp/001.mp3";
    audioCtx.onPlay(()=>{console.log("start play");});
    audioCtx.play();
      this.setData({isPlayingMusic:!this.data.isPlayingMusic})
      console.log(this.data.isPlayingMusic);
      if(!this.data.ishind){
          clearTimeout(timer);
          let timer = setTimeout(()=>{
            this.setData({ishind:!this.data.ishind})
          },3000);
      }
    }else if(this.data.isPlayingMusic){
        let audioCtx = this.data.audioCtx;
        console.log("pause");
        audioCtx.pause();
        audioCtx.onPause(()=>{console.log("start pause");});
        this.setData({isPlayingMusic:!this.data.isPlayingMusic})
        console.log(this.data.isPlayingMusic);
        this.setData({ishind:!this.data.ishind});
        if(!this.data.ishind){
            clearTimeout(timer);
          let timer = setTimeout(()=>{
            this.setData({ishind:!this.data.ishind})
          },3000);
      }
    }
  },
  showRadio(e){
    console.log(e);
    const index = e.currentTarget.dataset.index;
    this.setData({chooseIndex:index});
    if(this.data.isRadio.length === 0){
      for(var i = 0;i < this.data.allMovies.length;i++){
        this.data.isRadio[i]=false;
      }
    }
    this.data.isRadio[index]=!this.data.isRadio[index];
    this.setData(this.data);
  },
  radioChange(e){
    const index = this.data.chooseIndex;
    const radio = this.data.radioItems;//该radio本身
    const obj = this.data.allMovies[index];//该类电影本身
    const tag = this.data.allMovies[index].tag;//选择电影的类别
    console.log(tag);
    var sort = e.detail.value;//选择电影的排序
    for(var j = 0;j < radio.length;j++){
      radio[j].check = null;
    }
    for(var j = 0;j<radio.length;j++){
      console.log(radio[j].value);
      radio[j].check = radio[j].value === sort?true:null;
    }
    this.setData(this.data);
    wx.request({
      url: wx.db.movieUrl(),
      data:{tag,sort},
      header:{'content-type':'json'},
      success:res=>{
        obj.movies = [];
        obj.movies = res.data.subjects;
        for(let i in obj.movies){
          this.updataMoive(obj.movies[i]);
        }
        this.setData(this.data);
        console.log(obj.movies);
      }
    })
  }
})