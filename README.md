# 北影熊小程序 - 项目复习指南

这是一个基于微信小程序的电影/电视剧信息展示应用，包含首页电影展示、电视剧列表、用户登录、地图定位等功能。

---

## 一、app.js / app.json / app.wxss 与 pages 下文件的关系

### 1. 文件结构关系

```
├── app.js          # 全局逻辑（生命周期、全局数据、公共方法）
├── app.json        # 全局配置（页面路径、tabBar、窗口样式、权限等）
├── app.wxss        # 全局样式（所有页面共享）
└── pages/
    └── home/
        ├── home.js      # 页面逻辑
        ├── home.json    # 页面配置（覆盖全局配置）
        ├── home.wxml    # 页面结构
        └── home.wxss    # 页面样式（与全局样式合并）
```

### 2. 配置优先级

- **app.json** 是全局配置，定义所有页面路径、tabBar、窗口默认样式
- **页面.json** 可覆盖 `app.json` 中 `window` 的配置（如导航栏标题）
- **app.wxss** 中的样式被所有页面继承，页面.wxss 中的同名样式会覆盖全局样式

### 3. 本项目关键配置示例

**app.json - 全局配置：**

```json
{
  "pages": ["pages/home/home", "pages/login/login", ...],  // 页面路径
  "tabBar": {                                              // 底部导航栏
    "color": "#f3f3f3",
    "selectedColor": "#ffac2d",
    "list": [
      { "pagePath": "pages/home/home", "text": "首页", "iconPath": "...", "selectedIconPath": "..." }
    ]
  },
  "window": {                                              // 全局窗口样式
    "navigationBarBackgroundColor": "#F6F6F6",
    "navigationStyle": "custom"                            // 自定义导航栏
  },
  "permission": {                                          // 权限声明
    "scope.userLocation": { "desc": "你的位置信息将用于..." }
  },
  "usingComponents": {}                                    // 全局组件注册
}
```

**home.json - 页面配置（覆盖全局）：**

```json
{
  "usingComponents": {                                     // 页面级组件注册
    "nav-bar": "../../components/nav-bar/nav-bar",
    "movie-item": "../../components/movie-item/movie-item"
  },
  "navigationBarTitleText": "北音熊音乐"                    // 覆盖全局导航栏标题
}
```

**app.wxss - 全局样式：**

```css
/* 定义 CSS 变量供所有页面使用 */
page {
  height: 100%;
  --NavBarbg: linear-gradient(180deg, rgb(143, 255, 177), rgb(56, 92, 255));
  --HomeNavBarbg: linear-gradient(180deg, rgb(86, 1, 126), rgb(0, 0, 26));
}
```

---

## 二、小程序生命周期相关 API

### 1. App 生命周期（全局）

在 `app.js` 中定义，整个小程序只触发一次或在特定时机触发：

```javascript
App({
  // 小程序初始化完成时触发（全局只触发一次）
  onLaunch() {
    console.log('小程序启动');
    // 适合做：获取设备信息、用户登录、初始化全局数据
    const { screenWidth, statusBarHeight } = wx.getSystemInfoSync();
    this.globalData.screenWidth = screenWidth;
  },
  
  // 小程序启动或从后台进入前台时触发
  onShow() {
    console.log('小程序显示');
  },
  
  // 小程序从前台进入后台时触发
  onHide() {
    console.log('小程序隐藏');
  },
  
  // 小程序发生脚本错误或 API 调用失败时触发
  onError(msg) {
    console.log('错误信息:', msg);
  },
  
  // 全局数据（不具备响应式，适合存储不变的数据）
  globalData: {
    screenWidth: 0,
    statusBarHeight: 0
  }
});
```

### 2. Page 生命周期（页面）

在页面的 `.js` 文件中定义：

