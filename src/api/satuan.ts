import request from '@/utils/request'

export const getSatuan = (params: any) =>
  request({
    url: '/satuan',
    method: 'get',
    params
  })
