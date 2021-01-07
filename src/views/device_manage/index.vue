<template>
  <div class="device_detail">
    <!-- 设备列表-->
    <device-top
      :currentIndex="currentIndex"
      :deviceList="deviceList"
      @addNewDevice="addNewDevice"
      @toDeviceDetail="toDeviceDetail">
    </device-top>
    <div class="content">
      <device-left
        class="device_left"
        :deviceId="deviceId"
        :deviceBean="deviceBean"
        :deviceAttr="deviceAttr"
        @editDevice="editDevice"
        @deleteDevice="dialogDeleteDevice=true"
        @restartDevice="dialogRestartDevice=true"
        @changeSwitch1="changeSwitch1"
        @changeSwitch2="changeSwitch2"
        @changeSwitch3="changeSwitch3"
        @changeSwitchOut="changeSwitchOut"
      >
      </device-left>
      <device-right
        class="device_right"
        :deviceBean="deviceBean"
        :deviceAttr="deviceAttr"
        :camerasList="camerasList"
        :recloseData="recloseData"
        @toVideo="toVideo"
        @editCamera="editCamera"
        @deleteCamera="deleteCamera"
        @addCamera="addCamera"
        @policeSetting="policeSetting"
        @changeSwitchOut="changeSwitchOut">
      </device-right>
    </div>

    <el-dialog class="form_dialog" :visible.sync="dialogAddDevice" :destroy-on-close="true">
      <form-with-hint>
        <template v-slot:form>
          <el-form :rules="deviceRules" ref="addDeviceForm" :model="addDeviceData" label-position="left" label-width="140px">
            <div class="title">新增设备</div>
            <el-form-item :label="$t('serial_number')" prop="id">
              <el-input v-model="addDeviceData.id" type="text" :placeholder="$t('fill_in_serial_nmuber')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="addDeviceData.name" type="text" :placeholder="$t('fill_in_device_name')"></el-input>
            </el-form-item>
            <el-form-item class="is-required" label="安装地址">
              <div style="display:flex">
                <el-form-item label="" style="margin-right:10px">
                  <el-select v-model="addressValue.province" placeholder="省" @change="selectProvince()">
                    <el-option v-for="item in addressValue.mProvinceList" :key="item.value" :label="item.text" :value="item.text"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" style="margin-right:10px">
                  <el-select v-model="addressValue.city" placeholder="市" @change="selectCity()">
                    <el-option v-for="item in addressValue.mCityList" :key="item.value" :label="item.text" :value="item.text"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="nodejs" label="" style="margin-right:0px">
                  <el-select v-model="addressValue.area" placeholder="区/县">
                    <el-option v-for="item in addressValue.mDistrictList" :key="item.value" :label="item.text" :value="item.text"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item :label="$t('detailed_address')" prop="addr">
              <el-input v-model="addDeviceData.addr" type="text" :placeholder="$t('fill_detailed_address')"></el-input>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button class="button" @click="dialogAddDevice=false">{{$t('cancel')}}</el-button>
            <el-button class="button" type="primary" @click="sureAddDevice('addDeviceForm')">保存</el-button>
          </div>
        </template>
        <template v-slot:hint>
          <div class="text">1、可在贴在设备上的标签查看设备编码</div>
          <div class="text"> 2、新添加的设备默认会设置报警功能：温度大于60℃、箱门开启、设备离线，并将客户的超级管理员设为报警通知人</div>
          <div class="text"> 3、新添加的设备默认会开启：自动降温（60℃）、自动除尘（60天1次）</div>
        </template>
      </form-with-hint>
    </el-dialog>
    <el-dialog class="form_dialog" :visible.sync="dialogEditDevice" :destroy-on-close="true">
      <form-with-hint>
        <template v-slot:form>
          <el-form :rules="deviceRules" ref="editDeviceForm" :model="editDeviceData" label-position="left" label-width="140px">
            <div class="title">修改设备</div>
            <el-form-item label="设备编码" >
              <el-input v-model="editDeviceData.id" placeholder="" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="自定义名称" prop="name">
              <el-input v-model="editDeviceData.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item class="is-required" label="安装地址">
              <div style="display:flex">
                <el-form-item label="" style="margin-right:10px">
                  <el-select v-model="addressValue.province" placeholder="省" @change="selectProvince()">
                    <el-option v-for="item in addressValue.mProvinceList" :key="item.value" :label="item.text" :value="item.text"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="margin-right:10px">
                  <el-select v-model="addressValue.city" placeholder="市" @change="selectCity()">
                    <el-option v-for="item in addressValue.mCityList" :key="item.value" :label="item.text" :value="item.text"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="nodejs" label="" prop="district" style="margin-right:0px">
                  <el-select v-model="addressValue.area" placeholder="区/县">
                    <el-option v-for="item in addressValue.mDistrictList" :key="item.value" :label="item.text" :value="item.text"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="详细地址" prop="addr">
              <el-input v-model="editDeviceData.addr" placeholder="填写详细地址"></el-input>
            </el-form-item>
            <div class="footer">
              <el-button class="button" @click="dialogEditDevice=false">{{$t('cancel')}}</el-button>
              <el-button class="button" type="primary" @click="sureEditDevice('editDeviceForm')">保存</el-button>
            </div>
          </el-form>
        </template>
        <template v-slot:hint>
          <div class="text">1、设备编码不可修改</div>
        </template>
      </form-with-hint>
    </el-dialog>
    <el-dialog class="action_dialog" :visible.sync="dialogDeleteDevice" title="删除设备" width="30%" center="center" :destroy-on-close="true">
      <div class="tip">删除后该设备将无法使用，确定删除该设备吗？</div>
      <div class="footer">
        <el-button class="button" @click="dialogDeleteDevice=false">{{$t('cancel')}}</el-button>
        <el-button class="button" type="danger" @click="sureDelete">{{$t('sure')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog class="action_dialog" :visible.sync="dialogRestartDevice" title="重启设备" width="30%" center="center" :destroy-on-close="true">
      <div class="tip">确认重启吗？</div>
      <div class="footer">
        <el-button class="button" @click="dialogRestartDevice=false">{{$t('cancel')}}</el-button>
        <el-button class="button" type="primary" @click="sureRestart()">{{$t('sure')}}</el-button>
      </div>
    </el-dialog>


    <el-dialog class="form_dialog" :visible.sync="dialogChooseCamera" :destroy-on-close="true" :close-on-click-modal="false">
      <form-with-hint>
        <template v-slot:form>
          <div class="title">选择添加的摄像机类型</div>
          <div class="choose" style="margin-bottom: 140px">
            <div class="choose_type" :class="{active: chooseCameraType === '0'}" @click="chooseCameraType = '0'">
              <div class="name">内网</div>
              <div class="icon">
                <img src="@/assets/neiwai@2x.png">
              </div>
            </div>
            <div class="choose_type" :class="{active: chooseCameraType === '1'}" @click="chooseCameraType = '1'">
              <div class="name">外网</div>
              <div class="icon">
                <img src="@/assets/waiwang@2x.png">
              </div>
            </div>
          </div>
          <div class="footer">
            <el-button class="button" @click="dialogChooseCamera=false">{{$t('cancel')}}</el-button>
            <el-button class="button" type="primary" @click="sureChooseCamera('form')">下一步</el-button>
          </div>
        </template>
        <template v-slot:hint>
          <div class="text">1、内网：监控摄像机使用的是内网的组网方式</div>
          <div class="text">2、外网：监控摄像机使用的是外网的组网方式</div>
          <div class="text">3、外网目前支持海康威视的萤石云平台，需提供萤石云账户的APPKEY和SECRET</div>
          <div class="text">4、只能选择其中1种组网方式，后续不可修改</div>
        </template>
      </form-with-hint>
    </el-dialog>
    <el-dialog class="form_dialog" :visible.sync="dialogYsSetting" :destroy-on-close="true" :close-on-click-modal="false">
      <form-with-hint>
        <template v-slot:form>
          <el-form :rules="YsSettingRules" ref="YsSettingForm" :model="YsSettingData" label-position="left" label-width="140px" style="margin-bottom: 290px">
            <div class="title">绑定萤石云账户</div>
            <el-form-item label="APPKEY" prop="key">
              <el-input v-model="YsSettingData.key" type="text" placeholder="填写APPKEY"></el-input>
            </el-form-item>
            <el-form-item label="SECRET" prop="secret">
              <el-input v-model="YsSettingData.secret" type="text" placeholder="填写SECRET"></el-input>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button class="button" @click="dialogYsSetting=false">{{$t('cancel')}}</el-button>
            <el-button class="button" type="primary" @click="sureYsSetting('YsSettingForm')">下一步</el-button>
          </div>
        </template>
        <template v-slot:hint>
          <div class="text">1、如何获取APPKEY和SECRET？</div>
          <div class="text">登录萤石云平台（www.ys7.com），选择创建应用即可获得应用的APPKEY和SECRET</div>
        </template>
      </form-with-hint>
    </el-dialog>

    <el-dialog class="form_dialog" :visible.sync="dialogEditCamera" :destroy-on-close="true">
      <form-with-hint>
        <template v-slot:form>
          <el-form :rules="cameraRules" ref="editCameraForm" :model="editCameraData" label-position="left" label-width="140px">
            <div class="title">{{editCameraType === '0'?'修改内网摄像机':'修改外网摄像机'}}</div>
            <template v-if="editCameraType === '0'">
              <el-form-item label="摄像头IP" prop="ip">
                <el-input v-model="editCameraData.ip" type="text" placeholder="填写摄像头IP"></el-input>
              </el-form-item>
              <el-form-item label="摄像头账号" prop="username">
                <el-input v-model="editCameraData.username" type="text" placeholder="填写摄像头账号"></el-input>
              </el-form-item>
              <el-form-item label="摄像头密码" prop="password">
                <el-input v-model="editCameraData.password" type="text" placeholder="填写摄像头密码"></el-input>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="设备序列号">
                <el-input v-model="editCameraData.id" type="text" :disabled="true" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="验证码">
                <el-input v-model="editCameraData.code" type="text" :disabled="true" placeholder=""></el-input>
              </el-form-item>
            </template>
            <el-form-item label="连接端口" prop="port">
              <el-select v-model="editCameraData.port" placeholder="选择连接端口" style="width:100%">
                <el-option v-for="item in portList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入电源" prop="out">
              <el-select v-model="editCameraData.out" placeholder="选择输入电源" style="width:100%">
                <el-option v-for="item in powerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入自定义名字" prop="name">
              <el-input v-model="editCameraData.name" type="text" placeholder="填写自定义名称"></el-input>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button class="button" @click="dialogEditCamera=false">{{$t('cancel')}}</el-button>
            <el-button class="button" type="primary" @click="sureEditCamera('editCameraForm')">{{$t('save')}}</el-button>
          </div>
        </template>
        <template v-slot:hint>
          <template v-if="editCameraType === '0'">
            <div class="text">1、可在摄像机的说明书中查看摄像的IP、用户名和密码，或询问管理员</div>
            <div class="text">2、添加摄像机时，请确保摄像机已接通电源和网络</div>
          </template>
          <template v-else>
            <div class="text">1、设备序列号和验证码不可修改</div>
          </template>
        </template>
      </form-with-hint>
    </el-dialog>
    <el-dialog class="form_dialog" :visible.sync="dialogAddCamera" :destroy-on-close="true">
      <form-with-hint>
        <template v-slot:form>
          <el-form :rules="cameraRules" ref="addCameraForm" :model="addCameraData" label-position="left" label-width="140px">
            <div class="title">{{addCameraType === '0'?'添加内网摄像机':'添加外网摄像机'}}</div>
            <template v-if="addCameraType === '0'">
              <el-form-item label="摄像头IP" prop="ip">
                <el-input v-model="addCameraData.ip" type="text" placeholder="填写摄像头IP"></el-input>
              </el-form-item>
              <el-form-item label="摄像头账号" prop="username">
                <el-input v-model="addCameraData.username" type="text" placeholder="填写摄像头账号"></el-input>
              </el-form-item>
              <el-form-item label="摄像头密码" prop="password">
                <el-input v-model="addCameraData.password" type="text" placeholder="填写摄像头密码"></el-input>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="设备序列号" prop="id">
                <el-input v-model="addCameraData.id" type="text" placeholder="填写设备编码"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <el-input v-model="addCameraData.code" type="text" placeholder="填写验证码"></el-input>
              </el-form-item>
            </template>
            <el-form-item label="连接端口" prop="port">
              <el-select v-model="addCameraData.port" placeholder="选择连接端口" style="width:100%">
                <el-option v-for="item in portList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入电源" prop="out">
              <el-select v-model="addCameraData.out" placeholder="选择输入电源" style="width:100%">
                <el-option v-for="item in powerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="输入自定义名字" prop="name">
              <el-input v-model="addCameraData.name" type="text" placeholder="填写自定义名称"></el-input>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button class="button" @click="dialogAddCamera=false">{{$t('cancel')}}</el-button>
            <el-button class="button" type="primary" @click="sureAddCamera('addCameraForm')">{{$t('save')}}</el-button>
          </div>
        </template>
        <template v-slot:hint>
          <template v-if="addCameraType === '0'">
            <div class="text">1、可在摄像机的说明书中查看摄像的IP、用户名和密码，或询问管理员</div>
            <div class="text">2、添加摄像机时，请确保摄像机已接通电源和网络</div>
          </template>
          <template v-else>
            <div class="text">1、可在摄像头机身上查看设备序列号和验证码</div>
            <div class="text">2、添加摄像机时，请确保摄像机已接通电源和网络</div>
          </template>
        </template>
      </form-with-hint>
    </el-dialog>
    <el-dialog class="action_dialog" :visible.sync="dialogDeleteCamera" title="删除摄像头" width="30%" center="center" :destroy-on-close="true">
      <div class="tip">确定删除该摄像头吗？删除后你将看不到此摄像头的监控视频</div>
      <div class="footer">
        <el-button class="button" @click="dialogDeleteCamera=false">{{$t('cancel')}}</el-button>
        <el-button class="button" type="danger" @click="sureDeleteCamera()">{{$t('sure')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog class="form_dialog" :visible.sync="dialogPoliceSetting" :destroy-on-close="true">
      <form-with-hint>
        <template v-slot:form>
          <el-form ref="policeSettingForm" :model="policeSettingData">
            <div class="title">报警修改</div>
            <div style="color:#666666;font-size:16px;margin-bottom:40px" v-if="warn_type === '1'">箱门打开</div>
            <div style="color:#666666;font-size:16px;margin-bottom:40px" v-if="warn_type === '2'">设备离线</div>
            <div style="color:#666666;font-size:16px;margin-bottom:40px" v-if="warn_type === '3'">箱内温度过高</div>
            <div style="color:#666666;font-size:16px;margin-bottom:40px" v-if="warn_type === '4'">输入电压过高</div>
            <div style="color:#666666;font-size:16px;margin-bottom:40px" v-if="warn_type === '5'">输入电压过低</div>
            <el-form-item label="是否开启报警">
              <el-radio-group v-model="policeSettingData.state">
                <el-radio label="1" border="border">启用</el-radio>
                <el-radio label="0" border="border">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报警温度值" v-if="warn_type === '3'">
              <el-input v-model="policeSettingData.val" type="number" placeholder="填写温度值，单位：℃"></el-input>
            </el-form-item>
            <el-form-item label="报警电压值" v-if="warn_type === '4'">
              <el-input v-model="policeSettingData.val" type="number" placeholder="填写电压值，单位：V"></el-input>
            </el-form-item>
            <el-form-item label="报警电压值" v-if="warn_type === '5'">
              <el-input v-model="policeSettingData.val" type="number" placeholder="填写电压值，单位：V"></el-input>
            </el-form-item>
            <el-form-item label="报警提醒人">
                <el-checkbox-group v-model="policeSettingData.notifier" style="display: flex;flex-wrap: wrap">
                  <el-checkbox border="border" v-for="contact in allNotifiers" :label="contact.phone" :key="contact.phone" style="margin: 0 20px 20px 0">{{contact.name}}({{contact.phone}})</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div class="footer">
            <el-button class="button" @click="dialogPoliceSetting=false">{{$t('cancel')}}</el-button>
            <el-button class="button" type="primary" @click="surePolice">{{$t('save')}}</el-button>
          </div>
        </template>
        <template v-slot:hint>
          <div class="text"> 1、报警提醒人为该企业的管理员，可在权限管理中新增管理员</div>
          <div class="text"> 2、报警提醒人为该企业的管理员，可在权限管理中新增管理员</div>
        </template>
      </form-with-hint>
    </el-dialog>
  </div>
</template>
<script>
  import DeviceTop from './components/DeviceTop'
  import DeviceLeft from './components/DeviceLeft'
  import DeviceRight from './components/DeviceRight'
  import FormWithHint from './components/FormWithHint'
  import {
    equipment, addDeviceClick, HttpModifyDevice,  HttpDeleteDevice,  HttpRestartDevice, HttpGetCamerasDetail, HttpModifyCarera, HttpDeleteCarema, HttpGetDeviceDetail, HttpPliceType, getNotifierList,
    HttpChangeSwith,  HttpBindCamera, HttpGetRecloseInfo, HttpGetYsSeting, HttpBindYsSeting
  } from '_api/device_manage'
  import { provinceList, cityList, areaList } from '_common/area'

  import { deepCopy } from '_common/util'

  export default {
    components: {
      DeviceTop,DeviceLeft,DeviceRight,FormWithHint
    },

    data() {
      return {
        //新增设备
        dialogAddDevice: false,
        deviceRules: {
          id: [
            { required: true,message:'请填写设备编号', trigger: 'blur'  },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '设备编号不支持特殊字符',
              trigger: 'blur'
            },
            { required: true, min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
            { validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入设备ID'));
                } else {
                  let isExist = this.deviceList.some((item) => item.id === value)
                  isExist?callback(new Error('该设备ID已存在')):callback();
                }
              }, trigger: 'blur'},
          ],
          name: [
            { required: true,message:'请输入自定义名称' , trigger: 'blur' },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '自定义名称不支持特殊字符',
              trigger: 'blur'
            },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
          ],
          //address
          addr: [
            { required: true,message:'请输入详细地址', trigger: 'blur'  },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '地址不支持特殊字符',
              trigger: 'blur'
            },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
          ],
        },
        addressValue: {
          mProvinceList: [],
          mCityList: [],
          mDistrictList: [],
          province: '',
          city: '',
          area: '',
          address: '',
        },
        addDeviceData: {},

        //编辑设备
        dialogEditDevice: false,
        editDeviceData: {},

        //删除设备
        dialogDeleteDevice: false,

        //重启设备
        dialogRestartDevice: false,

        //选择摄像头的类型
        dialogChooseCamera: false,
        chooseCameraType: '0',

        //绑定萤石云账号
        dialogYsSetting: false,
        YsSettingRules: {
          key: [
            { required: true,message:'请填写APPKEY' , trigger: 'blur'},
          ],
          secret: [
            { required: true,message:'请填写SECRET', trigger: 'blur' },
          ],
        },
        YsSettingData: {},

        //新增摄像头
        dialogAddCamera: false,
        cameraRules: {
          id: [
            { required: true, message: '请输入编号', trigger: 'blur'  },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '编号输入有误',
              trigger: 'blur',
            },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur'  },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '验证码不支持特殊字符',
              trigger: 'blur',
            },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
          ],
          ip: [
            { required: true, message: '请输入ip地址', trigger: 'blur'  },
          ],
          username: [
            { required: true, message: '请输入摄像头账号', trigger: 'blur'  },
          ],
          password: [
            { required: true, message: '请输入摄像头密码', trigger: 'blur'  },
          ],
          port: [
            { required: true, message: '请选择端口', trigger: 'blur'  },
          ],
          out: [
            { required: true, message: '请选择电源', trigger: 'blur'  },
          ],
          name: [
            { required: true, message: '请输入自定义名称', trigger: 'blur'  },
            {
              pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
              message: '自定义名称不支持特殊字符',
              trigger: 'blur',
            },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
          ],
        },
        portList: [
          { label: '端口1', value: '1' },
          { label: '端口2', value: '2' },
          { label: '端口3', value: '3' },
          { label: '端口4', value: '4' },
          { label: '端口5', value: '5' },
        ],
        powerList: [
          { label: '电源1', value: '1' },
          { label: '电源2', value: '2' },
          { label: '电源3', value: '3' },
          { label: '电源4', value: '4' },
          { label: '电源5', value: '5' },
          { label: '电源6', value: '6' },
          { label: '电源7', value: '7' },
          { label: '电源8', value: '8' },
        ],
        addCameraData: {},

        //编辑摄像头
        dialogEditCamera:false,
        editCameraType: '0',
        editCameraData: {},

        //删除摄像头
        dialogDeleteCamera:false,
        deleteCameraData:{},

        //报警设置
        warn_type: '',
        dialogPoliceSetting: false,
        policeSettingData: {
          warn_type: '',
          state: '',
          val: '',
          notifier: [],
        },

        //设备信息
        hasYsSetting: false,
        deviceList:[],
        currentIndex:0,
        deviceBean: {},
        deviceAttr: {},
        recloseData: {},

        camerasList: [],
        allNotifiers: [],

        initId: '',
        deviceId :'',

      }
    },
    computed: {
      confirmCameraType() {
        //内网、外网
        if (this.camerasList && this.camerasList.length){
          const ip =  this.camerasList[0].ip
          return ip && ip.length?'0':'1'
        }
        return '-1'
      },
      addCameraType() {
        if (this.confirmCameraType !== '-1'){
          return  this.confirmCameraType
        }
        return  this.chooseCameraType
      },
    },
    mounted() {
      // 初始化省列表，这个只会初始化一次，提前初始化。
      this.initId = this.$route.query.id
      this.addressValue.mProvinceList = provinceList
      this.getDeviceList()
      this.getYsSetting()
    },
    methods: {
      getDeviceList() {
        let params = { page: 1, row: 10000 }
        equipment(params).then((res) => {
          if (res.data.code === 200) {
            const {list=[]} = res.data.data
            this.deviceList = list
            if (list.length){
              let index = 0
              if (this.initId){
                 index = list.findIndex(item => item.id === this.initId)
                 index = index === -1? 0: index
                 this.initId = ''
              }
              const {id} = list[index]
              this.deviceId = id
              this.currentIndex = index
              this.toDeviceDetail(this.deviceId,this.currentIndex)
            }
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      getYsSetting(){
        HttpGetYsSeting().then((res) => {
          if (res.data.code === 200) {
            this.hasYsSetting = res.data.data === '1'
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error(this.$t('data_acquisition_failed'))
        })
      },
      toDeviceDetail(id,index){
        this.deviceId= id
        this.currentIndex=index
        this.deviceBean={}
        this.recloseData ={}
        this.getCamerasDetail(id)
        this.getDeviceDetail(id)
        this.getNotifiers(id)
        this.getRecloseInfo(id)
      },
      toVideo(item,index) {
        this.$router.push({path:'/device/manage/video',query:{deviceId:this.deviceId, index, type: this.confirmCameraType }})
      },
      getCamerasDetail(t) {
        HttpGetCamerasDetail(t).then((res) => {
          if (res.data.code === 200) {
            this.camerasList = res.data.data
          } else {
            this.$message.error('获取数据失败~')
          }
        })
      },
      getDeviceDetail(t) {
        HttpGetDeviceDetail(t).then((res) => {
          if (res.data.code === 200) {
            this.deviceBean = res.data.data
            this.deviceAttr = res.data.data.attr || {}
          } else {
            this.$message.error('获取数据失败~')
          }
        })
      },
      getNotifiers(t) {
        getNotifierList(t).then((res) => {
          if (res.data.code === 200) {
            this.allNotifiers = res.data.data
          } else {
            this.$message.error('获取数据失败~')
          }
        })
      },
      getRecloseInfo(t){
        HttpGetRecloseInfo(t).then((res) => {
          if (res.data.code === 200) {
            let { warning=[], ...rest} = res.data.data
            warning = Array(6).fill('-1').map((item,index)=> {
              return warning.includes(index+'')?'1':'0'
            })
            this.recloseData = {...rest, warning}
          } else {
            this.$message.error('获取数据失败~')
          }
        })
      },
      //设备状态设置
      changeSwitch1() {
        HttpChangeSwith('/device/door/' + this.deviceId + '/').then((res) => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
            this.getDeviceDetail(this.deviceId)
          }
        })
      },
      changeSwitch2() {
        let body = {
          fan: 'fan1',
        }
        HttpChangeSwith('/device/fan/' + this.deviceId + '/',body).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
            this.getDeviceDetail(this.deviceId)}
        })
      },
      changeSwitch3() {
        let body = {
          fan: 'fan2',
        }
        HttpChangeSwith('/device/fan/' + this.deviceId + '/',body).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
            this.getDeviceDetail(this.deviceId)
          }
        })
      },

      //电源设置
      changeSwitchOut(out) {
        let body = {
          out: out,
        }
        HttpChangeSwith('/device/out/' + this.deviceId + '/',body).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
            this.getDeviceDetail(this.deviceId)
          }
        })
      },

      //报警设置
      policeSetting(a) {
        let cl = []
        this.policeSettingData.val = this.deviceBean.warn[parseInt(a) - 1].val
        this.policeSettingData.state = this.deviceBean.warn[parseInt(a) - 1].state
        let notifier = this.deviceBean.warn[parseInt(a) - 1].notifiers
        this.allNotifiers.forEach(function(n) {
          if (Object.keys(notifier).find(key => notifier[key]['phone'] === n.phone)) {
            cl.push(n.phone)
            n['check'] = true
          } else {
            n['check'] = false
          }
        })
        this.policeSettingData.notifier = cl
        this.warn_type = a
        this.dialogPoliceSetting = true
      },
      surePolice() {
        let body = deepCopy(this.policeSettingData)
        body.warn_type = this.warn_type
        body.val = Number(body.val)
        HttpPliceType(this.deviceId,body).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('报警成功')
            this.dialogPoliceSetting = false
            this.getDeviceDetail(this.deviceId)
          } else {
            this.$message.error('报警失败')
          }
        })
      },
      //新增设备
      addNewDevice(){
        this.addDeviceData = {}
        this.dialogAddDevice=true
      },
      sureAddDevice(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              id:this.addDeviceData.id,
              name:this.addDeviceData.name,
              addr:this.addDeviceData.addr,
              province:this.addressValue.province,
              city:this.addressValue.city,
              area:this.addressValue.area,
            }
            addDeviceClick(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(this.$t('new_success'))
                this.dialogAddDevice = false
                this.getDeviceList()
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
      //- 编辑设备
      editDevice() {
        const id = this.deviceId
        const {name, province, city, area, addr} = this.deviceBean
        this.editDeviceData = {id,name,province,city,area,addr}
        this.dialogEditDevice = true
        this.refreshAddressList()
      },
      refreshAddressList() {
        for (let i = 0; i < provinceList.length; i++) {
          if (this.editDeviceData.province.indexOf(provinceList[i].text) != -1) {
            // 拿到对应的省
            this.addressValue.province = provinceList[i].text
            // 拿到对应省的所有城市列表
            this.addressValue.mCityList = cityList[provinceList[i].value]
            for (let j = 0; j < this.addressValue.mCityList.length; j++) {
              if (this.editDeviceData.city.indexOf(this.addressValue.mCityList[j].text) != -1) {
                // 拿到对应的市
                this.addressValue.city = this.addressValue.mCityList[j].text
                // 拿到对应市的所有县城/区列表
                this.addressValue.mDistrictList = areaList[this.addressValue.mCityList[j].value]
                for (let k = 0; k < this.addressValue.mDistrictList.length; k++) {
                  if (this.editDeviceData.area.indexOf(this.addressValue.mDistrictList[k].text) != -1) {
                    // 拿到对应的区
                    this.addressValue.area = this.addressValue.mDistrictList[k].text
                    break
                  }
                }
              }
            }
          }
        }
        this.addressValue.address = this.editDeviceData.address
      },
      //地址的编辑
      // 用户选择某个省触发回调
      selectProvince() {
        this.refreshCityList()
        this.refreshAreaList()
      },
      // 用户选择某个城市触发回调
      selectCity() {
        this.refreshAreaList()
      },
      // 选择了省份要重刷省的市列表
      refreshCityList() {
        // 如果不用一个辅助变量，虽然this.addressValue.mCityList的值变了，但是由于地址不变，vue认为还是没有变，会导致界面不刷新。
        let temp = []
        for (let i = 0; i < provinceList.length; i++) {
          if (this.addressValue.province.indexOf(provinceList[i].text) != -1) {
            temp = cityList[provinceList[i].value]
            break
          }
        }
        this.addressValue.mCityList = temp
        this.addressValue.city = temp[0].text
      },
      // 选择了市要重刷县城或者区的列表
      refreshAreaList() {
        // 如果不用一个辅助变量，虽然this.addressValue.mAreaList的值变了，但是由于地址不变，vue认为还是没有变，会导致界面不刷新。
        let temp = []
        for (let j = 0; j < this.addressValue.mCityList.length; j++) {
          if (this.addressValue.city.indexOf(this.addressValue.mCityList[j].text) != -1) {
            temp = areaList[this.addressValue.mCityList[j].value]
            break
          }
        }
        this.addressValue.mDistrictList = temp
        this.addressValue.area = temp[0].text
      },
      sureEditDevice(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 验证表单数据
            let body = deepCopy(this.editDeviceData)
            body.province = this.addressValue.province
            body.city = this.addressValue.city
            body.area = this.addressValue.area
            delete body.client_id
            delete body.deviceId
            delete body.address
            HttpModifyDevice(this.deviceId, body).then((res) => {
              if (res.data.code === 200) {
                this.$message.success('修改成功')
                this.dialogEditDevice = false
                this.getDeviceDetail(this.deviceId)
              } else {
                this.$message.warning('修改失败了')
              }
            })
          } else {
            return false;
          }
        });
      },
      //- 删除设备
      sureDelete() {
        HttpDeleteDevice(this.deviceId, {}).then((res) => {
          if (res.data.code === 200) {
            this.dialogDeleteDevice = false
            this.$message.success(this.$t('delete_success'))
            this.getDeviceList()
          } else {
            this.$message.error(this.$t('delete_failed'))
          }
        })
      },
      //- 重启设备
      sureRestart() {
        HttpRestartDevice(this.deviceId, {}).then((res) => {
          if (res.data.code === 200) {
            this.dialogRestartDevice = false
            this.$message.success('重启成功')
            this.getDeviceDetail(this.deviceId)
          } else {
            this.$message.error('重启失败')
          }
        })
      },

      //- 添加摄像头
      addCamera(){
        if (this.confirmCameraType === '-1'){
          this.chooseCameraType = '0'
          this.dialogChooseCamera = true
          return
        }
        this.addCameraData = {}
        this.dialogAddCamera=true
      },

      //- 选择摄像头类型
      sureChooseCamera(){
        this.dialogChooseCamera = false
        setTimeout(() => {
          if (this.chooseCameraType === '1' && !this.hasYsSetting){
            this.YsSettingData = {}
            this.dialogYsSetting = true
            return
          }
          this.addCameraData = {}
          this.dialogAddCamera=true
        },300)
      },
      sureYsSetting(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let body = deepCopy(this.YsSettingData)
            HttpBindYsSeting(body).then((res) => {
              if (res.data.code === 200) {
                this.$message.success('账号绑定成功')
                this.dialogYsSetting = false
                this.getYsSetting()
                setTimeout(() => {
                  this.addCameraData = {}
                  this.dialogAddCamera = true
                },300)
              } else {
                this.$message.warning('账号绑定失败了')
              }
            })
          } else {
            return false;
          }
        });
      },
      sureAddCamera(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let body = deepCopy(this.addCameraData)
            HttpBindCamera(this.deviceId, body).then((res) => {
              if (res.data.code === 200) {
                this.$message.success('绑定成功')
                this.dialogAddCamera = false
                this.getCamerasDetail(this.deviceId)
              } else {
                this.$message.warning('绑定失败了')
              }
            })
          } else {
            return false;
          }
        });
      },
      // 修改摄像头
      editCamera(item){
        const {ip} = item
        this.editCameraType = ip && ip.length ? '0':'1'
        this.editCameraData = item
        this.dialogEditCamera = true
      },
      sureEditCamera(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let body = deepCopy(this.editCameraData)
            delete body.id
            HttpModifyCarera(this.deviceId+'/camera/'+this.editCameraData.id, body).then((res) => {
              if (res.data.code === 200) {
                this.$message.success('修改成功')
                this.dialogEditCamera = false
                this.getCamerasDetail(this.deviceId)
              } else {
                this.$message.warning('修改失败了')
              }
            })
          } else {
            return false;
          }
        });
      },
      //- 删除摄像头
      deleteCamera(item){
        const {id='0'} = item
        this.deleteCameraData = {id}
        this.dialogDeleteCamera=true
      },
      sureDeleteCamera(){
        HttpDeleteCarema(this.deviceId+'/camera/'+this.deleteCameraData.id, {}).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(this.$t('delete_success'))
            this.getCamerasDetail(this.deviceId)
            this.dialogDeleteCamera = false
          } else {
            this.$message.error(this.$t('delete_failed'))
          }
        })
      },
    }
  }

