<template>
    <div class="app-container">
      <el-button
        type="primary"
        @click="handleCreate"
      >
        New User
      </el-button>

      <el-table
        :data="dataList"
        style="width: 100%;margin-top:30px;"
        border
      >
        <el-table-column
          align="center"
          label="Kode User"
          width="300"
        >
          <template slot-scope="{row}">
            {{ row.user_kode }}
          </template>
        </el-table-column>
        <el-table-column
          align="header-center"
          label="Nama User"
        >
          <template slot-scope="{row}">
            {{ row.name }}
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

        <el-dialog
          :visible.sync="dialogVisible"
          width="30%"
          :title="dialogType==='edit'?'Edit User':'New User'"
        >
          <el-form
            :model="user"
            label-width="100px"
            label-position="left"
          >
            <el-form-item label="Kode">
              <el-input
                v-model="user.user_kode"
                placeholder="Kode User"
              />
            </el-form-item>
            <el-form-item label="Nama">
              <el-input
                v-model="user.name"
                placeholder="Nama User"
              />
            </el-form-item>
            <el-form-item label="Usergroup">
              <el-select v-model="user.s_role_id" clearable placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.role_id"
                  :label="item.role_nama"
                  :value="item.role_id"
                  width="100%">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Password">
              <el-input
                v-model="user.password"
                type="password"
                placeholder="Password"
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
              @click="confirmRole"
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
import { getUsers } from '@/api/users'

interface IUser {
  user_id : number
  user_kode : string
  name : string
  s_role_id : number
  role_nama : string
  password : string
}

const defaultUser: IUser = {
  user_id : 0,
  user_kode : "",
  name : "",
  s_role_id : 0,
  role_nama : "",
  password : ""
}

@Component({
  name: 'User'
})
export default class extends Vue {
    private dialogVisible = false
    private dialogType = 'new'
    private dataList: IUser[] = []
    private user = Object.assign({}, defaultUser)
    private options = [{
          role_id: 'Option1',
          role_nama: 'Option1'
        }, {
          role_id: 'Option2',
          role_nama: 'Option2'
        }, {
          role_id: 'Option3',
          role_nama: 'Option3'
        }, {
          role_id: 'Option4',
          role_nama: 'Option4'
        }, {
          role_id: 'Option5',
          role_nama: 'Option5'
        }];

    created() {
      this.getUsers()
    }

    private async getUsers() {
      const { data } = await getUsers({ /* Your params here */ })
      this.dataList = data.users;
    }

    private handleCreate() {
      this.dialogType = 'new'
      this.dialogVisible = true
      console.log('new')
    }

    private handleEdit(scope: any){
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = cloneDeep(scope.row)
    }

    private handleDelete(scope: any){
      
    }

    private confirmRole() {
      console.log(this.user)
    }
};
</script>
