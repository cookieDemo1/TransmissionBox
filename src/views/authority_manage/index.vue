<template>
  <div class="authority w1200 mgauto">
    <div class="head border_shadow new_">
      <div class="search_condition">
        <div style="display:flex;justify-content:space-between;width: 100%;">
          <el-form :inline="true">
            <el-form-item label="姓名" style="margin-bottom:0px">
              <el-input v-model="searchBean.name" placeholder="填写姓名" clearable="clearable" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('phone')" style="margin-bottom:0px">
              <el-input v-model="searchBean.phone" :placeholder="$t('authority_fill_in_phone')" clearable="clearable" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 20px; margin-right: 10px;margin-bottom:0px">
              <el-button @click="getAuthorityList()" type="primary">{{$t('search')}}</el-button>
            </el-form-item>
            <el-form-item style="margin-right: 10px;margin-bottom:0px">
              <el-button @click="resetSearchParams">{{$t('reset')}}</el-button>
            </el-form-item>
          </el-form>
          <el-form :inline="true">
            <el-form-item style="margin-bottom:0px">
              <el-button @click="addRow" type="primary">{{$t('add_manager')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="body">
      <el-table class="border_shadow new_" v-if="tableData.length" :data="tableData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle">
        <el-table-column :label="$t('No')" width="100"><template slot-scope="scope"><span>{{(page-1) * row + scope.$index + 1 }}</span></template></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" :label="$t('phone')"></el-table-column>
        <el-table-column prop="rights" :label="$t('authority')" width="150px"><template slot-scope="scope">
          <el-tooltip class="item" :content="getRight(scope.row.rights)" effect="dark" placement="top" popper-class="test"><span style="width: 4em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;color:#19CCAE">{{getRight(scope.row.rights)}}</span></el-tooltip>
        </template></el-table-column>
        <el-table-column prop="creator" :label="$t('creator')"></el-table-column>
        <el-table-column prop="time" :label="$t('create_time')"></el-table-column>
        <el-table-column :label="$t('operation')"><template slot-scope="scope">
          <el-button v-if="scope.row.role !== '2'" @click="showDeleteDialog(scope.row)" type="text" size="small" style="color:#FF4452">删除</el-button>
          <el-button v-if="scope.row.role !== '2'" @click="modifyRow(scope.row)" type="text" size="small">{{$t('modify')}}</el-button>
          <el-button v-if="scope.row.role !== '2'" @click="resetPwdRow(scope.row)" type="text" size="small">重置密码</el-button>
        </template></el-table-column>
      </el-table>
      <Empty v-else></Empty>
    </div>
    <div class="pagination border_shadow new_">
      <el-pagination :background="false" :page-size="row" :total="total" :current-page.sync="page" @current-change="handleCurrentChange" layout="prev, pager, next,total,jumper"></el-pagination>
    </div>

    <div class="scope_dialog">
      <el-dialog :visible.sync="isDialogVisible" :title="isCreate ? $t('add_manager') : $t('modify_manager') " :width="dialogWidth+'px'" center="center">
        <el-form ref="form" :model="dialogMessage" :inline="true">
          <el-form-item label="姓名">
            <el-input class="authority_input" v-model="dialogMessage.name" :placeholder="$t('tip_fill_in_name')" autocomplete="off" type="text" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item :label="$t('phone')">
            <el-input class="authority_input" v-model="dialogMessage.phone" :placeholder="$t('fill_in_phone')" type="number" autocomplete="off" :disabled="isCreate?false:true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('select_permissions')">
            <el-checkbox-group v-model="chooiceRight">
              <el-checkbox v-for="right in rights" :label="right" :key="right">{{right}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="el-dialog__footer">
          <el-button @click="clickCancelDialog()">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="clickSureDialog()">{{$t('sure')}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="isTipDialogVisible" :title="$t('delete_manager')" width="30%" center="center">
        <div class="tip">{{$t('tip_delete')}}</div>
        <div class="el-dialog__footer">
          <el-button @click="cancelDelete()">{{$t('cancel')}}</el-button>
          <el-button type="danger" @click="sureDelete()">{{$t('sure')}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogResetPwd" title="重置密码" width="30%" center="center">
        <div class="tip">重置后的登录密码为：<span style="color: #19CCAE">YT123456789</span>，确定重置密码？</div>
        <div class="el-dialog__footer">
          <el-button @click="dialogResetPwd=false">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="sureResetPwd">{{$t('sure')}}</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import { resetPwd } from '_api/login_signup'
  import { getAuthorityList, addManager, modifyManager, deleteManager } from '_api/authority_manage'
  import { deepCopy } from '_common/util'
  import Empty from '_components/empty'

  export default {
    components: {
      Empty,
    },
    data() {
      return {

        searchBean: {
          name: '',// 姓名
          phone: '',// 手机号
        },
        row: 10,
        page: 1,
        total: 0,


        headerStyle() {
          return 'background-color:rgba(246,248,249,0.45);height:48px;border-radius:2px;text-align:center;font-size:16px;font-weight:500;color:#333333'
        },
        cellStyle() {
          return 'text-align:center;height:56px'
        },
        tableData: [],


        // 新建客户Dialog相关
        isDialogVisible: false,
        dialogWidth: '650',


        isCreate: true,
        dialogMessage: {
          'id': '',
          'name': '',
          'phone': '',
          'role': '0',
          'rights': [],
        },


        // 不能直接用dialogMessage.right,el-checkbox-group会触发选一个就把其它全部自动选上的bug
        chooiceRight: [],


        // 删除站点提示框相关
        isTipDialogVisible: false,
        tempManagerBean: {},
        role: localStorage.getItem('Role') || '1',

        dialogResetPwd: false,
        rights: [
          '监控管理',
          '设备管理',
          '报警管理',
          '权限管理',
          '操作日志',
          '系统日志',
          '固件升级',
        ]
      }
    },

    mounted() {
      this.getAuthorityList()
    },
    methods: {
      // 重置搜索条件
      resetSearchParams() {
        this.searchBean = {
          name: '',
          phone: '',
        }
        this.getAuthorityList()
      },
      // 获取管理员列表
      getAuthorityList(page = 1) {
        this.page = page
        let params = {
          row: this.row,
          page: this.page,
          name: this.searchBean.name,
          phone: this.searchBean.phone,
        }
        getAuthorityList(params).then((res) => {
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
      handleCurrentChange(val) {
        this.getAuthorityList(val)
      },

      // 将权限数组拆分并在中间加上,再显示出来
      getRight(array) {
        let rightString = ''
        if (array) {
          for (let i = 0; i < array.length; i++) {
            if (i == 0) {
              rightString += this.transformNumToRight(array[i])
            } else {
              rightString = rightString + ',' + this.transformNumToRight(array[i])
            }
          }
        }
        return rightString
      },

      transformRightToNum(val) {
        switch (val) {
          // case '监控管理':
          case this.$t('monitoring_management'):
            val = '1'
            break
          // case '设备管理':
          case this.$t('device_management'):
            val = '2'
            break
          // case '客户管理':
          case this.$t('client_management'):
            val = '3'
            break
          // case '报警管理':
          case this.$t('alarm_management'):
            val = '4'
            break
          // case '权限管理':
          case this.$t('authority_management'):
            val = '5'
            break
          case '操作日志':
            val = '6'
            break
          case '系统日志':
            val = '7'
            break
          case '固件升级':
            val = '8'
            break
          default:
            val = ''
            break
        }
        return val
      },
      // 例子：['监控管理','设备管理']转换成['1','2']
      transformRightsNum(val) {
        let array = []
        if (val.length === 10) {// 如果选了7个权限，则用['0']代替
          array = ['0']
        } else if (val.length > 0) { // 如果小于10，把汉字字符数组转成用'0','1','2'的数组
          for (let i = 0, j = 0; i < val.length; i++) {
            let variable = this.transformRightToNum(val[i])
            if (variable === '') {
              continue
            } else {
              array[j] = variable
              j++
            }
          }
          array.sort().join('').split('')// 重新排序并且去除空串
        }
        return array
      },

      //删除
      showDeleteDialog(row) {
        this.isTipDialogVisible = true
        this.tempManagerBean = row
      },
      cancelDelete() {
        this.isTipDialogVisible = false
      },
      sureDelete() {
        this.isTipDialogVisible = false
        this.deleteRow()
      },
      deleteRow() {
        if (null === this.tempManagerBean)
          return
        deleteManager(this.tempManagerBean.id).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(this.$t('delete_success'))
            // 查找需要删除的是哪一行。
            let index = this.tableData.findIndex(item => {
              if (item.id == this.tempManagerBean.id) {
                return true
              }
            })
            // 本地数据删除某一行。
            this.tableData.splice(index, 1)
            this.total = this.total - 1
          } else {
            this.$message.error(this.$t('delete_failed'))
          }
        })
      },

      // 新增管理员
      addRow() {
        this.isDialogVisible = true
        this.isCreate = true
        for (let key in this.dialogMessage) {
          this.dialogMessage[key] = ''
        }
        this.dialogMessage.role = '0'
        this.chooiceRight = []
      },
      // 修改管理员
      modifyRow(row) {
        this.isDialogVisible = true
        this.isCreate = false
        this.dialogMessage = deepCopy(row)
        // 如果不用deepCopy，改了this.chooiceRight会改变this.dialogMessage.right，修改失败无法还原了。
        this.chooiceRight = this.transformNumRight(deepCopy(this.dialogMessage.rights))
      },
      // 例子：['1','2']转换成['监控管理','设备管理']
      transformNumRight(val) {
        let array = []
        if (val[0] === '0') { // ['0']代表选了全部
          array = this.rights
        } else if (val.length > 0) {
          for (let i = 0, j = 0; i < val.length; i++) {
            let variable = this.transformNumToRight(val[i])
            if (variable === '') {
              continue
            } else {
              array[j] = variable
              j++
            }
          }
          array.sort().join('').split('')// 重新排序并且去除空串
        }
        return array
      },
      transformNumToRight(val) {
        switch (val) {
          case '0':
            val = this.$t('all_privileges')
            break
          case '1':
            // val = '监控管理'
            val = this.$t('monitoring_management')
            break
          case '2':
            // val = '设备管理'
            val = this.$t('device_management')
            break
          case '3':
            val = this.$t('client_management')
            break
          case '4':
            val = this.$t('alarm_management')
            break
          case '5':
            val = '权限管理'
            break
          case '6':
            val = '操作日志'
            break
          case '7':
            val = '系统日志'
            break
          case '8':
            val = '固件升级'
            break
          default:
            val = ''
        }
        return val
      },
      clickCancelDialog() {
        this.isDialogVisible = false
      },
      clickSureDialog() {
        if (!this.checkState()) {
          return
        }
        if (this.isCreate) {
          this.clickAddManager()
        } else {
          this.clickModifyManager()
        }
      },
      // 检查新增或者修改的客户数据是否达标
      checkState() {
        if (!this.dialogMessage.name) {//
          this.$message.warning(this.$t('tip_lack_name'))
          this.dialogMessage.name = ''
          return false
        } else if (this.dialogMessage.name && (/[^\u4E00-\u9FA5]/g.test(this.dialogMessage.name))) {
          this.$message.warning(this.$t('tip_lack_pure_chinese_name'))
          return false
        }
        else if (!this.dialogMessage.phone) {
          this.$message.warning(this.$t('fill_in_phone_please'))
        } else if (this.dialogMessage.phone && !(/^1[0-9]{10}$/.test(this.dialogMessage.phone))) {
          this.$message.warning(this.$t('fill_in_correct_phone_please'))
          return false
        } else if (this.chooiceRight === undefined || this.chooiceRight.length === 0) {
          this.$message.warning(this.$t('tip_lack_authority'))
          return false
        } else {
          return true
        }
      },
      // 新增管理员
      clickAddManager() {
        let body = deepCopy(this.dialogMessage)
        delete body.id
        delete body.time
        delete body.creator
        delete body.role
        body.rights = this.transformRightsNum(deepCopy(this.chooiceRight))
        addManager(body).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(this.$t('added_success'))
            this.isDialogVisible = false
            this.getAuthorityList()
          } else {
            if (res.data.code === 10006) {
              this.$message.error(this.$t('phone_is_exist'))
            } else {
              this.$message.error(this.$t('added_failed'))
            }
          }
        })
      },
      // 修改管理员
      clickModifyManager() {
        let body = deepCopy(this.dialogMessage)
        delete body.id
        delete body.creator
        delete body.time
        delete body.password
        delete body.role
        body.rights = this.transformRightsNum(deepCopy(this.chooiceRight))
        modifyManager(this.dialogMessage.id, body).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(this.$t('modify_success'))
            this.isDialogVisible = false
            if (body.phone === localStorage.getItem('Phone')) {
              localStorage.removeItem('rights')
              window.location.reload()
            } else {
              this.getAuthorityList()
            }
          } else {
            if (res.data.code === 10006) {
              this.$message.error(this.$t('phone_is_exist'))

            } else {
              this.$message.error(this.$t('modify_failed'))
            }
          }
        })
      },

      // 密码重置
      resetPwdRow(row) {
        this.tempManagerBean = row
        this.dialogResetPwd = true
      },
      sureResetPwd(){
        const { user_id } = this.tempManagerBean
        let params = { user_id }
        resetPwd(params).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('密码重置成功')
            this.dialogResetPwd = false
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },


    },
  }
