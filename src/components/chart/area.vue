<template lang="pug">
  .area
    g2-area(
    :data="areaData"
    :is-smooth="true"
    :axis-name="{name:'时间', value:'值'}")

</template>

<script>
  import { extra } from '_common/util'

  export default {
    data() {
      return {
        isShow: false,
        areaData: [],
        defaultData: [
          {
            name: '1951 年',
            value: 4,
          },
          {
            name: '1952 年',
            value: 4,
          },
          {
            name: '1956 年',
            value: 4,
          },
          {
            name: '1957 年',
            value: 4,
          },
          {
            name: '1958 年',
            value: 4,
          },
          {
            name: '1959 年',
            value: 4,
          },
          {
            name: '1960 年',
            value: 4,
          },
          {
            name: '1962 年',
            value: 4,
          },
        ],
      }
    },
    props: {
      chartData: Array,
    },
    mounted() {
      this.areaData = []
      if(this.chartData.length){
        this.chartData.forEach((item) => {
          let date = new Date(item.time)
          if (item.time.length === 10) {
            item.time = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          } else if (item.time.length > 10) {
            item.time =extra(date.getMonth() + 1) + '.' + extra(date.getDate()) + ' ' + extra(date.getHours()) + ':' + extra(date.getMinutes()) + ':' + extra(date.getSeconds())
          }
          this.areaData.push({
            name: item.time,
            value: parseInt(item.value),
          })
        })
      }
    },
    methods: {

    },
  }
</script>

<style scoped lang="stylus">
  .area
    padding 40px
    border 1px solid rgba(25, 204, 174, 0.13)
    box-shadow 0px 0px 6px 0px rgba(25, 204, 174, 0.2)
    border-radius 4px
    margin-bottom 10px
</style>
