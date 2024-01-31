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
            <!-- <el-form-item label="父级权限" prop="parent_id">
                            <el-col :span="12">
                                <el-select v-model="formData.parent_id" placeholder="请选择">
                                    <el-option  label="首级" :value="0"> </el-option>
                                    <el-option v-for="item in list" :key="id" :label="item.display_name" :value="item.admin_id"> </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item> -->
            <el-form-item label="管理员名称" prop="nickname">
              <el-col :span="12">
                <el-input v-model="formData.nickname" placeholder="管理员名称" />
              </el-col>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-col :span="12">
                <el-input v-model="formData.mobile" placeholder="手机号" />
              </el-col>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-col :span="12">
                <el-input v-model="formData.password" placeholder="密码" />
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-col :span="12">
                <el-input v-model="formData.email" placeholder="邮箱" />
              </el-col>
            </el-form-item>
            <el-form-item label="头像" prop="email">
              <!-- <el-col :span="12"> -->
              <el-upload
                class="upload-com"
                action=""
                :file-list="[]"
                :http-request="(files) => httpRequest('avatar', files)"
                :before-upload="beforeAvatarUpload"
                :limit="1"
              >
                <i class="el-icon-plus" style="font-size:82px;" :size="18" />
                <div class="pic">
                  <img class="img" :src="formData.avatar ? formData.avatar :''" alt="">

                </div>
              </el-upload>
              <!-- </el-col> -->
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
import { admins_detail, admins_edit, admins_add, permissions_list, uploadImg } from '@/api/project'
export default {
  data() {
    return {
      dialogTitle: '新增权限',
      dialogVisible: false,
      formData: {
        nickname: '',
        mobile: '',
        password: '',
        email: '',
        avatar: ''
      },
      method: '',
      rules: {
        nickname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      list: []
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isIMG = file.type.includes('image')

      if (!isIMG) {
        this.$message.error('上传头像只能是图片!')
      }
      return isIMG
    },
    async httpRequest(type, files) {
      const formData = new FormData()
      formData.append('file', files.file) // 文件名
      console.log(type, files, formData)
      const res = await uploadImg(formData)
      console.log(res, process.env.VUE_APP_FILE_URL)
      if (res.code == 200) {
        this.formData[type] = process.env.VUE_APP_FILE_URL + res.data
        return
      }
      this.$message.error(res.msg)
    },
    openDialog(row, type) {
      this.getList()
      if (row) {
        if (type) {
          this.dialogTitle = '权限详情'
          this.method = 'detail'
          this.getDetail(row.admin_id)
        } else {
          this.getDetail(row.admin_id)
          this.dialogTitle = '编辑权限'
          this.method = 'edit'
          this.formData = row
        }
      } else {
        this.method = 'add'
        this.formData = {
          admin_id: '',
          name: '',
          display_name: '',
          effect_uri: '',
          description: ''
        }
      }
      this.dialogVisible = true
    },
    async getDetail(id) {
      const res = await admins_detail(id)
      if (res.code == 200) {
        this.formData = res.data
      }
    },
    async getList() {
      const res = await permissions_list(this.formData)
      if (res.code == 200) {
        this.list = res.data.data
      }
    },
    handleEmit() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          let res
          if (this.method == 'add') {
            res = await admins_add(this.formData)
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
