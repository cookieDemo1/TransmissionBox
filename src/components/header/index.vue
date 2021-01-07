<template>
  <div class="header">
    <div class="content">
      <div class="title"><img src="./LOGO01.png" v-show="showGo" /><span>{{companyName}}</span></div>
      <div class="device">
        <div class="device-item-1" v-popover:device-item-1 @mouseenter="triggle1(1)" @mouseleave="triggle1(0)" @click="jumpPage('/device/manage')" style="cursor:pointer">
          <div class="icon">
            <svg-icon icon-class="csx01"> </svg-icon>
          </div>
          <div class="transform-box-title">
            <span v-if="boxList.total=='0'">传输箱</span>
            <span v-else>传输箱{{boxList.total}}台</span>
          </div>
          <el-popover placement="top" title="" v-model="tran1" trigger="hover" ref="device-item-1" v-if="boxList.total!='0'">
            <div class="el-popover_title"><span>多功能传输箱设备数</span></div>
            <div class="el-content_content_box">
              <div class="content_box">
                <div class="div-one">
                  <div class="icon">
                    <svg-icon icon-class="csx02"></svg-icon>
                  </div>
                </div>
                <div class="div-two"><span>{{boxList.total}}台</span><span>总设备数</span></div>
              </div>
              <div class="content_box">
                <div class="div-one">
                  <div class="icon">
                    <svg-icon icon-class="csx03"></svg-icon>
                  </div>
                </div>
                <div class="div-two"><span>{{boxList.online}}台</span><span>在线设备数</span></div>
              </div>
              <div class="content_box">
                <div class="div-one">
                  <div class="icon">
                    <svg-icon icon-class="csx04"></svg-icon>
                  </div>
                </div>
                <div class="div-two"><span>{{boxList.offline}}台</span><span>离线设备数</span></div>
              </div>
            </div>
          </el-popover>
          <div class="transform-box">
            <div class="icon-jiantou" ref="zhankai1">
              <svg-icon icon-class="xxgwd"></svg-icon>
            </div>
          </div>
        </div>
        <div class="device-item-2" v-popover:device-item-2 @mouseenter="triggle2(1)" @mouseleave="triggle2(0)" @click="jumpPage('/device/manage')" style="cursor:pointer">
          <div class="icon">
            <svg-icon icon-class="sxt01"></svg-icon>
          </div>
          <div class="transform-box-title"><span v-if="CameraList.total=='0'">摄像头</span><span v-else>摄像头{{CameraList.total}}台</span></div>
          <el-popover placement="top" v-model="tran2" trigger="hover" ref="device-item-2" v-if="CameraList.total!='0'">
            <div class="el-popover_title"><span>摄像头设备数</span></div>
            <div class="el-content_content_box">
              <div class="content_box">
                <div class="div-one">
                  <div class="icon">
                    <svg-icon icon-class="sxt02"></svg-icon>
                  </div>
                </div>
                <div class="div-two"><span>{{CameraList.total}}台</span><span>总设备数</span></div>
              </div>
              <div class="content_box">
                <div class="div-one">
                  <div class="icon">
                    <svg-icon icon-class="sxt03"></svg-icon>
                  </div>
                </div>
                <div class="div-two"><span>{{CameraList.online}}台</span><span>在线设备数</span></div>
              </div>
              <div class="content_box">
                <div class="div-one">
                  <div class="icon">
                    <svg-icon icon-class="sxt04"></svg-icon>
                  </div>
                </div>
                <div class="div-two"><span>{{CameraList.offline}}台</span><span>离线设备数</span></div>
              </div>
            </div>
          </el-popover>
          <div class="transform-box">
            <div class="icon-jiantou" ref="zhankai2">
              <svg-icon icon-class="xxgwd"></svg-icon>
            </div>
          </div>
        </div>
        <div class="device-item-3" v-popover:device-item-3 @mouseenter="triggle3(1)" @mouseleave="triggle3(0)" @click="jumpPage('/police/manage')" style="cursor:pointer">
          <div class="icon">
            <svg-icon icon-class="ssbj01"></svg-icon>
          </div>
          <div class="transform-box-title">
            <span v-if="WarningList.total=='0'">实时报警</span>
            <span v-else>实时报警{{WarningList.total}}条</span>
          </div>
          <el-popover placement="top" v-model="tran3" trigger="hover" ref="device-item-3" v-if="WarningList.total!='0'">
            <div class="el-content_content_box" style="display:flex;flex-direction:column">
              <div class="el-content_content_box_two" v-for="(item,index) in WarningList.list" :key="index">
                <span class="box_two_one">{{item.desc}}</span>
                <span class="box_two_two">{{item.time}}</span>
              </div>
            </div>
          </el-popover>
          <div class="transform-box">
            <div class="icon-jiantou" ref="zhankai3">
              <svg-icon icon-class="xxgwd"></svg-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="avatar">
        <img src="./toux.png" />
      </div>
      <div class="usermsg">
        <div class="username"><span>{{localStorage.getItem('UserName')}}</span>
          <div class="sign_out" v-if="!localStorage.getItem('Phone')" @click="sureLogout">去登入</div>
          <el-dropdown v-else @command="handleCommand" placement="bottom">
            <div class="user_message">
              <div class="phone">{{localStorage.getItem('Phone') | formatPhone}}</div>
              <div class="icon">
                <svg-icon icon-class="xxgwd"></svg-icon>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
              <el-dropdown-item command="忘记密码">忘记密码</el-dropdown-item>
              <el-dropdown-item command="退出登录">{{$t('exit_login')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

    </div>

    <el-dialog class="form_dialog" :visible.sync="dialogModifyPwd" :title="$t('change_password')" width="415px" :destroy-on-close="true">
      <el-form ref="form" :rules="modifyPwdRules" :model="modifyPwdData" label-position="left" label-width="90px">
        <el-form-item label="原密码" prop="o_pwd">
          <el-input  v-model="modifyPwdData.o_pwd" placeholder="填写原密码" type="password"  show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="n_pwd">
          <el-input  v-model="modifyPwdData.n_pwd" placeholder="字母+数字、10-16位数" type="password"  show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button class="button" @click="dialogModifyPwd=false">{{$t('cancel')}}</el-button>
        <el-button class="button" type="primary" @click="sureModifyPwd('form')">{{$t('save')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog class="action_dialog" :visible.sync="dialogResetPwd" title="忘记密码" width="380px">
      <div class="tip">
        请联系超级管理员帮您重置密码，重置后的登录密码为：<span style="color: #19CCAE">YT123456789</span>
      </div>
      <div class="footer">
        <el-button class="button" type="primary" @click="dialogResetPwd=false">我知道了</el-button>
      </div>
    </el-dialog>

    <el-dialog class="action_dialog" :visible.sync="dialogLogout" title="退出登录" width="380px">
      <div class="tip">
        确定退出吗？
      </div>
      <div class="footer">
        <el-button class="button" @click="dialogLogout=false">{{$t('cancel')}}</el-button>
        <el-button class="button" type="primary" @click="sureLogout">{{$t('sure')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {HttpgetBoxNum,HttpgetCameraNum,HttpgetWarningMsg} from '_api/header'
  import {modifyPwd} from '_api/login_signup'
  import SvgIcon from '_components/SvgIcon'
  import Bus from '@/bus'

  export default {
    components: {
      SvgIcon,
    },
    data() {
      return {
        icon: './LOGO01.png',
				companyName:'宇泰多功能传输箱管理平台',

        localStorage: window.localStorage,
        qrcodeVisible: false,
        deviceVisible:false,
        tran1:false,
        tran2:false,
        tran3:false,

        waitTime: 60,
        canClick: true, //添加canClick
        unReadMsgNum: 0,
        dialogWidth:500,
        boxList:'',
        CameraList:'',
        WarningList:'',
        showGo:null,

        dialogResetPwd: false,
        dialogModifyPwd: false,
        modifyPwdData:{},
        modifyPwdRules: {
          o_pwd: [
            { required: true,message:'请输入原密码' , trigger: 'blur' },
          ],
          n_pwd: [
            { required: true,message:'请输入新密码' , trigger: 'blur' },
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: '密码由数字、字母组成',
              trigger: 'blur'
            },
            { min: 10, max: 16, message: '密码长度为 10 到 16 个字符', trigger: 'blur' },
          ],
        },

        dialogLogout: false,
      }
    },
    mounted() {
      this.getBoxNum()
      this.getCameraNum()
      this.getWarningMsg()
      Bus.$on('showCityName',(x)=>{
        this.showGo=!x
      })
    },
    methods: {
      triggle1(p) {
        if(p==1) {
          this.$refs.zhankai1.style.transform = 'rotate(-180deg)'
          this.$refs.zhankai1.style.transition = '0.5s'
        }
        if(p==0) {
          this.$refs.zhankai1.style.transform = 'rotate(0deg)'
          this.$refs.zhankai1.style.transition = '0.5s'
        }
      },
      triggle2(p) {
        if(p==1) {
          this.$refs.zhankai2.style.transform = 'rotate(-180deg)'
          this.$refs.zhankai2.style.transition = '0.5s'
        }
        if(p==0) {
          this.$refs.zhankai2.style.transform = 'rotate(0deg)'
          this.$refs.zhankai2.style.transition = '0.5s'
        }
      },
      triggle3(p) {
        if(p==1) {
          this.$refs.zhankai3.style.transform = 'rotate(-180deg)'
          this.$refs.zhankai3.style.transition = '0.5s'
        }
        if(p==0) {
          this.$refs.zhankai3.style.transform = 'rotate(0deg)'
          this.$refs.zhankai3.style.transition = '0.5s'
        }
      },
      // 获取传输箱的信息
      getBoxNum(){
        HttpgetBoxNum()
          .then((res) => {
            if(res.data.code === 200){
              this.boxList = res.data.data
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      // 获取摄像头的信息
      getCameraNum(){
        HttpgetCameraNum()
          .then((res) => {
            if(res.data.code === 200){
              this.CameraList = res.data.data
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      // 获取报警信息
      getWarningMsg(){
        HttpgetWarningMsg()
          .then((res) => {
            if(res.data.code === 200){
              this.WarningList = res.data.data
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      handleCommand(command) {
        if(command === '修改密码') {
          this.modifyPwdData = {}
          this.dialogModifyPwd = true
        }else if(command === '忘记密码') {
          this.dialogResetPwd = true
        }else if(command === '退出登录') {
          this.dialogLogout = true
        }
      },
      sureModifyPwd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = { ...this.modifyPwdData }
            modifyPwd(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success('密码修改成功')
                this.dialogModifyPwd = false
              } else {
                this.$message.error(res.data.msg)
              }
            }).catch(() => {
              this.$message.error(this.$t('data_acquisition_failed'))
            })
          } else {
            return false;
          }
        });
      },
      sureLogout() {
        this.dialogLogout = false
        localStorage.clear()
        this.$router.replace(`/login_signup?isLogin=1`)
      },
      jumpPage(path){
        this.$router.push(path)
      }
    },
  }
</script>

<style lang="stylus" scoped>
  imgStyle()
    display flex
    wh 38px 38px
    margin-right 10px
    border-radius 50%

  .header
    width 100%
    height 70px
    padding 0px 20px
    border-bottom 1px solid rgba(25, 204, 174, 0.13)
    background:#FDFFFD;
    box-shadow:0px 0px 8px 0px rgba(125,189,178,0.2);
    border-radius:4px 4px 0px 0px;
    .content
      display flex
      align-items center
      height 100%
      .title
        flex 1
        display flex
        flex-direction row
        align-items center
        height 100%
        img
          display flex
          max-height 80px
          max-width 130px
          margin-right 14px
        span
          display flex
          fsc 24px rgba(51,51,51,1);
          font-weight:400;
          cursor pointer
      .avatar
        display flex
        margin-right 10px
        img
          wh 44px 44px
          border-radius 50%

      .usermsg
        .username
          display flex
          flex-direction column
          position relative
          span
            font-size 14px
      .device
        display flex
        position relative
        height 70px
        .device-item-1
          margin-right 31px
          display flex
          fct()
          .icon
            wh 30px 30px
            color #666
          .transform-box-title
              margin 0px 5px
              font-size 16px
              color #333

          .transform-box
            display flex
            flex-direction row
            fct()
            .icon-jiantou
              wh 12px 12px
              fct()
        .device-item-2
          display flex
          margin-right 31px
          fct()
          .icon
            wh 30px 30px
            color #666
          .transform-box-title
              margin 0px 5px
              font-size 16px
              color #333

          .transform-box
            display flex
            flex-direction row
            fct()
            .icon-jiantou
              wh 12px 12px
              fct()
        .device-item-3
          margin-right 31px
          display flex
          fct()
          .icon
            svg
              wh 30px 30px
              color #666
          .transform-box-title
              margin 0px 5px
              font-size 16px
              color #333

          .transform-box
            display flex
            flex-direction row
            fct()
            .icon-jiantou
              wh 12px 12px
              fct()


      .download_app
        display flex
        align-items center
        cursor pointer
        span
          display flex
          padding 0 4px
          fsc 16px #19CCAE

      .mail
        display flex
        margin 0 40px
        position relative
        cursor pointer
        .icon
          wh 24px 20px
          fill #FFFFFF
        span
          display flex
          justify-content center
          align-items center
          position absolute
          right -16px
          top -10px
          padding 2px 4px
          background #FF4452
          border-radius 7px
          fsc 10px #FFF
      .sign_out
        fsc 16px #19CCAE
      .user_message
        display flex
        flex-direction row
        align-items center
        margin-right 10px
        cursor pointer
        .phone
          display flex
          flex-direction column
          margin-right 10px
          fsc 12px #999
        .icon
          wh(12px,12px)
          position: absolute;
          right: 0;
          transform: translate(0, -100%);
      .el-dropdown-item
        display flex
        flex-direction row
      .item
        display flex
        flex-direction row
        .img
          wh(10px,10px)
        span
          fsc 12px #666
    .el-dialog
      display flex
      flex-direction column
</style>

<style lang="stylus">
  .el-content_content_box
    df 1
    .content_box
      df 1
      fdc 1
      pb 19
      pr 25
      pl 25
      div.div-one
        mt 25
        mb 16
        fct()
        .icon
          wh 42px 42px
      div.div-two
        df 1
        fdc 1
        text-align center
        span
          font-size 14px
          color #585B61
    .el-content_content_box_two
      df 1
      fdr 1
      pb 12
      pr 25
      pl 25
      span.box_two_one
        pr 30
        fc 14 #333
      span.box_two_two
        fc 14 #333
  .el-popover_title
    df 1
    fct()
    text-align center
    span
      color #585B61
      font-size 16px
</style>


<style scoped lang="stylus">

  .form_dialog,.action_dialog {
    .tip {
      text-align: left !important;
      font-size:14px;
      color:rgba(102,102,102,1);
      line-height:22px;
      margin-bottom 20px
    }

    .footer{
      display flex
      flex-direction row
      justify-content center
      .button {
        flex 1
        font-size: 16px !important;
      }
    }
  }

  .form_dialog >>> ,.action_dialog >>> {
    .el-dialog {
      border-radius:8px;
      padding 20px!important
    }
    .el-dialog__header{
      padding 10px 30px
      text-align: left !important;
      .el-dialog__title{
        font-size:20px;
        color:rgba(51,51,51,1);
      }
    }
    .el-dialog__body{
      padding 10px 30px
    }

    .el-form {
      margin-bottom 40px
      .el-form-item__label{
        text-align left!important
        margin-left: 0px !important;
        font-size:16px;
        color:rgba(51,51,51,1);
      }
      .el-input__inner{
        width 225px !important
      }
    }
  }
</style>

