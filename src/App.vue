<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import Bus from '@/bus'

  export default {
    data() {
      return {
        loading: false,
      }
    },
    mounted() {
      Bus.$on('UnAuthorized', () => {
        localStorage.removeItem('Authorization')
        if (this.$route.path !== '/login_signup') {
          this.$router.replace('/login_signup?isLogin=1&from=' + this.$route.fullPath)
        }
      })
    },
  }
</script>

<style lang="stylus">
  @require '~@/style/reset.styl'
  @require '~@/style/common.styl'
  @import url('//at.alicdn.com/t/font_1521771_hemi2ppkpmc.css')
</style>

<style lang="stylus" scoped>
  .app {
    width 100%
    height 100%
  }

</style>