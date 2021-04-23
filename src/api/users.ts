import request from '@/utils/request'

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const createUser = (data: any) =>
  request({
    url: '/users',
    method: 'post',
    data
  })

export const updateUser = (userid: number, data: any) =>
  request({
    url: `/users/${userid}`,
    method: 'put',
    data
  })

export const deleteUser = (userid: number) =>
  request({
    url: `/users/${userid}`,
    method: 'delete'
  })

export const login = (data: any) =>
  request({
    url: '/users/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })
