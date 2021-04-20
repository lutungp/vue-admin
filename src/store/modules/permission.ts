import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

interface IPermission {
  sRouteId : number
  create : string
  read : string
  update : string
  delete : string
  path : string
  permission1 : string
  permission2 : string
  permission3 : string
  permission4 : string
}

const hasPermission = (roles: IPermission[], route: RouteConfig) => {
  const permit = roles.filter(p => (p.path) === route.path && p.read === 'y')
  if (permit.length > 0) {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: IPermission[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(permission : any[]) {
    this.SET_ROUTES(filterAsyncRoutes(asyncRoutes, permission))
  }
}

export const PermissionModule = getModule(Permission)
