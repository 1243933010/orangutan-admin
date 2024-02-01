import { asyncRoutes, constantRoutes } from '@/router'
import {route_list} from '@/api/project'
import Layout from '@/layout'
// import {routeProject} from '@/router/index'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async resolve => {
      let accessedRoutes = [];
      let res = await route_list(1007)
      if(res.code==200){

       if( res.data.length>0){
        res.data.forEach((val,index)=>{
          let itemObj = {};
          itemObj.path = val.path;
          itemObj.component = Layout;
          itemObj.redirect=`${val.path}${val.child[0].path}`,
          itemObj.meta = {title:val.name,icon:val.icon};
          itemObj.children = [];
          if(val.child.length>0){
            val.child.forEach((item,ind)=>{
              let component = resolve => require([`../../views/${item.additional}.vue`], resolve) 
              itemObj.children.push({
                path: item.path,
                component,
                meta: {
                  title: item.name,
                }
              })
            })
          }
          
          accessedRoutes.push(itemObj)
        })
       }
      }


      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
