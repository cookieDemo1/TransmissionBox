<template lang="pug">
  .column(id="bar")
</template>

<script>
  import G2 from '@antv/g2'
  import Bus from '@/bus'

  export default {
    data() {
      return {
        chart: '',
        columnData: [],
        defaultData: [
          {
            time: '09-24',
            value: 38,
          },
          {
            time: '09-23',
            value: 52,
          },
          {
            time: '09-22',
            value: 61,
          },
          {
            time: '09-21',
            value: 145,
          },
          {
            time: '09-20',
            value: 48,
          },
        ],
      }
    },
    props: { data: Object },
    methods: {
      initTable1() {
        const chart = new G2.Chart({
          container: 'bar',
          width: 324,
          height: 200,
          padding: [10, 10, 45, 40],
        })
        this.chart = chart
        // Step 2: 载入数据源
        let tmp = []
        this.data.data.forEach(function(item) {
          if (item.time.length != 5) {
            let time = item.time.slice(5)
            tmp.push({ time: time, value: item.value })
          } else {
            tmp.push({ time: item.time, value: item.value })
          }
        })
        chart.source(tmp)

        let theme = localStorage.getItem('theme')
        let axisColor = '#16CEB9'
        let barColor = '#16CEB9'
        if (theme == '2') {
          axisColor = '#787B80'
          barColor = '#1E9AFF'
        }

        chart.axis('time', {
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
        chart
          .interval()
          .position('time*value')
          .color(barColor)
        chart.render()
      },
    },
    mounted() {
      this.initTable1()
      Bus.$on('map-bar', (val) => {
        let tmp = []
        val.data.forEach(function(item) {
          if (item.time.length != 5) {
            let time = item.time.slice(5)
            tmp.push({ time: time, value: item.value })
          } else {
            tmp.push({ time: item.time, value: item.value })
          }
        })
        let theme = localStorage.getItem('theme')
        let axisColor = '#16CEB9'
        let barColor = '#16CEB9'
        if (theme == '2') {
          axisColor = '#787B80'
          barColor = '#1E9AFF'
        }

        this.chart.axis('time', {
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
        this.chart.source(tmp)
        this.chart
          .interval()
          .position('time*value')
          .color(barColor)
        this.chart.render()
      })
    },
  }
</script>
