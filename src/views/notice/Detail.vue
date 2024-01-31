<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-row>
          <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'" :rules="rules"
            label-width="120px">
            
            <el-form-item label="标题" prop="title">
              <el-col :span="12">
                <el-input v-model="formData.title" placeholder="标题" />
              </el-col>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <el-col :span="12">
                <el-input v-model="formData.content" placeholder="内容" type="textarea" />
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
import {  admins_edit, notice_add, } from '@/api/project'
export default {
  data() {
    return {
      dialogTitle: '新增权限',
      dialogVisible: false,
      formData: {
        title: '',
        content:''
      },
      method: '',
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      list: []
    }
  },
  methods: {
    
    openDialog(row, type) {
      if (row) {
        if (type) {
          this.dialogTitle = '权限详情'
          this.method = 'detail'
          this.formData = row
        } else {
          this.dialogTitle = '编辑权限'
          this.method = 'edit'
          this.formData = row
        }
      } else {
        this.method = 'add'
        this.formData = {
          title: '',
          content:''
        }
      }
      this.dialogVisible = true
    },
   
    handleEmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res
          if (this.method == 'add') {
            res = await notice_add(this.formData)
          } else if (this.method == 'edit') {
            res = await admins_edit(this.formData.admin_id, this.formData)
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
