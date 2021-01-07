<template lang="pug">
  .screen
    .content
      .icon
        svg.ali_icon(aria-hidden="true")
          use(xlink:href="#iconfilter")
      p {{$t('please_select_the_filter')}}
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {

    },
    methods: {},
  }
</script>

<style scoped lang="stylus">
  .screen
    width 100%
    min-height calc(100vh - 380px)
    background #fff
    box-shadow:0px 0px 6px 0px rgba(25,204,174,0.2)!important
    border-radius:4px!important
    border:1px solid rgba(25,204,174,0.13)!important
    text-align center
    position relative
    .content
      width 200px
      height 200px
      display flex
      flex-direction column
      align-items center
      justify-content center
      position absolute
      left 50%
      top 50%
      margin-left -100px
      margin-top -100px
      .icon
        wh 126px 114px
        margin-bottom 24px
      p
        fsc 20px #999999


</style>
