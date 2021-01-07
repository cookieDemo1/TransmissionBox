<template>
  <div class="overview">
    <div class="echarts_top">
      <div class="echarts_left" :style="{height: containerHeight}">
        <device-num class="device_num"></device-num>
        <device-online class="device_online"></device-online>
      </div>
      <div class="echarts_right">
        <div class="video_menu" z-index="1">
          <el-dropdown @command="handleCurrentIndexChange" @visible-change="handleVisibleChange" trigger="click">
        <span class="title">
          <div class="name">{{videoItem && videoItem.name}}</div><i class="el-icon-arrow-down el-icon--right"></i>
        </span>
            <el-dropdown-menu class="dropdownMenu" slot="dropdown" ref="dropdownMenu">
              <el-dropdown-item class="item" v-for="(item,index) in videoList" :key="item.id" :command="index">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="video_content" ref="videoContent" :style="{height: videoHeight}">
          <inside-video v-show="showInside" class="inside" :videoItem="showInside?videoItem:null">
          </inside-video>
          <outside-video v-show="showOutside" class="outside" :videoItem="showOutside?videoItem:null">
          </outside-video>
        </div>
      </div>
    </div>
    <div class="echarts_bottom">
      <device-activity class="activity"></device-activity>
      <device-police class="police"></device-police>
    </div>

  </div>
</template>

<script>
  import DeviceNum from './DeviceNum'
  import DeviceOnline from './DeviceOnline'
  import DeviceActivity from './DeviceActivity'
  import DevicePolice from './DevicePolice'
  import { getV2Data } from '_api/data_overview'
  import InsideVideo from '_components/InsideVideo'
  import OutsideVideo from '_components/OutsideVideo'

  import axios from 'axios'

  export default {
    components: {DeviceNum, DeviceOnline, DeviceActivity, DevicePolice, InsideVideo, OutsideVideo},
    data() {
      return {
        videoList: [],
        currentIndex: 0,
        mask: null,

        videoHeight: '655px',
        containerHeight: '780px',
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
    computed: {
      videoItem(){
        return this.videoList && this.videoList.length ? this.videoList[this.currentIndex] : null
      },
      showInside(){
        return this.videoItem && this.videoItem.ip
      },
      showOutside(){
        return this.videoItem && !this.videoItem.ip
      }
    },
    methods: {
      initData() {
        getV2Data('/devices/').then((res) => {
            if (res.data.code === 200) {
                const list = res.data.data.list || []
                axios.all(list.map((item) => {
                  return axios.get(`/device/${item.id}/cameras/`)
                })).then((result) => {
                  let array = []
                  result.forEach((res) => {
                    res.data.data.forEach((item) => array.push(item))
                  })
                  this.videoList = array
                  this.videoList = this.videoList.map((item) => {
                    const isInside = !!item.ip
                    if (isInside) {
                        const {ip} = item
                        const port = 80
                        const isLogin = false
                        const szDeviceIdentify = ip + "_" + port
                        const iProtocol = 1
                        const iStreamType = 1
                        return {...item, port, isLogin,szDeviceIdentify, iProtocol, iStreamType}
                    }else {
                      return item
                    }
                  })
                })
            } else {
              this.$message.error(res.data.msg)
            }
        }).catch(() => {
          this.$message.error('获取数据失败~')
        })
      },
      handleCurrentIndexChange(index) {
        this.currentIndex = index
      },
      handleVisibleChange(visible){
        if (visible) {
          setTimeout(() => {
            let menu = this.$refs.dropdownMenu.$el
            if (!this.mask){
                let height = menu.clientHeight
                let mask = document.createElement('iframe')
                mask.src = "about:blank"
                mask.style.cssText = `z-index:-1;position:absolute;left: -1px;right: 0px;top:0;bottom:0; max-width:none; width: 152px; height: ${height}px; `
                menu.appendChild(mask)
                this.mask = mask
            }
          },10)
        }
      },
      resetPosition(){
        this.$nextTick(() => {
          console.log('视频高度重置')
          let videoWith = this.$refs.videoContent.offsetWidth
          let videoHeight = videoWith* 9/16
          this.videoHeight = videoHeight + 'px'
          this.containerHeight = (videoHeight + 125)  + 'px'
        })
      }
    },
  }
</script>
<style>


</style>



<style lang="stylus" scoped>
  .overview {

  }

  .echarts_top
    display flex
    .echarts_left
      width: 32.3%
      .device_num
        height calc(50% - 20px)
        margin-bottom 20px
      .device_online
        height 50%

    .echarts_right
      flex 1
      margin-left 20px
      display flex
      flex-direction column
      padding-bottom  50px
      position relative
      background:#ffffff;
      border:1px solid rgba(125, 189, 178, 0.2);
      box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2);
      border-radius:4px;
      .video_content
        background:rgba(235,237,237,1);
        width 100%
        .inside,.outside
          width 100%
          height 100%

      .video_menu
        position relative
        margin 20px 20px 20px

        .title
          padding 0 10px
          width 165px
          height 36px
          border-radius: 18px
          background:rgba(232,235,235,1);
          font-size 16px
          color #333333
          display flex
          justify-content space-between
          align-items center
          cursor pointer
          .name
            flex 1
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          .icon
            wh 16px 16px

  .echarts_bottom{
    margin-top 20px
    display flex
    .activity{
      flex 1
      height 550px
    }
    .police{
      margin-left 20px
      flex 1
      height 550px
    }
  }

  .dropdownMenu
    li
      width 110px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap

</style>
