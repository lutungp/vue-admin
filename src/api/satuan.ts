import request from '@/utils/request'

export const getSatuan = (params: any) =>
  request({
    url: '/satuan',
    method: 'get',
    params
  })

export const getSatuanList = (params: any) =>
  request({
    url: '/satuan_list',
    method: 'get',
    params
  })

export const createSatuan = (data: any) =>
  request({
    url: '/satuan',
    method: 'post',
    data
  })

export const updateSatuan = (id: number, data: any) =>
  request({
    url: `/satuan/${id}`,
    method: 'put',
    data
  })

export const deleteSatuan = (id: number) =>
  request({
    url: `/satuan/${id}`,
    method: 'delete'
  })
