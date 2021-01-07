<template>
  <div class="device_detail">
    <div class="detail_header">
      <el-breadcrumb class="bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-size:16px" :to="{ path: '/device/manage' }">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item style="font-size:16px" :to="{ path: '/device/manage' }">设备详情</el-breadcrumb-item>
        <el-breadcrumb-item style="font-size:16px">摄像机详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="detail_body">
      <div class="video_left">
        <div class="video_content" ref="videoContent">
          <template v-if="shouldGuide">
            <div style="color: white">这是引导</div>
          </template>
          <template v-else-if="isInside">
            <inside-split-video
                class="inside"
                ref="insideVideo"
                :videoList="videoList"
                :activeIndexs="activeIndexs"
                :windowType="windowType"
                :selectedWindow.sync="selectedWindow"
            >
            </inside-split-video>
          </template>
          <template v-else>
            <outside-split-video
                class="outside"
                ref="outsideVideo"
                :videoList="videoList"
                :activeIndexs="activeIndexs"
                :windowType="windowType"
                :selectedWindow.sync="selectedWindow"
            >
            </outside-split-video>
          </template>
        </div>
        <div class="video_bottom">
          <div class="split_screen">
            <img class="split_icon" v-if="windowType===1" src="@/assets/one_click@2x.png" />
            <img class="split_icon" v-else src="@/assets/one_nor@2x.png" @click="handleWindowTypeChange(1)" />
            <img class="split_icon" v-if="windowType===2" src="@/assets/four_click@2x.png" />
            <img class="split_icon" v-else src="@/assets/four_nor@2x.png" @click="handleWindowTypeChange(2)" />
            <img class="split_icon" v-if="windowType===3" src="@/assets/nine_click@2x.png" />
            <img class="split_icon" v-else src="@/assets/nine_nor@2x.png" @click="handleWindowTypeChange(3)" />
          </div>
          <div class="full_screen">
            <img src="@/assets/full_screen@2x.png" @click="handleFullScreen" />
          </div>
        </div>
      </div>
      <div class="video_right">
        <div class="title">播放列表</div>
        <div class="list">
          <div v-for="(item ,index) in videoList" :key="index" @click="handleActiveIndexsChange(index)" class="list_item" :class="{active: activeIndexs.includes(index)}">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { HttpGetCamerasDetail } from '_api/device_manage'
  import InsideSplitVideo from '_components/InsideSplitVideo'
  import OutsideSplitVideo from '_components/OutsideSplitVideo'
  export default {
    components: { InsideSplitVideo, OutsideSplitVideo},
    data() {
      return {
        shouldGuide:false,
        isInside: false,
        videoHeight: '720px',

        deviceId: '',
        activeIndexs: [0],
        windowType: 1,
        selectedWindow: 0,
        videoList:[],
      }
    },
    mounted() {
      this.initData()
      this.resetPosition()
      window.addEventListener('resize', this.resetPosition)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resetPosition)
    },
    methods: {
      initData(){
        const { deviceId='', index='0', type='0'} = this.$route.query
        this.isInside = type === '0'
        this.deviceId = deviceId
        this.activeIndexs = [parseInt(index)]
        this.getVideoList()
        // this.shouldGuide = window.localStorage.getItem('shouldGuide')
        // if (this.shouldGuide){
        //   this.activeIndexs = [0]
        //   this.windowType = 2
        //   this.selectedWindow = 0
        //   this.videoList = []
        //   // this.getVideoList()
        // }else {

        // }
      },
      getVideoList(){
        HttpGetCamerasDetail(this.deviceId).then((res) => {
          if (res.data.code == 200) {
            this.videoList = res.data.data
            if (this.isInside) {
              this.videoList =  this.videoList.map(item => {
                const {ip} = item
                const port = 80
                const isLogin = false
                const szDeviceIdentify = ip + "_" + port
                const iProtocol = 1
                const iStreamType = 1
                return {...item, port, isLogin,szDeviceIdentify, iProtocol, iStreamType}
              })
            }
          } else {
            this.$message.error('获取数据失败~')
          }
        })
      },
      handleActiveIndexsChange(nextActiveIndex){
        const activeIndex = this.activeIndexs[this.selectedWindow]
        if (activeIndex === nextActiveIndex){
          return
        }
        const activeIndexs = [...this.activeIndexs]
        activeIndexs[this.selectedWindow] = nextActiveIndex
        this.activeIndexs = activeIndexs
      },
      handleWindowTypeChange(nextWindowType){
        this.windowType = nextWindowType
        const length = this.videoList.length
        const minLength = Math.min(length , nextWindowType*nextWindowType)
        this.activeIndexs = Array(minLength).fill(0).map((item,index) => index)
      },
      handleFullScreen(){
        if (this.isInside) {
          this.$refs.insideVideo.fullScreen()
        }else {
          this.$refs.outsideVideo.fullScreen()
        }
      },
      resetPosition() {
        this.$nextTick(() => {
          let videoWith = this.$refs.videoContent.offsetWidth
          this.videoHeight = videoWith* 9/16 + 'px'
        })
      },
    }
  }
</script>

<style scoped lang="stylus">

  .device_detail{
    width 100%
    height 100%
    display flex
    flex-direction column
  }

  .detail_header
    fc 18 #999
    margin-bottom 15px
    .breadcrumb
      margin-top 26px
      margin-bottom 12px
      fsc 16px #666

  /*video content  width 720px height 1280*/
  .detail_body
    width 100%
    height calc(100vh - 150px)
    min-height 550px
    display flex
    background #000

  .video_left
    width calc(100% - 215px)
    height 100%
    .video_content{
      width 100%
      height calc(100% - 60px)
      background rgba(0, 0, 0, 0.4)
      .inside,.outside{
        width 100%
        height 100%
      }
    }

    .video_bottom{
      width 100%
      height 60px
      padding 0 20px
      display flex
      justify-content space-between
      align-items center
      .split_screen{
        display flex
        .split_icon{
          width 32px
          height 32px
          margin-right 14px
          cursor pointer
        }
      }
      .full_screen{
        width 30px
        height 30px
        img{
          width 100%
          height 100%
          cursor pointer
        }
      }
    }


  .video_right{
    width 215px
    height 100%
    padding 20px
    display flex
    flex-direction column
    .title{
      margin-bottom  30px
      fc 18 #fff
    }
    .list{
      flex 1
      overflow-x hidden
      overflow-y auto
      .list_item {
        fc 16 #999
        margin-bottom 15px
        cursor pointer
        &.active{
          color: #19CCAE;
        }
      }
    }
  }
</style>

