<template lang="pug">

  .infoItem
    .value
      .num {{data.value}}
      .unit {{data.unit}}
    .label {{data.label}}

</template>
<script>
  export default {
    props: ['data']
  }
</script>

<style lang="stylus" scoped>

  .infoItem
    display flex
    flex-direction column
    align-items center
    .value
      display flex
      align-items flex-end

      .num
        line-height 24px
        font-size 24px
        font-weight:bold;
        color #333333
      .unit
        line-height 20px
        margin-left 5px
        font-size 14px
        color #333333
    .label
      margin-top 8px
      font-size 14px
      color #999999
</style>