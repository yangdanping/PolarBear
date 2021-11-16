Page({
  data: {
    latitude:0,//北纬
    longitude:0,//东经
    myAddress:'',
    markers: [
      {
        iconPath: '../../images/navi.png',
        width: 50,
        height: 50
      }
    ],
    weaInfo:{},
    isGood:false,
    isNormal:false,
    isloadLocal:null,
    inputValue:''
  },
  onLoad(options) {
      const obj = this.data.markers[0];
      obj.latitude = parseFloat(options.latitude);
      obj.longitude = parseFloat(options.longitude);
      this.data.myAddress = options.myAddress;
      this.setData(this.data);//获取完地址后更新data
      wx.getStorageSync('天气缓存')?this.loadLocalDate():this.loadData(this.data.myAddress);////缓存后就直接用本地数据,就不用再请求(重要!)
      obj.latitude = parseFloat(options.latitude);
      obj.longitude = parseFloat(options.longitude);
      this.setData({
        latitude:parseFloat(options.latitude),
        longitude:parseFloat(options.longitude)
      });
      console.log(obj);
      
    },
    loadLocalDate(){
      this.data.weaInfo = wx.getStorageSync('天气信息');//从缓存wx.setStorage中拿到以及缓存的数据
      this.setData(this.data);
      console.log(this.data.weaInfo);
      console.log('读取地图本地缓存成功!');
    },
    loadData(myAddress){
      console.log(myAddress);
     const city =  myAddress.length > 5 ? myAddress.substring(3, 5) : myAddress;
     console.log(city);
      wx.db.toast('正在获取天气信息...');
      wx.request({
        url: wx.db.weaUrl(),
        data:{city},
        header:{'content-type':'json'},
        timeout:10000,
        success: res => {
        //  console.log(res);
         this.data.weaInfo = res.data;
         this.data.isGood = this.data.weaInfo.air_level === '优' ? !this.data.isGood : null;
         this.data.isNormal = this.data.weaInfo.air_level === '良' ? !this.data.isNormal : null;
         this.setData(this.data);
         console.log(this.data.weaInfo);
          wx.setStorage({//将movies数组缓存到本地
            key: '天气信息',//key保证得是唯一的
            data: this.data.weaInfo,//在缓存时就保存起来,用到的时候
            success:res=>{
              console.log('缓存天气信息成功',res);
            }
          })
          this.setData({isloadLocal:true});
          console.log(this.data.isloadLocal);
          wx.setStorage({//将movies数组缓存到本地
            key: '天气缓存',//key保证得是唯一的(true)
            data: this.data.isloadLocal,//在缓存时就保存起来,用到的时候
          })
        },
        fail:()=>{wx.db.toast(`获取天气失败`);}
      })
    },
    updateData(){
      this.loadData(this.data.myAddress);
      console.log('更新天气数据成功');
    },
    markertap() {
     const latitude = this.data.latitude;
     const longitude = this.data.longitude;
     const myAddress = this.data.myAddress;
     const name =  myAddress.substring(0, myAddress.length - 9);
     const address =  myAddress.substring(6, myAddress.length);
     console.log(latitude,longitude);
      wx.openLocation({
        latitude,
        longitude,
        name,
        address
      })
  },
  inputing(e){
    console.log(e.detail.value.trim());
    this.setData({
      inputValue:e.detail.value.trim()
    })

  },
  submit(){
    const reg = /^[\u4E00-\u9FA5]{2,5}$/;
    const city = this.data.inputValue;
    if(wx.getStorageSync('登录信息')){
      if(reg.test(city)){
        console.log('我搜索了:',city);
        this.loadData(city);
      }else{
        wx.db.toast('请输入2~5个汉字的城市');
      }
    }else{
      wx.db.toast('登录后才能查看天气');
    }
    this.data.inputValue = '';
    this.setData(this.data);
  }
  // buttonTap(){
  //   wx.getLocation({
  //     type: 'gcj02',
  //     success(res){
  //       wx.openLocation({
  //         latitude: res.latitude,
  //         longitude: res.longitude,
  //       })
  //     }
  //   })
  // }
})