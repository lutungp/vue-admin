<template>
  <div class="app-container">
      <el-button size="small"
        type="primary"
        @click="handleCreate"
      >
        New satuan
      </el-button>
      <el-table
        :data="dataList"
        style="width: 100%;margin-top:30px;"
        border
      >
        <el-table-column
          align="center"
          label="Kode satuan"
          width="110"
        >
          <template slot-scope="{row}">
            {{ row.satuan_kode }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Nama satuan"
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
        :title="dialogType==='edit'?'Edit Satuan':'New Satuan'"
      >
        <el-form
          :model="satuan"
          label-width="100px"
          label-position="left"
          :rules="rules"
          ref="submitForm"
        >
          <el-form-item
            label="Kode"
            prop="satuan_kode"
            :error="getErrorForField('satuan_kode', errors)"
            required
            >
            <el-input
              v-model="satuan.satuan_kode"
              placeholder="Kode Satuan"
            />
          </el-form-item>
          <el-form-item
            label="Nama"
            prop="satuan_nama"
            :error="getErrorForField('satuan_nama', errors)"
            required>
            <el-input
              v-model="satuan.satuan_nama"
              placeholder="Nama Satuan"
            />
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
import { getSatuanList, createSatuan, deleteSatuan, updateSatuan } from '@/api/satuan'

interface ISatuan {
  satuan_id : number
  satuan_kode : string
  satuan_nama : string
}

const defaultsatuan: ISatuan = {
  satuan_id : 0,
  satuan_kode : "",
  satuan_nama : ""
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
  name: 'Satuan'
})

export default class extends Vue {
  private dialogVisible = false
  private dialogType = 'new'
  private dataListTotal = 0

  private dataList: ISatuan[] = []
  private satuan = Object.assign({}, defaultsatuan)

  rules = {
    satuan_kode : [
      {required: true, message: 'Nama satuan tidak boleh kosong', trigger: 'blur'},
    ],
    satuan_nama : [
      {required: true, message: 'Nama satuan tidak boleh kosong', trigger: 'blur'},
      {min: 3, max: 25, message: 'Nama minimal 3 karakter dan maksimal 25 karakter', trigger: 'blur'}
    ],
  }

  private errors:IErrors[] = []

  created(){
    this.getSatuan()
  }

  private async getSatuan() {
    const { data } = await getSatuanList({ /* Your params here */ })
    this.dataList = data.satuan;
    this.dataListTotal = data.total
  }

  private reset(){
    this.satuan = {
      satuan_id : 0,
      satuan_kode : "",
      satuan_nama : "",
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
    this.satuan = cloneDeep(scope.row)
  }

  private handleDelete(scope: any) {
    const { $index, row } = scope
    this.$confirm('Confirm to remove the role?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async() => {
        await deleteSatuan(row.satuan_id)
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
    try {
      if (isEdit) {
        await updateSatuan(this.satuan.satuan_id, { satuan: this.satuan })
        this.getSatuan()
      } else {
        const { data } = await createSatuan({ satuan: this.satuan })
        this.getSatuan()
      }

      const { satuan_kode, satuan_nama } = this.satuan
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Kode satuan: ${satuan_kode}</div>
            <div>Nama satuan: ${satuan_nama}</div>
          `,
        type: 'success'
      })
    } catch (error) {
      var errmsg = Object.entries(error.response.data.message);
      var datamsg : IErrorsmsg[] = []
      errmsg.forEach(function (params:any[]) {
        var msg = Object.values(params[1])
        if (msg.length > 0) {
            datamsg.push({
              field : params[0],
              message : msg[0]
            })
        }
      })

      this.errors = datamsg
    }
  }

  getErrorForField(field : string, error : IErrors[]) {
    var errfield = error.filter(p=>p.field === field)

    if (errfield.length > 0) {
      return errfield[0].message
    }
  }

}
</script>
