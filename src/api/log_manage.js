// import Axios from 'axios'
import { ArrangeHttpMethod } from '_common/util'

// 获取日志管理列表 /log/managementlist
export function getLogList(params) {
  return ArrangeHttpMethod('get')('/oplog',params)
}

// 获取系统日志
export function getDeviceLog(params) {
  return ArrangeHttpMethod('get')('/devicelog/',params)
}

// 获取日志详情/api/v1/log/detail/{id}
export function getLogDetail(path) {
  return ArrangeHttpMethod('get')('/log/detail'+ (path ? ('/' + path) : '/'))
}
