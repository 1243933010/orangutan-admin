<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-row>
          <el-form
            ref="ruleForm"
            :model="formData"
            class="demo-form-inline"
            :disabled="method == 'detail'"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="父级菜单" prop="name">
              <el-col :span="12">
                <el-select v-model="formData.parent_id" placeholder="请选择">
                  <el-option label="首级" :value="0" />
                  <el-option v-for="(item,index) in list" :key="index" :label="item.name" :value="item.menu_id" />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="关联权限" prop="name">
              <el-col :span="12">
                <el-select v-model="formData.permission_id" placeholder="请选择">
                  <el-option label="首级" :value="0" />
                  <el-option v-for="(item,index) in permissionsList" :key="index" :label="item.display_name" :value="item.permission_id" />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
              <el-col :span="12">
                <el-input v-model="formData.name" placeholder="菜单名称" />
              </el-col>
            </el-form-item>
            <el-form-item label="菜单路径" prop="path">
              <el-col :span="12">
                <el-input v-model="formData.path" placeholder="菜单路径" />
              </el-col>
            </el-form-item>
            <el-form-item label="附加字段" prop="additional">
              <el-col :span="12">
                <el-input v-model="formData.additional" placeholder="附加字段" />
              </el-col>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-col :span="12">
                <el-input v-model="formData.description" placeholder="备注" />
              </el-col>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <span v-if="method !== 'detail'" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleEmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { menus_detail, menus_edit, menus_add, menus_list, permissions_list } from '@/api/project'
export default {
  data() {
    return {
      dialogTitle: '新增角色',
      dialogVisible: false,
      formData: {
        name: '',
        path: '',
        additional: '',
        description: '',
        permission_id: ''
      },
      method: '',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        additional: [{ required: true, message: '请输入附加字段', trigger: 'blur' }],
        permission_id: [{ required: true, message: '请选择关联权限', trigger: 'blur' }]
      },
      list: [],
      permissionsList: []
    }
  },
  methods: {
    async getPermissionsList() {
      const res = await permissions_list({})
      if (res.code == 200) {
        this.permissionsList = res.data.data
      }
    },
    openDialog(row, type) {
      this.getList()
      this.getPermissionsList()
      if (row) {
        if (type) {
          this.dialogTitle = '角色详情'
          this.method = 'detail'
          this.getDetail(row.menu_id)
        } else {
          this.getDetail(row.menu_id)
          this.dialogTitle = '编辑角色'
          this.method = 'edit'
          this.formData = row
        }
      } else {
        this.method = 'add'
        this.formData = {
          menu_id: '',
          name: '',
          display_name: '',
          description: ''
        }
      }
      this.dialogVisible = true
    },
    async getDetail(id) {
      const res = await menus_detail(id)
      if (res.code == 200) {
        this.formData = res.data
      }
    },
    async getList() {
      const res = await menus_list(this.formData)
      if (res.code == 200) {
        this.list = res.data.data
      }
    },
    handleEmit() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          let res
          if (this.method == 'add') {
            res = await menus_add(this.formData)
          } else if (this.method == 'edit') {
            res = await menus_edit(this.formData.menu_id, this.formData)
          }

          if (res.code == 200) {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.$emit('handleEmit')
            return
          }
          this.$message.error(res.msg)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