```javascript
Page({
  data: { message: 'Hello' },
  
  // 页面加载时触发（只触发一次），可获取页面参数
  onLoad(options) {
    console.log('页面参数:', options);
  },
  
  // 页面显示时触发（每次显示都会触发）
  onShow() {
    console.log('页面显示');
  },
  
  // 页面初次渲染完成时触发（只触发一次）
  onReady() {
    console.log('页面渲染完成');
  },
  
  // 页面隐藏时触发
  onHide() {
    console.log('页面隐藏');
  },
  
  // 页面卸载时触发
  onUnload() {
    console.log('页面卸载');
  },
  
  // 下拉刷新时触发（需在 json 中配置 enablePullDownRefresh: true）
  onPullDownRefresh() {
    console.log('下拉刷新');
    wx.stopPullDownRefresh(); // 停止刷新动画
  },
  
  // 上拉触底时触发
  onReachBottom() {
    console.log('触底加载更多');
  },
  
  // 页面滚动时触发
  onPageScroll(e) {
    console.log('滚动位置:', e.scrollTop);
  },
  
  // 用户点击右上角分享
  onShareAppMessage() {
    return { title: '分享标题', path: '/pages/home/home' };
  }
});
```

### 3. Component 生命周期（组件）

在组件的 `.js` 文件中定义：

```javascript
Component({
  // 组件生命周期（推荐写在 lifetimes 中）
  lifetimes: {
    created() {
      // 组件实例刚创建，此时还不能调用 setData
    },
    attached() {
      // 组件进入页面节点树，可以使用 setData
      console.log('组件已挂载');
    },
    ready() {
      // 组件布局完成
    },
    detached() {
      // 组件从页面节点树移除
      console.log('组件已卸载');
    }
  },
  
  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      // 页面显示时
    },
    hide() {
      // 页面隐藏时
    },
    resize(size) {
      // 页面尺寸变化时
    }
  }
});
```

### 4. 生命周期执行顺序

```
App.onLaunch → App.onShow → Page.onLoad → Page.onShow → Component.attached → Component.ready → Page.onReady
```

---

## 三、组件通信示例

### 1. 父传子（Properties）

父组件通过属性向子组件传递数据：

**父组件 (home.wxml)：**

```html
<!-- 父组件向子组件传递 movie 数据 -->
<movie-item movie="{{ movie }}" />

<!-- 传递多个属性 -->
<nav-bar title="北影熊" titleColor="#fff" titleSize="44" back="false" />
```

**子组件 (movie-item.js)：**

```javascript
Component({
  // 通过 properties 接收父组件传递的数据
  properties: {
    movie: {
      type: Object,
      value: null    // 默认值
    }
  },
  
  methods: {
    detail() {
      // 使用 this.data.movie 或 this.properties.movie 访问
      console.log(this.data.movie);
    }
  }
});
```

**子组件 (movie-item.wxml)：**

```html
<view class="item">
  <image src="{{movie.cover}}" />
  <view>{{movie.title}}</view>
</view>
```

---

### 2. 子传父（triggerEvent）

子组件通过触发自定义事件向父组件传递数据：

**子组件 (my-music.js)：**

```javascript
Component({
  methods: {
    play() {
      // 触发自定义事件 'play'，可传递数据
      this.triggerEvent('play', { isPlaying: true });
      
      // 带事件选项
      this.triggerEvent('play', { isPlaying: true }, {
        bubbles: true,      // 事件是否冒泡
        composed: true      // 事件是否可以穿越组件边界
      });
    }
  }
});
```

**父组件 (home.wxml)：**

```html
<!-- 监听子组件的 play 事件，绑定 handlePlay 方法 -->
<my-music bind:play="handlePlay" />

<!-- 或使用 bindplay -->
<my-music bindplay="handlePlay" />
```

**父组件 (home.js)：**

```javascript
Page({
  handlePlay(e) {
    // 通过 e.detail 获取子组件传递的数据
    console.log('子组件传递的数据:', e.detail.isPlaying);
  }
});
```

---

### 3. 父组件获取子组件实例（selectComponent）

父组件可以直接调用子组件的方法：

**子组件 (child-component.js)：**

