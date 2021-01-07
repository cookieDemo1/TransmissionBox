<template>
  <div class="police mgauto">
    <div class="menu_box">
      <div class="tab_item">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="报警总览" name="first" style="font-size:16px">
            <div class="police_sum">
              <div class="sum_left">
                <div class="left_top">
                  <div class="title">
                    <div class="title-icon">
                      <svg-icon icon-class="emphasize"></svg-icon>
                    </div><span>今日报警</span>
                  </div>
                  <div class="wrap" style="padding-left:14px;padding-right:14px">
                    <ul>
                      <li>
                        <div class="police-icon">
                          <div class="police-icon-icon">
                            <svg-icon icon-class="xiangmen"></svg-icon>
                          </div><span>箱门打开</span>
                        </div><span>{{todayPolice[0]}}次</span>
                      </li>
                      <li>
                        <div class="police-icon">
                          <div class="police-icon-icon">
                            <svg-icon icon-class="fengshan"></svg-icon>
                          </div><span>设备离线</span>
                        </div><span>{{todayPolice[1]}}次</span>
                      </li>
                      <li>
                        <div class="police-icon">
                          <div class="police-icon-icon">
                            <svg-icon icon-class="fengshan"></svg-icon>
                          </div><span>箱内温度过高</span>
                        </div><span>{{todayPolice[2]}}次</span>
                      </li>
                      <li>
                        <div class="police-icon">
                          <div class="police-icon-icon">
                            <svg-icon icon-class="fengshan"></svg-icon>
                          </div><span>输入电压过高</span>
                        </div><span>{{todayPolice[3]}}次</span>
                      </li>
                      <li>
                        <div class="police-icon">
                          <div class="police-icon-icon">
                            <svg-icon icon-class="led"></svg-icon>
                          </div><span>输入电压过低</span>
                        </div><span>{{todayPolice[4]}}次</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="left_middle">
                  <div class="title">
                    <div class="title-icon">
                      <svg-icon icon-class="emphasize"></svg-icon>
                    </div><span>最近30天报警类型排行</span>
                  </div>
                  <div class="chart" ref="left_middle_chart" v-if="cityrank"></div>
                  <Empty v-else style="width:100%;height:100%"></Empty>
                </div>

                <div class="left_bottom">
                  <div class="title">
                    <div class="title-icon">
                      <svg-icon icon-class="emphasize"></svg-icon>
                    </div><span>30天平均报警处理时长</span>
                  </div>
                  <div class="wrap">
                    <div class="wrap_left">
                      <div>
                        <span>{{parseInt((timetime.confirm/1/60/60/24)%30)}}天{{parseInt((timetime.confirm/1/60/60)%24 )}}时{{parseInt((timetime.confirm/1/60)%60)}}分</span>
                      </div>
                      <h5>确认时长</h5>
                    </div>
                    <div class="wrap_right">
                      <div> <span>{{parseInt((timetime.recover/1/60/60/24)%30)}}天{{parseInt((timetime.recover/1/60/60)%24 )}}时{{parseInt((timetime.recover/1/60)%60)}}分</span></div>
                      <h5>恢复时长</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div  class="sum_right">
                <div class="right_top">
                  <div class="title">
                    <div class="title-icon">
                      <svg-icon icon-class="emphasize"></svg-icon>
                    </div><span>最近20天报警趋势</span>
                  </div>
                  <div class="chart" ref="right_top_chart" v-if="policeTrend"></div>
                  <Empty v-else style="width:100%;height:100%"></Empty>
                </div>
                <div class="right_bottom">
                  <div class="title">
                    <div class="title-icon">
                      <svg-icon icon-class="emphasize"></svg-icon>
                    </div><span>30天报警最多的设备排行</span>
                  </div>
                  <div class="chart" ref="right_bottom_chart" v-if="devicePoliceRank.length"></div>
                  <Empty v-else style="width:100%;height:100%"></Empty>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$t('real_time_alarm')" name="second" style="font-size:16px">
            <div class="search_item">
              <el-form class="border_top" :inline="true">
                <el-form-item :label="$t('device_code')" style="margin-right: 30px;">
                  <el-input v-model="searchItem.device_id" placeholder="填写设备编码" clearable="clearable" style="width:200px;"></el-input>
                </el-form-item>
                <el-form-item style="margin-right: 10px;">
                  <el-button style="width: 100px;" type="primary" @click="searchRealClick">{{$t('search')}}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button style="width: 100px;" @click="resetRealClick">{{$t('reset')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table class="border_shadow" v-if="realList.length" :data="realList" v-loading="loading" stripe="stripe">
              <el-table-column header-align="center" align="center" :label="$t('No')" width="100"><template slot-scope="scope"><span>{{(page-1)*10 + scope.$index+1}}</span></template></el-table-column>
              <el-table-column header-align="center" align="center" prop="warn_desc" :label="$t('police_decr')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="device_id" :label="$t('police_device_id')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="notifiers[0].name" :label="$t('notifier_name')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="time" :label="$t('police_time')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="recover" label="状态"><template slot-scope="scope"><span>{{scope.row.recover=='0'?'触发':'恢复'}}</span></template></el-table-column>
              <el-table-column header-align="center" align="center" prop="customer_name" :label="$t('belongs_to_the_customer')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="option" :label="$t('operation')"><template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col>
                    <el-button v-if="scope.row.state==='0'" @click="policeClick(scope.$index,scope.row)" type="text" size="small" style="color:#19CCAE">{{$t('police_confirm')}}</el-button>
                    <el-button v-if="scope.row.state==='1'" type="text" size="small" style="color: #333333;cursor:default">{{$t('police_confirmed')}}</el-button>
                  </el-col>
                </el-row>
              </template></el-table-column>
            </el-table>
            <Empty v-else></Empty>
          </el-tab-pane>

          <el-tab-pane :label="$t('historical_alarm')" name="third">
            <div class="search_item">
              <el-form class="border_top" :inline="true" style="display: flex;flex-wrap: wrap;">
                <el-form-item :label="$t('device_code')" style="margin-right: 30px;">
                  <el-input v-model="searchItem.id" :placeholder="$t('fill_in_alarm_code')" clearable="clearable"></el-input>
                </el-form-item>
                <el-form-item :label="$t('start_time')" style="margin-right: 30px;">
                  <el-date-picker v-model="searchItem.start_time" type="datetime" :placeholder="$t('chooice_start_time')"></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('end_time')">
                  <el-date-picker v-model="searchItem.end_time" type="datetime" :placeholder="$t('chooice_end_time')"></el-date-picker>
                </el-form-item><br />
                <el-form-item style="margin-right: 12px;">
                  <el-button style="width: 100px;" type="primary" @click="searchHistoryClick">{{$t('search')}}</el-button>
                </el-form-item>
                <el-form-item style="margin-right: 40px;">
                  <el-button style="width: 100px;" @click="resetHistoryClick">{{$t('reset')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table class="border_shadow" v-if="historyList.length" :data="historyList" v-loading="loading" stripe="stripe">
              <el-table-column header-align="center" align="center" :label="$t('No')" width="100"><template slot-scope="scope"><span>{{(page-1)*10 + scope.$index+1}}</span></template></el-table-column>
              <el-table-column header-align="center" align="center" prop="warn_desc" :label="$t('police_decr')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="device_id" :label="$t('police_device_id')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="time" :label="$t('police_time')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="customer_name" :label="$t('belongs_to_the_customer')"></el-table-column>
              <el-table-column header-align="center" align="center" prop="recover" label="状态"><template slot-scope="scope"><span>{{scope.row.recover=='0'?'触发':'恢复'}}</span></template></el-table-column>
              <el-table-column header-align="center" align="center" prop="confirm_desc" label="问题描述"></el-table-column>
              <el-table-column header-align="center" align="center" prop="solve_desc" label="解决方案"></el-table-column>
              <el-table-column header-align="center" align="center" prop="option" :label="$t('operation')"><template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col>
                    <el-button @click="policeDetailClick(scope.$index,scope.row)" type="text" size="small" style="color:#19CCAE">查看详情</el-button>
                  </el-col>
                </el-row>
              </template></el-table-column>
            </el-table>
            <Empty v-else></Empty>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="pagination border_shadow" v-if="parseInt(index)!==0">
        <el-pagination :background="false" :page-size="row" :total="total" :current-page.sync="page" @current-change="handleCurrentChange" layout="prev, pager, next,total,jumper"></el-pagination>
      </div>
    </div>

    <div class="scope_dialog">
      <el-dialog :title="$t('alarm_confirm')" :visible.sync="dialogPolice">
        <el-form ref="form" :model="formData" label-width="90px" style="flex-direction: column;">
          <el-form-item class="problem" :label="$t('problem_description')">
            <el-input v-model="formData.problem" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('fill_in_problem_description')"></el-input>
          </el-form-item>
          <el-form-item class="fangan" :label="$t('treatment_plan')">
            <el-input v-model="formData.plan_description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('fill_in_treatment_plan')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('confirming_person')"><span>{{localStorage.getItem('UserName') || ''}}</span></el-form-item>
          <el-form-item :label="$t('confirm_time')"><span>{{confirm_time}}</span></el-form-item>
          <div style="display:flex;justify-content:space-between;margin-left:0px">
            <el-button @click="cancelBtnClick" style="width:220px;height:44px">{{$t('cancel')}}</el-button>
            <el-button @click="confirmClick" type="primary" style="width:220px;height:44px">{{$t('sure')}}</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
  
</template>

<script>
  import echarts from 'echarts';
  import Empty from '_components/empty'
  import { parseDate, getFullDate } from '_common/util'
  import {
    policeReal,
    policeConfirm,
    policeHistory,
  } from '_api/police_manage' 
  import {getV2Data} from '_api/data_overview';
  import SvgIcon from '_components/SvgIcon'

  let leftMiddleChart=null,rightTopChart=null,rightBottomChart=null
  export default {
    components: { Empty, SvgIcon },
    data() {
      return {
        isShow:false,
        device_id: 6666,
        police_id: '',
        id: '',
        level_id: '',
        localStorage: window.localStorage,
        getFullDate,
        activeName: 'first',
        index: '0',
        radio: '0',
        confirm_time: 0,
        confirmTime: 0,
        loading: false,
        flag: false,
        dialogPolice: false,
        dialogPriority: false,
        row: 10,
        page: 1,
        total: 0,
        indexs: 0,
        searchItem: {},
        listItem: [],
        siteList: [],
        realList: [],
        historyList: [],
        predictList: [],
        formData: {},
        PriorityData: {
          level: '0',
        },
        keywordList: [
          {
            value: '0',
            label: '触发',
          },
          {
            value: '1',
            label: '确认',
          },
        ],
        no_customer: false,
        cityrank:[
        ],
        typeRankList:[],
        devicePoliceRank:[
          {name: " 1区2巷1111",count: 11,},
          {name: " 设备22",count: 22,},
          {name: " 设备33",count: 33,},
          {name: " 设备44",count: 44,},
          {name: " 设备55",count: 55,},
          {name: "  1区2巷1111",count: 66,},
        ],
        policeTrend:{
          date: [
            // "一月","一月","一月","一月","一月","一月","一月","一月","一月",
          ],
          list:[
            {
              name: "箱门打开",
              values: [11,22,33,44,55,66,77,88,39]
            },
            {
              name: "设备离线",
              values: [11,22,33,44,55,66,77,88,99]
            },
            {
              name: "箱内温度过高",
              values: [11,22,33,44,55,66,77,88,99]
            },
            {
              name: "输入电压过高",
              values: [11,22,33,44,55,66,77,88,99]
            },
            {
              name: "输入电压过低",
              values: [11,22,33,44,55,66,77,88,99]
            }
          ]
        },
        todayPolice:[1,2,3,4,5],
        timetime:{
          confirm:300,
          recover:1000
        },
        
      }
    },
    mounted() {
      this.getPoliceReal()
      this.getSeconds()
      this.tPolice()
      this.$nextTick(() => {
        this.getTypeRank()
        this.getDeviceRank()
        this.getTrend()
        this.resetPosition()
      })
      window.addEventListener('resize', this.resetPosition)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resetPosition)
    },
    methods: {
      arrSort(arr){
          let res=[],pname=[],pvalue=[],newArr=[];
          
          for (let j = 0; j < arr.length; j++) {
             (function (j){
                if(arr[j].type=="1"){
                  newArr.push({
                    type:"箱门打开",
                    value:arr[j].value
                  })
                  
                }else if(arr[j].type=="2"){
                   newArr.push({
                     type:"设备离线",
                     value:arr[j].value
                   })
                }else if(arr[j].type=="3"){
                  newArr.push({
                    type:"温度过高",
                    value:arr[j].value
                  })
                }else if(arr[j].type=="4"){
                   newArr.push({
                     type:"电压过高",
                     value:arr[j].value
                   })
                }else{
                  newArr.push({
                    type:"电压过低",
                    value:arr[j].value
                  })
                }
              })(j)
            
          }
          
          res = newArr.sort(function(a,b){return a.value-b.value})
          for(let i=0;i<res.length;i++){
              pname.push(res[i].type);
              pvalue.push(res[i].value)
          }
          // 1 箱门打开
          // 2 设备离线
          // 3 温度过高
          // 4 电压过高
          // 5 电压过低
          return {pname,pvalue};
      },
      arrSortDevice(arr){
          let res=[],pname=[],pvalue=[],newArr=[];
          res = arr.sort(function(a,b){return b.count-a.count})
          for(let i=0;i<res.length;i++){
              pname.push((res[i].name).length>5?(res[i].name).slice(0,5)+'...':res[i].name);
              pvalue.push(res[i].count)
          }
          return {pname,pvalue};
      },
      getSeconds(){
        //this.initData()
        getV2Data('/stats/warn/handle/')
          .then((res) => {
            if(res.data.code === 200){
              this.timetime = res.data.data   //recover
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      getTypeRank(){
        getV2Data('/stats/warn/type/rank')
          .then((res) => {
            if(res.data.code === 200){
              this.cityrank = res.data.data   //recover
              this.initData()
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      getDeviceRank(){
        getV2Data('/stats/warn/device/rank')
          .then((res) => {
            
            if(res.data.code === 200){
              this.devicePoliceRank = res.data.data   //recover
              this.initData_r()
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      getTrend(){
        getV2Data('/stats/warn/count/trend')
          .then((res) => {
            if(res.data.code === 200){
              this.policeTrend = res.data.data   //recover
              this.initData_m()
            }else {
              this.$message.error(res.data.msg)
            }
            
          }).catch(() => {
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      tPolice(){
        getV2Data('/stats/warn/type/count/')
          .then((res) => {
            if(res.data.code === 200){
              this.todayPolice = res.data.data   //recover
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      initData() {
        // 最近30天报警类型排行
        leftMiddleChart = echarts.init(this.$refs.left_middle_chart);
        let option = {
            title: {
                text: '',
                padding:[30,0,0,0],
                left:'center',
                textStyle:{
                  color:'#000000',
                  fontStyle:'normal',
                  fontWeight:'400',
                  fontSize:18
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
               
            },
            grid: {
                top:'23%',
                left: '7%',
                right: '12%',
                bottom: '6%',
                containLabel: true
            },
            
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                scale:true,
                splitLine:{
                  show:true,
                  lineStyle:{
                    type:'dashed'
                  }
                },
                min: 0,
                axisTick: {
                    show:false
                },
            },
            yAxis: {
                type: 'category',
                data: this.arrSort(this.cityrank).pname,
                axisTick: {
                    alignWithLabel: true,
                    show:false
                },
                textStyle: {
                  fontSize : 14
                },
                
            },
            series: [
                {
                    type: 'bar',
                    barWidth : 18,
                    data: this.arrSort(this.cityrank).pvalue,
                    itemStyle:{
                      color:'#1E9AFF'
                    }
                },
            ]
        };
        leftMiddleChart.setOption(option);
      }, 
        // 30天报警最多的设备排行
      initData_r() {
        rightBottomChart = echarts.init(this.$refs.right_bottom_chart);
          let option = {
                        title: {
                            text: '',
                            padding:[30,0,0,0],
                            left:'center',
                            textStyle:{
                              color:'#000000',
                              fontStyle:'normal',
                              fontWeight:'400',
                              fontSize:18
                            },
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },  
                        grid: {
                            top:'23%',
                            left: '7%',
                            right: '12%',
                            bottom: '6%',
                            containLabel: true
                        },
                        xAxis:{
                          type: 'category',
                          data: this.arrSortDevice(this.devicePoliceRank).pname.slice(0,5),
                          axisTick: {
                              alignWithLabel: true,
                              show:false
                          },
                          
                        },
                        yAxis:{
                            
                          type: 'value',
                          axisTick: {
                              show:false
                          },
                          splitLine:{
                            show:true,
                            lineStyle:{
                              type:'dashed'
                            }
                          },
                        },
                        series: [
                            {
                                type: 'bar',
                                barWidth: '18',
                                data: this.arrSortDevice(this.devicePoliceRank).pvalue.slice(0,5),
                                itemStyle:{ 
                                  color:'#8F71FF'
                                }
                            }
                        ]
                    };
        rightBottomChart.setOption(option);
      },  
        // 最近20天报警趋势
      initData_m(){
        rightTopChart = echarts.init(this.$refs.right_top_chart);
        let option = {
            title: {
                text: '',
                padding:[30,0,0,0],
                left:'center',
                textStyle:{
                  color:'#000000',
                  fontStyle:'normal',
                  fontWeight:'400',
                  fontSize:18
                },
            },
            tooltip: {
                trigger: 'axis'
            },
                    color:['#19CC4C','#6F7591','#FF5B67','#1E9AFF','#8F71FF'],
            legend: {
                //orient: 'vertical',
                y: 'bottom',
                icon: "circle",
                itemWidth: 10,  // 设置宽度
                itemHeight: 10, // 设置高度
                itemGap: 40, // 设置间距
                padding:[20,20,20,20],
                data: ['箱门打开', '设备离线', '箱内温度过高', '输入电压过高', '输入电压过低']
            },
            grid: {
                top:'12%',
                left: '5%',
                right: '5%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.policeTrend.date,
                axisTick: {
                    inside:true
                    
                },
                
                
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show:false
                },
                splitLine:{
                  show:true,
                  lineStyle:{
                    type:'dashed'
                  }
                },
                splitNumber:10,
                boundaryGap:["1","1"],
                min: 0,
                // axisLabel:{
                //   formatter: function (value) {
                //     let  res = []
                //     return res
                //   }
                // }
              },
            series: [
                {
                    name: '箱门打开',
                    type: 'line',
                    symbol: 'none',
                    data: this.policeTrend.list[0].values,
                    itemStyle:{
                      normal:{
                        // 拐点上显示数值
                        label : {
                        show: false
                        },
                        //borderColor:'yellow',  // 拐点边框颜色
                        lineStyle:{                 
                          width:1,  // 设置线宽
                          type:'solid',  //'dotted'虚线 'solid'实线
                          color:"#19CC4C"
                        },
                      }
                    },
                },
                {
                    name: '设备离线',
                    type: 'line',
                    symbol: 'none',
                    data: this.policeTrend.list[1].values,
                    itemStyle:{
                      normal:{
                        // 拐点上显示数值
                        label : {
                        show: false
                        },
                        //borderColor:'yellow',  // 拐点边框颜色
                        lineStyle:{                 
                          width:1,  
                          type:'solid',  
                          color:"#6F7591"
                        },
                      }
                    },
                },
                {
                    name: '箱内温度过高',
                    type: 'line',
                    symbol: 'none',
                    data: this.policeTrend.list[2].values,
                    itemStyle:{
                      normal:{
                        // 拐点上显示数值
                        label : {
                        show: false
                        },
                        //borderColor:'yellow',  // 拐点边框颜色
                        lineStyle:{                 
                          width:1,  
                          type:'solid',  
                          color:"#FF5B67"
                        },
                      }
                    },
                },
                {
                    name: '输入电压过高',
                    type: 'line',
                    symbol: 'none',
                    data: this.policeTrend.list[3].values,
                    itemStyle:{
                      normal:{
                        // 拐点上显示数值
                        label : {
                        show: false
                        },
                        //borderColor:'yellow',  // 拐点边框颜色
                        lineStyle:{                 
                          width:1,  
                          type:'solid',  
                          color:"#1E9AFF"
                        },
                      }
                    },
                },
                {
                    name: '输入电压过低',
                    type: 'line',
                    symbol: 'none',
                    data: this.policeTrend.list[4].values,
                    itemStyle:{
                      normal:{
                        // 拐点上显示数值
                        label : {
                        show: false
                        },
                        //borderColor:'yellow',  // 拐点边框颜色
                        lineStyle:{                 
                          width:1,  
                          type:'solid',  
                          color:"#8F71FF"
                        },
                      }
                    },
                }
            ]
        }
        rightTopChart.setOption(option);
      },

      // ----------------  实时报警  ---------------- //
      // 初始化 列表数据
      getPoliceReal() {
        let params = {
          customer_id: this.searchItem.customer_id,
          page: this.page,
          row: this.row,
          device_id: this.searchItem.device_id,

        }
        policeReal(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.realList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      searchRealClick() {
        this.getPoliceReal()
      },
      resetRealClick() {
        this.searchItem = {}
        this.getPoliceReal()
      },
      policeClick(index, row) {
        this.dialogPolice = true
        this.confirm_time = getFullDate((new Date()).getTime() / 1000)//当前时间
        this.confirmTime = Math.floor((new Date()).getTime() / 1000)
        this.id = row.id
      },
      policeDetailClick(index, row) {
        this.$router.push({
          path: '/police/manage/detail',
          query: row,
        })
      },
      cancelBtnClick() {
        this.dialogPolice = false
        this.formData = {
          remark: '',
          plan_description: '',
        }
      },
      confirmClick() {
        let params = {
          confirm_desc: this.formData.problem,
          solve_desc: this.formData.plan_description,
        }
        policeConfirm(params, 'post', this.id).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.dialogPolice = false
            this.getPoliceReal()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },

      // ----------------  历史报警  ---------------- //
      getPoliceHistory() {
        let params = {
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
          status: this.searchItem.status,
          start_time: parseDate(this.searchItem.start_time),
          end_time: parseDate(this.searchItem.end_time),
          device_name: this.searchItem.device_name,
          id: this.searchItem.id,
          page: this.page,
          row: this.row,
        }
        policeHistory(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.historyList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          //this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      searchHistoryClick() {
        this.getPoliceHistory()
      },
      resetHistoryClick() {
        this.searchItem = {
          id: '',
          name: '',
          device_name: '',
          start_time: '',
          end_time: '',
        }
        this.getPoliceHistory()
      },
      resetPosition() {
        this.$nextTick(() => {
          leftMiddleChart && leftMiddleChart.resize()
          rightTopChart && rightTopChart.resize()
          rightBottomChart && rightBottomChart.resize()
        })
      },


      // ----------------  tab切换  ---------------- //
      handleClick(tab) {
        // this.$router.replace(`/police/manage`)
        this.searchItem = {}
        this.customer_id = ''
        this.site_id = ''
        this.policeChartList = []
        this.page = 1
        this.index = tab.index || '0'
        this.indexs = this.index || tab.index
        this.loading = true
        if (this.indexs === '1') {
          this.getPoliceReal()
        }
        if (this.indexs === '2') {
          this.getPoliceHistory()
        }
      },

      // ----------------  页码切换  ---------------- //
      handleCurrentChange() {
        if (this.indexs === '1') {
          this.getPoliceReal()
        }
        if (this.indexs === '2') {
          this.getPoliceHistory()
        }
      },
    },
  }
</script>

<style scoped lang="stylus">
  .police
    wh 100% 100%
    .menu_box
      width 100%
      height 100%
      .tab_item
        min-height calc(100vh - 300px)
        .search_item
          background #fff
          padding 0px 30px
          margin-bottom 10px
          background:rgba(249,252,255,1) !important;
          border:1px solid rgba(125, 189, 178, 0.1) !important;
          box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
          border-top 0
          border-top-right-radius 0px
          border-top-left-radius 0px
        .chart_box
          display flex
          min-height calc(100vh - 300px) !important
          flex-wrap wrap
          .item
            display flex
            flex-direction column
            align-items center
            width 32.5%
            height 380px
            background #fff
            position relative
            margin 0.6%
            padding 12px
            border 1px solid rgba(25, 204, 174, 0.13) !important
            box-shadow 0px 0px 6px 0px rgba(25, 204, 174, 0.2) !important
            border-radius 4px !important
            &:nth-of-type(3n)
              margin-right 0
            &:nth-of-type(1)
              margin-left 0
            &:nth-of-type(3n+1)
              margin-left 0
            .modify_icon
              position absolute
              right 12px
              top 12px
              wh 20px 20px
            .title
              display flex
              flex-direction column
              align-items center
              margin-top 10px

              span
                display flex
                fsc 18px #333333
                margin-bottom 4px
              .generating
                display flex
                wh 94px 88px
                margin-top 80px
              .tip
                display flex
                fsc 14px #999999
                margin-top 18px
              p
                display flex
                fsc 14px #999999
                margin-bottom 80px

              .add
                display flex
                wh 80px 80px
            .content
              text-align center
              fsc 14px #999999
              padding 0 50px
              margin-top 60px
              margin-bottom 10px
              line-height 20px
            .item_tip
              wh 22px 22px
              position absolute
              left 13px
              bottom 16px
        .screen
          min-height calc(100vh - 300px) !important
        .tab_tips
          display flex
          flex-direction row
          padding 0 30px
          background #fff
          box-shadow: 0px 0px 6px 0px rgba(25, 204, 174, 0.2);
          border-radius: 4px;
          border: 1px solid rgba(25, 204, 174, 0.13);
          border-top 0
          border-top-right-radius 0px
          border-top-left-radius 0px
          span
            width 100%
            display flex
            padding 10px 0px 24px
            fsc 16px #333333
            margin-bottom 10px
            border-top 1px solid #B6BDC2
        .predict_content
          display flex
          flex-wrap wrap
          .predict_item
            width 32.66%
            flex-direction column
            background #fff
            margin-top 90px
            padding 90px 40px 10px
            position relative
            border 1px solid rgba(25, 204, 174, 0.13)
            box-shadow 0px 0px 6px 0px rgba(25, 204, 174, 0.2)
            border-radius 4px
            &:nth-of-type(3n-1)
              margin-left 1%
              margin-right 1%
            .probability
              position absolute
              left 50%
              top 0
              wh 120px 120px
              display flex
              flex-direction column
              justify-content center
              align-items center
              background #fff
              margin-left -60px
              margin-top -60px
              border-radius 50%
              box-shadow 0px 2px 6px 0px rgba(220, 233, 243, 1)
              span
                fsc 20px #19CCAE
              p
                fsc 12px #19CCAE
            .item
              display flex
              flex-direction row
              justify-content space-between
              align-items center
              margin-bottom 20px
              span
                display flex
              p
                display flex
      .border_shadow
        background:rgba(249,252,255,1) !important;
        border:1px solid rgba(125, 189, 178, 0.1) !important;
        box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
      .sideBar
        wh 48px 228px
        display flex
        flex-direction column
        align-items center
        justify-content center
        position fixed
        right 0
        top 50%
        margin-top -114px
        padding 8px 12px
        box-shadow -2px 2px 5px 0px rgba(219, 227, 232, 1)
        .icon
          display flex
          wh 24px 24px
          margin-bottom 8px
        span
          width 14px
          fsc 14px #333333
          display flex
          align-items center
          justify-content center
      .pagination
        display flex !important
        flex-direction row !important
        justify-content center !important
        padding 20px 0 !important
        margin-top 10px !important
        background #FFFFFF
</style>
<style scoped>

  .police  >>>  .el-table__header-wrapper .el-table__header  .is-leaf{
    background:#F2F3F7 !important;
  }

  .police  >>>  .el-table__body tbody .el-table__row {
    overflow: hidden;
    background:#FAFCFF !important;
  }

  .police  >>> .el-pagination button:disabled ,  .police  >>> .el-pager li{
    background:#FAFCFF !important;
  }
  .police  >>> .el-pagination__editor.el-input .el-input__inner{
    background:#FAFCFF !important;
  }

  .police  >>>  .search_item .el-input--suffix .el-input__inner{
    background:#FAFCFF !important;
  }





</style>
<style scoped lang="stylus">
  .scope_dialog >>> {
    .el-dialog {
      padding 20px!important
      fsc 16px #fff
      width 550px
      .el-dialog__header{
        padding-top 30px
        text-align left
        font-size 20px
        color #333
      }
      .el-dialog__body{
        padding-top 10px
        .problem .el-textarea__inner{
          height 110px !important
        }
        .fangan .el-textarea__inner {
          height 110px !important
        }
      }
    }
  }
</style>
<style lang="stylus" scoped>
  .police_sum
    display flex
    margin-top 20px
    .sum_left
      width: 35%
      max-width 400px
    .sum_right
      margin-left 20px
      flex 1


  .left_top
    background_style()
    width: 100%;
    height:340px;
    margin-bottom 20px
    padding 30px
    .title
      text-align left
      align-items center
      .title-icon
        wh 4px 20px
        mr 10
      df 1

      mb 30
      span
        fc 18 #000
    .wrap
      ul
        margin 0
        padding 0
        li
          margin-top 10px
          padding-bottom 10px
          border-bottom 1px solid #DDDDDD
          display flex
          justify-content space-between
          span
            font-size 16px
            color #666






  .left_middle
    background_style()
    width: 100%;
    height:300px;
    margin-bottom 20px
    position  relative
    .title
      position absolute
      z-index 9999
      left 30px
      top 30px
      text-align left
      align-items center
      df 1
      mb 30
      .title-icon
        wh 4px 20px
        mr 10
      span
        fc 18 #000


    .chart
      width 100%
      height 100%

  .left_bottom
    background_style()
    width: 100%;
    height:330px;
    margin-bottom 20px
    padding: 30px;
    .title
      text-align left
      align-items center
      df 1
      mb 30
      .title-icon
        wh 4px 20px
        mr 10
      span
        fc 18 #000
    .wrap
      display flex
      justify-content  space-between
      .wrap_left
        div
          width: 150px;
          height: 150px;
          border:20px solid #189BFF;
          border-radius: 50%;
          display flex
          align-items center
          justify-content center
          span
            font-size 17px
            color #333
        h5
          mt 30
          text-align center
          font-size 14px
          color #666
      .wrap_right
        div
          width: 150px;
          height: 150px;
          border:20px solid #11CDAF;
          border-radius: 50%;
          display flex
          align-items center
          justify-content center
          span
            font-size 17px
            color #333
        h5
          mt 30
          text-align center
          font-size 14px
          color #666

  .right_top
    background_style()
    width 100%
    height 570px
    margin-bottom 20px
    position relative
    .title
      position: absolute;
      z-index: 9999;
      left: 30px;
      top: 30px;
      text-align left
      align-items center
      .title-icon
        wh 4px 20px
        mr 10
      df 1
      mb 30
      span
        fc 18 #000
    .chart
      width 100%
      height 100%





  .right_bottom
    background_style()
    width 100%
    height:420px;
    margin-bottom 20px
    position  relative
    .title
      position absolute
      z-index 9999
      left 30px
      top 30px
      text-align left
      align-items center
      df 1
      mb 30
      .title-icon
        wh 4px 20px
        mr 10
      span
        fc 18 #000
    .chart
      width 100%
      height 100%

</style>

<style lang="stylus">
  .border_top
    padding-top 24px

  .el-tabs__nav-wrap::after
    height 0

  .el-table th
    color #333333
    background rgba(246, 248, 249, 0.45)

  .el-form-item__label
    fsc 16px #666666
    display flex

  .el-form-item__content
    flex 1

  .el-select
    width 100%

  .dialog_width
    .el-form-item__label
      width 80px

  .text_left
    .el-form-item__content
      text-align left

  .line_hight
    .el-form-item__content
      line-height 20px
      padding 10px 0

  .el-table
    min-height calc(100vh - 300px)
    background #fff

  .el-tabs__header
    background #fff
    padding 14px 0 0 30px !important
    margin-bottom 0 !important
    background:rgba(249,252,255,1) !important;
    border:1px solid rgba(125, 189, 178, 0.1) !important;
    box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
    border-radius:4px  !important;

  .el-tabs__nav
    padding-bottom 6px

  .el-tabs__active-bar
    height 4px

  .el-tabs__item
    fsc 20px #333333


  .el-table--striped .el-table__body tr.el-table__row--striped td
    background #fff

  .el-popover
    margin-top 2px !important

  .el-tooltip__popper
    max-width 200px !important
    padding 12px !important

  .el-tooltip__popper.is-dark
    background rgba(0, 60, 110, 0.51)
    .tip_box
      margin-bottom 6px
      &:last-child
        margin-bottom 0


  .el-button--success
    background #19CCAE



</style>

<style lang="stylus">
  .police-icon
    //wh 26px 26px
    display  flex
    flex-direction row
    .police-icon-icon 
      wh 26px 26px
      margin-right 8px
</style>

