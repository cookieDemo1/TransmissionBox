<template>
  <div class="form_with_hint">
    <div class="form" >
      <slot name="form"></slot>
    </div>
    <div class="hint">
      <div class="title">
        友情提示
      </div>
      <slot name="hint"></slot>
    </div>
  </div>
</template>

<script>
    export default {
      data: function() {
        return {
        }
      }

    }
</script>

<style scoped lang="stylus">

  .form_with_hint{
    display flex
  }

  .form{
    padding 40px
    flex 1
    box-shadow:0px 0px 10px 0px rgba(125,189,178,0.32);
  }

  .hint{
    padding 40px
    width 260px

    .title {
      color #1E9AFF
      font-size 16px
      margin-bottom  30px
    }
  }


</style>


<!--width:580px;-->
<!--height:604px;-->
<!--background:rgba(255,255,255,1);-->
<!--box-shadow:0px 0px 10px 0px rgba(125,189,178,0.32);-->
<!--border-radius:8px;-->