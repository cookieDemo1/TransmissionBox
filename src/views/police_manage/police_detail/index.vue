<template>
  <div class="detail w1200 mgauto">
    <div class="menu_box">
      <div class="title_box">
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/police/manage' }">{{$t('alarm_management')}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/police/manage?activeName=third' }">{{$t('historical_alarm')}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{$t('view_details')}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="detail_box">
        <div class="item item_basic">
          <div class="item_title">{{$t('basic_information')}}</div>
          <div class="item_info">
            <div class="info"><span>{{$t('device_name')}}：</span>
              <p>{{basic_info.device_name}}</p>
            </div>
            <div class="info"><span>{{$t('device_code')}}：</span>
              <p>{{basic_info.device_id}}</p>
            </div>
            <div class="info"><span>报警值：</span>
              <p>{{basic_info.warn_desc}}</p>
            </div>
            <div class="info"><span>报警时间：</span>
              <p>{{basic_info.time}}</p>
            </div>
            <div class="info"><span>状态：</span>
              <p>{{basic_info.state=="1"?'触发':'恢复'}}</p>
            </div>
            <div class="info"><span>恢复时间：</span>
              <p>{{basic_info.recover_time}} </p>
            </div>
            <div class="info"><span>通知人：</span>
              <div style="display:flex;flex-wrap: wrap;">
                <p v-for="(item,index) in basic_info.notifier" :key="index">
                  <span>{{item.name}}{{'('+item.phone+')'}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="item item_deal">
          <div class="item_title">{{$t('alarm_handling')}}</div>
          <div class="item_info">
            <div class="info"><span>{{$t('confirming_person')}}：</span>
              <p>{{alarm_solution.confirmer}}</p>
            </div>
            <div class="info"><span>{{$t('confirm_time')}}：</span>
              <p>{{alarm_solution.confirm_time}}</p>
            </div>
            <div class="info"><span>{{$t('confirm_time_pay')}}：</span>
              <p>{{confirm_duration}}</p>
            </div>
          </div>
          <div class="item_info">
            <div class="info"><span>{{$t('problem_description')}}：</span>
              <p>{{alarm_solution.confirm_desc}}</p>
            </div>
          </div>
          <div class="item_info">
            <div class="info"><span>{{$t('plan_description')}}：</span>
              <p>{{alarm_solution.solve_desc}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { policeDetail } from '_api/police_manage'
  import dayjs from 'dayjs';

  export default {
    data() {
      return {
        id: '',
        basic_info: {},
        alarm_solution: {},
      }
    },
    mounted() {
      this.initData()
    },
    computed: {
      confirm_duration() {
        const { time, confirm_time } = this.alarm_solution
        if (time && confirm_time){
          const d1 = dayjs(time)
          const d2 = dayjs(confirm_time)
          const t = d2.diff(d1)
          let left = t,d,h,m,s

          //计算出相差天数
          d = Math.floor(left/(24*3600*1000))
          left = left % (24*3600*1000)
          //计算出小时数
          h =Math.floor(left/(3600*1000))
          left = left % (3600*1000)
          //计算相差分钟数
          m =Math.floor(left/(60*1000))
          left = left % (60*1000)
          //计算相差秒数
          s =Math.floor(left/(1000))
          return  d+' 天 '+h+' 时 '+m+' 分 '+s+' 秒 '
        }
        return null
      }
    },
    methods: {
      initData() {
        this.id = this.$route.query.id || ''
        this.basic_info = this.$route.query
        this.alarm_solution = this.$route.query
      },

    }
  }
</script>

<style scoped lang="stylus">
  .detail
    wh 100% 100%
    display flex
    padding 24px 30px 12px 0
    .menu_box
      display flex
      flex 1
      flex-direction column
      .title_box
        background_style()
        display flex
        flex-direction column
        margin-bottom 10px
        padding 0 30px
        .title
          display flex
          flex-direction row
          fsc 16px #333333
          padding 24px 0
      .detail_box
        display flex
        flex-direction row
        justify-content space-around
        .item
          background_style()
          display flex
          flex 1
          flex-direction column
          padding 24px 30px
          &:first-child
            margin-right 10px
          .item_title
            fsc 24px #333333
            margin-bottom 48px
          .item_info
            display flex
            flex-direction column
            margin-bottom 48px
            &:nth-of-type(2)
              margin-bottom 0

            .info
              display flex
              flex-direction row
              margin-bottom 24px
              span
                min-width 80px
                display flex
                fsc 16px #666666
                margin-right 10px
              p
                display flex
                fsc 16px #333333
                margin-top 2px
</style>
