<template>
  <div class="page_control">
    <div class="left_arrow" @click="prevClick" v-if="showArrow">
      <slot name="left"></slot>
    </div>
    <div class="content" ref="content">
      <div class="list" ref="list" :style="{transform: 'translateX('+translateX+'px)'}">
        <slot></slot>
      </div>
    </div>
    <div class="right_arrow" @click="nextClick" v-if="showArrow">
      <slot name="right"></slot>
    </div>
  </div>

</template>
<script>
  export default {
    mounted() {
      window.addEventListener('resize', this.resetPosition)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resetPosition)
    },
    props: {
      total: {
        type: Number,
        default: () => 4,
      },
      pageSize: {
        type: Number,
        default: () => 4,
      },
    },
    watch:{
      total: function(){
        this.currentPage = 0
        this.resetPosition()
      }
    },
    data: function () {
      return {
        pageWidth: 0,
        currentPage: 0,
      }
    },
    computed: {
      pageCount: function () {
        return Math.ceil(this.total / this.pageSize)
      },
      translateX: function () {
        return -(this.currentPage * this.pageWidth)
      },
      showArrow: function () {
        return this.pageCount > 1
      },
    },
    methods: {
      resetPosition() {
        this.$nextTick(() => {
          this.pageWidth = this.$refs.list.offsetWidth
        })
      },
      prevClick() {
        if (this.currentPage > 0) {
          this.currentPage = this.currentPage - 1
        }
      },
      nextClick() {
        if (this.currentPage < this.pageCount - 1) {
          this.currentPage = this.currentPage + 1
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .page_control {
    display flex
    align-items center

    .content {
      flex 1
      overflow hidden

      .list {
        width 100%
        height 100%
        display flex
        /*align-items center*/
        transition: transform .5s ease-in-out;

      }
    }
  }
</style>


