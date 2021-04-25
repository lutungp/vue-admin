<template>
  <div class="app-container">
      <el-button size="small"
        type="primary"
        @click="handleCreate"
      >
        New Produk
      </el-button>
      <el-table
        :data="dataList"
        style="width: 100%;margin-top:30px;"
        border
      >
        <el-table-column
          align="center"
          label="Kode Produk"
          width="110"
        >
          <template slot-scope="{row}">
            {{ row.produk_kode }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Nama Produk"
        >
          <template slot-scope="{row}">
            {{ row.produk_nama }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Satuan"
        >
          <template slot-scope="{row}">
            {{ row.satuan_nama }}
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
        :title="dialogType==='edit'?'Edit Produk':'New Produk'"
      >
        <el-form
          :model="produk"
          label-width="100px"
          label-position="left"
          :rules="rules"
          ref="submitForm"
        >
          <el-form-item
            label="Kode"
            prop="produk_kode"
            >
            <el-input
              v-model="produk.produk_kode"
              placeholder="Kode Produk"
            />
          </el-form-item>
          <el-form-item
            label="Nama"
            prop="produk_nama"
            required>
            <el-input
              v-model="produk.produk_nama"
              placeholder="Nama Produk"
            />
          </el-form-item>
          <el-form-item
            label="Satuan"
            prop="m_satuan_id"
            required>
            <el-select v-model="produk.m_satuan_id"
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
            @click="confirmForm"
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
import { getProduk, createProduk, deleteProduk, updateProduk } from '@/api/produk'

interface IProduk {
  produk_id : number
  produk_kode : string
  produk_nama : string
  m_satuan_id? : number
  satuan_nama? : string
}

const defaultProduk: IProduk = {
  produk_id : 0,
  produk_kode : "",
  produk_nama : ""
}

interface IErrors {
  message : string
  field : string
}

interface IErrorsmsg {
  field : string
  message : any
}

interface ISatuan {
  satuan_id : number
  satuan_kode : string
  satuan_nama : string
}

@Component({
  name: 'Produk'
})

export default class extends Vue {
  private dialogVisible = false
  private dialogType = 'new'
  private dataListTotal = 0

  private dataList: IProduk[] = []
  private produk = Object.assign({}, defaultProduk)

  rules = {
    produk_kode : [
      {required: true, message: 'Kode Produk tidak boleh kosong', trigger: 'blur'},
      {min: 3, max: 25, message: 'Kode minimal 3 karakter dan maksimal 25 karakter', trigger: 'blur'}
    ],
    produk_nama : [
      {required: true, message: 'Nama Produk tidak boleh kosong', trigger: 'blur'},
      {min: 3, max: 25, message: 'Nama Produk minimal 3 karakter dan maksimal 25 karakter', trigger: 'blur'}
    ],
    m_satuan_id : [
      {required: true, message: 'Satuan tidak boleh kosong', trigger: 'blur'}
    ],
  }

  private errors:IErrors[] = []

  created(){
    this.getProduk()
  }

  get satuan() {
    return SatuanModule.satuan
  }

  private async getProduk() {
    const { data } = await getProduk({ /* Your params here */ })
    this.dataList = data.produk;
    this.dataListTotal = data.total
  }

  private reset(){
    this.produk = {
      produk_id : 0,
      produk_kode : "",
      produk_nama : "",
      m_satuan_id : 0,
      satuan_nama : ""
    }
  }

  private handleCreate () {
    this.dialogType = 'new'
    this.dialogVisible = true
    this.reset();
  }

  private async handleEdit(scope: any) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.reset();
    this.produk = cloneDeep(scope.row)
  }

  private handleDelete(scope: any) {
    const { $index, row } = scope
    this.$confirm('Confirm to remove the role?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async() => {
        await deleteProduk(row.produk_id)
        this.dataList.splice($index, 1)
        this.$message({
          type: 'success',
          message: 'Deleted!'
        })
      })
      .catch(err => { console.error(err) })
  }

  private async confirmForm(){
    const isEdit = this.dialogType === 'edit'
    if (isEdit) {
      await updateProduk(this.produk.produk_id, { produk: this.produk })
      this.getProduk()
    } else {
      const { data } = await createProduk({ produk: this.produk })
      this.produk.produk_id = data.produk_id
      this.getProduk()
    }

    const { produk_kode, produk_nama } = this.produk
    this.dialogVisible = false
    this.$notify({
      title: 'Success',
      dangerouslyUseHTMLString: true,
      message: `
          <div>Kode Produk: ${produk_kode}</div>
          <div>Nama Produk: ${produk_nama}</div>
        `,
      type: 'success'
    })
  }

  getErrorForField(field : string, error : IErrors[]) {
    var errfield = error.filter(p=>p.field === field)

    if (errfield.length > 0) {
      return errfield[0].message
    }
  }

  selectSatuan(value : number){
      var selectSatuan = this.satuan.filter(p=>p.satuan_id==value);
      if (selectSatuan.length > 0) {
        this.produk.satuan_nama = selectSatuan[0].satuan_nama
      }
  }
}
</script>
