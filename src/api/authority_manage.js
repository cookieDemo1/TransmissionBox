import { ArrangeHttpMethod } from '_common/util'

// 获取权限管理列表 /authority
export function getAuthorityList(params) {
  return ArrangeHttpMethod('get')('/rights/', params)
}
// 修改管理员/authority/{account_id}
export function modifyManager(path, params) {
  return ArrangeHttpMethod('put')('/rights'+ (path ? ('/' + path ) : '') + '/', params)
}

// 增加管理员/authority
export function addManager(params) {
  return ArrangeHttpMethod('post')('/rights/', params)
}

// 删除管理员/authority/{id}
export function deleteManager(path) {
  return ArrangeHttpMethod('delete')('/rights' + (path ? ('/' + path) : ''))
}

