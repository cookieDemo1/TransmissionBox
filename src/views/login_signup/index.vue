<template>
  <div class="login_signup">
    <div class="content">
      <div class="log_log" style="position:absolute;top:30px;left:30px"><img src="./LOGO02.png" style="width:100%;height:100%" /></div>
      <div class="box_img" style="width:680px;height:640px;display:block"><img src="./img02.png" style="width:100%;height:100%" /></div>
      <div class="box">
        <div class="title" style="margin-bottom:0px">登录</div>
        <div class="logo" style="color:#999;margin-top:28px;margin-bottom:80px">
          <span>核对好账号及密码后进行登录</span>
        </div>
        <div class="input_box">
          <el-input class="noborder" prefix-icon="el-icon-user" :placeholder="$t('fill_in_phone')" v-model="phone" clearable="clearable"></el-input>
        </div>
        <div class="input_box">
          <el-input class="noborder" prefix-icon="el-icon-lock" @keyup.enter.native="toLogin" :placeholder="$t('fill_in_password')" v-model="password" clearable="clearable" show-password="show-password">
          </el-input>
        </div>
        <div class="input_box" style="margin-top:50px;">
          <el-button type="primary" width="100%" @click="toLogin" style="width: 100%;">{{$t('login')}}</el-button>
        </div>
        <div class="input_box">
          <div class="to_other">
            <el-link type="info" :underline="false" @click="toReset">{{$t('forget_password') +' ＞'}}</el-link>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="action_dialog" :visible.sync="dialogResetPwd" title="忘记密码" width="380px">
      <div class="tip">
        请联系超级管理员帮您重置密码，重置后的登录密码为：<span style="color: #19CCAE">YT123456789</span>
      </div>
      <div class="footer">
        <el-button class="button" type="primary" @click="dialogResetPwd=false">我知道了</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { login, getMenuRights } from '_api/login_signup'
  import { Base64 } from 'js-base64'
  import { SetDefaultHeader } from '_common/http'

  export default {
    data() {
      return {
        isLogin: true,
        phone: '',
        password: '',
        menuRights: [],
        dialogResetPwd: false
      }
    },
    methods: {
      toLogin() {
        if (!this.phone) {
          this.$message.error(this.$t('fill_in_phone_please'))
          return
        }
        if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
          this.$message.error(this.$t('fill_in_correct_phone_please'))
          return
        }
        if (!this.password) {
          this.$message.error(this.$t('fill_in_pwd_please'))
          return
        }
        SetDefaultHeader('Authorization', Base64.encode(`${this.phone}:${this.password}`))
        login().then((response) => {
          if (parseInt(response.data.code) === 200) {
            this.$message.success(this.$t('login_success'))
            const { name, phone, token } = response.data.data
            let authorization = 'Basic ' + token
            localStorage.setItem('Authorization', authorization)
            localStorage.setItem('Phone', phone)
            localStorage.setItem('UserName', name)
            SetDefaultHeader('Authorization', authorization)
            this.toGetMenuRights()
          } else {
            this.$message.error(response.data.msg)
          }
        })
      },
      toReset() {
        this.dialogResetPwd = true
      },
      toGetMenuRights() {
        getMenuRights().then((res) => {
          if (res.data.code === 200) {
            localStorage.setItem('rights', res.data.data)
            this.menuRights = res.data.data
            if (this.$route.query.from) {
              this.$router.replace(this.$route.query.from)
            } else {
              let routeUrl = this.getLoginJumpRoute()
              if (routeUrl) {
                this.$router.push(routeUrl)
              } else {
                this.$message.error(this.$t('without_authority'))
              }
            }
          } else {
            this.$message.error(this.$t('without_authority'))
          }
        })
      },
      getLoginJumpRoute() {
        if (this.menuRights.length) {
          let firstMenu = this.menuRights[0]
          let routeUrl = ''
          switch (firstMenu) {
            case '0':
            case '1':
              routeUrl = '/overview'
              break;
            case '2':
              routeUrl ='/device/manage'
              break;
            case '3':
            case '4':
              routeUrl ='/police/manage'
              break;
            case '5':
            case '6':
              routeUrl ='/log_manage'
              break;
            case '7':
              routeUrl ='/log_system'
              break;
            case '8':
              routeUrl ='/firmware_upgrade'
              break;
          }
          return routeUrl
        } else {
          return ''
        }
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .login_signup
    width 100%
    height 100%
    background #FAFBFB
    display flex
    justify-content center
    align-items center

    .content
      position relative
      display flex
      .box
        bgf()
        padding: 79px 100px 126px 100px;
        margin 0 auto
        width auto
        .logo
          display flex
          justify-content center
          margin-bottom 17px
          img
            wh 270px 91px
        .title
          fsc 26px #333333
          text-align center
          margin-bottom 80px

        .input_box
          width 300px !important
          display flex
          flex-direction row
          justify-content center
          margin-bottom 29px
          border-bottom 1px solid #EEEEEE
          &:last-child
            border-bottom 0
            margin-bottom 0
          .to_other
            fsc 16px #666666
            text-align center


  .noborder >>> {
    input{
      border none !important
    }
  }

  .action_dialog {
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

  .action_dialog >>> {
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
  }
</style>