</script>

<style scoped lang="stylus">
  .authority
    wh 100% 100%
    .add_box
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

    .add_box_on
      z-index 2
      display flex
      align-items center
      wh 100% 100%
      background: rgba(51, 51, 51, 0.3);
      position absolute
      margin-top -116px
      margin-left -220px
    .border_shadow
      background:rgba(249,252,255,1);
      border:1px solid rgba(125, 189, 178, 0.1);
      box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2);
      border-radius:4px;
    .head
      padding 20px 30px
      background white
      width 100%
      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
    .body
      width 100%
      min-height calc(100vh - 380px)
      margin-bottom 10px
      background white
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
  .el-tooltip__popper[x-placement^=top] .popper__arrow {
    border-top-color: white;
  }

  .el-tooltip__popper[x-placement^=top] .popper__arrow:after {
    border-top-color: white;

  }

  .test {
    background: rgba(255, 255, 255, 1) !important;
    box-shadow: 0px 0px 6px 0px rgba(25, 204, 174, 0.2) !important;
    border-radius: 4px !important;
    border: 1px solid rgba(25, 204, 174, 0.13) !important;
    color: #333 !important;
    font-size 14px
  }
</style>

<style scoped>
.authority >>> .el-checkbox.is-bordered+.el-checkbox.is-bordered {
      margin-left: 0px;
  }
