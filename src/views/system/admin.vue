<template>
  <div>
    <div class="search">
      <div class="form">

        <div class="form-item"><el-input v-model="formData.nickname" type="text" placeholder="请输入名称" /></div>
        <div class="form-item"><el-input v-model="formData.mobile" type="text" placeholder="请输入手机号" /></div>

        <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
        <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
        <div class="form-item submit" @click="editFnc(false)"><span>新增</span></div>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="" label="" width="10"></el-table-column>
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column prop="admin_id" label="id" />
        <el-table-column prop="nickname" label="名称" />
        <el-table-column prop="mobile" label="mobile" />
        <el-table-column prop="email" label="email" />
        <el-table-column prop="avatar" label="头像" />
        <el-table-column prop="password" label="密码" />
        <el-table-column prop="description" label="备注" />
        <el-table-column fixed="right" label="操作" width="400">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editFnc(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="editFnc(scope.row,'see')">详情</el-button>
            <el-button type="text" size="small" @click="delFnc(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="handleRole(scope.row)">配置角色</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display: flex;flex-direction: row-reverse;">
      <el-pagination
        :current-page="formData.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="formData.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="formData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <AdminDetail ref="adminRef" @handleEmit="getList(true)" />
    <AdminRoles ref="adminRolesRef" />
  </div>
</template>

<script>
import { admins_list, admins_del } from '@/api/project'
import AdminDetail from './components/AdminDetail.vue'
import AdminRoles from './components/AdminRoles.vue'

export default {
  components: { AdminDetail,AdminRoles },
  data() {
    return {
      formData: {
        page: 1,
        limit: 10,
        total: 0,
        nickname: '',
        mobile: ''
      },
      tableData: []

    }
  },
  mounted() {
    // this.getWithdrawOptions()
    this.getList(true)
  },
  methods: {
    handleRole(row){
      this.$refs.adminRolesRef.openDialog(row)
    },
    delFnc(row) {
      this.$confirm('是否删除该管理员', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消' }).then(async() => {
        const res = await admins_del(row.admin_id)
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.getList(true)
          return
        }
        this.$message.error(res.msg)
        this.getList(true)
      })
    },
    editFnc(row, type) {
      this.$refs.adminRef.openDialog(row, type)
    },
    resertFormFnc() {
      this.formData = {
        page: 1,
        limit: 10,
        total: 0,
        nickname: '',
        mobile: ''
      }
    },
    handleSizeChange(val) {
      this.formData.limit = val
      this.getList(true)
    },
    handleCurrentChange(val) {
      this.formData.page = val
      this.getList()
    },
    async getList(bool = false) {
      if (bool) {
        this.formData.page = 1
      }
      const res = await admins_list()
      if (res.code == 200) {
        this.formData.total = res.data.total
        this.tableData = res.data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;

    .form-item {
        margin-right: 7px;
    }

    .submit {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: linear-gradient(90deg, #5B80EE 0%, #3E63F4 100%);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 14px;
    }

    .reset {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: #FFFFFF;
        border: 1px solid #F1F1F1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333333;
        font-size: 14px;
    }
}
</style>
