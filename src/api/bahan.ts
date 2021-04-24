import request from '@/utils/request'

export const getBahan = (params: any) =>
  request({
    url: '/bahan',
    method: 'get',
    params
  })
