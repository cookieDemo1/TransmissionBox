<template>
  <div id="outsideVideo" ref="outsideVideo">
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
    name: 'outside-split-video',
    props: {
      videoList: {
        type: Array,
        default: () => []
      },
      borderColor: {
        type: String,
        default: () => '19CCAE'
      },
      activeIndexs: {
        type: Array,
        default: () => [0]
      },
      windowType: {
        type: Number,
        default: () => 1
      },
      selectedWindow: {
        type: Number,
        default: () => 0
      },
    },
    watch: {
      videoList: function(newVal,oldVal) {
        if (this.videoList && !this.videoList.length){
          return
        }
        const item = this.videoList[0]
        this.accessToken = item.access_token
        this.startPlay()
      },
      activeIndexs: {
        handler: function(newVal, oldVal) {
          if (this.checkPluginError()){
            return
          }
          if (this.videoList && !this.videoList.length){
            return
          }
          //改变了windowType
          if (newVal.length !== oldVal.length){
            this.stopPlay()
            this.startPlay()
          }else {//changeItem
            newVal.forEach((newIndex,index) => {
              const oldIndex = oldVal[index]
              if (newIndex !== oldIndex){
                this.toStopPlay(this.selectedWindow,this.videoList[oldIndex])
                this.toChangePlay(this.selectedWindow,this.videoList[newIndex])
              }
            })
          }
        },
        deep:true
      },
    },
    data: function () {
      return {
        accessToken: '',
        pluginError: 0,
        dialogBrowser: false,
        dialogPlugin: false,
      }
    },
    computed: {
      activeItems(){
        return this.activeIndexs.map(activeIndex => this.videoList[activeIndex])
      },
      url(){
        let url = ''
        this.activeItems.forEach((item,index) => {
          url += index === 0? item.url:`,${item.url}`
        })
        return  url
      },
    },
    destroyed() {
      this.stopPlay()
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
                this.$emit('update:selectedWindow',selectedWindow)
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
          handleError: () => {
            console.log('handleError')
          },
        });
      },
      toChangePlay(windowIndex,item){
        decoder.changePlay(windowIndex,this.url)
      },
      stopPlay() {
        for(let i=0; i< this.videoList.length; i++){
          let item = this.videoList[i]
          this.toStopPlay(i,item)
        }
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