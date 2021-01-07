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
  import G2 from '@antv/g2'
  import DataSet from '@antv/data-set'
  import { percentFormat } from '_common/util'

  export default {
    data() {
      return {
        chart: null,
        id: '',
        pieData: [
          { name: '2016', value: 2 },
          { name: '2017', value: 1 },
          { name: '2018', value: 3 },
        ],
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
          return ['auto', 'auto']
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
        console.log(this.width, this.height)
        if (!val.chartData) {
          this.pieData = this.defaultData
          this.isShow = true
          return
        }
        let arr = []
        val.chartData.data_y.forEach((item, idx) => {
          arr.push({ name: item, value: val.chartData.data_x[idx] })
        })
        this.pieData = arr
        this.drawChart(this.pieData)
      })
    },
    methods: {
      drawChart: function(data) {
        // 如果图形存在则销毁后再创建
        if (this.chart) {
          this.chart.destroy()
        }

        // 新建实例
        this.chart = new G2.Chart({
          container: this.id,
          forceFit: true,
          height: this.height,
          padding: ['auto', 'auto'],
        })

        // 生成占比数据percent
        const ds = new DataSet()
        const dv = ds
          .createView()
          .source(data)
          .transform({
            type: 'percent',
            field: 'value',
            dimension: 'name',
            as: 'percent',
          })


        // 设置数据的显示别名并格式化数据
        let _this = this
        let scaleConfig = (function() {
          let obj = {}
          for (const key in _this.axisName) {
            if (_this.axisName.hasOwnProperty(key)) {
              obj[key] = {}
              obj[key]['alias'] = _this.axisName[key]
            }
          }
          return obj
        })()
        scaleConfig.percent = {}
        scaleConfig.percent = {
          alias: '占比',
          formatter: (val) => {
            return percentFormat(val)
          },
        }
        // 为 chart 装载数据
        this.chart.source(dv, scaleConfig)

        if (this.guide.name || this.guide.value) {
          this.chart.guide().html({
            position: ['50%', '50%'],
            html: `<div style="text-align: center;width: 10em;">
                                        <span style="color:rgba(0,0,0,0.65);font-size:${this
              .height / 15}px">${
              this.guide.name ? this.guide.name : ''
              }</span><br>
                                        <span style="color:#000000;font-size:${this
              .height / 10}px">${
              this.guide.value ? this.guide.value : ''
              }</span>
                                      </div>`,
            alignX: 'middle',
            alignY: 'middle',
          })
        }

        let interval = ''
        // 根据图表类型(ring,pie,nightingale)选择不同的坐标系(theta,polar)以及设置内半径
        if (this.type === 'ring') {
          this.chart.coord('theta', {
            innerRadius: this.innerRadius === null ? 0.75 : this.innerRadius,
          })
          interval = this.chart.intervalStack().position('value')
        } else if (this.type === 'pie') {
          this.chart.coord('theta', {
            radius: 0.9,
          })
          interval = this.chart.intervalStack().position('value')
        } else if (this.type === 'nightingale') {
          this.chart.coord('polar', {
            innerRadius: this.innerRadius === null ? 0.2 : this.innerRadius,
          })
          interval = this.chart.interval().position('name*value')
        } else if (this.type === 'mountNode') {
          this.chart.coord('theta', {
            startAngle: Math.PI, // 起始角度
            endAngle: Math.PI * (3 / 2), // 结束角度
            radius: 0.9,
          })
          interval = this.chart.intervalStack().position('value')
        }
        // 关闭坐标轴
        this.chart.axis(false)

        // 配置颜色
        let colors = ['#1890ff', '#50CB74', '#f04864', '#AC6CFF', '#FBD444', '#063d8a', '#1770d6', '#47abfc', '#38c060']
        interval.color('name', colors).style({
          lineWidth: 1,
        })

        //  是否使用tooltip
        if (this.useTooltip) {
          // 配置 tooltip
          this.chart.tooltip({
            showTitle: false,
          })
          interval.tooltip('name*value*percent')
        } else {
          this.chart.tooltip(false)
        }

        // 配置文本
        if (this.labelOption.show) {
          interval.label('percent', {
            offset: this.labelOption.offset,
            formatter: function formatter(val, item) {
              return item.point.name + ': ' + val
            },
          })
        }
        // 配置图例
        if (this.legendOption.show) {
          this.chart.legend('name', {
            position: this.legendOption.position,
          })
        } else {
          this.chart.legend(false)
        }

        // 渲染
        this.chart.render()

        // 注册点击事件
        this.chart.on('interval:click', (ev) => {
          const data = ev.data._origin
          _this.$emit('itemClick', data)
        })

        // 销毁实例
        this.$once('hook:beforeDestroy', function() {
          this.chart.destroy()
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
   .pie
     wh 100% 100%
</style>
