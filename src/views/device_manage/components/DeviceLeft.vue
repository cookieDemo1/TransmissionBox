<template>
  <div class="device_left">
    <div class="basic_infor">
      <div class="box_name">
        <div class="box_icon">
          <svg-icon icon-class="csx07"></svg-icon>
        </div>
        <h4>多功能传输箱</h4>
        <div class="edit_icon" style="width:22px;height:24px;padding-top:6px;padding-left:4px; cursor:pointer" @click="$emit('editDevice')">
          <svg-icon icon-class="xiugai02"></svg-icon>
        </div>
      </div>
      <div class="box_serial">
        <p>编码：{{deviceId}}</p>
      </div>
      <div class="box_name_client"><span class="name1">名称：{{deviceBean.name}}</span></div>
      <div class="box_site"><span>位置：{{deviceBean.address}}</span></div>
      <div class="box_divider">
        <el-divider></el-divider>
      </div>
      <div class="operating_button">
        <el-button type="danger" @click="$emit('deleteDevice')">移除设备</el-button>
        <el-button class="restart" type="success" @click="$emit('restartDevice')" :disabled="deviceBean.state=='0'">重启</el-button>
      </div><img class="box_state" v-if="deviceBean.state !=='1' " src="@/assets/lixian@2x.png" />
    </div>
    <div class="device_param">
      <div class="param_title"><span class="vertical_bar">
        <svg-icon icon-class="emphasize"></svg-icon>
      </span><span>设备参数</span></div>
      <div class="device_param_param">
        <div class="param_state">
          <p> 设备功率<span class="param_state_icon"><img src="@/assets/gonglv@2x.png" /></span></p>
          <p v-if="deviceBean.state=='1'">{{deviceBean.attr.pow}}W</p>
          <p v-else>--</p>
        </div>
        <div class="param_state">
          <p>箱门状态<span class="param_state_icon">
            <svg-icon icon-class="xiangmen"></svg-icon>
          </span></p>
          <el-switch v-if="deviceBean.state=='0'" disabled="disabled" inactive-color="#999"></el-switch>
          <el-switch v-else active-value="1" inactive-value="0" v-model="door" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitch1')"></el-switch>
        </div>

        <div class="param_state">
          <p>220V电压<span class="param_state_icon">
            <img src="@/assets/dianya@2x.png" />
          </span></p>
          <el-switch v-if="deviceBean.state=='0'" disabled="disabled" inactive-color="#999"></el-switch>
          <el-switch v-else active-value="1" inactive-value="0" v-model="ac220" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','ac220')"></el-switch>
        </div>
        <div class="param_state">
          <p>5V电压<span class="param_state_icon">
            <img src="@/assets/dianya@2x.png" />
          </span></p>
          <el-switch v-if="deviceBean.state=='0'" disabled="disabled" inactive-color="#999"></el-switch>
          <el-switch v-else active-value="1" inactive-value="0" v-model="dc5" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitchOut','dc5')"></el-switch>
        </div>

        <div class="param_state">
          <p>风扇1状态<span class="param_state_icon">
            <svg-icon icon-class="fengshan"></svg-icon>
          </span></p>
          <el-switch v-if="deviceBean.state=='0'" disabled="disabled" inactive-color="#999"></el-switch>
          <el-switch v-else active-value="1" inactive-value="0" v-model="fan1" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitch2')"></el-switch>
        </div>
        <div class="param_state">
          <p> 风扇2状态<span class="param_state_icon">
            <svg-icon icon-class="fengshan"></svg-icon>
          </span></p>
          <el-switch v-if="deviceBean.state=='0'" disabled="disabled" inactive-color="#999"></el-switch>
          <el-switch v-else active-value="1" inactive-value="0" v-model="fan2" active-color="#11CD4A" inactive-color="#999" @change="$emit('changeSwitch3')"></el-switch>
        </div>
        <div class="param_state">
          <p> 箱内LED灯<span class="param_state_icon">
            <svg-icon icon-class="led"></svg-icon>
          </span></p>
          <p>{{deviceBean.state=='1'&&deviceBean.attr.led=='1'?'开':'关'}}</p>
        </div>
        <div class="param_state">
          <p>箱内温湿度<span class="param_state_icon">
            <svg-icon icon-class="wenshi"></svg-icon>
          </span></p>
          <p v-if="deviceBean.state=='1'">{{deviceBean.attr.temp}}℃ | {{deviceBean.attr.hum}}%</p>
          <p v-else>-- | --</p>
        </div>
      </div>
    </div>
    <div class="scene_function">
      <div class="function_title"><span class="vertical_bar">
        <svg-icon icon-class="emphasize"></svg-icon>
      </span><span>场景功能</span></div>
      <div class="scene_function_function">
        <div class="fun_state">
          <p>自动降温<span class="param_state_icon">
            <svg-icon icon-class="zidong"></svg-icon>
          </span></p>
          <p v-if="deviceBean.state=='1'">温度大于30℃</p>
          <p v-else>--</p>
        </div>
        <div class="fun_state" style="    border-bottom: 1px solid #F9FCFF;">
          <p>自动除尘<span class="param_state_icon">
            <svg-icon icon-class="zidong"></svg-icon>
          </span></p>
          <p v-if="deviceBean.state=='1'">30天1次</p>
          <p v-else>--</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SvgIcon from '_components/SvgIcon'

  export default {
    name: 'device-left',
    components: { SvgIcon },
    props: {
      deviceId: String,
      deviceBean: Object,
      deviceAttr: Object,
    },
    watch: {
      deviceAttr: {
        handler: function(newValue) {
          const { door = '', ac220 = '', dc5 = '', fan1 = '', fan2 = ''} = newValue
          this.door = door
          this.ac220 = ac220
          this.dc5 = dc5
          this.fan1 = fan1
          this.fan2 = fan2
        },
        deep: true,
      },
    },
    data: function() {
      return {
        door: '',
        ac220: '',
        dc5: '',
        fan1: '',
        fan2: '',
      }
    },
  }

