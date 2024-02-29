<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        label-width="120px">
                        <el-form-item label="头像" prop="head_img">
                            <img :src="formData.head_img" alt="">
                        </el-form-item>
                        <el-form-item label="账号名称" prop="username">
                            <el-input v-model="formData.username" placeholder="账号名称" />
                        </el-form-item>
                        <el-form-item label="商家名称" prop="name">
                            <el-input v-model="formData.name" placeholder="商家名称" />
                        </el-form-item>
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="手机号码" />
                        </el-form-item>
                        <el-form-item label="身份证号" prop="card_no">
                            <el-input v-model="formData.card_no" placeholder="身份证号" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="formData.email" placeholder="邮箱" />
                        </el-form-item>
                        <el-form-item label="正面照片" prop="email">
                            <!-- <el-input v-model="card_img.front" placeholder="邮箱" /> -->
                            <img style="width:200px;" :src="card_img.front?card_img.front:''" alt="">
                        </el-form-item>
                        <el-form-item label="反面照片" prop="email">
                            <!-- <el-input v-model="card_img.front" placeholder="邮箱" /> -->
                            <img  style="width:200px;"  :src="card_img.back?card_img.back:''" alt="">
                        </el-form-item>
                        <el-form-item label="认证状态" prop="is_auth">
                            <el-select v-model="formData.is_auth" placeholder="认证状态">
                                <el-option label="已认证" :value="1" />
                                <el-option label="未认证" :value="0" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核状态" prop="auth_status">
                            <el-select v-model="formData.auth_status" placeholder="审核状态">
                                <el-option label="通过" :value="1" />
                                <el-option label="驳回" :value="2" />
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

                        <el-form-item label="备注" prop="examined_remark">
                            <el-input v-model="formData.examined_remark" placeholder="备注" :disabled="true" />
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
            list: []
        }
    },
    computed:{
        card_img(){
           
            if(this.formData.card_img){
                return JSON.parse(this.formData.card_img)
            }else{
                return {back:'',front:''}
            }
            
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
            console.log(row,type,'222222')
            if (row) {
                if (type) {
                    this.dialogTitle = '详情'
                    this.method = 'detail';
                    this.formData = row
                    // this.getDetail(row.member_id, row.payment_id)
                } else {
                    // this.getDetail(row.member_id, row.payment_id)
                    this.dialogTitle = '编辑'
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
        async getDetail(member_id, payment_id) {
            const res = await payment_detail({ member_id: member_id, payment_id: payment_id })
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
  