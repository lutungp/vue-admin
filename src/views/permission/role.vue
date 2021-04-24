<template>
  <div class="app-container">
    <el-button
      type="primary"
      @click="handleCreateRole"
    >
      {{ $t('permission.createRole') }}
    </el-button>

    <el-table
      :data="rolesList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="Role Name"
        width="220"
      >
        <template slot-scope="{row}">
          {{ row.role_nama }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="Description"
      >
        <template slot-scope="{row}">
          {{ row.role_keterangan }}
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
      :title="dialogType==='edit'?'Edit Role':'New Role'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Name">
          <el-input
            v-model="role.role_nama"
            placeholder="Role Name"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.role_keterangan"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>

          <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="route_id"
            border
            default-expand-all>
            <el-table-column
              prop="meta.title"
              label="Path">
            </el-table-column>
            <el-table-column
              prop="create"
              label="Create"
              align="center"
              width="129">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.create" @change="checkingCreateBox(scope.row, scope.row.create)"/>
                </template>
            </el-table-column>
            <el-table-column
              prop="read"
              label="Read"
              align="center"
              width="129">
              <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.read" @change="checkingReadBox(scope.row, scope.row.read)"/>
                </template>
            </el-table-column>
            <el-table-column
              prop="update"
              label="Update"
              align="center"
              width="129">
              <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.update" @change="checkingUpdateBox(scope.row, scope.row.update)"/>
                </template>
            </el-table-column>
            <el-table-column
              prop="delete"
              label="Delete"
              align="center"
              width="129">
              <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.delete" @change="checkingDeleteBox(scope.row, scope.row.delete)"/>
                </template>
            </el-table-column>
          </el-table>

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
import { RouteConfig } from 'vue-router'
import { Tree } from 'element-ui'
import { getRoutes, getRoles, createRole, deleteRole, updateRole, getRolePermission } from '@/api/roles'

interface IRole {
  role_id: number
  role_nama: string
  role_keterangan: string
  routes: RouteConfig[]
}

interface IRoutesData {
  permission_id: number
  route_id: number
  route_level: number
  path   : string
  create : boolean
  read   : boolean
  update : boolean
  delete : boolean
  meta : []
  children : IRoutesDataCh[]
}

interface IRoutesDataCh {
  permission_id: number
  route_id: number
  s_route_id: number
  route_level: number
  path   : string
  create : boolean
  read   : boolean
  update : boolean
  delete : boolean
  meta : []
  children : IRoutesDataCh[]
}

const defaultRole: IRole = {
  role_id: 0,
  role_nama: '',
  role_keterangan: '',
  routes: []
}

@Component({
  name: 'RolePermission'
})
export default class extends Vue {
  private role = Object.assign({}, defaultRole)
  private rolesList: IRole[] = []
  private dialogVisible = false
  private dialogType = 'new'
  private tableData: IRoutesData[] = []

  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  }

  private async getRoutes() {
    const { data } = await getRoutes({ /* Your params here */ })
    this.tableData = data.routes;
  }

  private async getRoles() {
    const { data } = await getRoles({ /* Your params here */ })
    this.rolesList = data.items
  }

  private checkingCreateBox (row : any, value : boolean): void{
      let children = row.children;
      children.forEach((ch : any) => {
        ch.create = value;
      });

      if (children.length == 0) {
        const s_route_id = row.s_route_id;

        const tableData = this.tableData.filter(p=>p.route_id == s_route_id)
        tableData[0].create = value;
      }
  }

  private checkingReadBox (row : any, value : boolean){
      let children = row.children;
      children.forEach((ch : any) => {
        ch.read = value;
      });

      if (children.length == 0) {
        const s_route_id = row.s_route_id;

        const tableData = this.tableData.filter(p=>p.route_id == s_route_id)
        tableData[0].read = value;
      }
  }

  private checkingUpdateBox (row : any, value : boolean){
      let children = row.children;
      children.forEach((ch : any) => {
        ch.update = value;
      });

      if (children.length == 0) {
        const s_route_id = row.s_route_id;

        const tableData = this.tableData.filter(p=>p.route_id == s_route_id)
        tableData[0].update = value;
      }
  }

  private checkingDeleteBox (row : any, value : boolean){
      let children = row.children;
      children.forEach((ch : any) => {
        ch.delete = value;
      });

      if (children.length == 0) {
        const s_route_id = row.s_route_id;

        const tableData = this.tableData.filter(p=>p.route_id == s_route_id)
        tableData[0].delete = value;
      }
  }

  private handleCreateRole() {
    this.role = Object.assign({}, defaultRole)
    if (this.$refs.tree) {
      (this.$refs.tree as Tree).setCheckedKeys([])
    }
    this.dialogType = 'new'
    this.dialogVisible = true
  }

  private async handleEdit(scope: any) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.role = cloneDeep(scope.row)
    const { data } = await getRolePermission(this.role.role_id)

    this.tableData = data;
  }

  private handleDelete(scope: any) {
    const { $index, row } = scope
    this.$confirm('Confirm to remove the role?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async() => {
        await deleteRole(row.role_id)
        this.rolesList.splice($index, 1)
        this.$message({
          type: 'success',
          message: 'Deleted!'
        })
      })
      .catch(err => { console.error(err) })
  }

  private async confirmRole() {
    const isEdit = this.dialogType === 'edit'
    this.role.routes = this.tableData;
    if (isEdit) {
      await updateRole(this.role.role_id, { role: this.role })
      for (let index = 0; index < this.rolesList.length; index++) {
        if (this.rolesList[index].role_id === this.role.role_id) {
          this.rolesList.splice(index, 1, Object.assign({}, this.role))
          this.tableData = [];
          break
        }
      }
    } else {
      const { data } = await createRole({ role: this.role })
      this.role.role_id = data.role_id
      this.rolesList.push(this.role)
      this.tableData = [];
    }

    const { role_keterangan, role_id, role_nama } = this.role
    this.dialogVisible = false
    this.$notify({
      title: 'Success',
      dangerouslyUseHTMLString: true,
      message: `
          <div>Role Key: ${role_id}</div>
          <div>Role Name: ${role_nama}</div>
          <div>Description: ${role_keterangan}</div>
        `,
      type: 'success'
    })
  }

}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
