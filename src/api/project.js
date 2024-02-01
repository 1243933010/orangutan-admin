import request from '@/utils/request'


// 菜单路由列表
export function route_list(id) {
  return request({
    url: `/admin/admins/get_menus/${id}`,
    method: 'get',
  })
}


// 上传
export function uploadImg(data) {
  return request({
    url: '/api/public/file_upload',
    method: 'post',
    data
  })
}



// 权限列表
export function permissions_list(params) {
  return request({
    url: '/admin/permissions/list',
    method: 'get',
    params
  })
}

// 权限信息详情
export function permissions_detail(id) {
  return request({
    url: `/admin/permissions/get/${id}`,
    method: 'get'
  })
}

// 权限修改
export function permissions_edit(id, data) {
  return request({
    url: `/admin/permissions/update/${id}`,
    method: 'post',
    data
  })
}

// 权限新增
export function permissions_add(data) {
  return request({
    url: `/admin/permissions/add`,
    method: 'post',
    data
  })
}

// 删除权限
export function permissions_del(id) {
  return request({
    url: `/admin/permissions/del/${id}`,
    method: 'post'
  })
}

// 角色列表
export function roles_list(params) {
  return request({
    url: '/admin/roles/list',
    method: 'get',
    params
  })
}

// 删除角色
export function roles_del(id) {
  return request({
    url: `/admin/roles/del/${id}`,
    method: 'post'
  })
}

// 角色修改
export function roles_edit(id, data) {
  return request({
    url: `/admin/roles/update/${id}`,
    method: 'post',
    data
  })
}

// 角色信息详情
export function roles_detail(id) {
  return request({
    url: `/admin/roles/get/${id}`,
    method: 'get'
  })
}

// 角色新增
export function roles_add(data) {
  return request({
    url: `/admin/roles/add`,
    method: 'post',
    data
  })
}

// 角色拥有的权限列表
export function get_permissions(id) {
  return request({
    url: `/admin/roles/get_permissions/${id}`,
    method: 'get'
  })
}

// 角色添加权限
export function roles_permissions_add(data) {
  return request({
    url: `/admin/roles_permissions/insert`,
    method: 'post',
    data
  })
}

// 角色添加权限
export function roles_permissions_del(id) {
  return request({
    url: `/admin/roles_permissions/del/${id}`,
    method: 'post'
  })
}

// 菜单列表
export function menus_list() {
  return request({
    url: `/admin/menus/list`,
    method: 'get'
  })
}

// 菜单详情
export function menus_detail(id) {
  return request({
    url: `/admin/menus/get/${id}`,
    method: 'get'
  })
}

// 菜单添加
export function menus_add(data) {
  return request({
    url: `/admin/menus/add`,
    method: 'post',
    data
  })
}

// 删除菜单
export function menus_del(id) {
  return request({
    url: `/admin/menus/del/${id}`,
    method: 'post'
  })
}

// 菜单修改
export function menus_edit(id, data) {
  return request({
    url: `/admin/menus/update/${id}`,
    method: 'post',
    data
  })
}

// 管理员列表
export function admins_list() {
  return request({
    url: `/admin/admins/list`,
    method: 'get'
  })
}

// 管理员详情
export function admins_detail(id) {
  return request({
    url: `/admin/admins/get/${id}`,
    method: 'get'
  })
}

// 管理员添加
export function admins_add(data) {
  return request({
    url: `/admin/admins/add`,
    method: 'post',
    data
  })
}

// 删除管理员
export function admins_del(id) {
  return request({
    url: `/admin/admins/del/${id}`,
    method: 'post'
  })
}

// 管理员修改
export function admins_edit(id, data) {
  return request({
    url: `/admin/admins/update/${id}`,
    method: 'post',
    data
  })
}

// 获取管理员角色
export function admins_roles_list(id) {
  return request({
    url: `/admin/admins/get_roles/${id}`,
    method: 'get'
  })
}

// 管理员添加角色
export function admins_roles_edit(data) {
  return request({
    url: `/admin/roles_admins/insert`,
    method: 'post',
    data
  })
}



// 移除管理员角色
export function admins_roles_del(id) {
  return request({
    url: `/admin/roles_admins/del/${id}`,
    method: 'post'
  })
}


// ------

// 提现订单-列表
export function withdraw_list(params) {
  return request({
    url: '/admin/withdraw/list',
    method: 'get',
    params
  })
}

// 提现订单-列表的状态可选项
export function withdraw_options(params) {
  return request({
    url: '/admin/withdraw/options',
    method: 'get',
    params
  })
}

// 提现订单-审核
export function withdraw_examine(data) {
  return request({
    url: '/admin/withdraw/examine',
    method: 'post',
    data
  })
}

// 充值订单-列表
export function recharge_list(params) {
  return request({
    url: '/admin/recharge/list',
    method: 'get',
    params
  })
}

// 充值订单-标记失败
export function recharge_checkFail(data) {
  return request({
    url: '/admin/recharge/checkFail',
    method: 'post',
    data
  })
}

// 充值订单-补单
export function recharge_reGet(data) {
  return request({
    url: '/admin/recharge/reGet',
    method: 'post',
    data
  })
}

// 资金明细列表
export function fund_list(params) {
  return request({
    url: '/admin/fund/list',
    method: 'get',
    params
  })
}

// 资金明细导出
export function fund_export(params) {
  return request({
    url: '/admin/fund/export',
    method: 'get',
    params
  })
}

// 公告列表
export function notice_list(params) {
  return request({
    url: '/admin/notice/list',
    method: 'get',
    params
  })
}


// 公告-添加
export function notice_add(data) {
  return request({
    url: '/admin/notice/add',
    method: 'post',
    data
  })
}

// 公告-删除
export function notice_del(id, data) {
  return request({
    url: `/admin/notice/del/${id}`,
    method: 'post',
    data
  })
}


// 用户列表
export function member_list(data) {
  return request({
    url: '/admin/member/list',
    method: 'post',
    data
  })
}


// 用户详情
export function member_detail(data) {
  return request({
    url: `/admin/member/get_member`,
    method: 'post',
    data
  })
}



// 用户编辑
export function member_edit(data) {
  return request({
    url: `/admin/member/edit_member`,
    method: 'post',
    data
  })
}



// 收款钱包信息列表
export function payment_list(data) {
  return request({
    url: '/admin/payment/list',
    method: 'post',
    data
  })
}


// 收款钱包信息
export function payment_detail(data) {
  return request({
    url: '/admin/payment/wallet_select',
    method: 'post',
    data
  })
}


// 钱包添加
export function payment_add(data) {
  return request({
    url: '/admin/payment/wallet_store',
    method: 'post',
    data
  })
}



// 钱包编辑
export function payment_edit(data) {
  return request({
    url: '/admin/payment/wallet_edit',
    method: 'post',
    data
  })
}


// 认证申请-列表
export function authentication_list(params) {
  return request({
    url: '/admin/authentication/list',
    method: 'get',
    params
  })
}

// 认证申请-审核
export function authentication_examine(data) {
  return request({
    url: '/admin/authentication/examine',
    method: 'post',
    data
  })
}



// 认证申请-列表
export function workorder_list(data) {
  return request({
    url: '/admin/workorder/list',
    method: 'post',
    data
  })
}



// 配置列表
export function config_list(params) {
  return request({
    url: '/admin/config/list',
    method: 'get',
    params
  })
}


// 添加配置
export function config_add(data) {
  return request({
    url: '/admin/config/add',
    method: 'post',
    data
  })
}

// 修改配置
export function config_edit(data) {
  return request({
    url: '/admin/config/edit',
    method: 'post',
    data
  })
}
