import request from '@/utils/request'

//权限列表
export function permissions_list(params) {
  return request({
    url: '/admin/permissions/list',
    method: 'get',
    params
  })
}


//权限信息详情
export function permissions_detail(id) {
  return request({
    url: `/admin/permissions/get/${id}`,
    method: 'get'
  })
}

//权限修改
export function permissions_edit(id,data) {
  return request({
    url: `/admin/permissions/update/${id}`,
    method: 'post',
    data
  })
}

//权限新增
export function permissions_add(data) {
  return request({
    url: `/admin/permissions/add`,
    method: 'post',
    data
  })
}

//删除权限
export function permissions_del(id) {
  return request({
    url: `/admin/permissions/del/${id}`,
    method: 'post'
  })
}


//角色列表
export function roles_list(params) {
  return request({
    url: '/admin/roles/list',
    method: 'get',
    params
  })
}

//删除角色
export function roles_del(id) {
  return request({
    url: `/admin/roles/del/${id}`,
    method: 'post'
  })
}

//角色修改
export function roles_edit(id,data) {
  return request({
    url: `/admin/roles/update/${id}`,
    method: 'post',
    data
  })
}

//角色信息详情
export function roles_detail(id) {
  return request({
    url: `/admin/roles/get/${id}`,
    method: 'get'
  })
}

//角色新增
export function roles_add(data) {
  return request({
    url: `/admin/roles/add`,
    method: 'post',
    data
  })
}


//角色拥有的权限列表
export function get_permissions(id) {
  return request({
    url: `/admin/roles/get_permissions/${id}`,
    method: 'get'
  })
}

//角色添加权限
export function roles_permissions_add(data) {
  return request({
    url: `/admin/roles_permissions/insert`,
    method: 'post',
    data
  })
}

//角色添加权限
export function roles_permissions_del(id) {
  return request({
    url: `/admin/roles_permissions/del/${id}`,
    method: 'post',
  })
}


//------

//提现订单-列表
export function withdraw_list(params) {
  return request({
    url: '/admin/withdraw/list',
    method: 'get',
    params
  })
}


//提现订单-列表的状态可选项
export function withdraw_options(params) {
    return request({
      url: '/admin/withdraw/options',
      method: 'get',
      params
    })
  }
  
//提现订单-审核
export function withdraw_examine(data) {
  return request({
    url: '/admin/withdraw/examine',
    method: 'post',
    data
  })
}



//充值订单-列表
export function recharge_list(params) {
  return request({
    url: '/admin/recharge/list',
    method: 'get',
    params
  })
}


//充值订单-标记失败
export function recharge_checkFail(data) {
  return request({
    url: '/admin/recharge/checkFail',
    method: 'post',
    data
  })
}


//充值订单-补单
export function recharge_reGet(data) {
  return request({
    url: '/admin/recharge/reGet',
    method: 'post',
    data
  })
}



//资金明细列表
export function fund_list(params) {
  return request({
    url: '/admin/fund/list',
    method: 'get',
    params
  })
}

//资金明细导出
export function fund_export(params) {
  return request({
    url: '/admin/fund/export',
    method: 'get',
    params
  })
}


//公告列表
export function notice_list(params) {
  return request({
    url: '/admin/notice/list',
    method: 'get',
    params
  })
}