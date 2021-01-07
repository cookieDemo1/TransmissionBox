<template lang="pug">
  .pie(:id='id')
    //- g2-pie(
    //- v-if="isShow"
    //- :width="width" :height="height"
    //- :type="'pie'"
    //- :data="pieData"
    //- :axis-name="{name:'设备', value:'参数值'}")
    //- g2-pie(
    //-   :type="'pie'" :axis-name="{name:'年份', value:'GDP(亿美元)'}"
    //-   :data="[{ name: '2016', value: 2 },{ name: '2017', value: 1 },{ name: '2018', value: 3 }]")
</template>

<script>
  import Bus from '@/bus'
  import { extra } from '_common/util'
  import G2 from '@antv/g2'
  import DataSet from '@antv/data-set'
  import { percentFormat } from '_common/util'

  export default {
    data() {
      return {
        customer_id: this.$route.query.customer_id,
        chart: null,
        id: '',
        pieData: [],
        firstName: '',
        secordName: '',
        defaultData: [
          {
            time: '10:10',
            waiting: 2,
            people: 2,
          },
          {
            time: '10:15',
            waiting: 6,
            people: 3,
          },
          {
            time: '10:20',
            waiting: 2,
            people: 5,
          },
          {
            time: '10:25',
            waiting: 9,
            people: 1,
          },
          {
            time: '10:30',
            waiting: 2,
            people: 3,
          },
          {
            time: '10:35',
            waiting: 2,
            people: 1,
          },
          {
            time: '10:40',
            waiting: 1,
            people: 2,
          },
        ],
        isShow: false,
        // width: 0,
        // height: 0,
      }
    },
    props: {
      data: Object,
      // height: {
      //   type: Number,
      //   default: 300,
      // },
      colorMap: {
        type: Array,
        default: () => {
          return G2.Global.colors_pie_16
        },
      },
      // 坐标轴名称
      axisName: {
        type: Object,
        default: () => {
          return {
            name: 'name',
            value: 'value',
          }
        },
      },
      // 辅助元素内容
      guide: {
        type: Object,
        default: () => {
          return {}
        },
      },
      useTooltip: {
        type: Boolean,
        default: true,
      },
      // 图例配置
      legendOption: {
        type: Object,
        default: () => {
          return {
            show: true,
            position: 'bottom-center',
          }
        },
      },
      labelOption: {
        type: Object,
        default: () => {
          return {
            show: false,
            offset: 20,
          }
        },
      },
      // 图表类型 ring pie nightingale
      type: {
        type: String,
        default: 'pie',
      },
      innerRadius: {
        type: Number,
        default: null,
      },
      // 内边距
      padding: {
        type: Array,
        default: function() {
          return [40,40]
        },
      },
    },
    // watch: {
    //   // 监控data，当发生变化时，重新绘制图表
    //   pieData: function(val, oldVal) {
    //     this.drawChart(val)
    //   },
    // },
    created() {
      const uuidv4 = require('uuid/v4')
      this.id = uuidv4()
    },
    mounted() {
      Bus.$on(this.data.id, (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.pieData = this.defaultData
          this.isShow = true
          return
        }
        let arr = []
        let obj = {}
        this.firstName = val.chartData.items[0].name
        this.secordName = val.chartData.items[1].name
        val.chartData.data_x.forEach((item, idx) => {
          obj = {}
          let date = new Date(item)
          if (item.length === 10) {
            item = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          } else if (item.length > 10) {
            item = extra(date.getHours()) + ':' + extra(date.getMinutes())
          }
          // item = extra(date.getMonth() + 1) + '' + extra(date.getDate())
          obj[val.chartData.items[0].name] = val.chartData.data_y[0][idx]
          obj[val.chartData.items[1].name] = val.chartData.data_y[1][idx]
          obj['time'] = item
          // arr.push({
          //   time: item,
          //   firstName: val.chartData.data_y[0][idx],
          //   secordName: val.chartData.data_y[1][idx],
          // })
          arr.push(obj)
        })
        this.pieData = arr

        this.drawChart(this.pieData)
      })
    },
    methods: {
      drawChart(data) {
        // 如果图形存在则销毁后再创建
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
          this.chart.axis('time', {
            label: {
              textStyle: {
                fill: '#fff',
              },
            },
          })
          this.chart.axis(this.firstName, {
            label: {
              textStyle: {
                fill: '#fff',
              },
            },
          })
          this.chart.axis(this.secordName, {
            label: {
              textStyle: {
                fill: '#fff',
              },
            },
          })
        }
        this.chart.source(data)
        this.chart.legend({
          custom: true,
          allowAllCanceled: true,
          items: [
            {
              value: this.firstName,
              marker: {
                symbol: 'square',
                fill: '#19CCAE',
                radius: 5,
              },
            },
            {
              value: this.secordName,
              marker: {
                symbol: 'hyphen',
                stroke: '#AC6CFF',
                radius: 5,
                lineWidth: 3,
              },
            },
          ],
        })
        this.chart.axis(this.secordName, {
          grid: null,
          label: {
            textStyle: {
              fill: '#AC6CFF',
            },
          },
        })
        this.chart
          .interval()
          .position(`time*${this.firstName}`)
          .color('#19CCAE')
        this.chart
          .line()
          .position(`time*${this.secordName}`)
          .color('#AC6CFF')
          .size(3)
          .shape('smooth')
        this.chart
          .point()
          .position(`time*${this.secordName}`)
          .color('#AC6CFF')
          .size(3)
          .shape('circle')
        this.chart.render()

        //销毁实例
        this.$once('hook:beforeDestroy', function() {
          this.chart.destroy()
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
                                                                    // .pie
                                                                    //   wh 100% 100%
</style>
