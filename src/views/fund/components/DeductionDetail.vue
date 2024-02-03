<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="扣款证明图" prop="email">
                            <el-upload class="upload-com" action="" :file-list="[]"
                                :http-request="(files) => httpRequest('image', files)"
                                :before-upload="beforeAvatarUpload" :limit="1">
                                <!-- <i class="el-icon-plus " style="font-size:82px;" :size="18" /> -->
                                <div class="pic">
                                    <img class="img" style="width: 100px;"
                                        :src="formData.image ? formData.image : defaultImgUrl" alt="">
                                    <!-- <img class="img" :src="defaultImgUrl" alt=""> -->


                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="扣款账号" prop="from_account">
                            <el-input v-model="formData.from_account" placeholder="扣款账号" />
                        </el-form-item>
                        <el-form-item label="转入账号" prop="to_account">
                            <el-input v-model="formData.to_account" placeholder="转入账号" />
                        </el-form-item>
                        <el-form-item label="来源单号" prop="from_no">
                            <el-input v-model="formData.from_no" placeholder="来源单号" />
                        </el-form-item>
                        <el-form-item label="扣款金额" prop="money">
                            <el-input v-model="formData.money" placeholder="扣款金额" />
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="formData.remark" placeholder="备注" />
                        </el-form-item>
                       

                    </el-form>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button v-if="method !== 'detail'" type="primary" @click="handleEmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import { deduct_add,uploadImg } from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '新增',
            dialogVisible: false,
            formData: {},
            defaultImgUrl: require('@/assets/upload_icon.png'),
            method: '',
            rules: {
                nickname: [{ required: true, message: '请输入名称', trigger: 'blur' }],
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
            if (row) {
                if (type) {
                    this.dialogTitle = '详情'
                    this.method = 'detail'
                    // this.getDetail(row.work_order_id)
                } else {
                    // this.getDetail(row.work_order_id)
                    this.dialogTitle = '编辑'
                    this.method = 'edit'
                    this.formData = row
                }
            } else {
                this.dialogTitle = '添加'
                this.method = 'add'
                this.formData = { }
            }
            this.dialogVisible = true
        },
        // async getDetail(work_order_id) {
        //     const res = await workorder_detail({ work_order_id: work_order_id })
        //     if (res.code == 200) {
        //         this.formData = res.data;
        //     }
        // },
        handleEmit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res
                    if (this.method == 'add') {
                        res = await deduct_add(this.formData)
                    } else if (this.method == 'edit') {
                        // res = await dealers_edit(this.formData)
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
  