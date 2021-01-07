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
    name: 'InsideVideo',
    props: {
      videoItem: Object,
      borderColor: {
        type: String,
        default: () => '19CCAE'
      },

    },
    data: function () {
      return {
        windowType: 1,
        selectedWindow: 0,

        isInitPlugin: false,
        pluginError: 0,

        bZeroChannel: false,
        dialogBrowser: false,
        dialogPlugin: false
      }
    },
    watch: {
      videoItem(newVal,oldVal) {
        if (oldVal){
          this.toStopPlay(this.selectedWindow,oldVal)
          this.toLogout(this.selectedWindow,oldVal)
        }
        if (newVal){
          if (!this.isInitPlugin){
            this.initPlugin()
          }else {
            this.startPlay()
          }
        }
      }
    },
    destroyed() {
      if (this.videoItem){
        this.stopPlay()
        this.logout()
      }
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
            this.selectedWindow = jsonObj.RealPlayInfo.SelectWnd
          },
          cbInitPluginComplete:  ()  => {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            this.startPlay()
          }
        });
      },
      toStartLogin(windowIndex,item){
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
        this.toStartPlay(0,this.videoItem)
      },
      toStartPlay(windowIndex,item){
        if (!item.isLogin){
          this.toStartLogin(windowIndex,item)
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
        this.toStopPlay(0,this.videoItem)
      },
      toStopPlay(windowIndex,item){
        const iWndIndex = windowIndex
        WebVideoCtrl.I_Stop({iWndIndex});
      },
      logout(){
        this.toLogout(0,this.videoItem)
      },
      toLogout(windowIndex,item){
        const {szDeviceIdentify} = item
        WebVideoCtrl.I_Logout(szDeviceIdentify);
        item.isLogin = false
      },
      downloadPlugin(){
        this.$refs.download.click()
        this.dialogPlugin = false
      }
    },
  }
</script>

<style scoped lang="stylus">
  .plugin {
    width: 100%;
    height: 100%;
  }

</style>
