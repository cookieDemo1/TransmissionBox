<template>
  <div class="plugin" id="divPlugin">
    <el-dialog title="提示" :visible.sync="dialogPlugin" width="30%" center :close-on-click-modal="false">
      <div style="text-align: center;font-size: 18px;">查看监控视频需安装视频插件，点击此处下载插件</div>
      <template v-slot:footer>
        <el-button @click="dialogPlugin = false" style="width: 40%">取消</el-button>
        <el-button type="primary" @click="downloadPlugin" style="width: 40%">下载</el-button>
      </template>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogBrowser" width="30%" center>
      <div style="text-align: center;font-size: 18px;">该浏览器不支持，请使用IE浏览器或者360浏览器兼容模式查看</div>
      <template v-slot:footer>
        <el-button type="primary" @click="dialogBrowser = false" style="width: 210px">确定</el-button>
      </template>
    </el-dialog>
    <a ref="download" v-show="false" href="/WebComponentsKit.exe" download="download"></a>
  </div>
</template>

<script>
  import { WebVideoCtrl } from '_api/webVideoCtrl.js'
  import {XMLSTR2JSON} from "_common/xml2Json.js";

  export default {
    name: 'inside-split-video',
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
        this.startPlay()
      },
      windowType: function(newVal, oldVal) {
        this.changeWindowType()
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
                this.toStartPlay(this.selectedWindow,this.videoList[newIndex])
              }
            })
          }
        },
        deep:true
      },
    },
    data: function () {
      return {
        pluginError: 0,
        bZeroChannel: false,
        dialogBrowser: false,
        dialogPlugin: false
      }
    },
    mounted: function () {
      this.initPlugin()
    },
    destroyed: function () {
      this.stopPlay();
      this.logout();
    },
    computed: {
      activeItems(){
        return this.activeIndexs.map(activeIndex => this.videoList[activeIndex])
      },
    },
    methods: {
      checkPluginError(){
        if (!(window.ActiveXObject || "ActiveXObject" in window)){
          this.dialogBrowser = true
          return true;
        }
        if (this.pluginError !== 0) {
          this.dialogPlugin = true
          return true;
        }
        return false
      },
      initPlugin() {
        this.pluginError = WebVideoCtrl.I_CheckPluginInstall();
        if (this.checkPluginError()){
          return
        }
        const iWndowType = this.windowType
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
          // szColorProperty: 'plugin-background:ffffff; sub-background:ffffff; sub-border:ffffff; sub-border-select:ffffff',
          szColorProperty: `sub-border-select:${this.borderColor};`,
          iWndowType,
          bWndFull: true,
          cbSelWnd: function(xmlDoc) {
            // console.log(xmlDoc)
          },
          myCbSelWnd: (xmlSTR)  => {
            const jsonObj = XMLSTR2JSON(xmlSTR)
            this.$emit('update:selectedWindow',parseInt(jsonObj.RealPlayInfo.SelectWnd))
          },
          cbInitPluginComplete:  ()  => {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
          }
        });
      },
      toLogin(windowIndex,item){
        const {ip,port,username,password, iProtocol, szDeviceIdentify} = item
        WebVideoCtrl.I_Login(ip, iProtocol, port, username, password, {
          // async: false,
          success:  (xmlDoc)  => {
            item.isLogin = true
            WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
                async: false,
                success:  (xmlDoc)  => {
                },
                mysuccess:  (xmlSTR)  => {
                  let jsonObj = XMLSTR2JSON(xmlSTR)
                  let list = jsonObj.InputProxyChannelStatusList.InputProxyChannelStatus;
                  //todo
                  let iChannelID = list[14].id
                  item.iChannelID = iChannelID
                },
                error:  (status, xmlDoc)  => {
                  console.log("获取数字通道失败");
                }
              }
            );
            WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
              async: false,
              success:  (xmlDOC)  => {
              },
              mysuccess:  (xmlSTR)  => {
                let jsonObj = XMLSTR2JSON(xmlSTR);
                let iChannelID = jsonObj.VideoInputChannelList.VideoInputChannel.id;
                item.iChannelID = iChannelID
              },
              error: (status, xmlDoc)  => {
                console.log("获取模拟通道失败");
              }
            });
            this.videoList.forEach(videoItem => {
              if (videoItem.szDeviceIdentify === szDeviceIdentify){//同一个设备登录一次就可以了
                videoItem.isLogin = item.isLogin
                videoItem.iChannelID = item.iChannelID
              }
            })
            this.toStartPlay(windowIndex,item)
          },
          error: ()  => {
            item.isLogin = false
            // this.$message.error(`摄像头“${item.name}”登录失败！`)
          }
        });
      },
      startPlay(){
        if (this.checkPluginError()){
          return
        }
        for(let i=0; i< this.activeItems.length; i++){
          let item = this.activeItems[i]
          this.toStartPlay(i,item)
        }
      },
      toStartPlay(windowIndex,item){
        if (!item.isLogin){
          this.toLogin(windowIndex,item)
          return
        }
        const iWndIndex = windowIndex
        const {szDeviceIdentify, iStreamType, iChannelID } = item
        WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
          iWndIndex,
          iStreamType,
          iChannelID,
          bZeroChannel: this.bZeroChannel,
          success:  ()  => {
          },
          error:  (status, xmlDoc2)  => {
            this.$message.error(`播放失败，请检查设备是否在线！`)
          }
        });
      },
      stopPlay() {
        for(let i=0; i< this.videoList.length; i++){
          let item = this.videoList[i]
          this.toStopPlay(i,item)
        }
      },
      toStopPlay(windowIndex,item){
        const iWndIndex = windowIndex
        WebVideoCtrl.I_Stop({iWndIndex});
      },
      logout(){
        for(let i=0; i< this.videoList.length; i++){
          let item = this.videoList[i]
          this.toLogout(i,item)
        }
      },
      toLogout(windowIndex,item){
        const {szDeviceIdentify} = item
        WebVideoCtrl.I_Logout(szDeviceIdentify);
        item.isLogin = false
      },
      changeWindowType(){
        if (this.checkPluginError()){
          return
        }
        WebVideoCtrl.I_ChangeWndNum(this.windowType)
      },
      fullScreen(){
        if (this.checkPluginError()){
          return
        }
        WebVideoCtrl.I_FullScreen(true)
      },
      downloadPlugin(){
        this.$refs.download.click()
        this.dialogPlugin = false
      }
    }
  }

</script>
<style scoped>
  .plugin {
    width: 500px;
    height: 300px;
  }
</style>

