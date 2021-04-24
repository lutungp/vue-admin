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
  </div>
</template>
<script lang="ts">
/* eslint-disable */
import { cloneDeep } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'

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

export default class extends Vue {
  private dialogVisible = false
  private dialogType = 'new'
  private dataListTotal = 0

  private dataList: IBahan[] = []
  private bahan = Object.assign({}, defaultBahan)

  private reset(){

  }

  private handleCreate () {
    this.dialogType = 'new'
    this.dialogVisible = true
    this.reset();
  }
}
</script>
