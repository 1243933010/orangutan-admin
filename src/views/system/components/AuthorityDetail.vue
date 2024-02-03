<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <div>
                <el-row>
                    <el-form ref="ruleForm" :model="formData" class="demo-form-inline" :disabled="method == 'detail'"
                        :rules="rules" label-width="120px">
                        <el-form-item label="父级权限" prop="parent_id">
                            <el-col :span="12">
                                <!-- <el-select v-model="formData.parent_id" placeholder="请选择">
                                    <el-option  label="首级" :value="0"> </el-option>
                                    <el-option v-for="(item,index) in list" :key="index" :label="item.display_name" :value="item.permission_id"> </el-option>
                                </el-select> -->
                                <el-tree :data="list" highlight-current :props="defaultProps"
                                    @node-click="handleNodeClick"></el-tree>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="权限名称" prop="display_name">
                            <el-col :span="12">
                                <el-input v-model="formData.display_name" placeholder="权限名称"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="url" prop="effect_uri">
                            <el-col :span="12">
                                <el-input v-model="formData.effect_uri" placeholder="url"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="权限字段" prop="name">
                            <el-col :span="12">
                                <el-input v-model="formData.name" placeholder="权限字段"></el-input>
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
import { permissions_detail, permissions_edit, permissions_add, permissions_list } from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '新增权限',
            dialogVisible: false,
            formData: {
                permission_id: '',
                name: "",
                display_name: "",
                effect_uri: "",
                description: "",
            },
            method: '',
            rules: {
                display_name: [{ required: true, message: '请输入权限名称', trigger: 'blur' },],
                url: [{ required: true, message: '请输入url', trigger: 'blur' },],
                // name: [{ required: true, message: '请输入权限字段', trigger: 'blur' },],
                // description: [{ required: true, message: '请输入备注', trigger: 'blur' },],
            },
            list: [],
            defaultProps: {
                children: 'children',
                label: 'display_name',
                permission_id: 'permission_id',
                parent_id: 'parent_id',
                name: "name",
                display_name: "display_name",
                effect_uri: "effect_uri",
                description: "description",
                sort: 'sort'
            }
        }
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
            this.formData.parent_id = data.permission_id
        },
        organizeDataIntoTree(data, parentId = 0) {
            const result = [];
            for (const item of data) {
                if (item.parent_id === parentId) {
                    const children = this.organizeDataIntoTree(data, item.permission_id);

                    if (children.length) {
                        item.children = children;
                    }

                    result.push(item);
                }
            }

            return result;
        },
        openDialog(row, type) {
            this.getList()
            if (row) {
                if (type) {
                    this.dialogTitle = '权限详情'
                    this.method = 'detail'
                    this.getDetail(row.permission_id);
                } else {
                    this.dialogTitle = '编辑权限'
                    this.method = 'edit'
                    this.formData = row;
                }

            } else {
                this.method = 'add'
                this.formData = {
                    permission_id: '',
                    name: "",
                    display_name: "",
                    effect_uri: "",
                    description: "",
                }
            }
            this.dialogVisible = true

        },
        async getDetail(id) {
            let res = await permissions_detail(id)
            if (res.code == 200) {
                this.formData = res.data;
            }
        },
        async getList() {
            let res = await permissions_list(this.formData)
            if (res.code == 200) {
                this.list = [
                    {
                        display_name:'首级',
                        name:'index',
                        permission_id:0,
                        children:this.organizeDataIntoTree(res.data.data)
                    }
                ]
                // this.list = res.data.data;
                console.log(this.list)
            }
        },
        handleEmit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    let res;
                    if (this.method == 'add') {
                        res = await permissions_add(this.formData);
                    } else if (this.method == 'edit') {
                        res = await permissions_edit(this.formData.permission_id, this.formData);
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