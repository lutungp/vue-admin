/* eslint-disable */
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSatuan } from '@/api/satuan'
import store from '@/store'

export interface ISatuan {
  satuan_id : number
  satuan_kode : string
  satuan_nama : string
}

export interface ISatuanState {
  satuan : ISatuan[]
}

@Module({ dynamic: true, store, name: 'satuan' })
class Satuan extends VuexModule implements ISatuanState {
  public satuan: ISatuan[] = []

  @Mutation
  private SET_SATUAN(satuan: ISatuan[]) {
    this.satuan = satuan
  }

  @Action({ rawError: true })
  public async GetSatuan() {
    const { data } = await getSatuan({ /* Your params here */ })
    this.SET_SATUAN(data.items)
  }
}

export const SatuanModule = getModule(Satuan)
