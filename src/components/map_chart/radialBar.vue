<template lang="pug">
  .radial(id="radial")
</template>

<script>
  import G2 from '@antv/g2'
  import Bus from '@/bus'

  export default {
    data() {
      return {
        chart: '',
        defaultData: [{
          'question': '报警盒子数',
          'percent': 0.21,
          'color': '#F7517F',
        }, {
          'question': '运行中盒子数',
          'percent': 0.40,
          'color': '#19CCAE',
        }, {
          'question': '总盒子数',
          'percent': 0.49,
          'color': '#2D99FF',
        }],
      }
    },
    props: { data: Object },
    methods: {
      initTable1() {
        var chart = new G2.Chart({
          container: 'radial',
          forceFit: true,
          height: 200,
          width: 324,
          padding: ['auto', 80, 0],
        })

        this.chart = chart

        this.defaultData[2].percent = 0.8
        this.defaultData[2].count = this.data.total
        this.defaultData[1].percent = (this.data.running / this.data.total) * 0.8
        this.defaultData[1].count = this.data.running
        this.defaultData[0].percent = (this.data.warning / this.data.total) * 0.8
        this.defaultData[0].count = this.data.warning

        chart.source(this.defaultData, {
          'percent': {
            min: 0,
            max: 1,
          },
        })
        chart.tooltip({
          title: 'question',
        })
        chart.legend(false)
        chart.coord('polar', {
          innerRadius: 0.5,
        }).transpose()
        chart.interval().position('question*percent').color('color', function(val) {
          return val
        }).tooltip('count', function(val) {
          return {
            name: '数量',
            value: val,
          }
        }).shape('smooth')
        chart.render()
      },
    },
    mounted() {
      this.initTable1()
      Bus.$on('radial', (val) => {
        this.defaultData[2].percent = 0.8
        this.defaultData[2].count = val.data.total
        this.defaultData[1].percent = (val.data.running / val.data.total) * 0.8
        this.defaultData[1].count = val.data.running
        this.defaultData[0].percent = (val.data.warning / val.data.total) * 0.8
        this.defaultData[0].count = val.data.warning

        this.chart.source(this.defaultData, {
          'percent': {
            min: 0,
            max: 1,
          },
        })
        this.chart.render()
      })
    },
  }
</script>

<style lang="stylus" scoped>
  .radial
    wh 324px 200px
</style>