</script>

<style lang="stylus" scoped>
  .device_detail
    width 100%
    height 100%
    overflow-y hidden

  .content{
    display flex
    .device_left {
      width: 27.6%
      min-width 315px
      max-width 400px
    }
    .device_right {
      margin-left 20px
      flex: 1;
    }
  }


</style>

<style lang="stylus" scoped>
  .vertical_bar
    display inline-block !important
    width: 4px !important;
    height: 20px !important;
    margin-right: 10px !important;
    border-right: 0 !important
    mr 10 !important;
  .param_state
    position relative
    .param_state_icon
      position absolute
      wh 26px 26px
      left 4px
      top 16px
    p
      ml 38
  .fun_state
    position relative
    .param_state_icon
      position absolute
      wh 26px 26px
      left 4px
      top 16px
    p
      ml 38
</style>

<style scoped lang="stylus">
  .form_dialog >>> {
     .el-dialog{
      padding 0!important
      text-align left!important
      width 840px
     }
     .el-dialog__header{
       padding 0
     }
     .el-dialog__body{
       padding 0
     }
    .el-form {
      padding-top: 0 !important;
      .el-form-item .el-form-item__label{
        width 140px !important;
        font-size: 16px;
        color: #666;
        text-align: left!important;
      }
    }
  }

  .form_dialog {
    .title {
      font-size 20px
      color  #333
      margin-bottom 40px
    }
    .text{
      font-size 14px
      color #666666
      line-height 20px
      margin-bottom 15px
    }

    .choose {
      .choose_type{
        width 100%
        height:96px;
        background:rgba(240,242,242,1);
        border-radius:4px;
        margin-bottom 30px
        display flex
        align-items center
        justify-content space-between
        .name{
          margin-left 40px
          font-size:18px;
          font-weight:bold;
          color:#333333;
        }
        .icon{
          margin-right 30px
          wh 54px 54px
          img{
            wh 100% 100%
          }
        }
        &.active{
          border:2px solid rgba(25,204,174,1);
        }
      }
    }

    .footer{
      display flex
      flex-direction row
      justify-content center
      .button {
        flex 1
        margin 30px 10px 10px
        font-size: 16px !important;
      }
    }
  }

  .action_dialog {
    .tip {
      font-size:18px;
      margin: 10px 0 30px !important;
      text-align: center !important;
      width: 100% !important;
    }

    .footer{
      display flex
      flex-direction row
      justify-content center
      .button {
        flex 1
        margin 30px 10px 10px
        font-size: 16px !important;
      }
    }
  }

</style>
