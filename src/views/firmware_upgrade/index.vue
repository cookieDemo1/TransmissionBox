<template>
  <div class="police mgauto" >
    <div class="add_firmware" v-if="add_firmware">
      <div class="s_title">
        <p>上传固件</p>
      </div>
      <el-form :inline="true">
        <el-form-item class="label" label="固件版本号">
          <el-input v-model="version" placeholder="填写版本号"></el-input>
        </el-form-item>
        <el-form-item class="label" label="上传固件包">
          <input type="file" ref="inputFile" @change="chooseFile()" />
        </el-form-item>
        <el-form-item class="label" label="备注 (选填)">
          <el-input v-model="remark" placeholder="填写备注"></el-input>
        </el-form-item>
        <el-form-item class="label">
          <el-button style="width: 220px;" @click="add_firmware_off">取消</el-button>
          <el-button style="width: 220px;" type="primary" @click="addFirmwareSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add_firmware_on" v-if="add_firmware" @click="add_firmware_off"></div>


    <div class="menu_box">
      <div class="tab_item">
        <el-tabs v-model="activeName">
          <el-tab-pane label="固件升级" name="first">
            <div class="search_item">
              <div class="search_item_top" style="display:flex;justify-content:space-between;width: 100%;">
                <el-form class="border_top" :inline="true">
                  <el-form-item :label="$t('device_code')" style="margin-right: 30px;">
                    <el-input v-model="searchDevicesParams.device_id" type="text" placeholder="填写设备编码" clearable="clearable" style="width:150px;"></el-input>
                  </el-form-item>
                  <el-form-item label="版本号" style="margin-right: 30px;">
                    <el-select v-model="searchDevicesParams.version" placeholder="全部" style="width:150px;">
                      <el-option v-for="item in versionList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态" style="margin-right: 30px;">
                    <el-select v-model="searchDevicesParams.state" placeholder="全部" clearable="clearable" style="width:150px;">
                      <el-option label="待升级" value="1"></el-option>
                      <el-option label="升级中" value="2"></el-option>
                      <el-option label="已升级" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="margin-right: 10px;">
                    <el-button style="width: 100px;" type="primary" @click="searchDevicesFirmware()">{{$t('search')}}</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button style="width: 100px;" @click="resetSearchDevicesParams">{{$t('reset')}}</el-button>
                  </el-form-item>
                </el-form>
                <el-form class="border_top" :inline="true">
                  <el-form-item>
                    <el-button style="width: 100px;" type="primary" @click="devicesUpgrade">升级固件</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <el-table class="border_shadow new_" v-if="realList.length" :data="realList" v-loading="loading" @selection-change="handleSelectionChange">
              <el-table-column class="nodejs" type="selection" header-align="center" align="center"></el-table-column>
              <el-table-column header-align="center" align="center" :label="$t('No')" width="100"><template slot-scope="scope"><span>{{(devicesPage-1)*devicesRow + scope.$index + 1}}</span></template></el-table-column>
              <el-table-column header-align="center" align="center" prop="id" label="设备编码"></el-table-column>
              <el-table-column header-align="center" align="center" prop="customer_name" label="所属客户"></el-table-column>
              <el-table-column header-align="center" align="center" prop="version" label="设备版本号"></el-table-column>
              <el-table-column header-align="center" align="center" prop="latest_version" label="最新版本"></el-table-column>
              <el-table-column header-align="center" align="center" prop="update_time" label="发布时间"></el-table-column>
              <el-table-column header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-row :gutter="20">
                    <el-col>
                      <el-button v-if="scope.row.state==='1'" @click="deviceUpgradeClick(scope.$index,scope.row)" type="text" size="small" style="color:#19CCAE">升级固件</el-button>
                      <el-button v-if="scope.row.state==='2'" type="text" size="small" style="color: #333333;cursor:default">升级中...</el-button>
                      <el-button v-if="scope.row.state==='3'" type="text" size="small" style="color: #333333;cursor:default">已是最新版本</el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
            <Empty v-else></Empty>

            <div class="pagination border_shadow new_" >
              <el-pagination :background="false" :page-size="devicesRow" :current-page="devicesPage" :total="devicesTotal" @current-change="devicesPageChange" layout="prev, pager, next,total,jumper"></el-pagination>
            </div>
          </el-tab-pane>

          <el-tab-pane label="固件包管理" name="second">
            <div class="search_item">
              <div class="search_item_top" style="display:flex;justify-content:space-between;width: 100%;">
                <el-form class="border_top" :inline="true" style="display: flex;flex-wrap: wrap;">
                  <el-form-item label="版本号" style="margin-right: 30px;">
                    <el-select v-model="searchFirmwaresParams.version" placeholder="全部">
                      <el-option v-for="item in versionList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="margin-right: 12px;">
                    <el-button style="width: 100px;" type="primary" @click="searchFirmwares()">{{$t('search')}}</el-button>
                  </el-form-item>
                  <el-form-item style="margin-right: 40px;">
                    <el-button style="width: 100px;" @click="resetSearchFirmwaresParams">{{$t('reset')}}</el-button>
                  </el-form-item>
                </el-form>
                <el-form class="border_top" :inline="true">
                  <el-form-item>
                    <el-button style="width: 100px;" type="primary" @click="add_firmware_on">上传固件</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <el-table class="border_shadow new_" v-if="firmwareList.length" :data="firmwareList" v-loading="loading">
              <el-table-column header-align="center" align="center" label="序号"><template slot-scope="scope"><span>{{(firmwaresPage-1)*firmwaresRow + scope.$index + 1}}</span></template></el-table-column>
              <el-table-column header-align="center" align="center" prop="type" label="设备类型"></el-table-column>
              <el-table-column header-align="center" align="center" prop="version" label="固件版本号"></el-table-column>
              <el-table-column header-align="center" align="center" prop="time" label="发布时间"></el-table-column>
              <el-table-column header-align="center" align="center" prop="remark" label="备注"></el-table-column>
              <el-table-column header-align="center" align="center" label="操作"><template slot-scope="scope">
                <el-button @click="showDeleteDialog(scope.row)" type="text" size="small" style="color:#FF4452">{{$t('delete')}}</el-button>
              </template></el-table-column>
            </el-table>
            <Empty v-else></Empty>
            <div class="pagination border_shadow">
              <el-pagination :background="false" :page-size="firmwaresRow" :current-page="firmwaresPage" :total="firmwaresTotal"  @current-change="firmwaresPageChange" layout="prev, pager, next,total,jumper"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-dialog :visible.sync="isTipDialogVisible" width="30%" center="center">
          <div class="tip" style="font-size:18px">确认删除吗？</div>
          <div class="el-dialog__footer">
            <el-button @click="cancelDelete()">{{$t('cancel')}}</el-button>
            <el-button type="danger" @click="sureDelete()">{{$t('sure')}}</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import Empty from '_components/empty'
  import { deviceFirmwareList, uploadFirmware, getFirmwareList, delFirmware, deviceUpgrade } from '_api/firmware_upgrade'

  export default {
    components: { Empty },
    data() {
      return {
        //添加固件
        add_firmware: false,
        version: '',
        remark: '',
        file: null,

        //删除固件
        isTipDialogVisible: false,
        tempFirmwareRow: {},

        loading: false,
        activeName: 'first',
        //第一个tab
        realList: [],
        //选取设备升级固件
        selectedDevices: [],
        //第二个tab
        firmwareList: [],

        //搜索相关
        versionList: [],
        searchDevicesParams: {
          device_id: '',
          version: '',
          state: '',
        },
        devicesPage: 1,
        devicesRow: 10,
        devicesTotal: 0,

        searchFirmwaresParams: {
          version: '',
        },
        firmwaresPage: 1,
        firmwaresRow: 10,
        firmwaresTotal: 0,
      }
    },
    mounted() {
      this.searchDevicesFirmware()
      this.searchFirmwares()
    },
    methods: {
      //设备列表
      resetSearchDevicesParams() {
        this.searchDevicesParams = {
          device_id: '',
          version: '',
          state: '',
        }
        this.searchDevicesFirmware()
      },
      searchDevicesFirmware(page = 1) {
        this.devicesPage = page
        let params = {
          row: this.devicesRow,
          page: this.devicesPage,
          ...this.searchDevicesParams,
        }
        deviceFirmwareList(params).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.devicesTotal = res.data.data.total
            this.realList = res.data.data.list
          } else {
            this.$message.error(this.$t('data_acquisition_failed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      devicesPageChange(val) {
        this.searchDevicesFirmware(val)
      },


      //固件列表
      resetSearchFirmwaresParams() {
        this.searchFirmwaresParams = {
          version: '',
        }
        this.searchFirmwares()
      },
      searchFirmwares(page =1) {
        this.firmwaresPage = page
        let params = {
          row: this.firmwaresRow,
          page: this.firmwaresPage,
          ...this.searchFirmwaresParams,
        }
        getFirmwareList(params).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.firmwaresTotal = res.data.data.total
            this.firmwareList = res.data.data.list
          } else {
            this.$message.error(this.$t('data_acquisition_failed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      firmwaresPageChange(val) {
        this.searchFirmwares(val)
      },

      //添加固件
      add_firmware_off() {
        this.add_firmware = false
      },
      add_firmware_on() {
        this.add_firmware = true
      },
      chooseFile() {
        if (this.$refs.inputFile.files[0]) {
          this.file = this.$refs.inputFile.files[0]
        }
      },
      addFirmwareSubmit() {
        let params = {
          file: this.file,
          version: this.version,
          remark: this.remark,
        }
        uploadFirmware(params).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('固件上传成功')
            this.add_firmware = false
            this.searchFirmwares()
          } else {
            this.$message.error('固件上传失败')
          }
        }).catch(() => {
          this.$message.error('固件上传失败')
        })
      },

      //删除固件
      showDeleteDialog(row) {
        this.isTipDialogVisible = true
        this.tempFirmwareRow = row
      },
      cancelDelete() {
        this.isTipDialogVisible = false
      },
      sureDelete() {
        this.isTipDialogVisible = false
        this.deleteFirmware()
      },
      deleteFirmware() {
        if (null === this.tempFirmwareRow)
          return
        delFirmware(this.tempFirmwareRow.id).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(this.$t('delete_success'))
            // 查找需要删除的是哪一行。
            let index = this.firmwareList.findIndex(item => {
              if (item.id == this.tempFirmwareRow.id) {
                return true
              }
            })
            // 本地数据删除某一行。
            this.firmwareList.splice(index, 1)
            this.firmwaresTotal = this.firmwaresTotal - 1
          } else {
            this.$message.error(this.$t('delete_failed'))
          }
        })
      },

      //选择多个固件升级
      handleSelectionChange(val) {
        this.selectedDevices = val.map(function(x) {
          return x.id
        })
      },
      devicesUpgrade() {
        if(this.selectedDevices.length==0){
          this.$message({
            message: '请选择要升级的固件',
            type: 'warning'
          });
          return
        }
        deviceUpgrade({ ids: this.selectedDevices }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("升级成功")
            this.searchDevicesFirmware()
          } else {
            this.$message.error(this.$t('data_acquisition_failed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      //单个固件升级
      deviceUpgradeClick(a,b){
        deviceUpgrade({ ids: [b.id] }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("提交成功")
            this.searchDevicesFirmware()
          } else {
            this.$message.error(this.$t('data_acquisition_failed'))
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
    },
  }
</script>

<style scoped lang="stylus">
  .police
    wh 100% 100%

    .add_firmware
      position absolute
      z-index 3
      background: rgba(255, 255, 255, 1)
      border-radius: 6px
      wh 580px 450px
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      flex-direction column

      .s_title
        margin-left 50px
        padding-top 30px
        font-size 20px
        font-weight 400
        color rgba(51, 51, 51, 1)
        line-height 15px

      .label
        margin-left 50px
        margin-top 40px
        font-size 16px
        font-weight 400
        color rgba(51, 51, 51, 1)
        line-height 15px

    .add_firmware_on
      z-index 2
      display flex
      align-items center
      wh 100% 100%
      background: rgba(51, 51, 51, 0.3);
      position absolute
      margin-top -100px
      margin-left -200px

    .menu_box
      width 100%
      height 100%

      .tab_item
        min-height calc(100vh - 300px)

        .search_item
          background_style()
          width 100%
          padding 0px 30px
          margin-bottom 10px

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
        background_style()

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
<style lang="stylus">
  .police_dialog
    width 550px
    padding 30px 50px !important

    .el-dialog__header
      text-align left !important
      font-weight 500

    .el-dialog__body
      padding: 0px 30px !important

      .police_form
        text-align left

        .el-form-item
          display flex
          flex-direction row
          margin-bottom 24px

          button

            fsc 16px #fff

            &:first-child
              background #B8C5D0

            &:last-child
              background #19CCAE

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

    padding 14px 0 0 30px !important
    margin-bottom 0 !important

    border-radius 4px !important
    border-bottom 0px !important
    border-bottom-right-radius 0px !important
    border-bottom-left-radius 0px !important
    background:rgba(249,252,255,1) !important;
    border:1px solid rgba(125, 189, 178, 0.1) !important;
    box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;

  .el-tabs__nav
    padding-bottom 6px

  .el-tabs__active-bar
    height 4px

  .el-tabs__item
    fsc 20px #333333

  .el-dialog__headerbtn
    display none

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

</style>

<style lang="stylus">
  .label
    .el-input
      width 380px

    .el-input__inner
      width: 380px;
      height: 40px;
      border: 1px solid rgba(204, 204, 204, 1);
      border-radius: 2px;

    .el-form-item
      margin 0

  .el-dialog
    .tip
      margin 10px 0 30px
      text-align center
      width 100%

    .el-dialog__footer
      display flex
      flex-direction row
      justify-content center

      .el-button
        width 120px
        font-size 16px
        margin 0px 20px


</style>
<style scoped>
  .search_item_top .border_top {
    padding-top: 24px;
    border-top: 0px;
  }


</style>
<style>
  .el-dialog .tip {
      margin: 10px 0 30px !important;
      text-align: center !important;
      width: 100% !important;
  }
</style>
<style scoped>
  
.menu_box >>> th{
    font-size: 16px !important;
  }
</style>

<style scoped>
  .add_firmware >>> .s_title {
    margin-left: 50px !important;
    padding-top: 30px !important;
    font-size: 20px !important;
    font-weight: 400 !important;
    color: #333 !important;
    line-height: 15px !important;
}
  .add_firmware >>> .el-form{
    display :flex  !important;
    flex-direction:column !important;
    padding-top:10px !important;
  }
  .add_firmware >>> .label{
      margin-left: 50px !important;
      margin-top: 25px !important;
      font-size: 16px !important;
      font-weight: 400 !important;
      color: #333 !important;
      line-height: 15px !important;
  }
  .add_firmware >>> .el-form-item__content {
      line-height: 40px !important;
      position: relative !important;
      font-size: 14px !important;
      flex: 1 !important;
  }
 
  .add_firmware >>> .el-form-item__label {
     text-align: right !important;
     vertical-align: middle !important;
     float: left !important;
     font-size: 14px !important;
     color: #606266 !important;
     line-height: 40px !important;
     padding: 0 12px 0 0 !important;
     -webkit-box-sizing: border-box !important;
     box-sizing: border-box !important;
     font-size: 16px !important;
     color: #666 !important;
     display: -webkit-box !important;
     display: -ms-flexbox !important;
     display: flex !important;
 }
   .add_firmware >>> .el-form-item__content .label .el-input {
     width: 380px !important;
 }
    .add_firmware >>> .el-form-item__content .label .el-input__inner {
     width: 380px;
     height: 40px;
     border: 1px solid #ccc;
     border-radius: 2px;
 }
</style>
<style scoped>

.police  >>>  .el-table__header-wrapper .el-table__header .is-leaf{
     background:#F2F3F7 !important;
 }
 
 .police  >>>  .el-table__body tbody .el-table__row ,.el-table{
     overflow: hidden;
     background:#FAFCFF !important;
 }
 
 .police  >>> .el-pagination button:disabled ,  .police  >>> .el-pager li{
     background:#FAFCFF !important;
 }
.police  >>> .el-pagination__editor.el-input .el-input__inner{
   background:#FAFCFF !important;
 }
 
.police  >>>  .search_item_top .el-input--suffix .el-input__inner{
   background:#FAFCFF !important;
 }
.police  >>>   .el-table--striped .el-table__body tr.el-table__row--striped td{
    background:#FAFCFF !important;
 }
</style>