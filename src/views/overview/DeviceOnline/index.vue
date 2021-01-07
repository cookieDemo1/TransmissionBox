<template>
  <div class="echarts-bar">
    <div class="title">
      <div class="icon">
        <svg-icon icon-class="emphasize"></svg-icon>
      </div><span>近7天传输箱在线率</span>
    </div>
    <div class="bar" ref="bar"></div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import {getV2Data} from '_api/data_overview'

  let myChart = null
  export default {
    data() {
      return {
        chart: null,
        provinces:[
          {name:"广东",value:[{name:"广州",value:66},{name:"深圳",value:18},{name:"珠海",value:99}]},
          {name:"海南",value:[{name:"海口",value:436},{name:"三亚",value:18},{name:"文昌",value:99}]}
        ],
        devicePoliceRank:{
        }
      }
    },
    mounted() {
      this.initData()
      window.addEventListener('resize', this.resetPosition)
      this.$nextTick(() => {
        this.resetPosition()
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resetPosition)
    },
    methods: {
      initData(){
        getV2Data('/stats/device/online_7/')
          .then((res) => {
            if(res.data.code === 200){
              this.devicePoliceRank = res.data.data   //recover
              this.setupChar()
            }else {
              this.$message.error(res.data.msg)
              this.setupChar()
            }
          }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      setupChar() {
        myChart = echarts.init(this.$refs.bar)
        // 指定图表的配置项和数据
        let option_right_bottom = {
          title: {
            text: '',
            padding: [30, 0, 0, 0],
            left: 'center',
            textStyle: {
              color: '#000000',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: 18,
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            top: '23%',
            left: '7%',
            right: '12%',
            bottom: '6%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: this.devicePoliceRank.date,
            axisTick: {
              alignWithLabel: true,
              show: false,
            },
            boundaryGap: true,

          },
          yAxis: {
            type: 'value',
            data: [0, 20, 40, 60, 80, 100],
            axisLabel: {
              //show: true,
              //interval: "auto",
              formatter: '{value}%',
            },
            axisTick: {
              alignWithLabel: true,
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
              },
            },
          },
          series: [
            {
              type: 'bar',
              barWidth: '18',
              data: this.devicePoliceRank.values,
              itemStyle: {
                color: '#8F71FF',
              },
            },
          ],
        }
        myChart.setOption(option_right_bottom)
      },
      resetPosition() {
        this.$nextTick(() => {
          if (myChart){
            myChart.resize()
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus">

  .echarts-bar
    width 100%
    height 100%
    position  relative
    background rgba(255, 255, 255, 1)
    border 1px solid rgba(125, 189, 178, 0.2)
    box-shadow 0px 0px 8px 0px rgba(125, 189, 178, 0.2)
    border-radius 4px

    .title
      margin 30px
      display flex
      .icon
        wh 4px 20px
        mr 10
      span
        fc 18 #000

    .bar
      position absolute
      left 0
      top 0
      wh 100% 100%



        
</style>
