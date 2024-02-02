<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="商家名称" prop="dealers_name">
                            <el-input v-model="formData.dealers_name" placeholder="商家名称" />
                        </el-form-item>
                        <el-form-item label="收单数量" prop="order_num">
                            <el-input v-model="formData.order_num" placeholder="收单数量" />
                        </el-form-item>
                        <el-form-item label="收单金额" prop="order_money">
                            <el-input v-model="formData.order_money" placeholder="收单金额" />
                        </el-form-item>
                        <el-form-item label="汇率" prop="rate">
                            <el-input v-model="formData.rate" placeholder="汇率" />
                        </el-form-item>
                        <el-form-item label="最小金额" prop="min_money">
                            <el-input v-model="formData.min_money" placeholder="最小金额" />
                        </el-form-item>
                        <el-form-item label="最大金额" prop="max_money">
                            <el-input v-model="formData.max_money" placeholder="最大金额" />
                        </el-form-item>
                      
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="formData.status" placeholder="状态">
                                <el-option label="离线" :value="0" />
                                <el-option label="在线" :value="1" />
                                <el-option label="冻结" :value="2" />
                            </el-select>
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
import { dealers_detail, dealers_edit, payment_add } from '@/api/project'
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
                mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            list: []
        }
    },
    methods: {
       
        openDialog(row, type) {
            if (row) {
                if (type) {
                    this.dialogTitle = '详情'
                    this.method = 'detail'
                    this.getDetail(row.dealers_id)
                } else {
                    this.getDetail(row.dealers_id)
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
        async getDetail(dealers_id) {
            const res = await dealers_detail({ dealers_id: dealers_id })
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
                        res = await dealers_edit(this.formData)
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
  