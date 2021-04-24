<template>
  <div class="app-container">
      <el-button size="small"
        type="primary"
        @click="handleCreate"
      >
        New Bahan
      </el-button>
      <el-table
        :data="dataList"
        style="width: 100%;margin-top:30px;"
        border
      >
        <el-table-column
          align="center"
          label="Kode Bahan"
          width="300"
        >
          <template slot-scope="{row}">
            {{ row.kode_bahan }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Nama Bahan"
        >
          <template slot-scope="{row}">
            {{ row.bahan_nama }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="Operations"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope)"
            >
              {{ $t('permission.editPermission') }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope)"
            >
              {{ $t('permission.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block bottom-static">
        <el-pagination
          layout="prev, pager, next"
          :total="dataListTotal">
        </el-pagination>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        :title="dialogType==='edit'?'Edit User':'New User'"
      >
        <el-form
          :model="bahan"
          label-width="100px"
          label-position="left"
          :rules="rules"
          ref="submitForm"
        >
          <el-form-item
            label="Kode"
            prop="bahan_kode"
            >
            <el-input
              v-model="bahan.bahan_kode"
              placeholder="Kode User"
            />
          </el-form-item>
          <el-form-item
            label="Nama"
            prop="bahan_nama"
            required>
            <el-input
              v-model="bahan.bahan_nama"
              placeholder="Nama User"
            />
          </el-form-item>
          <el-form-item
            label="Satuan"
            prop="m_satuan_id"
            required>
            <el-select v-model="bahan.m_satuan_id"
              clearable
              placeholder="Select"
              @change="selectSatuan">
              <el-option
                v-for="item in satuan"
                :key="item.satuan_id"
                :label="item.satuan_nama"
                :value="item.satuan_id"
                width="100%">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button
            type="danger"
            @click="dialogVisible=false"
          >
            {{ $t('permission.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="confirmUser"
          >
            {{ $t('permission.confirm') }}
          </el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script lang="ts">
/* eslint-disable */
import { cloneDeep } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'
import { SatuanModule } from '@/store/modules/satuan'
import { getSatuan } from '@/api/satuan'
import { getBahan } from '@/api/bahan'

interface IBahan {
  bahan_id : number
  bahan_kode : string
  bahan_nama : string
}

const defaultBahan: IBahan = {
  bahan_id : 0,
  bahan_kode : "",
  bahan_nama : ""
}

interface IErrors {
  message : string
  field : string
}

interface IErrorsmsg {
  field : string
  message : any
}

@Component({
  name: 'Bahan'
})

export default class extends Vue {
  private dialogVisible = false
  private dialogType = 'new'
  private dataListTotal = 0

  private dataList: IBahan[] = []
  private bahan = Object.assign({}, defaultBahan)

  rules = {
    bahan_kode : [
      {required: true, message: 'Nama Bahan tidak boleh kosong', trigger: 'blur'},
      {min: 3, max: 100, message: 'Nama minimal 3 karakter dan maksimal 10 karakter', trigger: 'blur'}
    ],
    bahan_nama : [
      {required: true, message: 'Nama Bahan tidak boleh kosong', trigger: 'blur'},
      {min: 3, max: 100, message: 'Nama minimal 3 karakter dan maksimal 10 karakter', trigger: 'blur'}
    ],
    m_satuan_id : [
      {required: true, message: 'Satuan tidak boleh kosong', trigger: 'blur'}
    ],
  }

  private errors:IErrors[] = []

  created(){
    this.getBahan()
  }

  get satuan() {
    return SatuanModule.satuan
  }

  private async getBahan() {
    const { data } = await getBahan({ /* Your params here */ })
    this.dataList = data.bahan;
    this.dataListTotal = data.total
  }

  private reset(){

  }

  private handleCreate () {
    this.dialogType = 'new'
    this.dialogVisible = true
    this.reset();
  }

  private async confirmUser(){

  }

  getErrorForField(field : string, error : IErrors[]) {
    var errfield = error.filter(p=>p.field === field)

    if (errfield.length > 0) {
      return errfield[0].message
    }
  }

  selectSatuan(){

  }
}
</script>
