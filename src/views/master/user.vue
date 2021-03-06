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
          align="header-center"
          label="Role"
        >
          <template slot-scope="{row}">
            {{ row.role_nama }}
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
          :rules="rules"
          ref="submitForm"
        >
          <el-form-item label="Kode">
            <el-input
              v-model="user.user_kode"
              placeholder="Kode User"
            />
          </el-form-item>
          <el-form-item
            label="Nama"
            prop="name"
            :error="getErrorForField('name', errors)"
            required>
            <el-input
              v-model="user.name"
              placeholder="Nama User"
            />
          </el-form-item>
          <el-form-item
            label="User Role"
            prop="s_role_id"
            :error="getErrorForField('s_role_id', errors)"
            required>
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
          <el-form-item
            label="Password"
            prop="password"
            :error="getErrorForField('password', errors)"
            required>
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
import { cloneDeep, values } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'
import { getUsers, updateUser, createUser, deleteUser } from '@/api/users'
import { getRoles } from '@/api/roles'

interface IUser {
  user_id : number
  user_kode : string
  name : string
  s_role_id? : number
  role_nama? : string
  password : string
}

const defaultUser: IUser = {
  user_id : 0,
  user_kode : "",
  name : "",
  password : ""
}

interface IRoles {
  role_id : number
  role_nama : string
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
  name: 'User'
})
export default class extends Vue {
    private dialogVisible = false
    private dialogType = 'new'
    private dataListTotal = 0
    private dataList: IUser[] = []
    private user = Object.assign({}, defaultUser)
    private optionRoles : IRoles[] = [];
    rules = {
      name : [
        {required: true, message: 'Nama tidak boleh kosong', trigger: 'blur'},
        {min: 3, max: 100, message: 'Nama minimal 3 karakter dan maksimal 10 karakter', trigger: 'blur'}
      ],
      s_role_id : [
        {required: true, message: 'Role tidak boleh kosong', trigger: 'blur'}
      ],
      password : [
        {required: true, message: 'Password tidak boleh kosong', trigger: 'blur'},
        {min: 3, max: 100, message: 'Password minimal 3 karakter', trigger: 'blur'}
      ],
    }

    private errors:IErrors[] = []

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
      this.user = {
        user_id : 0,
        user_kode : "",
        name : "",
        s_role_id : 0,
        role_nama : "",
        password : "",
      }
    }

    private handleCreate() {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.reset();
    }

    private handleEdit(scope: any){
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.reset();
      this.user = cloneDeep(scope.row)
    }

    private handleDelete(scope: any){
      const { $index, row } = scope
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.user_id)
          this.dataList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Deleted!'
          })
        })
        .catch(err => { console.error(err) })
    }

    private validateForm(): boolean{
      var validform = false
      let el: any = this.$refs["submitForm"]
      el.validate((valid: boolean) => {
         validform = valid
      })

      return validform
    }

    successResponse(){
      const { role_nama, name } = this.user
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Name: ${name}</div>
            <div>Role: ${role_nama}</div>
          `,
        type: 'success'
      })

      this.reset()
    }

    private async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      if (!this.validateForm()) {
        return false;
      }
      if (isEdit) {
        try {
          await updateUser(this.user.user_id, { user: this.user })
          this.successResponse()
        } catch(error) {
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
        this.dialogVisible = false
        for (let index = 0; index < this.dataList.length; index++) {
          if (this.dataList[index].user_id === this.user.user_id) {
            this.dataList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        try {
          const { data } = await createUser({ user: this.user })

          this.dialogVisible = false
          this.user.user_id = data.user_id
          this.dataList.push(this.user)
          this.successResponse()
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
    }

    getErrorForField(field : string, error : IErrors[]) {
      var errfield = error.filter(p=>p.field === field)

      if (errfield.length > 0) {
        return errfield[0].message
      }
    }

    selectRole(value : any){
      var selectRole = this.optionRoles.filter(p=>p.role_id==value);
      if (selectRole.length > 0) {
        this.user.role_nama = selectRole[0].role_nama
      }
    }
};
</script>
