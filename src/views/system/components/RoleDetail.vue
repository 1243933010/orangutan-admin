<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                       
                        <el-form-item label="角色名称" prop="display_name">
                            <el-col :span="12">
                                <el-input v-model="formData.display_name" placeholder="角色名称"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="角色字段" prop="name">
                            <el-col :span="12">
                                <el-input v-model="formData.name" placeholder="角色字段"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="备注" prop="description">
                            <el-col :span="12">
                                <el-input v-model="formData.description" placeholder="备注"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer" v-if="method !== 'detail'">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleEmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>



<script>
import { roles_detail, roles_edit, roles_add, roles_list} from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '新增角色',
            dialogVisible: false,
            formData: {
                role_id: '',
                name: "",
                display_name: "",
                description: "",
            },
            method: '',
            rules: {
                display_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' },],
                name: [{ required: true, message: '请输入角色字段', trigger: 'blur' },],
                description: [{ required: true, message: '请输入备注', trigger: 'blur' },],
            },
            list: []
        }
    },
    methods: {
        openDialog(row, type) {
            this.getList()
            if (row) {
                if (type) {
                    this.dialogTitle = '角色详情'
                    this.method = 'detail'
                    this.getDetail(row.role_id);
                } else {
                    this.dialogTitle = '编辑角色'
                    this.method = 'edit'
                    this.formData = row;
                }

            } else {
                this.method = 'add'
                this.formData = {
                    role_id: '',
                    name: "",
                    display_name: "",
                    description: "",
                }
            }
            this.dialogVisible = true

        },
        async getDetail(id) {
            let res = await roles_detail(id)
            if (res.code == 200) {
                this.formData = res.data;
            }
        },
        async getList() {
            let res = await roles_list(this.formData)
            if (res.code == 200) {
                this.list = res.data.data;
            }
        },
        handleEmit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this.method == 'add') {
                        res = await roles_add(this.formData);
                    } else if (this.method == 'edit') {
                        res = await roles_edit(this.formData.role_id,this.formData);
                    }

                    if (res.code == 200) {
                        this.$message.success(res.msg)
                        this.dialogVisible = false;
                        this.$emit('handleEmit')
                        return
                    }
                    this.$message.error(res.msg)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }
    }
}
</script>