import request from '@/utils/request'

export const getProduk = (params: any) =>
  request({
    url: '/produk',
    method: 'get',
    params
  })

export const createProduk = (data: any) =>
  request({
    url: '/produk',
    method: 'post',
    data
  })

export const updateProduk = (id: number, data: any) =>
  request({
    url: `/produk/${id}`,
    method: 'put',
    data
  })

export const deleteProduk = (id: number) =>
  request({
    url: `/produk/${id}`,
    method: 'delete'
  })
