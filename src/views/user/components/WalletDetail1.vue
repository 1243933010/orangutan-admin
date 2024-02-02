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
            formData: { },
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
        
        openDialog(row, type) {
            this.dialogTitle = '添加'
            this.method = 'add'
            this.formData.member_id = row.member_id

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
  