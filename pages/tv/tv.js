import useToast from '../../utils/useToast';
import updataItemStars from '../../utils/updataItemStars';
import { getTVData } from '../../service/tv.request';
import { allTv } from '../../constants/allTv';
import { radioItems } from '../../constants/radioItems';

Page({
  data: {
    allTv,
    radioItems,
    isRadio: [],
    chooseIndex: 0
  },
  onLoad() {
    // this.loadLocalDate();
    // for (let i = 0; i < this.data.allTv.length; i++) {
    //   this.loadData(i);
    // }
    this.data.allTv.forEach((item, index) => this.loadData(index));
  },
  // loadLocalDate() {
  //   for (let i = 0; i < this.data.allTv.length; i++) {
  //     let obj = this.data.allTv[i];
  //     obj.tvs = wx.getStorageSync(obj.title); //从缓存wx.setStorage中拿到以及缓存的数据
  //   }
  //   this.setData(this.data);
  // },
  async loadData(index) {
    useToast('正在获取tv信息...');
    const updateItem = `allTv[${index}].tvs`;
    const { title, tag } = this.data.allTv[index];
    console.log('tv title', title);
    const localTvs = wx.getStorageSync(title);
    if (localTvs) {
      console.log('直接使用本地数据-----------------');
      this.setData({ [updateItem]: localTvs ?? [] });
    } else {
      console.log('本地数据被清空,重新获取-----------------');
      const res = await getTVData({ tag });
      console.log('tv loadData res', res);
      let tvs = res.subjects;
      tvs.forEach((item) => updataItemStars(item));
      wx.setStorageSync(title, tvs);
      this.setData({ [updateItem]: tvs ?? [] });
    }
    // wx.request({
    //   url: wx.db.tvUrl(),
    //   data: {
    //     tag: this.data.allTv[index].tag
    //   },
    //   header: { 'content-type': 'json' },
    //   success: (res) => {
    //     // console.log(res);
    //     const obj = this.data.allTv[index];
    //     let allTv = res.data.subjects; //allTv此时是数组
    //     obj.tvs = [];
    //     for (let i in allTv) {
    //       this.updataTv(allTv[i]);
    //     }
    //     // obj.tvs.push(...allTv);
    //     obj.tvs = allTv;
    //     this.setData(this.data);
    //     wx.setStorage({
    //       //将tvs数组缓存到本地
    //       key: obj.title, //key保证得是唯一的
    //       data: obj.tvs //在缓存时就保存起来,用到的时候
    //     });
    //   },
    //   fail: () => useToast(`获取${this.data.allTv[index].title}失败`)
    // });
  },
  updataTv(tv) {
    let stars = tv.rate,
      oncount = 0,
      offcount = 0;
    if (stars == 0) return; //0分或还没出分直接显示暂无评分
    tv.stars = {}; //为alltv添加stars对象,存放判断星数的三个属性
    tv.stars.on = tv.stars.half = tv.stars.off = 0;
    oncount = parseInt(stars) / 2;
    offcount = 5 - parseInt(stars) / 2;
    if (parseInt(oncount)) {
      for (let i = 0; i < parseInt(oncount); i++) {
        tv.stars.on++;
      }
    }
    oncount === parseInt(oncount) + 0.5 ? tv.stars.half++ : null;
    if (offcount !== 0.5) {
      for (let i = 0; i < parseInt(offcount); i++) {
        tv.stars.off++;
      }
    }
  },
  viewMore(e) {
    const index = e.currentTarget.dataset.index;
    const obj = this.data.allTv[index];
    wx.navigateTo({
      url: `/pages/list/list?title=${obj.title}&url=${obj.tag}`
    });
  },

  showRadio(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ chooseIndex: index });
    if (this.data.isRadio.length === 0) {
      for (var i in this.data.allTv) {
        this.data.isRadio[i] = false;
      }
    }
    this.data.isRadio[index] = !this.data.isRadio[index];
    this.setData(this.data);
  },
  radioChange(e) {
    const index = this.data.chooseIndex;
    const radio = this.data.radioItems; //该radio本身
    const obj = this.data.allTv[index]; //该类电影本身
    const tag = obj.tag; //选择电影的类别
    var sort = e.detail.value; //选择电影的排序
    for (var j = 0; j < radio.length; j++) {
      radio[j].check = null;
    }
    for (var j = 0; j < radio.length; j++) {
      console.log(radio[j].value);
      radio[j].check = radio[j].value === sort ? true : null;
    }
    this.setData(this.data);
    wx.request({
      url: wx.db.tvUrl(),
      data: {
        tag,
        sort
      },
      header: { 'content-type': 'json' },
      success: (res) => {
        console.log(res);
        obj.tvs = [];
        obj.tvs = res.data.subjects;
        for (let i in obj.tvs) {
          updataItemStars(obj.tvs[i]);
        }
        this.setData(this.data);
        console.log(obj.tvs);
      }
    });
  }
});
