import useToast from '../../utils/useToast';

Page({
  data: {
    allTv: [
      {
        //一个row对应一个{}
        title: '热门剧',
        tag: '热门',
        tvs: []
      },
      {
        title: '美剧',
        tag: '美剧',
        tvs: []
      },
      {
        title: '英剧',
        tag: '英剧',
        tvs: []
      },
      {
        title: '日剧',
        tag: '日剧',
        tvs: []
      },
      {
        title: '国产剧',
        tag: '国产剧',
        tvs: []
      },
      {
        title: '港剧',
        tag: '港剧',
        tvs: []
      },
      {
        title: '日本动画',
        tag: '日本动画',
        tvs: []
      },
      {
        title: '综艺',
        tag: '综艺',
        tvs: []
      },
      {
        title: '纪录片',
        tag: '纪录片',
        tvs: []
      }
    ],
    radioItems: [
      {
        value: 'recommend',
        name: '热门',
        check: true
      },
      {
        value: 'time',
        name: '最新',
        check: null
      },
      {
        value: 'rank',
        name: '评价',
        check: null
      }
    ],

    isRadio: [],
    chooseIndex: 0
  },
  onLoad() {
    this.loadLocalDate();
    for (let i = 0; i < this.data.allTv.length; i++) {
      this.loadData(i);
    }
  },
  loadLocalDate() {
    for (let i = 0; i < this.data.allTv.length; i++) {
      let obj = this.data.allTv[i];
      obj.tvs = wx.getStorageSync(obj.title); //从缓存wx.setStorage中拿到以及缓存的数据
    }
    this.setData(this.data);
  },
  loadData(index) {
    useToast('正在获取tv信息...');
    wx.request({
      url: wx.db.tvUrl(),
      data: {
        tag: this.data.allTv[index].tag
      },
      header: { 'content-type': 'json' },
      success: (res) => {
        // console.log(res);
        const obj = this.data.allTv[index];
        let allTv = res.data.subjects; //allTv此时是数组
        obj.tvs = [];
        for (let i in allTv) {
          this.updataTv(allTv[i]);
        }
        // obj.tvs.push(...allTv);
        obj.tvs = allTv;
        this.setData(this.data);
        wx.setStorage({
          //将tvs数组缓存到本地
          key: obj.title, //key保证得是唯一的
          data: obj.tvs //在缓存时就保存起来,用到的时候
        });
      },
      fail: () => useToast(`获取${this.data.allTv[index].title}失败`)
    });
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
          this.updataTv(obj.tvs[i]);
        }
        this.setData(this.data);
        console.log(obj.tvs);
      }
    });
  }
});
