<template>
  <div class="layouts_container">
    <div class="left_menu" :class="{'unfold':!isShow}">
      <el-menu class="el-menu-vertical" v-if="loadFinished" :default-active="$route.path" router="router" collapse-transition="collapse-transition">
        <el-menu-item class="layout-logo"><img src="./LOGO01.png" v-if="isShow" /></el-menu-item>
        <el-menu-item index="/overview" :collapse="true" v-if="getShowState('1')">
          <div class="icon">
            <svg-icon icon-class="jiankong"></svg-icon>
          </div><span slot="title" v-if="isShow">设备总览</span>
        </el-menu-item>
        <el-menu-item index="/device/manage" v-if="getShowState('2')">
          <div class="icon">
            <svg-icon icon-class="shebei"></svg-icon>
          </div><span slot="title" v-if="isShow">{{$t('device_management')}}</span>
        </el-menu-item>
        <el-menu-item index="/police/manage" v-if="getShowState('4')">
          <div class="icon">
            <svg-icon icon-class="baojin"></svg-icon>
          </div><span slot="title" v-if="isShow">{{$t('alarm_management')}}</span>
        </el-menu-item>
        <el-menu-item index="/authority_manage" v-if="getShowState('5')">
          <div class="icon">
            <svg-icon icon-class="quanxian"></svg-icon>
          </div><span slot="title" v-if="isShow">{{$t('authority_management')}}</span>
        </el-menu-item>
        <el-menu-item index="/log_manage" v-if="getShowState('6')">
          <div class="icon">
            <svg-icon icon-class="caozuo"></svg-icon>
          </div><span slot="title" v-if="isShow">{{$t('operation_log')}}</span>
        </el-menu-item>
        <el-menu-item index="/log_system" v-if="getShowState('7')">
          <div class="icon">
            <svg-icon icon-class="xitong"></svg-icon>
          </div><span slot="title" v-if="isShow">{{$t('system_log')}}</span>
        </el-menu-item>
        <el-menu-item index="/firmware_upgrade" v-if="getShowState('8')">
          <div class="icon">
            <svg-icon icon-class="gujian"></svg-icon>
          </div><span slot="title" v-if="isShow">固件管理</span>
        </el-menu-item>
        <div class="collapse_item" :class="{'collapse':!isShow}" @click="triggle" ref="collapse_item">
          <div class="icon_collapse" style="margin-right: 4px;" ref="zhankai">
            <i class="el-icon-caret-left"></i>
          </div>
          <span ref="shouqi">收起侧边栏</span>
        </div>
      </el-menu>
    </div>
    <div class="right_content">
      <Header class="header"></Header>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import SvgIcon from '_components/SvgIcon'
  import Header from '_components/header'
  import {getMenuRights } from '_api/login_signup'
  import Bus from '@/bus'
  export default {
    components: {
      Header,
      SvgIcon
    },
    data() {
      return {
        tabIndex: 1,
        isShow: true,
        menuItemWidth: 30,
        menuRights: [],
        loadFinished: false,
      }
    },
    created() {
      this.toGetMenusRights()
    },
    methods: {
      toGetMenusRights() {
        getMenuRights().then((res) => {
          this.loadFinished = true
          if(res.data.code === 200) {
            this.menuRights = res.data.data
            if (!this.$route.fullPath) {
              this.$router.replace(this.getLoginJumpRoute())
            }
          }
        }).catch(error => {
          this.loadFinished = true
        })
      },
      getLoginJumpRoute() {
        if (this.menuRights.length) {
          let firstMenu = this.menuRights[0]
          let routeUrl = ''
          switch (firstMenu) {
            case '0':
            case '1':
              routeUrl = '/overview'
              break;
            case '2':
              routeUrl ='/device/manage'
              break;
            case '3':
            case '4':
              routeUrl ='/police/manage'
              break;
            case '6':
              routeUrl ='/log_manage'
              break;
            case '7':
              routeUrl ='/log_system'
              break;
            case '8':
              routeUrl ='/firmware_upgrade'
              break;
          }
          return routeUrl
        }else {
          return ''
        }
      },
      triggle() {
        this.isShow = !this.isShow
        if(this.isShow) {
          this.$refs.zhankai.style.transform = 'rotate(0deg)'
          this.$refs.zhankai.style.transition = '1s'
          this.$refs.shouqi.innerHTML='收起侧边栏'
          this.$refs.collapse_item.style.width=''
          this.$refs.collapse_item.style.height=''
          this.$refs.collapse_item.style.marginLeft=39+"px"

        } else {
          this.$refs.zhankai.style.transform = 'rotate(-180deg)'
          this.$refs.zhankai.style.transition = '1s'
          this.$refs.shouqi.innerHTML=''
          this.$refs.collapse_item.style.width=24+"px"
          this.$refs.collapse_item.style.height=32+"px"
          this.$refs.collapse_item.style.marginLeft=18+"px"
        }
        Bus.$emit('showCityName',this.isShow );
      },
      getShowState(val) {
        if(this.menuRights.length) {
          if(this.menuRights.includes(val) || this.menuRights.includes('99')){
            return true
          }
        }
        return false
      },
    },
  }
</script>


<style lang="stylus" scoped>

  .layouts_container{
    width 100%
    display: flex;
    flex-direction row
    background #F3F6F2
  }

  .left_menu{
    width  175px
    min-width 175px
    background #2E4266 !important
    &.unfold{
      width 60px
      min-width 60px
    }
  }

  .right_content{
    flex  1
    min-width 1191px
    .header{
      width  100%
    }
    .content{
      width 100%
      padding 25px
    }
  }

  .layout-logo{
    height 70px !important
    display flex !important
    align-items center !important
    &:focus,&:hover{
      cursor: default;
      background: #2E4266 !important;
    }
  }

  .el-menu-vertical
    width 100%
    height 100vh
    background #2E4266 !important
    display flex
    flex-direction column
    box-sizing: border-box;
    .el-menu-item
      display flex
      flex-direction row
      align-items center
      justify-content center
      font-size 16px
      padding-left 0 !important
      padding 0
      .icon
        display flex
        wh 18px 18px
        color  #999EAF
      span
        color  #999EAF
        margin-left 12px
        margin-right 0px !important
      &:focus, &:hover {
        fill  #1E9AFF
        color  #1E9AFF!important
        background:rgba(38,55,84,1) !important;
      }

      &.is-active {
        color: #1E9AFF!important;
        border-left: 3px solid #1E9AFF;
        background:rgba(38,55,84,1);
        box-sizing: border-box;
        position: relative;
        span, .icon{
          color: #1E9AFF!important;
        }
      }
    .collapse_item
      overflow hidden
      display flex
      flex-direction row
      align-items center
      justify-content center
      margin-left 39px
      margin-top 8px
      wh 96px 32px
      cursor pointer
      color #fff
      border:1px solid #fff;
      border-radius:4px;
      &.collapse
        width 54px
        margin-left 6px
      .icon_collapse
        display flex
        wh 18px 18px
      span
        font-size 12px
        line-height 40px

</style>

