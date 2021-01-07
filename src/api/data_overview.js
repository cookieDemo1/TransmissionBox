import Axios from 'axios'
import {
  ArrangeHttpMethod
} from '_common/util'


//监控设备活动
export function HttpGetMonitorActivity(params) {
    return ArrangeHttpMethod('get')('/monitor/devices/', params)
}

//监控设备报警
export function HttpGetMonitorWarning(params) {
  return ArrangeHttpMethod('get')('/monitor/warnings/', params)
}

export function getV2Data(path) {
  return getV2({
    method:'get',
    url: path,
  })
}

function getV2({ url, method = 'get' }) {

  const instance = Axios.create({
    baseURL:window.location.origin+'/api/v1',
    timeout: 60 * 1000,
  });
  return instance({
    method,
    url,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      "Authorization": localStorage.getItem('Authorization') + '',
      
    },
  })
}