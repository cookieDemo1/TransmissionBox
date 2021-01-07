<template>
  <div class="echarts-bar">
    <div class="title">
      <div class="icon">
        <svg-icon icon-class="emphasize"></svg-icon>
      </div>
      <span>传输箱数量概览</span>
    </div>
    <div class="bar" ref="bar">
    </div>
    <div class="sum">
      <div class="sum_item"><span style="color:#1E9AFF">{{liquid.total}} </span><span>总共</span></div>
      <div class="sum_item"><span style="color:#19CCAE">{{liquid.online}}</span><span>在线</span></div>
      <div class="sum_item"><span style="color:#6C768D">{{liquid.offline}}</span><span>离线</span></div>
    </div>
    <div class="dot">
      <div><span style="background:#11CD4A"></span><span>正常</span></div>
      <div><span style="background:#FB9500"></span><span>预警</span></div>
      <div><span style="background:#FF5A67"></span><span>故障</span></div>
    </div>
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
          liquid:0.8,
        };
      },
      mounted() {
        this.initData();
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
          getV2Data('/header/boxs/')
            .then((res) => {
              if(res.data.code === 200){
                this.liquid = res.data.data
                this.setupChar();
              }else {
                this.$message.error(res.data.msg)
                this.setupChar()
              }
            }).catch(() => {
            this.$message.error(this.$t('data_acquisition_failed'))
          })
        },
        setupChar() {
          // 11CD4A FB9500 FF5A67
          myChart = echarts.init(this.$refs.bar);
          let currentBg ="";
          if ((this.liquid.online/this.liquid.total) < 0.5){ //online: 0, offline: 3, total: 3
            currentBg = '#FF5A67'
          }else if ((this.liquid.online/this.liquid.total) >=0.5 && (this.liquid.online/this.liquid.total) <0.7){
            currentBg = '#FB9500'
          }else{
            currentBg = '#11CD4A'
          }
          let option = {
            title: {
                text: '',
                padding:[20,0,0,0],
                left:'center',
                textStyle:{
                  color:'#000000',
                  fontStyle:'normal',
                  fontWeight:'400',
                  fontSize:18
                },
            },
            series: [{
                type: 'liquidFill',
                data: [
                  {
                    value: ((this.liquid.online/this.liquid.total)),
                    direction: 'left',
                    itemStyle: {
                        color: currentBg
                    }
                  }
                ],
                backgroundStyle: {
                  color: '#ffffff'
                },
                outline: {
                    itemStyle: {
                        borderWidth: 5,
                        borderColor: currentBg,
                    }
                },
                label: {
                    //formatter: '{c}',
                    fontSize: 20,
                    color:'#000'
                }
            }]
          }
          myChart.setOption(option);
        },
        resetPosition() {
          this.$nextTick(() => {
            if (myChart){
              myChart.resize()
            }
          })
        },
      },
    };
</script>

<style scoped lang="stylus">
  .echarts-bar
    width 100%
    height 100%
    margin-bottom 20px
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

    .sum
      position absolute
      left 0
      right 0
      bottom 0
      display flex
      justify-content center
      align-items center
      .sum_item{
        display flex
        flex-direction column
        align-items center
        padding 20px
        span{
          font-size 12px
          color #333
          &:nth-child(1){
            font-size  20px
            display:block
          }
        }
      }


    .dot
      position absolute
      bottom 120px
      right 29px
      div
        mb 16
        span
          font-size 12px
          color #333
          &:nth-child(1)
            wh 12px 12px
            border-radius 50%
            display:inline-block
            mr 11
</style>
