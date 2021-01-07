<template lang="pug">
  .column(:id="id")
</template>

<script>
  import Bus from '@/bus'
  import G2 from '@antv/g2'
  export default {
    data() {
      return {
        customer_id: this.$route.query.customer_id,
        chart: null,
        id: '',
        columnData: [],
        defaultData: [
          {
            name: '1951 年',
            value: 38,
          },
          {
            name: '1952 年',
            value: 52,
          },
          {
            name: '1956 年',
            value: 61,
          },
          {
            name: '1957 年',
            value: 145,
          },
          {
            name: '1958 年',
            value: 48,
          },
          {
            name: '1959 年',
            value: 38,
          },
          {
            name: '1960 年',
            value: 38,
          },
          {
            name: '1962 年',
            value: 38,
          },
        ],
        isShow: false,
        width: 0,
        height: 0,
      }
    },
    props: {
      data: Object,
    },
    created() {
      const uuidv4 = require('uuid/v4')
      this.id = uuidv4()
    },
    mounted() {
      Bus.$on(this.data.id, (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.columnData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          this.columnData.push({ name: val.chartData.data_y[idx], value: item })
        })
        this.isShow = true
        this.drawChart(this.columnData)
      })

      Bus.$on('column_b', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.columnData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          this.columnData.push({ name: val.chartData.data_y[idx], value: item })
        })
        this.isShow = true
        this.drawChart(this.columnData)
      })
    },
    methods: {
      drawChart(data) {
        if (this.chart) {
          this.chart.destroy()
        }

        // 新建实例
        this.chart = new G2.Chart({
          container: this.id,
          forceFit: true,
          height: this.height,
          padding: [30, 'auto', 40, 'auto'],
        })
        if(this.customer_id){
          this.chart.axis('name', {
            label: {
              textStyle: {
                fill: '#fff',
              },
            },
          })
          this.chart.axis('value', {
            label: {
              textStyle: {
                fill: '#fff',
              },
            },
          })
        }
        this.chart.source(data)
        this.chart.coord().transpose()
        this.chart.interval().position('name*value').color('#19CCAE')
        this.chart.render()

        // 销毁实例
        this.$once('hook:beforeDestroy', function() {
          this.chart.destroy()
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
      // .column
      //   wh 100% 100%
</style>
