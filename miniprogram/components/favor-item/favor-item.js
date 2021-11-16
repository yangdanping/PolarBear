// cmps/movie-item/movie-item.js
Component({
  properties: {
    film: {
      type: Object,
      value: null
    }
  },
  data: {

  },
  lifetimes:{
    attached(){
      console.log(this.data.film);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {//组件的方法是写在methods里
    detail() {// 序列化：将JSON对象转换为JSONString JSON.stringify(),反序列化：将JSONString转换为JSON对象 JSON.parse()
      const obj = this.data.film;
      console.log(obj);
      const movie = JSON.stringify(obj);
      wx.navigateTo({
        url: `/pages/detail/detail?movie=${movie}`
      });
    }
  }
})
