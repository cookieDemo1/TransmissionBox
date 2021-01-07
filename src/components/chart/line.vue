<template lang="pug">
  .line(:id="id")
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
        lineData: [],
        lineDatas: [
          { name: '1997', value: 86085, type: 'America' },
          { name: '2007', value: 144776, type: 'America' },
          { name: '2017', value: 193868, type: 'America' },
          { name: '1997', value: 9616, type: 'China' },
          { name: '2007', value: 35715, type: 'China' },
          { name: '2017', value: 122503, type: 'China' },
          { name: '1997', value: 44122, type: 'Japan' },
          { name: '2007', value: 45153, type: 'Japan' },
          { name: '2017', value: 48675, type: 'Japan' },
          { name: '1997', value: 22159, type: 'Germany' },
          { name: '2007', value: 34447, type: 'Germany' },
          { name: '2017', value: 36865, type: 'Germany' },
        ],
        isShow: false,
        width: 0,
        height: 0,
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
          this.lineData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          let date = new Date(item)
          if (this.time_type === '2') {
            item = extra(date.getMonth() + 1) + '-' + extra(date.getDate())
          } else {
            item = extra(date.getHours()) + ':' + extra(date.getMinutes())
          }
          // if (item.length === 10) {
          //   item = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          // } else if (item.length > 10) {
          //   item = extra(date.getHours()) + ':' + extra(date.getMinutes())
          // }
          val.chartData.data_y.forEach((items, idxs) => {
            this.lineData.push({
              name: item,
              value: val.chartData.data_y[idxs][idx],
              type: val.chartData.items[idxs].name,
            })
          })
        })
        this.isShow = true
        this.drawChart(this.lineData)
      })

      Bus.$on('line', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.lineData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          let date = new Date(item)
          if (this.time_type === '2') {
            item = extra(date.getMonth() + 1) + '-' + extra(date.getDate())
          } else {
            item = extra(date.getHours()) + ':' + extra(date.getMinutes())
          }
          // if (item.length === 10) {
          //   item = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          // } else if (item.length > 10) {
          //   item = extra(date.getHours()) + ':' + extra(date.getMinutes())
          // }
          val.chartData.data_y.forEach((items, idxs) => {
            this.lineData.push({
              name: item,
              value: val.chartData.data_y[idxs][idx],
              type: val.chartData.items[idxs].name,
            })
          })
        })
        this.isShow = true
        this.drawChart(this.lineData)
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
        this.chart.tooltip({
          crosshairs: {
            type: 'line',
          },
        })
        this.chart.line().position('name*value').color('#19CCAE')
        this.chart.point().position('name*value').size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        }).color('#19CCAE')
        this.chart.render()

        // 销毁实例
        this.$once('hook:beforeDestroy', function() {
          this.chart.destroy()
        })
      },
    },
  }
</script>
