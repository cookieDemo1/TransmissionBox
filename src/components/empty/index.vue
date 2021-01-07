<template>
  <div class="empty">
    <div class="content">
      <div class="icon">
        <svg class="ali_icon" aria-hidden="true">
        <use xlink:href="#iconEmpty_pt1"></use>
      </svg></div>
      <p>{{$t('no_data')}}</p>
    </div>
  </div>
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
  .empty
    width 100%
    min-height calc(100vh - 380px)
    background:rgba(249,252,255,1) !important;
    border:1px solid rgba(125, 189, 178, 0.1) !important;
    box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
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
        wh 140px 130px
        margin-bottom 24px
      p
        fsc 20px #999999


</style>
