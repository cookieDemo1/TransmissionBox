<template lang="pug">
  .area(id="area")
</template>

<script>
  import G2 from '@antv/g2'
  import Bus from '@/bus'

  export default {
    data() {
      return {
        chart:'',
        data: [
          {
            name: '09-24',
            value: 38,
          },
          {
            name: '09-23',
            value: 52,
          },
          {
            name: '09-22',
            value: 61,
          },
          {
            name: '09-21',
            value: 145,
          },
          {
            name: '09-20',
            value: 48,
          },
        ],
      }
    },
    props: {},
    methods: {
      initTable1() {
        const chart = new G2.Chart({
          container: 'area',
          forceFit: true,
          width: 324,
          height: 200,
          padding: [10, 10, 45, 40],
        })
        this.chart = chart
        // Step 2: 载入数据源
        let theme = localStorage.getItem('theme')
        let axisColor = '#16CEB9'
        let barColor = '#16CEB9'
        if (theme == '2') {
          axisColor = '#787B80'
          barColor = '#1E9AFF'
        }

        chart.source(this.data)
        chart.axis('name', {
          label: {
            textStyle: {
              fill: axisColor,
            },
          },
        })
        chart.axis('value', {
          label: {
            textStyle: {
              fill: axisColor,
            },
          },

        })

        chart.line().position('name*value').color(barColor)
        chart.area().position('name*value').color(barColor)
        chart.render()
      },
    },
    mounted() {
      this.initTable1()
      Bus.$on('map-area', (val) => {
        let theme = localStorage.getItem('theme')
        let axisColor = '#16CEB9'
        let barColor = '#16CEB9'
        if (theme == '2') {
          axisColor = '#787B80'
          barColor = '#1E9AFF'
        }
        this.chart.source(this.data)
        this.chart.axis('name', {
          label: {
            textStyle: {
              fill: axisColor,
            },
          },
        })
        this.chart.axis('value', {
          label: {
            textStyle: {
              fill: axisColor,
            },
          },

        })

        this.chart.line().position('name*value').color(barColor)
        this.chart.area().position('name*value').color(barColor)
        this.chart.render()
      })
    },
  }
</script>

<style lang="stylus" scoped>
  .area
    wh 324px 200px
</style>
