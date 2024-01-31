<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
            <div class="content">
                <div class="left">
                    <div class="title"><span>当前拥有权限</span></div>
                    <div class="item">
                        <div v-for="(item, index) in userPermissions" :key="index">
                            <span>{{ item.display_name }}</span>
                            <el-button @click="permissionsDel(item)">删除</el-button>
                        </div>
                    </div>
                </div>

                <div class="right">
                    <div class="title"><span>可添加权限列表</span></div>
                    <div class="item">
                        <div v-for="(item, index) in permissionsList" :key="index">
                            <span>{{ item.display_name }}</span>
                            <el-button @click="permissionsAdd(item)">添加</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <!-- <el-button type="primary" @click="handleEmit">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>



<script>
import { get_permissions, permissions_list,roles_permissions_add,roles_permissions_del } from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '分配权限',
            dialogVisible: false,
            rules: {
                display_name: [{ required: true, message: '请输入权限名称', trigger: 'blur' },],
                url: [{ required: true, message: '请输入url', trigger: 'blur' },],
                name: [{ required: true, message: '请输入权限字段', trigger: 'blur' },],
                description: [{ required: true, message: '请输入备注', trigger: 'blur' },],
            },
            list: [],
            userPermissions: [],
            propData: {},
            permissionsList: []
        }
    },
    methods: {
        async openDialog(row) {
            this.propData = row;
            await this.getPermissions()
            this.dialogVisible = true
            this.getPermissionsList()

        },
        async getPermissionsList() {
            let res = await permissions_list()
            if (res.code == 200) {
                const idsInA = new Set(this.userPermissions.map(item => item.permission_id));
                const filteredB = res.data.data.filter(item => !idsInA.has(item.permission_id));
                this.permissionsList = filteredB;
            }
        },
        async getPermissions() {
            let res = await get_permissions(this.propData.role_id)
            if (res.code == 200) {
                this.userPermissions = res.data;
            }
        },
        async permissionsDel(item){
            this.$confirm('是否删除该角色权限', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消' }).then(async () => {
                let res = await roles_permissions_del(item.permission_id)
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    await this.getPermissions()
                    this.getPermissionsList()
                    return
                }
                this.$message.error(res.msg)
            })
        },
        async permissionsAdd(item){
            this.$confirm('是否添加该角色权限', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消' }).then(async () => {
                let res = await roles_permissions_add({role_id:this.propData.role_id,permission_id:item.permission_id})
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    await this.getPermissions()
                    this.getPermissionsList()
                    return
                }
                this.$message.error(res.msg)
            })
        },
        async handleEmit() {
            // let res;
            // this.$refs.ruleForm.validate(async (valid) => {
            //     if (valid) {
            //         let res;
            //         if (this.method == 'add') {
            //             res = await permissions_add(this.formData);
            //         } else if (this.method == 'edit') {
            //             res = await permissions_edit(this.formData.permission_id, this.formData);
            //         }

            //         if (res.code == 200) {
            //             this.$message.success(res.msg)
            //             this.dialogVisible = false;
            //             this.$emit('handleEmit')
            //             return
            //         }
            //         this.$message.error(res.msg)
            //     } else {
            //         console.log('error submit!!');
            //         return false;
            //     }
            // });

        }
    }
}
</script>


<style lang="scss" scoped>
.content {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .left,
    .right {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
            margin-bottom: 30px;
        }

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;

            div {
                margin-bottom: 10px;
            }
        }
    }

    // align-items: center;
}</style>