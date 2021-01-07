<template>
  <div class="list_item" :class="item.className" @click="$emit('click')">
    <div class="text">
      {{item.text}}
    </div>
    <div class="status" v-if="showStatus">{{item.status}}</div>
    <div class="date">{{item.time}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      className: {
        type: String,
        default:  (() => ''),
      },
      showStatus: {
        type: Boolean,
        default: false,
      },
      item: {
        type: Object,
        default: (() => {})
      }
    },
    data: function() {
      return {
      }
    },
  }
</script>


<style scoped lang="stylus">

  .list_item{
    padding 8px 20px
    display  flex
    align-items center
    justify-content space-between
    color: rgba(102, 102, 102, 1);
    background:rgba(242,245,245,1);
    font-size  14px
    line-height:18px;
    margin-bottom 5px
    cursor pointer

    &.prompt {
      color: rgba(25, 204, 76, 1);
    }
    &.warn {
      color: rgba(251, 148, 0, 1);
    }
    &.question {
      color: rgba(255, 91, 103, 1);
    }
  }

  .text{
    flex 1
  }
  .status{
    margin-left 25px
  }
  .date{
    margin-left 25px
    color: rgba(102, 102, 102, 1);
  }


</style>