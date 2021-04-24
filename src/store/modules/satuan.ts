import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSatuan } from '@/api/satuan'
import store from '@/store'

export interface ISatuanState {
  satuan : string[]
}

@Module({ dynamic: true, store, name: 'satuan' })
class Satuan extends VuexModule implements ISatuanState {
  public satuan: string[] = []

  @Mutation
  private SET_SATUAN(satuan: string[]) {
    this.satuan = satuan
  }

  @Action({ rawError: true })
  public async GetSatuan() {
    const { data } = await getSatuan({ /* Your params here */ })
    this.SET_SATUAN(data.items)
  }
}

export const SatuanModule = getModule(Satuan)
