<template>
    <div class="app-container">
    </div>
</template>
<script lang="ts">
/* eslint-disable */
import { Component, Vue } from 'vue-property-decorator'
import { getUsers } from '@/api/users'

interface IUserData {
  user_id : number
  user_kode : string
  name : string
  s_role_id : number
}

@Component({
  name: 'User'
})
export default class extends Vue {
    private tableData: IUserData[] = []
    created() {
      this.getUsers()
    }

    private async getUsers() {
    const { data } = await getUsers({ /* Your params here */ })
      this.tableData = data.users;
    }
};
</script>
