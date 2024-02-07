<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">

                        <el-form-item label="提现单号" prop="withdraw_no">
                            <el-input v-model="formData.withdraw_no" placeholder="提现单号" />
                        </el-form-item>
                        <el-form-item label="订单金额" prop="money">
                            <el-input v-model="formData.money" placeholder="订单金额" />
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="手机号" />
                        </el-form-item>
                        <el-form-item label="添加人姓名" prop="add_name">
                            <el-input v-model="formData.add_name" placeholder="添加人姓名" />
                        </el-form-item>
                        <el-form-item label="用户身份" prop="identity">
                            <el-select v-model="formData.identity" placeholder="用户身份" style="width: 120px;">
                                <el-option label="未选择" :value="0" />
                                <el-option label="贸易商" :value="1" />
                                <el-option label="卡商" :value="2" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核人" prop="examined_name">
                            <el-input v-model="formData.examined_name" placeholder="审核人" />
                        </el-form-item>
                        <el-form-item label="实际金额" prop="real_money">
                            <el-input v-model="formData.real_money" placeholder="实际金额" />
                        </el-form-item>
                        <el-form-item label="固定金额" prop="fee">
                            <el-input v-model="formData.fee" placeholder="固定金额" />
                        </el-form-item>
                        <el-form-item label=" 费率" prop="rate">
                            <el-input v-model="formData.rate" placeholder=" 费率" />
                        </el-form-item>
                        <el-form-item label="收款地址" prop="address">
                            <el-input v-model="formData.address" placeholder="收款地址" />
                        </el-form-item>
                        <el-form-item label="交易哈希" prop="transfer_hash">
                            <el-input v-model="formData.transfer_hash" placeholder="交易哈希" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="formData.status" placeholder="状态" style="width: 120px;">
                                <el-option label="提现中" :value="1" />
                                <el-option label="提现成功" :value="2" />
                                <el-option label="提现失败" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核状态" prop="examine_status">
                            <el-select v-model="formData.examine_status" placeholder="审核状态" style="width: 120px;">
                                <el-option label="待审核" :value="1" />
                                <el-option label="审核成功" :value="2" />
                                <el-option label="审核失败" :value="3" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="formData.remark" placeholder="备注" />
                        </el-form-item>
                        <el-form-item label="创建时间" prop="created_at">
                            <el-input v-model="formData.created_at" placeholder="创建时间" />
                        </el-form-item>
                        <el-form-item label="审核时间" prop="examined_at">
                            <el-input v-model="formData.examined_at" placeholder="审核时间" />
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
import { withdraw_detail } from '@/api/project'
import { convertTimestampToDateString } from '@/utils/time'

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
            if (row) {
                if (type) {
                    this.dialogTitle = '详情'
                    this.method = 'detail'
                    this.formData = row
                    this.getDetail(row.withdraw_id)
                } else {
                    this.getDetail(row.withdraw_id)
                    this.dialogTitle = '编辑'
                    this.method = 'edit'
                    this.formData = row
                }
            } else {
                this.dialogTitle = '添加'
                this.method = 'add'
                this.formData = {}
            }
            this.dialogVisible = true
        },
        async getDetail(withdraw_id) {
            const res = await withdraw_detail(withdraw_id)
            if (res.code == 200) {
                res.data.created_at = convertTimestampToDateString(res.data.created_at);
                res.data.examined_at = convertTimestampToDateString(res.data.examined_at);
                this.formData = res.data;
            }
        },
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
  