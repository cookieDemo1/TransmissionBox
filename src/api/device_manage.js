import Axios from 'axios'
import {
  ArrangeHttpMethod
} from '_common/util'

//设备管理列表
export function equipment(params) {
  return ArrangeHttpMethod('get')('/devices/', params)
}

// 获取设备详情
export function HttpGetDeviceDetail(path) {
  return ArrangeHttpMethod('get')(`/device/${path}/`)
}

//新增设备
export function addDeviceClick(params) {
  return ArrangeHttpMethod('post')('/device/', params)
}

// 修改设备
export function HttpModifyDevice(path, params) {
  return ArrangeHttpMethod('put')(`/device/${path}/`, params)
}

// 删除设备
export function HttpDeleteDevice(path, params) {
  return ArrangeHttpMethod('delete')(`/device/${path}/`, params)
}

// 重启设备
export function HttpRestartDevice(path, params) {
  return ArrangeHttpMethod('post')(`/device/restart/${path}/`, params)
}


// 获取摄像机列表
export function HttpGetCamerasDetail(path) {
  return ArrangeHttpMethod('get')(`/device/${path}/cameras/`)
}

// 绑定摄像头
export function HttpBindCamera(path, params) {
  return ArrangeHttpMethod('post')(`/device/${path}/camera/`, params)
}


// 修改摄像头
export function HttpModifyCarera(path, params) {
  return ArrangeHttpMethod('post')( `/device/${path}/`, params)
}

// 删除摄像头
export function HttpDeleteCarema(path,params) {
  return ArrangeHttpMethod('delete')(`/device/${path}/`, params)
}


// 获取通知列表
export function getNotifierList(path) {
  return ArrangeHttpMethod('get')(`/device/notifiers/${path}/`)
}

//重合闸
export function HttpGetRecloseInfo(path) {
  return ArrangeHttpMethod('get')(`/device/reclose/${path}/`)
}

//获取萤石云配置
export function HttpGetYsSeting() {
  return ArrangeHttpMethod('get')('/ys/settings/')
}


//设置设备报警
export function HttpPliceType(path,params) {
  return ArrangeHttpMethod('put')(`/device/${path}/warn/`, params)
}
//设置设备参数
export function HttpChangeSwith(path,params) {
  return ArrangeHttpMethod('post')(path,params)
}

//配置萤石云
export function HttpBindYsSeting(params) {
  return ArrangeHttpMethod('post')('/ys/settings/', params)
}

