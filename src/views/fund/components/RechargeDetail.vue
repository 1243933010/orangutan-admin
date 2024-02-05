<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                      
                        <el-form-item label="充值单号" prop="recharge_no">
                            <el-input v-model="formData.recharge_no" placeholder="充值单号" />
                        </el-form-item>
                        <el-form-item label="交易哈希" prop="transfer_hash">
                            <el-input v-model="formData.transfer_hash" placeholder="交易哈希" />
                        </el-form-item>
                        <el-form-item label="充值金额" prop="money">
                            <el-input v-model="formData.money" placeholder="充值金额" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="formData.status" placeholder="状态">
                                <el-option label="充值中" :value="0" />
                                <el-option label="充值成功" :value="1" />
                                <el-option label="订单取消" :value="2" />
                                <el-option label="充值失败" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用户手机号" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="用户手机号" />
                        </el-form-item>
                        <el-form-item label="到账时间" prop="pay_time">
                            <el-input v-model="formData.pay_time" placeholder="到账时间" />
                        </el-form-item>
                        <el-form-item label="创建时间" prop="created_at">
                            <el-input v-model="formData.created_at" placeholder="创建时间" />
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
        openDialog(row, type) {
            console.log(row)
            if (row) {
                if (type) {
                    this.formData = row
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
  