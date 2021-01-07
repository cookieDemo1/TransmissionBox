<template>
  <div id="outsideVideo" ref="outsideVideo" >
    <div id="playContent"></div>
    <el-dialog title="提示" :visible.sync="dialogBrowser" width="30%" center>
      <div style="text-align: center;font-size: 18px;">该浏览器不支持，请使用浏览器Chrome 55+，Firefox 55+查看</div>
      <template v-slot:footer>
        <el-button type="primary" @click="dialogBrowser = false" style="width: 210px">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import EZUIKit from '@/api/ezuikit';
  let decoder = null
  export default {
    name: 'outside-video',
    props: {
      videoItem: Object,
      borderColor: {
        type: String,
        default: () => '19CCAE'
      }
    },
    watch: {
      videoItem(newVal,oldVal) {
        if (oldVal){
          this.toStopPlay(this.selectedWindow,oldVal)
        }
        if (newVal){
          this.accessToken = newVal.access_token
          this.url = newVal.url
          this.startPlay()
        }
      },
    },
    data: function () {
      return {
        windowType: 1,
        selectedWindow: 0,

        accessToken: '',
        url: '',
        pluginError: 0,
        dialogBrowser: false,
        dialogPlugin: false
      }
    },
    destroyed() {
      if (this.videoItem){
        this.stopPlay()
      }
      window.removeEventListener('resize',this.resetPosition)
    },
    methods: {
      checkPluginError(){
        if (typeof WebAssembly !== "object") {
          this.dialogBrowser = true
          return true
        }
        return false
      },
      startPlay(){
        if (this.checkPluginError()){
          return
        }
        decoder = new EZUIKit.EZUIPlayer({
          id: 'playContent',
          lodingId: 'outsideVideo',
          decoderPath: '',
          autoplay: true,
          url: this.url,
          accessToken: this.accessToken,
          splitBasis: this.windowType, // 1*1 2*2 3*3 4*4
          handleInitDecoderSuccess: () => {
            const parent = document.getElementsByClassName('parent-wnd')[0];
            const children = parent.children
            Array.from(children).forEach((item,index) => {
              if (index === this.selectedWindow){
                item.className = `child-wnd child-wnd-${this.windowType} child-wnd-active`
              }else {
                item.className=`child-wnd child-wnd-${this.windowType} child-wnd-inactive`
              }
              item.onclick = (e) => {
                let selectedWindow = index
                this.selectedWindow = selectedWindow
                Array.from(children).forEach((item,index) => {
                  if (index === selectedWindow){
                    item.className = `child-wnd child-wnd-${this.windowType} child-wnd-active`
                  }else {
                    item.className=`child-wnd child-wnd-${this.windowType} child-wnd-inactive`
                  }
                })
              }
            })
            this.resetPosition()
            window.addEventListener('resize',this.resetPosition)
          },
          handleSuccess: () => {
            console.log('handleSuccess')
          },
          handleError: (err) => {
            console.log('handleError')
          },
        });
      },
      stopPlay() {
        this.toStopPlay(this.selectedWindow,this.videoItem)
      },
      toStopPlay(windowIndex,item){
        const iWndIndex = windowIndex
        decoder.stop(iWndIndex)
      },
      fullScreen(){
        if (this.checkPluginError()){
          return
        }
        decoder.fullScreen()
      },
      resetPosition() {
        this.$nextTick(() => {
          const outsideVideo = this.$refs.outsideVideo
          const width = outsideVideo.offsetWidth
          const height = outsideVideo.offsetHeight
          decoder.jSPlugin.JS_Resize(width,height);
        })
      },
    }
  }

</script>

<style lang="stylus">

  .child-wnd{
    box-sizing: border-box;
  }
  .child-wnd-1{
    width: 100%!important;
    height: 100%!important;
  }
  .child-wnd-2{
    width: 50%!important;
    height: 50%!important;
  }
  .child-wnd-3{
    width: 33.333%!important;
    height: 33.333%!important;
  }
  .child-wnd-inactive {
    border: 1px solid black;
  }
  .child-wnd-active{
    border: 1px solid #19CCAE;
  }
</style>