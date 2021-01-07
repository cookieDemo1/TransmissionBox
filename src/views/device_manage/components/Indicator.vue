<template lang="pug">
  .indicator
    div(:class="isHorizontal?'horizontal':'vertical'")
      .circle(:class="{'normal': status === '0','danger': status === '1'}")
      .text  {{text}}
</template>

<script>
  export default {
    props: ['isHorizontal','status','text'],
    data: function() {
      return {
      }
    }
  }
</script>


<style lang="stylus" scoped>
    .vertical
      display flex
      flex-direction column
      align-items   center
      .circle
        width:12px;
        height:12px;
        border-radius:50%;
        background  #B8BAB9
        margin-bottom 10px
        &.normal
          background:rgba(25,204,174,1);
          box-shadow:0px 0px 10px 0px rgba(25,204,174,1);
        &.danger
          background:rgba(255,91,103,1);
          box-shadow:0px 0px 10px 0px rgba(255,91,103,1);
      .text
        font-size  16px
        color #333333

    .horizontal
      display flex
      align-items center

      .circle
        width:8px;
        height:8px;
        border-radius:50%;
        background  #B8BAB9
        margin-right 10px
        &.normal
          background:rgba(25,204,174,1);
          box-shadow:0px 0px 10px 0px rgba(25,204,174,1);
        &.danger
          background:rgba(255,91,103,1);
          box-shadow:0px 0px 10px 0px rgba(255,91,103,1);
      .text
        font-size  14px
        color #999999


</style>