```javascript
Component({
  data: { count: 0 },
  methods: {
    increment() {
      this.setData({ count: this.data.count + 1 });
    },
    getCount() {
      return this.data.count;
    }
  }
});
```

**父组件 (parent.wxml)：**

```html
<child-component id="child" class="child-class" />
<button bindtap="callChildMethod">调用子组件方法</button>
```

**父组件 (parent.js)：**

```javascript
Page({
  callChildMethod() {
    // 通过 id 或 class 选择器获取子组件实例
    const child = this.selectComponent('#child');
    // 或 const child = this.selectComponent('.child-class');
    
    if (child) {
      child.increment();              // 调用子组件方法
      console.log(child.data.count);  // 访问子组件数据
    }
  }
});
```

---

### 4. 兄弟组件通信

兄弟组件之间无法直接通信，需要通过以下方式：

**方式一：通过父组件中转**

```javascript
// 父组件
Page({
  data: { sharedData: '' },
  
  // 接收组件A的数据
  onDataFromA(e) {
    this.setData({ sharedData: e.detail.data });
  }
});
```

```html
<!-- 组件A触发事件传数据给父组件 -->
<component-a bind:dataChange="onDataFromA" />

<!-- 父组件将数据传给组件B -->
<component-b data="{{sharedData}}" />
```

**方式二：使用全局事件总线**

```javascript
// app.js 中定义事件总线
App({
  globalData: {},
  eventBus: {
    events: {},
    on(event, callback) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
    },
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(cb => cb(data));
      }
    },
    off(event, callback) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      }
    }
  }
});

// 组件A - 发送数据
const app = getApp();
app.eventBus.emit('dataUpdate', { message: 'Hello from A' });

// 组件B - 接收数据
const app = getApp();
app.eventBus.on('dataUpdate', (data) => {
  console.log(data.message);
});
```

**方式三：使用全局数据存储**

```javascript
// 组件A - 存储数据
wx.setStorageSync('sharedKey', { data: 'value' });

// 组件B - 读取数据
const data = wx.getStorageSync('sharedKey');
```

---

## 四、首页音乐播放实现

### 1. 核心代码 (home.js)

```javascript
Page({
  data: {
    audioCtx: null,           // 音频上下文
    isPlayingMusic: false,    // 是否正在播放
    ishind: false             // 是否隐藏播放图标
  },
  
  play() {
    if (!this.data.isPlayingMusic) {
      // 播放音乐
      console.log('play');
      
      // 创建音频上下文（只创建一次）
      this.data.audioCtx || this.setData({ audioCtx: wx.createInnerAudioContext() });
      
      let audioCtx = this.data.audioCtx;
      audioCtx.src = 'http://119.91.150.141:3333/static/music/001.mp3';  // 音乐地址
      
      // 监听播放开始
      audioCtx.onPlay(() => {
        console.log('start play');
      });
      
      audioCtx.play();  // 开始播放
      this.setData({ isPlayingMusic: true });
      
      // 3秒后隐藏播放图标
      if (!this.data.ishind) {
        setTimeout(() => {
          this.setData({ ishind: true });
        }, 3000);
      }
      
    } else {
      // 暂停音乐
      let audioCtx = this.data.audioCtx;
      console.log('pause');
      
      audioCtx.pause();
      audioCtx.onPause(() => {
        console.log('start pause');
      });
      
      this.setData({ 
        isPlayingMusic: false,
        ishind: false 
      });
    }
  }
});
```

### 2. 页面结构 (home.wxml)

```html
<view class="homeContainer">
  <!-- 音乐播放器图标 -->
  <view class="player player-{{isPlayingMusic ? 'play' : 'pause'}} {{ishind ? 'hind' : ''}}" 
        bindtap="play">
    <!-- 唱片图标 -->
    <image src="/assets/images/music_icon/music_icon.png" />
    <!-- 唱针图标 -->
    <image src="/assets/images/music_icon/music_play.png" />
  </view>
  
  <!-- 其他页面内容 -->
</view>
```

### 3. 样式与动画 (music.wxss)

