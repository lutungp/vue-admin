<style>
  .bottom-static {
    position: fixed;
    bottom: 0;
  }
</style>
<template>
    <div class="app-container">
      <el-button size="small"
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
            <el-select v-model="user.s_role_id"
              clearable
              placeholder="Select"
              @change="selectRole">
              <el-option
                v-for="item in optionRoles"
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
import { getUsers, updateUser, createUser } from '@/api/users'
import { getRoles } from '@/api/roles'

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

interface IRoles {
  role_id : number
  role_nama : string
}

@Component({
  name: 'User'
})
export default class extends Vue {
    private dialogVisible = false
    private dialogType = 'new'
    private dataListTotal = 0
    private dataList: IUser[] = []
    private user = Object.assign({}, defaultUser)
    private optionRoles : IRoles[] = [];

    created() {
      this.getUsers()
      this.getRoles()
    }

    private async getUsers() {
      const { data } = await getUsers({ /* Your params here */ })
      this.dataList = data.users;
      this.dataListTotal = data.total
    }

    private async getRoles() {
      const { data } = await getRoles({ /* Your params here */ })
      this.optionRoles = data.items
    }

    private reset(){
      this.user = Object.assign({}, defaultUser)
    }

    private handleCreate() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.reset();
    }

    private handleEdit(scope: any){
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = cloneDeep(scope.row)
    }

    private handleDelete(scope: any){

    }

    private async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateUser(this.user.user_id, { user: this.user })
        this.dialogVisible = false
        for (let index = 0; index < this.dataList.length; index++) {
          if (this.dataList[index].user_id === this.user.user_id) {
            this.dataList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        const { data } = await createUser({ user: this.user })
        this.dialogVisible = false
        this.user.user_id = data.role_id
        this.dataList.push(this.user)
        this.reset();
      }
    }

    private selectRole (data: string[]) {
      console.log(data);
    }
};
</script>
