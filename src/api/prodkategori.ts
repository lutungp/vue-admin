import request from '@/utils/request'

export const getProdKategori = (params: any) =>
  request({
    url: '/prodkategori',
    method: 'get',
    params
  })

export const getProdKategorilist = (params: any) =>
  request({
    url: '/prodkategorilist',
    method: 'get',
    params
  })

export const createProdKategori = (data: any) =>
  request({
    url: '/prodkategori',
    method: 'post',
    data
  })

export const updateProdKategori = (id: number, data: any) =>
  request({
    url: `/prodkategori/${id}`,
    method: 'put',
    data
  })

export const deleteProdKategori = (id: number) =>
  request({
    url: `/prodkategori/${id}`,
    method: 'delete'
  })