```css
/* 播放器基础样式 */
.player {
  position: fixed;
  top: 57rpx;
  left: 30rpx;
  z-index: 1;
}

/* 唱片图标 */
.player > image:first-child {
  width: 85rpx;
  height: 85rpx;
  animation: musicRotate 3s linear infinite;  /* 旋转动画 */
}

/* 唱针图标 */
.player > image:last-child {
  width: 14rpx;
  height: 40rpx;
  margin-left: -5px;
}

/* 播放状态 - 唱片旋转 */
.player-play > image:first-child {
  animation-play-state: running;
}

/* 播放状态 - 唱针抬起 */
.player-play > image:last-child {
  animation: musicStart 0.2s linear forwards;
}

/* 暂停状态 - 唱片停止 */
.player-pause > image:first-child {
  animation-play-state: paused;
}

/* 暂停状态 - 唱针放下 */
.player-pause > image:last-child {
  animation: musicStop 0.2s linear forwards;
}

/* 隐藏动画 */
.hind {
  animation: hinding 0.5s forwards;
}
```

### 4. 关键动画 (animation.wxss)

```css
/* 唱片旋转动画 */
@keyframes musicRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 唱针抬起动画 */
@keyframes musicStart {
  from { transform: rotate(0deg); }
  to { transform: rotate(20deg); }
}

/* 唱针放下动画 */
@keyframes musicStop {
  from { transform: rotate(20deg); }
  to { transform: rotate(0deg); }
}

/* 播放器隐藏动画 */
@keyframes hinding {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(-40rpx, 0); opacity: 0.2; }
}
```

### 5. InnerAudioContext 常用 API

```javascript
const audioCtx = wx.createInnerAudioContext();

// 属性
audioCtx.src = 'url';           // 音频地址
audioCtx.volume = 0.5;          // 音量 0-1
audioCtx.loop = true;           // 是否循环
audioCtx.currentTime;           // 当前播放位置（秒）
audioCtx.duration;              // 总时长（秒）
audioCtx.paused;                // 是否暂停

// 方法
audioCtx.play();                // 播放
audioCtx.pause();               // 暂停
audioCtx.stop();                // 停止
audioCtx.seek(position);        // 跳转到指定位置
audioCtx.destroy();             // 销毁实例

// 事件监听
audioCtx.onPlay(() => {});      // 开始播放
audioCtx.onPause(() => {});     // 暂停
audioCtx.onStop(() => {});      // 停止
audioCtx.onEnded(() => {});     // 播放结束
audioCtx.onError((err) => {});  // 播放错误
audioCtx.onTimeUpdate(() => {}); // 播放进度更新
```

---

## 五、其他重要知识点补充

### 1. 数据绑定与 setData

```javascript
Page({
  data: {
    message: 'Hello',
    list: [1, 2, 3],
    user: { name: 'Tom' }
  },
  
  updateData() {
    // 基础用法
    this.setData({ message: 'World' });
    
    // 更新数组某一项
    this.setData({ 'list[0]': 100 });
    
    // 更新对象某个属性
    this.setData({ 'user.name': 'Jerry' });
    
    // 动态 key
    const index = 1;
    this.setData({ [`list[${index}]`]: 200 });
    
    // setData 回调（数据更新后执行）
    this.setData({ message: 'Done' }, () => {
      console.log('数据已更新');
    });
  }
});
```

### 2. 页面传参方式

本项目中使用的传参方式：

```javascript
// 方式1: data-* 属性传值
// WXML
<view data-index="{{index}}" bindtap="handleTap">

// JS
handleTap(e) {
  const index = e.currentTarget.dataset.index;
}

// 方式2: 页面跳转传参
wx.navigateTo({
  url: `/pages/detail/detail?movie=${JSON.stringify(obj)}`
});

// 目标页面接收
onLoad(options) {
  const movie = JSON.parse(options.movie);
}

// 方式3: Storage 存储
wx.setStorageSync('key', data);
const data = wx.getStorageSync('key');

// 方式4: globalData（适合不变的全局数据）
// app.js
App({ globalData: { userInfo: null } });

// 其他页面获取
const app = getApp();
console.log(app.globalData.userInfo);
```

