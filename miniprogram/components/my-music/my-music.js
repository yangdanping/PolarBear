// components/my-music/my-music.js
Component({
  properties: {

  },
  data: {
    // audioCtx:null,
    // isPlayingMusic: false,
    // ishind:false
  },
  options:{
    addGlobalClass:true
  },
  lifetimes:{
    attached(){//组件生命周期函数--------节点数完成,可以使用setData,而created不能使用setData
      this.play();
    }
  },
  methods: {
    play(e){
      this.triggerEvent('play');
      // if(!this.data.isPlayingMusic){
      // console.log("play");
      // this.setData({
      //   audioCtx:wx.createInnerAudioContext()
      // })
      // let audioCtx = this.data.audioCtx;
      // audioCtx.src="http://cxywyq.top:3000/static/music/ydp/001.mp3";
      // audioCtx.onPlay(()=>{
      //   console.log("start play");
      // });
      // audioCtx.play();
      //   this.data.isPlayingMusic = !this.data.isPlayingMusic;
      //   this.setData(this.data);
      //   console.log(this.data.isPlayingMusic);
      // }else if(this.data.isPlayingMusic){
      //     let audioCtx = this.data.audioCtx;
      //     console.log("pause");
      //     audioCtx.pause();
      //     audioCtx.onPause(()=>{
      //       console.log("start pause");
      //     });
      //     this.data.isPlayingMusic = !this.data.isPlayingMusic;
      //     this.setData({
      //       isPlayingMusic:this.data.isPlayingMusic
      //     })
      // }
    },
    // pause(){
    //   if(this.data.isPlayingMusic !== null && this.data.isPlayingMusic){

    //   }
    //   let audioCtx = this.data.audioCtx;
    //   console.log("pause");
    //   audioCtx.pause();
    //   audioCtx.onPause(()=>{
    //     console.log("start pause");
    //   });
    //   if(this.data.isPlayingMusic){
    //     this.data.isPlayingMusic = !this.data.isPlayingMusic;
    //     this.setData({
    //       isPlayingMusic:this.data.isPlayingMusic
    //     })
    //   }
    //   console.log(audioCtx);
    // }


    // play(){
    //   if(!this.data.isPlayingMusic){
    //     console.log(this.data.isPlayingMusic);
    //     this.setData({
    //       isPlayingMusic: !this.data.isPlayingMusic,
    //       audioCtx:wx.createInnerAudioContext()
    //     })
    //     console.log(this.data.isPlayingMusic);
    //     let audioCtx = this.data.audioCtx;
    //     audioCtx.src="http://cxywyq.top:3000/static/music/ydp/001.mp3";
    //     audioCtx.play();
    //     audioCtx.onPlay(()=>{console.log("start play");});
    //     if(!this.data.ishind){
    //       clearTimeout(timer);
    //       let timer = setTimeout(()=>{
    //         this.setData({
    //           ishind:!this.data.ishind
    //         })
    //       },3000);
    //     }
    //   }else{
    //     let audioCtx = this.data.audioCtx;
    //     audioCtx.pause();
    //     audioCtx.onPause(()=>{console.log("start pause");});
    //     this.setData({
    //       isPlayingMusic: !this.data.isPlayingMusic,
    //       ishind:!this.data.ishind
    //     })
    //     console.log('音乐隐藏');
    //     if(!this.data.ishind){
    //       clearTimeout(timer);
    //       let timer = setTimeout(()=>{
    //         this.setData({
    //           ishind:!this.data.ishind
    //         })
    //       },3000);
    //     }
    //     // console.log(audioCtx);
    //   }
    // }

  }
})
