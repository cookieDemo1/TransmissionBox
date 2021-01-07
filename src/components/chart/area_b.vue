<template lang="pug">
  .area
    g2-area(
    v-if="isShow"
    :width="width" :height="height"
    :data="columnData"
    :is-smooth="true"
    :axis-name="{name:'名称', value:'值'}")

</template>

<script>
  import Bus from '@/bus'
  import {extra} from '_common/util'

  export default {
    data() {
      return {
        isShow: false,
        columnData: [],
        defaultData: [
          {
            name: '1951 年',
            value: 1,
          },
          {
            name: '1952 年',
            value: 4,
          },
          {
            name: '1956 年',
            value: 3,
          },
          {
            name: '1957 年',
            value: 4,
          },
          {
            name: '1958 年',
            value: 5,
          },
          {
            name: '1959 年',
            value: 4,
          },
          {
            name: '1960 年',
            value: 7,
          },
          {
            name: '1962 年',
            value: 4,
          },
        ],
        width: 0,
        height: 0,
      }
    },
    props: {
      data: Object,
    },
    mounted() {
      if (this.width) {
        this.isShow = true
      }
      Bus.$on(this.data.id, (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.columnData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          let date = new Date(item)
          if (item.length === 10) {
            item = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          } else if (item.length > 10) {
            item = extra(date.getMonth() + 1) + '.' + extra(date.getDate()) + ' ' + extra(date.getHours()) + ':' + extra(date.getMinutes()) + ':' + extra(date.getSeconds())
          }
          this.columnData.push({ name: item, value: parseInt(val.chartData.data_y[idx]) })
        })
        this.isShow = true
      })

      Bus.$on('area_b', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.columnData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          let date = new Date(item)
          if (item.length === 10) {
            item = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          } else if (item.length > 10) {
            item = extra(date.getMonth() + 1) + '.' + extra(date.getDate()) + ' ' + extra(date.getHours()) + ':' + extra(date.getMinutes()) + ':' + extra(date.getSeconds())
          }
          this.columnData.push({ name: item, value: parseInt(val.chartData.data_y[idx]) })
        })
        this.isShow = true
      })
    },
    methods: {

    },
  }
</script>