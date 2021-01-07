<template>
  <div class="empty">
    <div class="icon">
      <svg class="ali_icon" aria-hidden="true">
        <use xlink:href="#iconEmpty_pt1"></use>
      </svg>
    </div>
    <p>{{$t('no_data')}}</p>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped lang="stylus">
  .empty
    width 100%
    height 100%
    display flex
    flex-direction column
    align-items center
    justify-content center
    .icon
      wh 100px 100px
      margin-bottom 10px
    p
      fsc 16px #999999
      margin-left -15px

</style>
