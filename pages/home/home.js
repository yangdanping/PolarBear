import { getMovieData, getUserLocation } from '../../service/home.request';
import updataItemStars from '../../utils/updataItemStars';
import useToast from '../../utils/useToast';
import { homeMovies } from '../../constants/homeMovies';
import { radioItems } from '../../constants/radioItems';
Page({
  //页面的初始数据
  data: {
    isLogin: false,
    latitude: 0,
    longitude: 0,
    swiperImg: ['/assets/images/swiper_img/1.jpg', '/assets/images/swiper_img/2.jpg', '/assets/images/swiper_img/3.jpg', '/assets/images/swiper_img/4.jpg'],
    homeMovies,
    myAddress: '',
    audioCtx: null,
    isPlayingMusic: false,
    ishind: false,
    radioItems,
    isRadio: []
  },
  onLoad() {
    //生命周期函数--监听页面加载
    // this.play();
    this.loadCity(); //这个回调函数到时就是loadCity()中的参数
    this.data.homeMovies.forEach((item, index) => this.loadData(index));
  },
  async loadData(index) {
    useToast('正在获取影片信息...');
    const updateItem = `homeMovies[${index}].movies`;
    const { title, tag } = this.data.homeMovies[index];
    const localMovies = wx.getStorageSync(title);
    if (localMovies) {
      console.log('直接使用本地数据-----------------');
      this.setData({ [updateItem]: localMovies ?? [] });
    } else {
      console.log('本地数据被清空,重新获取-----------------');
      const res = await getMovieData({ tag, page_limit: 35 });
      let homeMovies = res.subjects;
      homeMovies.forEach((item) => updataItemStars(item));
      wx.setStorageSync(title, homeMovies);
      this.setData({ [updateItem]: homeMovies ?? [] });
    }
  },
  async loadCity() {
    const { latitude, longitude, myAddress } = await getUserLocation();
    this.setData({ latitude, longitude, myAddress });
  },
  viewMore(e) {
    const index = e.currentTarget.dataset.index;
    const obj = this.data.homeMovies[index];
    wx.navigateTo({
      url: `/pages/list/list?title=${obj.title}&url=${obj.tag}`
    });
  },
  getMap() {
    const latitude = this.data.latitude;
    const longitude = this.data.longitude;
    const myAddress = this.data.myAddress;
    wx.navigateTo({
      url: `/pages/map/map?latitude=${latitude}&longitude=${longitude}&myAddress=${myAddress}`
    });
  },
  play() {
    if (!this.data.isPlayingMusic) {
      console.log('play');
      this.data.audioCtx || this.setData({ audioCtx: wx.createInnerAudioContext() });
      let audioCtx = this.data.audioCtx;
      audioCtx.src = 'http://119.91.150.141:3333/static/music/001.mp3';
      audioCtx.onPlay(() => {
        console.log('start play');
      });
      audioCtx.play();
      this.setData({ isPlayingMusic: !this.data.isPlayingMusic });
      console.log(this.data.isPlayingMusic);
      if (!this.data.ishind) {
        clearTimeout(timer);
        let timer = setTimeout(() => {
          this.setData({ ishind: !this.data.ishind });
        }, 3000);
      }
    } else if (this.data.isPlayingMusic) {
      let audioCtx = this.data.audioCtx;
      console.log('pause');
      audioCtx.pause();
      audioCtx.onPause(() => {
        console.log('start pause');
      });
      this.setData({ isPlayingMusic: !this.data.isPlayingMusic });
      console.log(this.data.isPlayingMusic);
      this.setData({ ishind: !this.data.ishind });
      if (!this.data.ishind) {
        clearTimeout(timer);
        let timer = setTimeout(() => {
          this.setData({ ishind: !this.data.ishind });
        }, 3000);
      }
    }
  },
  showRadio(e) {
    const index = e.currentTarget.dataset.index;
    console.log('showRadio---------------', e.currentTarget);
    // if (this.data.isRadio.length === 0) {
    //   for (var i = 0; i < this.data.homeMovies.length; i++) {
    //     this.data.isRadio[i] = false;
    //   }
    // }
    this.data.isRadio[index] = !this.data.isRadio[index];
    this.setData(this.data);
  },
  async radioChange(e) {
    const index = e.currentTarget.dataset.index;
    const updateItem = `homeMovies[${index}].movies`;
    const { tag } = this.data.homeMovies[index];
    const sort = e.detail.value; //选择电影的排序 热门 recommend/最新 time/评价 rank
    console.log('radioChange-------------------------------------', tag, sort);
    // -----------重构---------------------------
    this.data.radioItems.forEach((item) => (item.check = item.value === sort ? true : null));
    const res = await getMovieData({ tag, sort, page_limit: 35 });
    let homeMovies = res.subjects;
    homeMovies.forEach((item) => updataItemStars(item));
    this.setData({ [updateItem]: homeMovies ?? [] });
  }
});
