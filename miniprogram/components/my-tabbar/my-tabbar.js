// components/my-tabbar/my-tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabInfo:[
      {
        title:'首页',
        normalImg:'../../images/ic_tab_home_normal.png',
        activeImg:'../../images/ic_tab_home_active.png'
      },
      {
        title:'TV',
        normalImg:'../../images/ic_tab_subject_normal.png',
        activeImg:'../../images/ic_tab_subject_active.png'
      },
      {
        title:'我的',
        normalImg:'../../images/ic_tab_profile_normal.png',
        activeImg:'../../images/ic_tab_profile_active.png'
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabChange(e){
      const index = e.currentTarget.dataset.index;
      if(index === 0){
        wx.navigateTo({
          url: '/pages/home/home'
        })
      }else if(index === 1){
        wx.navigateTo({
          url: '/pages/rank/rank'
        })
      }else if(index === 2){
        wx.navigateTo({
          url: '/pages/profile/profile',
        })
      }
    }
  }
})
