<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="字典标签" prop="title">
                            <el-col :span="12">
                                <el-input v-model="formData.title" placeholder="字典标签" />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="字典标识" prop="key">
                            <el-col :span="12">
                                <el-input v-model="formData.key" placeholder="字典标识" />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="字典键值" prop="value">
                            <el-col :span="12">
                                <el-input v-model="formData.value" placeholder="字典键值" />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="父级" prop="group_id">
                            <el-col :span="12">
                                <el-select v-model="formData.group_id" placeholder="请选择">
                                    <el-option v-for="(item, index) in list" :key="index" :label="item.title"
                                        :value="item.config_id">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-col :span="12">
                                <el-radio-group v-model="formData.status">
                                    <el-radio :label="1">启用</el-radio>
                                    <el-radio :label="2">禁用</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <el-col :span="12">
                                <el-input v-model="formData.sort" placeholder="排序" />
                            </el-col>
                        </el-form-item>
                        <el-form-item label="备注" prop="description">
                            <el-col :span="12">
                                <el-input v-model="formData.description" placeholder="备注" />
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <span v-if="method !== 'detail'" slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleEmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
import { config_edit, config_list, config_add } from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '新增权限',
            dialogVisible: false,
            formData: {
                title: '',
                key: '',
                value: '',
                group_id: '',
                status: 1,
                sort: '',
                description: ''
            },
            method: '',
            rules: {
                title: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
                key: [{ required: true, message: '请输入字典标识', trigger: 'blur' }],
                value: [{ required: true, message: '请输入字典键值', trigger: 'blur' }]
            },
            list: []
        }
    },
    methods: {

        openDialog(row, type) {
            this.getList()
            if (row) {
                if (type) {
                    this.dialogTitle = '权限详情'
                    this.method = 'detail'
                    // this.getDetail(row.admin_id)
                } else {
                    // this.getDetail(row.admin_id)
                    this.dialogTitle = '编辑权限'
                    this.method = 'edit'
                    this.formData = row
                }
            } else {
                this.method = 'add'
                this.formData = {
                    title: '',
                    key: '',
                    value: '',
                    group_id: '',
                    status: 1,
                    sort: '',
                    description: ''
                }
            }
            this.dialogVisible = true
        },

        async getList() {
            const res = await config_list(this.formData)
            if (res.code == 200) {
                this.list = res.data.data
            }
        },
        handleEmit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res
                    if (this.method == 'add') {
                        res = await config_add(this.formData)
                    } else if (this.method == 'edit') {
                        res = await config_edit(this.formData.admin_id, this.formData)
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
  