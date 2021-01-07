<template>
  <el-button-group size="small" class="btn_group">
    <el-button v-for="(item,index) in btns"  :key="item.type" size="small" class="btn" :class="{[item.className]: true, active: index === activeIndex}" @click="btnClick(index)">
      {{item.text}}
    </el-button>
  </el-button-group>
</template>

<script>
  export  default {
    props: {
      btns: {
        type: Array,
        default: (() => [])
      },
    },
    data: function() {
      return {
        activeIndex: 0,
      }
    },
    methods: {
      btnClick(index) {
        this.activeIndex = index
        this.$emit('changeType',index)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .btn_group{
    background:rgba(240,242,242,1);
    border-radius:4px;
    .btn {
      border none
      background transparent
      &.all {
        color: rgba(102, 102, 102, 1);
      }
      &.prompt {
        color: rgba(25, 204, 76, 1);
      }
      &.warn {
        color: rgba(251, 148, 0, 1);
      }
      &.question {
        color: rgba(255, 91, 103, 1);
      }
      &.active {
        color #fff
        background: rgba(25, 204, 174, 1);
      }
    }
  }
</style>