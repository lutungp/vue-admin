import request from '@/utils/request'

export const getBahan = (params: any) =>
  request({
    url: '/bahan',
    method: 'get',
    params
  })

export const createBahan = (data: any) =>
  request({
    url: '/bahan',
    method: 'post',
    data
  })

export const updateBahan = (id: number, data: any) =>
  request({
    url: `/bahan/${id}`,
    method: 'put',
    data
  })

export const deleteBahan = (id: number) =>
  request({
    url: `/bahan/${id}`,
    method: 'delete'
  })
