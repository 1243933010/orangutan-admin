<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="收款地址" prop="url">
                            <el-input v-model="formData.url" placeholder="收款地址" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="formData.status" placeholder="状态">
                                <el-option label="禁用" :value="0" />
                                <el-option label="启用" :value="1" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用途" prop="use_type">
                            <el-select v-model="formData.use_type" placeholder="用途">
                                <el-option label="收款" :value="1" />
                                <el-option label="提现" :value="2" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类型" prop="channel">
                            <el-select v-model="formData.channel" placeholder="类型">
                                <el-option label="paypal" value="paypal" />
                                <el-option label="visa" value="visa" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="最大收款金额" prop="max_price">
                            <el-input v-model="formData.max_price" placeholder="最大收款金额" />
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model="formData.sort" placeholder="排序" />
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
import { payment_detail, payment_edit, payment_add, uploadImg } from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '新增',
            dialogVisible: false,
            formData: {
                head_img: '',
                nickname: '',
                mobile: '',
                password: '',
                email: '',

            },
            defaultImgUrl: require('@/assets/upload_icon.png'),
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
            if (row) {
                if (type) {
                    this.dialogTitle = '详情'
                    this.method = 'detail'
                    this.getDetail(row.payment_id)
                } else {
                    this.getDetail(row.payment_id)
                    this.dialogTitle = '编辑'
                    this.method = 'edit'
                    this.formData = row
                }
            } else {
                this.dialogTitle = '添加'
                this.method = 'add'
                this.formData = {
                    // "dealers_id": 2,
                    // "url": "http:\/\/www.baidu.com",
                    // "status": 0,
                    // "use_type": 2,
                    // "max_price": "5000.00",
                    // "sort": 301,
                    // "remark": "过过过过",
                    // "created_at": "1706772409",
                    // "updated_at": "1706855030",
                    // "channel": "visa"
                }
            }
            this.dialogVisible = true
        },
        async getDetail(payment_id) {
            const res = await payment_detail({ payment_id: payment_id })
            if (res.code == 200) {
                this.formData = res.data;
            }
        },
        handleEmit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res
                    if (this.method == 'add') {
                        res = await payment_add(this.formData)
                    } else if (this.method == 'edit') {
                        res = await payment_edit(this.formData)
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
  