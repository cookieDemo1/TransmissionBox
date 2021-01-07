
import { ArrangeHttpMethod } from '_common/util'

//传输箱数量 /api/v1/header/boxs
export function HttpgetBoxNum() {
    return ArrangeHttpMethod('get')('/header/boxs/')
}
  
//初始化固件列表信息 /api/v1/firmware/devices  query: page	row	customer_id	device_id state 
export function HttpgetCameraNum() {
  return ArrangeHttpMethod('get')('/header/videos/')
}

//new 历史报警
export function HttpgetWarningMsg() {
  return ArrangeHttpMethod('methods')('/header/warnings/')
}
