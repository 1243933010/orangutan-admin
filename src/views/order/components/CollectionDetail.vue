<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="订单号" prop="order_no">
                            <el-input v-model="formData.order_no" placeholder="订单号" />
                        </el-form-item>
                        <el-form-item label="状态" prop="order_status_name">
                            <el-input v-model="formData.order_status_name" placeholder="状态" />
                        </el-form-item>
                        <el-form-item label="金额" prop="order_money">
                            <el-input v-model="formData.order_money" placeholder="金额" />
                        </el-form-item>
                        <!-- <el-form-item label="工单状态" prop="order_status">
                            <el-select v-model="formData.order_status" placeholder="工单状态">
                                <el-option label="待回复" :value="0" />
                                <el-option label="已回复" :value="1" />
                                <el-option label="已完成" :value="2" />
                                <el-option label="已取消" :value="3" />
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="贸易商账号" prop="trader_account">
                            <el-input v-model="formData.trader_account" placeholder="贸易商账号" />
                        </el-form-item>
                        <el-form-item label="卡商账号" prop="dealers_account">
                            <el-input v-model="formData.dealers_account" placeholder="卡商账号" />
                        </el-form-item>
                        <el-form-item label="费率" prop="rate">
                            <el-input v-model="formData.rate" placeholder="费率" />
                        </el-form-item>
                        <el-form-item label="收款渠道" prop="channel">
                            <el-input v-model="formData.channel" placeholder="收款渠道" />
                        </el-form-item>
                        <el-form-item label="地址" prop="payment_address">
                            <el-input v-model="formData.payment_address" placeholder="地址" />
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
import { order_detail, dealers_edit, payment_add } from '@/api/project'
import {convertTimestampToDateString} from '@/utils/time'

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
                    this.getDetail(row.order_id)
                } else {
                    this.getDetail(row.order_id)
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
        async getDetail(order_id) {
            const res = await order_detail(order_id)
            if (res.code == 200) {
                res.data.created_at = convertTimestampToDateString(res.data.created_at)
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
  