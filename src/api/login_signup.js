
import { ArrangeHttpMethod } from '_common/util'

/**
 * 登录
 * @param {Object} params
 * @param {String} method
 */
export function login() {
  return ArrangeHttpMethod('get')('/login/')
}

/**
 * 修改密码
 * @param {Object} params
 * @param {String} method
 */
export function modifyPwd(params) {
  return ArrangeHttpMethod('post')('/modifypwd/', params)
}

/**
 * 重置密码
 * @param {Object} params
 * @param {String} method
 */
export function resetPwd(params, methods) {
  return ArrangeHttpMethod('post')('/resetpass/' , params)
}
/**
 * 获取侧边菜单栏的显示权限
 * RIGHTS = {
    '0': '全部权限',
    '1': '监控管理',
    '2': '设备管理',
    '3': '报警管理',
    '4': '客户管理',
    '5': '数据分析',
    '6': '权限管理',
    '7': '系统设置'
}
 */

// 获取权限管理列表 /authority/rights /api/v1/authority/rights/
export function getMenuRights() {
  return ArrangeHttpMethod('get')('/right/')
}
