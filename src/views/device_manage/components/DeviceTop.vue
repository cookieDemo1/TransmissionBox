<template>
  <div class="detail_top">
    <el-button type="primary addbtn" @click="$emit('addNewDevice')">新增设备</el-button>
    <div class="column_line"></div>
    <page-control class="device_list" :total="deviceList.length" :page-size="6">
      <template v-slot:left>
        <div class="device_list_left">
          <div class="device_list_left">
            <i class="el-icon-arrow-left pre"></i>
          </div>
        </div>
      </template>
      <template v-slot:default>
        <div v-for="(item ,index) in deviceList" :key="index" class="device_list_item" >
          <el-button class="device_list_item_content" type="primary" :class="{'currentColor':currentIndex==index}" @click="$emit('toDeviceDetail',item.id,index)">
            {{item.name}}
            <div class="dot" :style="{background:(item.state==1?'#15C4AD':'#B8BAB9')}"></div>
          </el-button>
        </div>
      </template>
      <template v-slot:right>
        <div class="device_list_right">
          <i class="el-icon-arrow-right next"></i>
        </div>
      </template>
    </page-control>

  </div>
</template>

<script>
  import PageControl from './PageControl'
  export  default {
    name: 'device-top',
    components: { PageControl },
    props: {
      deviceList: Array,
      currentIndex: Number,
    },
    data: function() {
      return {
        deviceTranslateX: 0,
        deviceScrollable: false,
      }
    },
  }
</script>

<style scoped lang="stylus">
  .detail_top
    mb 12
    display flex
    flex-direction row
    align-items center

  .addbtn
    wh 130px 50px
    font-size  16px
    color  white

  .column_line
    width:2px;
    height:32px;
    background:rgba(0,0,0,1);
    opacity:0.05;
    border-radius:1px;
    mr 20
    ml 20


  .device_list
    overflow hidden
    position relative
    flex 1

    .device_list_left,.device_list_right
      width:24px;
      height:50px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(125, 189, 178, 0.1);
      box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2);
      border-radius:4px;
      display flex
      align-items center
      justify-content center
      cursor pointer

    .device_list_left
      margin-right 15px

    .device_list_item
      width calc(16.66% - 15px)
      min-width calc(16.66% - 15px)
      margin-right  15px
      height 50px
      background white
      .device_list_item_content
        wh 100% 100%
        position relative
        font-size  16px
        background:rgba(255,255,255,1) !important;
        border:1px solid rgba(125, 189, 178, 0.1)!important;
        box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2)!important;
        border-radius:4px;
        color #000000
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;

        .dot
          position absolute
          right 8px
          top 8px
          width:8px;
          height:8px;
          background:rgba(25,204,174,1)
          border-radius:50%

        &.currentColor
          background-color: #DAE6E2 !important;

</style>