.authority >>> .el-table__body tbody {
   background:#FAFCFF !important;
   border:1px solid rgba(125, 189, 178, 0.1) !important;
   box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2) !important;
   border-radius:4px !important;
 }
</style>
<style scoped>

.authority >>>  .el-table__header-wrapper .el-table__header  .is-leaf{
     background:#F2F3F7 !important;
 }
 
 .authority >>>  .el-table__body tbody .el-table__row ,.el-table{
     overflow: hidden;
     background:#FAFCFF !important;
 }
 
 .authority >>> .el-pagination button:disabled ,  .authority >>> .el-pager li{
     background:#FAFCFF !important;
 }
.authority >>> .el-pagination__editor.el-input .el-input__inner{
   background:#FAFCFF !important;
 }
 
.authority >>>  .search_condition .el-input--suffix .el-input__inner{
   background:#FAFCFF !important;
 }
 
.authority >>>   el-table tr{
  background: red;
}

.authority >>> .el-table__fixed-header-wrapper  .is-leaf{
  background: #F2F4F5 !important;
}
</style>





<style scoped lang="stylus">
  .scope_dialog >>>
    .el-dialog
      padding 20px!important
      .el-form
        width 100%
        margin-bottom 24px
        .el-form-item__label
          text-align left !important
          min-width 80px !important
          fsc 14px #666666 !important
          margin-left 40px !important
        .el-form-item_content
          width 340px !important
        .el-select
          width 340px !important
        .el-input__inner
          padding-left 12px !important
          width 340px !important
        .el-checkbox-group
          margin-left 40px !important
        .el-checkbox
          width 100px !important
          margin-right 16px !important
      .tip
        font-size:18px;
        margin 10px 0 30px !important
        text-align center !important
        width 100% !important


      .el-dialog__footer
        display flex
        flex-direction row
        justify-content center
        .el-button
          width 120px
          font-size 16px
          margin 0px 20px


  .el-table
    min-height calc(100vh - 300px) !important
</style>
