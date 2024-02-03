<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="工单号" prop="work_order_no">
                            <el-input v-model="formData.work_order_no" placeholder="工单号" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="formData.email" placeholder="邮箱" />
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="手机号" />
                        </el-form-item>
                        <el-form-item label="工单状态" prop="order_status">
                            <el-select v-model="formData.order_status" placeholder="工单状态">
                                <el-option label="待回复" :value="0" />
                                <el-option label="已回复" :value="1" />
                                <el-option label="已完成" :value="2" />
                                <el-option label="已取消" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="工单标题" prop="title">
                            <el-input v-model="formData.title" placeholder="工单标题" />
                        </el-form-item>
                        <el-form-item label="工单内容" prop="content">
                            <el-input v-model="formData.content" placeholder="工单内容" />
                        </el-form-item>
                        <el-form-item label="工单状态描述" prop="order_status_text">
                            <el-input v-model="formData.order_status_text" placeholder="工单状态描述" />
                        </el-form-item>
                        <el-form-item label="更新时间" prop="updated_at">
                            <el-input v-model="formData.updated_at" placeholder="更新时间" />
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
import { workorder_detail, dealers_edit, payment_add } from '@/api/project'
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
                    this.getDetail(row.work_order_id)
                } else {
                    this.getDetail(row.work_order_id)
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
        async getDetail(work_order_id) {
            const res = await workorder_detail({ work_order_id: work_order_id })
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
  