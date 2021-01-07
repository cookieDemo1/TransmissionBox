<template>
  <div class="device_right">
    <div class="external_device">
      <div class="external_title">
        <span class="vertical_bar">
          <svg-icon icon-class="emphasize"></svg-icon>
        </span>
        <span>外接设备</span>
      </div>
      <page-control class="camera_list" :total="camerasList.length<8?camerasList.length+1:camerasList.length">
        <template v-slot:left>
          <div class="camera_list_left">
            <div class="camera_list_left">
              <img  src="@/assets/zou_jt@2x.png" >
            </div>
          </div>
        </template>
        <template v-slot:default>
          <div class="camera_list_item" v-for="(item,index) in camerasList" :key="index">
            <div class="camera_list_wrapper">
              <div class="external_content_box" @click="$emit('toVideo',item,index)" style="cursor: pointer;">
                <div class="external_content_box_icon">
                  <svg-icon icon-class="shexiangji" style="width: 60px;height: 60px;"></svg-icon>
                </div>
                <div class="external_content_box_info">
                  <p class="carame_name" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{item.name}}</p>
                  <p class="carame_ip" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{item.ip || item.id}}</p>
                </div>
                <div class="external_content_box_arrow"><i class="el-icon-arrow-right"></i></div>
              </div>
              <div class="camera_status"><span>{{!!item.ip? '内网':'外网'}}&nbsp;| &nbsp;</span><span>端口{{item.port}}&nbsp; | &nbsp;</span><span>插座{{item.out}}</span></div>
              <div class="edit_camera">
                <img src="@/assets/modify@2x.png" @click="$emit('editCamera',item)" style="cursor: pointer;" />
                <img src="@/assets/delete@2x.png" @click="$emit('deleteCamera',item)" style="cursor: pointer;" />
              </div>
            </div>
          </div>
          <div class="camera_list_item ope_camera" @click="$emit('addCamera')" v-if="camerasList.length<8">
            <div class="camera_list_wrapper">
              <div class="external_content_box">
                <div class="external_content_box_icon" style="margin-right:15px;cursor: pointer;">
                  <svg-icon icon-class="add"></svg-icon>
                </div>
                <div class="camera_desc">添加摄像头</div>
              </div>
              <div class="add_camera"><span>添加连接此传输箱的摄像头</span></div>
            </div>
          </div>
        </template>
        <template v-slot:right>
          <div class="camera_list_right">
            <img  src="@/assets/you_jt@2x.png" >
          </div>
        </template>
      </page-control>
    </div>


    <div class="reclose_settings">
      <div class="reclose_settings_title">
        <div class="icon">
          <svg-icon icon-class="emphasize"></svg-icon>
        </div>
        <div class="title">自动重合闸</div>
        <div class="other">
          <indicator class="indicator" isHorizontal="true" status="0" text="正常"></indicator>
          <div class="split"></div>
          <indicator class="indicator" isHorizontal="true" status="1" text="异常"></indicator>
        </div>
      </div>
      <div class="reclose_settings_content">
        <div class="left">
          <template v-if="deviceBean.state === '1'">
            <div class="top">
              <indicator class="indicator" :status="recloseData.warning?recloseData.warning[0]:'-1'" text="电压低"></indicator>
              <indicator class="indicator" :status="recloseData.warning?recloseData.warning[1]:'-1'" text="电压高"></indicator>
              <indicator class="indicator" :status="recloseData.warning?recloseData.warning[2]:'-1'" text="过流"></indicator>
            </div>
            <div class="bottom">
              <indicator class="indicator" :status="recloseData.warning?recloseData.warning[3]:'-1'" text="短路"></indicator>
              <indicator class="indicator" :status="recloseData.warning?recloseData.warning[4]:'-1'" text="漏电"></indicator>
              <indicator class="indicator" :status="recloseData.warning?recloseData.warning[5]:'-1'" text="缺相"></indicator>
            </div>
          </template>
          <template v-else>
            <div class="top">
              <indicator class="indicator" :status="'-1'" text="电压低"></indicator>
              <indicator class="indicator" :status="'-1'" text="电压高"></indicator>
              <indicator class="indicator" :status="'-1'" text="过流"></indicator>
            </div>
            <div class="bottom">
              <indicator class="indicator" :status="'-1'" text="短路"></indicator>
              <indicator class="indicator" :status="'-1'" text="漏电"></indicator>
              <indicator class="indicator" :status="'-1'" text="缺相"></indicator>
            </div>
          </template>
        </div>
        <div class="split"></div>
        <div class="right">
          <div class="info"><template v-if="deviceBean.state === '1'">
            <infoItem class="infoItem" :data="{value: recloseData.hasOwnProperty('vol')?recloseData.vol:'--', unit:'V', label: '电压值'}"></infoItem>
            <infoItem class="infoItem" :data="{value: recloseData.hasOwnProperty('cur')?recloseData.cur:'--', unit:'A', label: '电流值'}"></infoItem>
            <infoItem class="infoItem" :data="{value: recloseData.hasOwnProperty('leak_cur')?recloseData.leak_cur:'--', unit:'mA', label: '漏电电流'}"></infoItem>
          </template><template v-else>
            <infoItem class="infoItem" :data="{value: '--', unit:'V', label: '电压值'}"></infoItem>
            <infoItem class="infoItem" :data="{value: '--', unit:'A', label: '电流值'}"></infoItem>
            <infoItem class="infoItem" :data="{value: '--', unit:'mA', label: '漏电电流'}"></infoItem>
          </template></div>
          <div class="statistics"><template v-if="deviceBean.state === '1'">
            <infoItem class="infoItem" :data="{value: recloseData.hasOwnProperty('counts')?recloseData.counts:'--', unit:'次', label: '重合次数'}"></infoItem>
            <infoItem class="infoItem" :data="{value: recloseData.hasOwnProperty('h_vol')?recloseData.h_vol:'--', unit:'V', label: '过压阀值'}"></infoItem>
            <infoItem class="infoItem" :data="{value: recloseData.hasOwnProperty('l_vol')?recloseData.l_vol:'--', unit:'V', label: '低压阀值'}"></infoItem>
          </template><template v-else>
            <infoItem class="infoItem" :data="{value: '--', unit:'次', label: '重合次数'}"></infoItem>
            <infoItem class="infoItem" :data="{value: '--', unit:'V', label: '过压阀值'}"></infoItem>
            <infoItem class="infoItem" :data="{value: '--', unit:'V', label: '低压阀值'}"></infoItem>
          </template></div>
        </div>
      </div>
    </div>
    <div class="alarm_settings">
      <div class="alarm_settings_title"><span class="vertical_bar">
        <svg-icon icon-class="emphasize"></svg-icon>
      </span><span>报警设置</span></div>
      <div class="alarm_settings_content">
        <ul class="alarm_settings_detail">
          <li v-for="(item,index) in deviceBean.warn" :key="index">
            <div v-if="item.warn_type==='1'"><span style="margin-left:36px">箱门打开<span class="param_state_icon">
                <svg-icon icon-class="xiangmen"></svg-icon>
              </span></span><span v-if="deviceBean.state==='1'" @click="$emit('policeSetting',item.warn_type)">{{item.state==='1'?'已启用':'停用'}} ></span><span v-else style="cursor:not-allowed">已停用 ></span></div>
            <div v-if="item.warn_type==='2'"><span style="margin-left:36px">设备离线<span class="param_state_icon">
                <svg-icon icon-class="sheli"></svg-icon>
              </span></span><span v-if="deviceBean.state==='1'" @click="$emit('policeSetting',item.warn_type)">{{item.state==='1'?'已启用':'停用'}} ></span><span v-else style="cursor:not-allowed">已停用 ></span></div>
            <div v-if="item.warn_type==='3'"><span style="margin-left:36px">箱内温度过高<span class="param_state_icon">
                <svg-icon icon-class="wengao"></svg-icon>
              </span></span><span v-if="deviceBean.state==='1'" @click="$emit('policeSetting',item.warn_type)"> {{item.state==='1'? '温度大于' + item.val +'℃' : '停用'}} ></span><span v-else style="cursor:not-allowed">已停用 ></span></div>
          </li>
        </ul>
      </div>
    </div>

    <div class="exchange_interface">
      <div class="exchange_interface_title">
        <span class="vertical_bar">
          <svg-icon icon-class="emphasize"></svg-icon>
        </span>
        <span>端口</span>
      </div>
      <div class="exchange_interface_content">
        <ul class="interface_detail">
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="duankou" v-if="deviceBean.state==='1'&&ports[0]==='1'"></svg-icon>
              <svg-icon v-else icon-class="duankou02"></svg-icon>
            </div>
            <div class="box_box"><span>端口1</span><span>{{deviceBean.state==='1'&&ports[0]==='1'? '在线':'离线'}}</span></div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="duankou" v-if="deviceBean.state==='1'&&ports[1]==='1'"></svg-icon>
              <svg-icon v-else icon-class="duankou02"></svg-icon>
            </div>
            <div class="box_box"><span>端口2</span><span>{{deviceBean.state==='1'&&ports[1]==='1'? '在线':'离线'}}</span></div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="duankou" v-if="deviceBean.state==='1'&&ports[2]==='1'"></svg-icon>
              <svg-icon v-else icon-class="duankou02"></svg-icon>
            </div>
            <div class="box_box"><span>端口3</span><span>{{deviceBean.state==='1'&&ports[2]==='1'? '在线':'离线'}}</span></div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="duankou" v-if="deviceBean.state==='1'&&ports[3]==='1'"></svg-icon>
              <svg-icon v-else icon-class="duankou02"></svg-icon>
            </div>
            <div class="box_box"><span>端口4</span><span>{{deviceBean.state==='1'&&ports[3]==='1'? '在线':'离线'}}</span></div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="duankou" v-if="deviceBean.state==='1'&&ports[4]==='1'"></svg-icon>
              <svg-icon v-else icon-class="duankou02"></svg-icon>
            </div>
            <div class="box_box"><span>端口5</span><span>{{deviceBean.state==='1'&&ports[4]==='1'? '在线':'离线'}}</span></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="power_input_output">
      <div class="output_title"><span class="vertical_bar">
        <svg-icon icon-class="emphasize"></svg-icon>
      </span><span>插座</span></div>
      <div class="output_content">
        <ul class="output_detail">
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" v-if="deviceBean.state==='1'&&deviceBean.attr.out1==='1'&&out1==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out1" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out1')"></el-switch><span>插座1</span>
            </div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out2==='1'&&out2==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out2" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out2')"></el-switch><span>插座2</span>
            </div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out3==='1'&&out3==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out3" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out3')"></el-switch><span>插座3</span>
            </div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out4==='1'&&out4==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out4" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out4')"></el-switch><span>插座4</span>
            </div>
          </li>
        </ul>
        <ul class="output_detail">
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out5==='1'&&out5==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out5" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out5')"></el-switch><span>插座5</span>
            </div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out6==='1'&&out6==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out6" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out6')"></el-switch><span>插座6</span>
            </div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out7==='1'&&out7==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out7" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out7')"></el-switch><span>插座7</span>
            </div>
          </li>
          <li>
            <div class="exchange-icon">
              <svg-icon icon-class="dianyuan" disabled="disabled" v-if="deviceBean.state==='1'&&deviceBean.attr.out8==='1'&&out8==='1'"></svg-icon>
              <svg-icon v-else icon-class="diany"></svg-icon>
            </div>
            <div class="box_box">
              <el-switch v-if="deviceBean.state==='0'" disabled="disabled" inactive-color="#999"></el-switch>
              <el-switch v-else active-value="1" inactive-value="0" v-model="out8" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','out8')"></el-switch><span>插座8</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import SvgIcon from '_components/SvgIcon'
  import Indicator from './Indicator'
  import InfoItem from './InfoItem'
  import PageControl from './PageControl'

  export default {
    name: 'device-right',
    components: { SvgIcon, Indicator, InfoItem, PageControl },
    props: {
      deviceBean: Object,
      deviceAttr: Object,
      camerasList: Array,
      recloseData: Object,
    },
    watch: {
      deviceAttr: {
        handler:function(newValue) {
          const { ports=[], out1='', out2='', out3='', out4='', out5='', out6='', out7='', out8='' } = newValue
          this.ports = ports
          this.out1 = out1
          this.out2 = out2
          this.out3 = out3
          this.out4 = out4
          this.out5 = out5
          this.out6 = out6
          this.out7 = out7
          this.out8 = out8
        },
        deep: true
      }
    },
    data: function() {
      return{
        cameraTranslateX: 0,
        cameraScrollable: false,
        ports: [],
        out1:'',
        out2:'',
        out3:'',
        out4:'',
        out5:'',
        out6:'',
        out7:'',
        out8:'',
      }
    },
  }
