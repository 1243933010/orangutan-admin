<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="头像" prop="email">
                            <!-- <el-col :span="12"> -->
                            <el-upload class="upload-com" action="" :file-list="[]"
                                :http-request="(files) => httpRequest('head_img', files)"
                                :before-upload="beforeAvatarUpload" :limit="1">
                                <!-- <i class="el-icon-plus " style="font-size:82px;" :size="18" /> -->
                                <div class="pic">
                                    <img class="img" style="width: 100px;"
                                        :src="formData.head_img ? formData.head_img : defaultImgUrl" alt="">
                                    <!-- <img class="img" :src="defaultImgUrl" alt=""> -->


                                </div>
                            </el-upload>
                            <!-- </el-col> -->
                        </el-form-item>
                        <el-col :span="24">
                            <el-form-item label="认证状态" prop="is_auth">
                                <el-select v-model="formData.is_auth" placeholder="认证状态" :disabled="true">
                                    <el-option label="已认证" :value="1" />
                                    <el-option label="未认证" :value="0" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邀请码" prop="invite_code">
                                <el-input v-model="formData.invite_code" placeholder="邀请码" :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="上级邀请码" prop="invite">
                                <el-input v-model="formData.invite" placeholder="上级邀请码" :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户角色" prop="identity">
                                <el-select v-model="formData.identity" placeholder="用户角色">
                                    <el-option label="未选择" :value="0" />
                                    <el-option label="贸易商" :value="1" />
                                    <el-option label="卡商" :value="2" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="账号名称" prop="nickname">
                                <el-input v-model="formData.nickname" placeholder="账号名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="mobile">
                                <el-input v-model="formData.mobile" placeholder="手机号" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="formData.email" placeholder="邮箱" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账号余额" prop="email">
                                <el-input v-model="formData.balance_money" placeholder="账号余额" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="username">
                                <el-input v-model="formData.username" placeholder="姓名" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="身份证号" prop="card_no">
                                <el-input v-model="formData.card_no" placeholder="身份证号" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证正面" prop="email">
                            <!-- <el-col :span="12"> -->
                            <el-upload class="upload-com" action="" :file-list="[]"
                                :http-request="(files) => httpRequest('front', files)"
                                :before-upload="beforeAvatarUpload" :limit="1">
                                <!-- <i class="el-icon-plus " style="font-size:82px;" :size="18" /> -->
                                <div class="pic">
                                    <img class="img" style="width: 100px;"
                                        :src="formData.head_img ? formData.head_img : defaultImgUrl" alt="">
                                    <!-- <img class="img" :src="defaultImgUrl" alt=""> -->


                                </div>
                            </el-upload>
                        </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证反面" prop="email">
                            <el-upload class="upload-com" action="" :file-list="[]"
                                :http-request="(files) => httpRequest('back', files)"
                                :before-upload="beforeAvatarUpload" :limit="1">
                                <div class="pic">
                                    <img class="img" style="width: 100px;"
                                        :src="formData.head_img ? formData.head_img : defaultImgUrl" alt="">
                                </div>
                            </el-upload>
                        </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="注册时间" prop="created_at">
                                <el-input v-model="formData.created_at" placeholder="注册时间" :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="最近登陆时间" prop="last_at">
                                <el-input v-model="formData.last_at" placeholder="最近登陆时间" :disabled="true"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核时间" prop="examined_at">
                                <el-input v-model="formData.examined_at" placeholder="审核时间" :disabled="true"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核状态" prop="auth_status">
                                <el-select v-model="formData.auth_status" placeholder="用户角色" :disabled="true"  >
                                    <el-option label="待审核" :value="0" />
                                    <el-option label="审核通过" :value="1" />
                                    <el-option label="审核不通过" :value="2" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核备注" prop="examined_remark">
                                <el-input v-model="formData.examined_remark" placeholder="审核备注" :disabled="true"  />
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button  v-if="method !== 'detail'" type="primary" @click="handleEmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import { member_detail, member_edit, uploadImg } from '@/api/project'
//   import defaultImgUrl from '@/assets/upload_icon.png'
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
                    this.getDetail(row.member_id)
                } else {
                    this.getDetail(row.member_id)
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
        async getDetail(member_id) {
            const res = await member_detail({ member_id: member_id })
            if (res.code == 200) {
                this.formData = res.data;
                if(res.data.card_img){
                    this.formData.front = JSON.parse(res.data.card_img).front;
                    this.formData.back = JSON.parse(res.data.card_img).back;
                }
            }
        },
        handleEmit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    // let form = {

                    // }

                    if (this.method == 'add') {
                        res = await admins_add(this.formData)
                    } else if (this.method == 'edit') {
                        res = await member_edit(this.formData)
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
  