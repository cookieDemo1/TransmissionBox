import Axios from 'axios'
import { ArrangeHttpMethod } from '_common/util'

//初始化固件列表信息 /api/v1/firmware/devices  query: page	row	customer_id	device_id state
export function deviceFirmwareList(params, methods, path) {
  return ArrangeHttpMethod(methods)('/firmware/devices' + (path ? ('/' + path) : ''), params)
}

// 固件上传
export function uploadFirmware(params) {
  return requestAsFormData('/firmware/mgmt/', params)
}

// 固件列表
export function getFirmwareList(params) {
  return ArrangeHttpMethod('get')('/firmware/mgmt', params)
}

// 固件升级
export function deviceUpgrade(params) {
  return ArrangeHttpMethod('put')('/firmware/upgrade/', params)
}

// 固件列表
export function delFirmware(id) {
  return ArrangeHttpMethod('delete')('/firmware/mgmt/' + id + '/')
}


//new 历史报警
export function policeHistory(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/history' + (path ? ('/' + path) : ''), params)
}

//new 确认报警
export function policeConfirm(params, methods, path) {
  return ArrangeHttpMethod(methods)('/warn/realtime' + (path ? ('/' + path) : ''), params)
}

//new 报警详情
export function policeDetail(params, methods, path) {
  return ArrangeHttpMethod(methods)('/police/detail' + (path ? ('/' + path) : ''), params)
}


function requestAsFormData(url, params, method = 'post') {
  const instance = Axios.create({
    baseURL: window.location.origin+'/api/v1',
    timeout: 60 * 1000,
  });

  let data = new FormData()
  Object.keys(params).forEach((key) => {
    data.append(key, params[key])
  })

  return instance({
    method,
    url,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: localStorage.getItem('Authorization') + '',
    },
  })
}