</script>

<style scoped lang="stylus">


  .device_right
    width 100%

  .external_device
    background_style()
    padding 20px
    margin-bottom 10px
    .external_title
      margin-bottom 10px
      span.vertical_bar
        wh 0px 0px
        margin-right 4px
        border-right 4px solid #11CDAF
      span
        font-size 18px
        color #333

    .camera_list
      margin 20px 0
      .camera_list_left,.camera_list_right
        width 24px
        height 52px
        cursor pointer
        img
          wh 100% 100%
      .camera_list_left
        margin-right 30px
      .camera_list_right
        margin-left  30px
      .camera_list_item
        flex 0 0 25%
        .camera_list_wrapper
          padding 0 10px
          width calc(100% - 20px)
          display flex
          flex-direction column
          .external_content_box
            display: flex
            align-items center
            margin-bottom 20px
            .external_content_box_icon
              margin-right 10px
              width 60px
              height 60px
            .external_content_box_info
              flex 1
              max-width 50%
              .carame_name
                max-width 100%
                margin-bottom 10px
                color #333
                font-size 18px
              .carame_ip
                max-width 100%
                color #999999
                font-size 14px
            .external_content_box_arrow
              width 16px
              height 16px
          .camera_status
            margin-bottom 10px
            span
              font-size 16px
              color #666
          .edit_camera
            display flex
            margin-top 19px
            img
              margin-right 16px
              width 36px
              height 36px


      .ope_camera
        width 25%
        .camera_desc
          margin-top 10px
          margin-bottom 10px
          color #333
          font-size 18px
        .add_camera
          margin-bottom 10px
          span
            font-size 16px
            color #666


  .reclose_settings
    background_style()
    padding: 20px 25px 50px;
    margin-bottom 10px
    .reclose_settings_title
      margin-bottom 50px
      display flex
      align-items center
      .icon
        width: 4px
        height: 20px
        margin-right: 10px
        border-right: 0
      .title
        font-size 18px
        color #333
      .other
        width:180px;
        height:28px;
        background:rgba(240,242,242,1);
        border-radius:14px;
        padding 0 24px;
        display  flex
        align-items center
        margin-left 39px
        .split
          width:1px;
          height:14px;
          background:rgba(249,252,255,1);
          margin 0 18px

    .reclose_settings_content
      display flex
      height 135px
      .left
        flex 1
        max-width 500px
        display flex
        flex-direction column
        justify-content space-between
        .top,.bottom
          display flex
          justify-content space-between
          align-items center
          margin-bottom 50px
          .indicator
            flex 1
        .bottom
          margin-bottom 0px
      .split
        width:1px;
        height:135px;
        background:rgba(221,221,221,1);

      .right
        flex 1
        max-width 500px
        display flex
        flex-direction column
        justify-content space-between
        .info, .statistics
          display flex
          justify-content space-between
          align-items center
          .infoItem
            flex 1



  .alarm_settings
    background_style()
    mb 10
    padding: 20px;
    .alarm_settings_title
      margin-bottom 30px
      span.vertical_bar
        wh 0px 0px
        margin-right 4px
        border-right 4px solid #11CDAF
      span
        font-size 18px
        color #333
    .alarm_settings_content
      ul.alarm_settings_detail
        margin 0px
        padding 0px
        ml 15
        display flex
        flex-direction row
        flex-wrap wrap
        li
          width 320px
          margin-right 50px
          display flex
          justify-content space-between
          border-bottom 1px solid #E2E2E2
          pb 17
          mb 18
          div
            width 100%
            df 1
            fdr 1
            justify-content space-between
            span
              fc 16 #666
              &:nth-child(1)
                color #666
              &:nth-child(2)
                cursor pointer
                color #333




  .exchange_interface
    background_style()
    mb 10
    padding: 20px;
    .exchange_interface_title
      margin-bottom 30px
      span.vertical_bar
        wh 0px 0px
        margin-right 4px
        border-right 4px solid #11CDAF
      span
        font-size 18px
        color #333
    .exchange_interface_content
      ul.interface_detail
        margin 0px
        padding 0px
        margin-left 15px
        margin-bottom 30px
        display flex
        flex-direction row
        li
          width 20%
          display flex
          flex-direction row
          text-align center
          div.box_box
            display flex
            flex-direction column
            ml 16
            span
              &:nth-child(1)
                margin-top 8px
                font-size 16px
                color: #333
            span
              &:nth-child(2)
                font-size 14px
                color: #999
          .exchange-icon
            wh 60px 60px

  .power_input_output
    background_style()
    mb 10
    padding: 20px;
    .output_title
      margin-bottom 30px
      span.vertical_bar
        wh 0px 0px
        margin-right 4px
        border-right 4px solid #11CDAF
      span
        font-size 18px
        color #333
    .output_content
      ul.output_detail
        margin 0px
        padding 0px
        ml 15px
        mb 30px
        display flex
        flex-direction row
        li
          width 20%
          display flex
          flex-direction row
          text-align center
          align-items center
          div.box_box
            display flex
            flex-direction column
            ml 16
            span
              &:nth-child(2)
                font-size 14px
                color: #333
                mt 6

          .exchange-icon
            wh 60px 60px



</style>



<style lang="stylus" scoped>
  .vertical_bar
    display inline-block !important
    width: 4px !important;
    height: 20px !important;
    margin-right: 10px !important;
    border-right: 0 !important
    mr 10 !important;

  .param_state
    position relative
    .param_state_icon
      position absolute
      wh 26px 26px
      left 4px
      top 16px
    p
      ml 38

  .fun_state
    position relative
    .param_state_icon
      position absolute
      wh 26px 26px
      left 4px
      top 16px
    p
      ml 38


  ul.alarm_settings_detail
    li
      position relative
      .param_state_icon
        position absolute
        wh 26px 26px
        top: -2px;
        left: 0;

</style>
