<template>
  <div class="log w1200 mgauto">
    <div class="head border_shadow new_">
      <div class="search_condition">
        <el-form :inline="true">
          <el-form-item :label="$t('operator')">
            <el-input v-model="searchBean.operator" :placeholder="$t('fill_in_operator')" clearable="clearable" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('module')">
            <el-select v-model="searchBean.module" placeholder="全部" clearable="clearable" style="width:200px;">
              <el-option v-for="item in moduleTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('start_time')">
            <el-date-picker v-model="searchBean.start_time" type="datetime" :placeholder="$t('chooice_start_time')" style="width:200px;"></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('end_time')">
            <el-date-picker v-model="searchBean.end_time" type="datetime" :placeholder="$t('chooice_end_time')" style="width:200px;"></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px;margin-right: 10px;">
            <el-button @click="getLogList()" type="primary">{{$t('search')}}</el-button>
          </el-form-item>
          <el-form-item style="margin-right: 10px;">
            <el-button @click="resetSearchParams">{{$t('reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="body">
      <el-table class="border_shadow" v-if="tableData.length" :data="tableData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle">
        <el-table-column :label="$t('No')" width="100"><template slot-scope="scope"><span>{{(page-1) * row + scope.$index + 1}}</span></template></el-table-column>
        <el-table-column prop="operator" :label="$t('operator')"></el-table-column>
        <el-table-column prop="operation" :label="$t('content')"></el-table-column>
        <el-table-column prop="result" :label="$t('result')"></el-table-column>
        <el-table-column prop="module" :label="$t('module')"><template slot-scope="scope"><span>{{scope.row.module}}</span></template></el-table-column>
        <el-table-column prop="ip" :label="$t('ip')"></el-table-column>
        <el-table-column prop="time" :label="$t('time')"></el-table-column>
        <el-table-column :label="$t('operation')" width="160" header-align="center" align="center" v-if="0"><template slot-scope="scope">
          <el-button @click="openDetail(scope.row)" type="text" size="small">{{$t('view_details')}}</el-button>
        </template></el-table-column>
      </el-table>
      <Empty v-else></Empty>
    </div>
    <div class="pagination border_shadow">
      <el-pagination :background="false" :page-size="row" :total="total" :current-page="page" @current-change="handleCurrentChange" layout="prev, pager, next,total,jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
  import { getLogList } from '_api/log_manage'
  import {getTimestampByDate} from '_common/util'
  import Empty from '_components/empty'

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        headerStyle() {
          return 'background-color:rgba(246,248,249,0.45);height:48px;border-radius:2px;text-align:center;font-size:16px;font-weight:500;color:#333333'
        },
        cellStyle() {
          return "text-align:center;height:56px"
        },
        tableData:[],

        moduleTypes:[
          {
            value: "0",
            label: "设备管理"
          }, {
            value: "2",
            label: "权限管理"
          }, {
            value: "3",
            label: "登录管理"
          }
        ],
        searchBean: {
          operator:'',// 操作人
          module:'',// 模块
          start_time: null,// 开始时间
          end_time: null,// 结束时间
        },
        row:10,
        page:1,
        total: 0,
      }
    },
    mounted() {
      this.getLogList()
    },
    methods: {
      // 重置搜索条件
      resetSearchParams() {
        this.searchBean = {
          operator:'',// 操作人
          module:'',// 模块
          start_time: null,// 开始时间
          end_time: null,// 结束时间
        }
        // 重刷日志列表
        this.getLogList()
      },
      // 获取日志列表
      getLogList(page = 1) {
        this.page = page
        let params = {
          row:this.row,
          page:this.page,
          operator:this.searchBean.operator,
          module:this.searchBean.module,
          start_time: getTimestampByDate(this.searchBean.start_time),
          end_time: getTimestampByDate(this.searchBean.end_time),
        }
        getLogList(params).then((res)=>{
          if(res.data.code === 200) {
            this.total = res.data.data.total
            this.tableData = res.data.data.list
          } else {
            this.$message.error(this.$t('data_acquisition_failed'))
          }
        }).catch(()=>{
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      // 分页按钮事件回调
      handleCurrentChange(val){
        this.getLogList(val)
      },
      // 打开日志详情
      openDetail(row) {
        this.$router.push(`/log_manage/log_detail?logId=${row.id}`)
      },
    },
  }
</script>

<style scoped lang="stylus">
  .log
    // padding 24px 30px 12px 0
    // background #FAFBFB
    wh 100% 100%
    .head
      padding 24px 30px 2px
      background white
      height auto
      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
    .body
      width 100%
      //min-height calc(100vh - 300px)
      margin-bottom 10px
      background white
    .border_shadow
      background:rgba(249,252,255,1) !important;
      border:1px solid rgba(125, 189, 178, 0.1) !important;
      box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
      border-radius 4px !important

    .pagination
      display flex
      flex-direction row
      justify-content center
      padding 20px 0
      width 100%
      height 74px
      background white

</style>
<style lang="stylus">
  .el-table
    min-height calc(100vh - 300px)!important
  .el-form-item
    margin-right 20px !important
</style>
<style scoped>
  .log .el-form-item {
    width:auto !important;
    font-size: 16px !important;
    color: #666  !important;
  }
 .log .el-form-item .el-form-item__label{
    font-size: 16px !important;
    color: #666  !important;
  }
  .log .el-form-item button{
    font-size: 16px !important;
  }
.el-form-item__label{
  color:red !important
}
</style>

<style scoped>

.log >>>  .el-table__header-wrapper .el-table__header  .is-leaf{
     background:#F2F3F7 !important;
 }
 
 .log >>>  .el-table__body tbody .el-table__row,.el-table {
     overflow: hidden;
     background:#FAFCFF !important;
 }
 
 .log >>> .el-pagination button:disabled ,  .log >>> .el-pager li{
     background:#FAFCFF !important;
 }
.log >>> .el-pagination__editor.el-input .el-input__inner{
   background:#FAFCFF !important;
 }
 
.log >>>  .search_condition .el-input--suffix .el-input__inner{
   background:#FAFCFF !important;
 }
</style>