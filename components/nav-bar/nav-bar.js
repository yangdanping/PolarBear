// components/nav-bar/nav-bar.js
const { statusBarHeight, navBarHeight } = getApp().globalData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      //写在这里说明希望别人可以传进来
      type: String
    },
    titleColor: {
      type: String,
      value: '#000'
    },
    titleSize: {
      type: String,
      value: '32'
    },
    // statusBarColor:{
    //   type:String,
    //   color:'#fff'
    // },
    // navBarColor:{
    //   type:String,
    //   color:'#fff'
    // },
    back: {
      type: String,
      value: 'true'
    },
    home: {
      type: String,
      value: 'true'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarStyle: '',
    navBarStyle: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back() {
      wx.navigateBack(); //delta默认值为1,表示只会回去1页
    },
    home() {
      wx.navigateBack({
        delta: 999 //大于现有页面直接回到首页
      });
    }
  },
  lifetimes: {
    attached() {
      const statusBarStyle = `
      height:${statusBarHeight}px;
      `;
      const navBarStyle = `
      height:${navBarHeight}px;
      color:${this.data.titleColor};
      font-size:${this.data.titleSize}rpx;
      `;
      this.setData({
        statusBarStyle,
        navBarStyle
      });
    }
  }
});
