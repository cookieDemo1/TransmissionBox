<template>
  <div class="log w1200 mgauto">
    <div class="head border_shadow new_">
      <div class="search_condition">
        <el-form :inline="true">
          <el-form-item label="设备编号" >
            <el-input v-model="searchBean.device_id" placeholder="填写设备编号" clearable="clearable" style="width:200px;"></el-input>
          </el-form-item>
          <el-form-item label="事件">
            <el-select v-model="searchBean.event" placeholder="选择事件" clearable="clearable" style="width:200px;">
              <el-option v-for="item in eventList" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
        <el-table-column :label="$t('No')" width="100"><template slot-scope="scope"><span>{{ (page-1)*row + scope.$index + 1}}</span></template></el-table-column>
        <el-table-column prop="event" label="事件"><template slot-scope="scope"><span>设备{{scope.row.event == '3'? '升级':scope.row.event == '2'?'上线':'离线' }}</span></template></el-table-column>
        <el-table-column prop="device_id" label="设备编号"></el-table-column>
        <el-table-column prop="version" label="设备版本号"></el-table-column>
        <el-table-column prop="time" :label="$t('time')"></el-table-column>
      </el-table>
      <Empty v-else></Empty>
      <div class="pagination border_shadow">
        <el-pagination :background="false" :page-size="row" :total="total" :current-page="page" @current-change="handleCurrentChange" layout="prev, pager, next,total,jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDeviceLog } from '_api/log_manage'
  import Empty from '_components/empty'

  export default {
    components: { Empty },
    data() {
      return {
        tableData: [],
        headerStyle() {
          return 'background-color:rgba(246,248,249,0.45);height:48px;border-radius:2px;text-align:center;font-size:16px;font-weight:500;color:#333333'
        },
        cellStyle() {
          return "text-align:center;height:56px"
        },
        eventList: [
          {
            value: '',
            label: this.$t('all'),
          },
          {
            value: '1',
            label: '设备离线',
          }, {
            value: '2',
            label: '设备上线',
          }, {
            value: '3',
            label: '设备升级',
          },
        ],
        searchBean: {
          device_id: '',
          event: '',
        },
        row: 10,
        page: 1,
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
          device_id: '',
          event: '',
        }
        this.getLogList()
      },
      // 获取日志列表
      getLogList(page = 1) {
        this.page = page
        let params = {
          row: this.row,
          page: this.page,
          ...this.searchBean
        }
        getDeviceLog(params).then((res) => {
          if (res.data.code === 200) {
            this.total = res.data.data.total
            this.tableData = res.data.data.list
          } else {
            this.$message.error(this.$t('data_acquisition_failed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      // 分页按钮事件回调
      handleCurrentChange(val) {
        this.getLogList(val)
      }
    },
  }
</script>

<style scoped lang="stylus">
  .log
    wh 100% 100%

    .head
      padding 30px 20px 0
      background white
      height auto
      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
    .body
      width 100%
      min-height calc(100vh - 300px)
      margin-bottom 10px
    .border_shadow
      background:rgba(249,252,255,1) !important;
      border:1px solid rgba(125, 189, 178, 0.1) !important;
      box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
      border-radius 4px !important

    .pagination
      display flex !important
      flex-direction row !important
      justify-content center !important
      padding 20px 0 !important
      margin-top 10px !important
      background #FFFFFF

</style>
<style lang="stylus">
  .el-table
    min-height calc(100vh - 300px) !important

  .el-form-item
    margin-right 20px !important
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