### 3. 网络请求封装

本项目的请求封装 (service/index.js)：

```javascript
class MyRequest {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  request(url, data, method) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseURL}${url}`,
        data,
        method,
        header: { 'content-type': 'json' },
        success: (res) => resolve(res.data),
        fail: (err) => reject(err)
      });
    });
  }
  
  get(url, params) {
    return this.request(url, params, 'GET');
  }
  
  post(url, data) {
    return this.request(url, data, 'POST');
  }
}

const request = new MyRequest('https://api.example.com');
export default request;
```

### 4. wxs 模块（视图层脚本）

WXS 是小程序的脚本语言，运行在视图层，可以提高性能：

```javascript
// utils/format.wxs
var formatTime = function(timestamp) {
  var date = getDate(timestamp);
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

module.exports = {
  formatTime: formatTime
}
```

```html
<!-- 在 wxml 中使用 -->
<wxs src="../../utils/format.wxs" module="format" />
<view>{{format.formatTime(timestamp)}}</view>
```

### 5. 常用 API 速查

```javascript
// 路由
wx.navigateTo({ url: '/pages/detail/detail' });  // 保留当前页，跳转
wx.redirectTo({ url: '/pages/home/home' });      // 关闭当前页，跳转
wx.switchTab({ url: '/pages/home/home' });       // 跳转到 tabBar 页面
wx.navigateBack({ delta: 1 });                   // 返回上一页
wx.reLaunch({ url: '/pages/home/home' });        // 关闭所有页面，打开某页

// 交互
wx.showToast({ title: '成功', icon: 'success' });
wx.showLoading({ title: '加载中' });
wx.hideLoading();
wx.showModal({ title: '提示', content: '确认删除？' });

// 存储
wx.setStorageSync('key', data);
wx.getStorageSync('key');
wx.removeStorageSync('key');
wx.clearStorageSync();

// 设备信息
wx.getSystemInfoSync();

// 位置
wx.getLocation({ type: 'wgs84', success(res) {} });
wx.openLocation({ latitude, longitude });

// 登录
wx.login({ success(res) { console.log(res.code); } });
wx.getUserInfo({ success(res) {} });  // 已废弃，使用 getUserProfile
```

### 6. 自定义组件注意事项

```javascript
Component({
  options: {
    addGlobalClass: true,     // 允许使用全局样式
    styleIsolation: 'shared', // 样式隔离模式
    multipleSlots: true       // 启用多 slot
  },
  
  // 外部样式类
  externalClasses: ['my-class'],
  
  // 数据监听器
  observers: {
    'propA, propB': function(propA, propB) {
      // propA 或 propB 变化时触发
    }
  }
});
```

### 7. 项目目录结构说明

```
├── app.js / app.json / app.wxss    # 全局配置
├── pages/                          # 页面目录
│   ├── home/                       # 首页
│   ├── detail/                     # 详情页
│   ├── login/                      # 登录页
│   └── ...
├── components/                     # 自定义组件
│   ├── nav-bar/                    # 导航栏组件
│   ├── movie-item/                 # 电影项组件
│   └── ...
├── service/                        # 网络请求
├── utils/                          # 工具函数
├── constants/                      # 常量配置
├── style/                          # 公共样式
└── assets/                         # 静态资源
```

---

## 快速复习清单

- [ ] App 生命周期：`onLaunch` → `onShow` → `onHide`
- [ ] Page 生命周期：`onLoad` → `onShow` → `onReady` → `onHide` → `onUnload`
- [ ] Component 生命周期：`created` → `attached` → `ready` → `detached`
- [ ] 父传子：`properties` 接收
- [ ] 子传父：`triggerEvent` 触发事件
- [ ] 获取子组件：`selectComponent`
- [ ] 数据更新：`setData`
- [ ] 页面传参：`url` 参数 / `Storage` / `globalData`
- [ ] 音频播放：`wx.createInnerAudioContext()`


