<template lang="pug">
  .area(:id="id")

</template>

<script>
  import Bus from '@/bus'
  import { extra } from '_common/util'
  import G2 from '@antv/g2'

  export default {
    data() {
      return {
        customer_id: this.$route.query.customer_id,
        chart: null,
        id: '',
        columnData: [],
        defaultData: [{
          country: 'Asia',
          year: '1750',
          value: 502,
        }, {
          country: 'Asia',
          year: '1800',
          value: 635,
        }, {
          country: 'Asia',
          year: '1850',
          value: 809,
        }, {
          country: 'Asia',
          year: '1900',
          value: 5268,
        }, {
          country: 'Asia',
          year: '1950',
          value: 4400,
        }, {
          country: 'Asia',
          year: '1999',
          value: 3634,
        }, {
          country: 'Asia',
          year: '2050',
          value: 947,
        }, {
          country: 'Africa',
          year: '1750',
          value: 106,
        }, {
          country: 'Africa',
          year: '1800',
          value: 107,
        }, {
          country: 'Africa',
          year: '1850',
          value: 111,
        }, {
          country: 'Africa',
          year: '1900',
          value: 1766,
        }, {
          country: 'Africa',
          year: '1950',
          value: 221,
        }, {
          country: 'Africa',
          year: '1999',
          value: 767,
        }, {
          country: 'Africa',
          year: '2050',
          value: 133,
        }, {
          country: 'Europe',
          year: '1750',
          value: 163,
        }, {
          country: 'Europe',
          year: '1800',
          value: 203,
        }, {
          country: 'Europe',
          year: '1850',
          value: 276,
        }, {
          country: 'Europe',
          year: '1900',
          value: 628,
        }, {
          country: 'Europe',
          year: '1950',
          value: 547,
        }, {
          country: 'Europe',
          year: '1999',
          value: 729,
        }, {
          country: 'Europe',
          year: '2050',
          value: 408,
        }, {
          country: 'Oceania',
          year: '1750',
          value: 200,
        }, {
          country: 'Oceania',
          year: '1800',
          value: 200,
        }, {
          country: 'Oceania',
          year: '1850',
          value: 200,
        }, {
          country: 'Oceania',
          year: '1900',
          value: 460,
        }, {
          country: 'Oceania',
          year: '1950',
          value: 230,
        }, {
          country: 'Oceania',
          year: '1999',
          value: 300,
        }, {
          country: 'Oceania',
          year: '2050',
          value: 300,
        }],
        isShow: false,
      }
    },
    props: {
      data: Object,
      time_type: String,
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
        val.chartData.items.forEach((item, idx) => {
          val.chartData.data_x.forEach((item2, idx2) => {
            let date = new Date(item2)
            if (this.time_type === '2') {
              item2 = extra(date.getMonth() + 1) + '-' + extra(date.getDate())
            } else {
              item2 = extra(date.getHours()) + ':' + extra(date.getMinutes())
            }
            this.columnData.push({ year: item2, value: parseInt(val.chartData.data_y[idx][idx2]), name: item.name })
          })
        })
        this.isShow = true
        this.drawChart(this.columnData)
      })

      Bus.$on('area_b', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.columnData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.items.forEach((item, idx) => {
          val.chartData.data_x.forEach((item2, idx2) => {
            let date = new Date(item2)
            if (this.time_type === '2') {
              item2 = extra(date.getMonth() + 1) + '-' + extra(date.getDate())
            } else {
              item2 = extra(date.getHours()) + ':' + extra(date.getMinutes())
            }
            this.columnData.push({ year: item2, value: parseInt(val.chartData.data_y[idx][idx2]), name: item.name })
          })
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
          padding: [30, 0, 40, 40],
        })
        if (this.customer_id) {
          this.chart.axis('year', {
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
        console.log(data)
        this.chart.source(data)
        this.chart.tooltip({
          crosshairs: {
            type: 'line',
          },
        })
        this.chart.areaStack().position('year*value').color('name')
        this.chart.lineStack().position('year*value').color('name').size(2)
        this.chart.render()

        // 销毁实例
        this.$once('hook:beforeDestroy', function() {
          this.chart.destroy()
        })
      },
    },
  }
</script>

<style scoped lang="stylus">

</style>