</script>


<style lang="stylus">
  .device_left
    width 100%
    border-radius: 0px;
    overflow hidden

  .basic_infor
    background_style()
    position relative
    display flex
    flex-direction column
    padding 0 15px
    .box_state
      position absolute
      top 0
      right 0
      width 60px
      height 60px
    .box_name
      display flex
      align-items center
      mt 30
      mb 14
      margin-bottom 8px
      .box_icon
        wh 50px 50px
      h4
        color #333
        font-size 22px
        font-family: Microsoft YaHei;
        margin-left 13px
        margin-right 13px

      .box_name_write
        wh 18px 18px

    .box_serial
      ml 63
      p
        font-size 12px
        color #666
        margin-bottom 14px

    .box_name_client
      ml 63
      margin-bottom 14px
      span
        font-size 14px
        color #666
      span.name1
        margin-right 30px

    .box_site
      ml 63
      span
        font-size 14px
        color #666
        text-align left

    .box_divider
      .el-divider
        background: rgba(221, 221, 221, 1);

    .operating_button
      mb 24
      width 100%
      mt 0
      display flex
      justify-content space-between
      button
        display inline-block
        flex 1
        border-radius 4px !important
        height: 44px;
        background: rgba(255, 91, 103, 1);
        box-shadow: 0px 2px 6px 0px rgba(255, 91, 103, 0.5);
      .restart
        background: #1E9AFF !important;
        border-color: #1E9AFF !important;
        box-shadow: 0px 2px 6px 0px rgba(30, 154, 255, 0.5);




  .device_param
    background_style()
    mt 20
    mb 16
    padding 0 15px
    .param_title
      margin-top 20px
      span.vertical_bar
        wh 0px 0px
        margin-right 4px
        border-right 4px solid #11CDAF
      span
        font-size 18px
        color #333
    .device_param_param
      margin-right 8px
      margin-left 8px
      .param_state
        display flex
        flex-direction: row
        align-items center
        height 58px
        justify-content: space-between
        border-bottom 1px solid #E6E6E6
        &:last-child
          border-bottom none
        p
          font-size 16px
          color #333

  .scene_function
    background_style()
    padding 0 15px
    .function_title
      margin-top 20px
      span.vertical_bar
        wh 0px 0px
        margin-right 4px
        border-right 4px solid #11CDAF
      span
        font-size 18px
        color #333
    .scene_function_function
      margin-right 8px
      margin-left 8px
      .fun_state
        display flex
        flex-direction: row
        align-items center
        height 58px
        justify-content: space-between
        border-bottom 1px solid #E6E6E6
        p
          font-size 16px
          color #333
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


</style>
