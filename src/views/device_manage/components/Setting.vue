<template lang="pug">

  .setting
    .left
      svg-icon.icon(:icon-class="icon")
      .title {{title}}
    .right
      slot(name="right")

</template>

<script>
  import SvgIcon from '_components/SvgIcon'
  export default {
    component: {SvgIcon},
    props: ['icon','title'],
  }

</script>




<style lang="stylus" scoped>

  .setting
    display flex
    align-items   center
    justify-content space-between
    /*height  39px*/
    padding-bottom 18px
    margin-bottom 18px
    border-bottom 1px solid #E2E2E2

    .left
      display flex
      align-items center

      .icon
        wh 26px 26px
      .title
        margin-left:10px
        font-size  16px
        color #666
    .right
      color #333


</style>