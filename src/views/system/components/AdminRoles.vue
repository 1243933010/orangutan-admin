<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
            <div class="content">
                <div class="left">
                    <div class="title"><span>当前拥有角色</span></div>
                    <div class="item">
                        <div v-for="(item, index) in adminsRolesList" :key="index">
                            <span>{{ item.name }}</span>
                            <el-button @click="rolesDel(item)">删除</el-button>
                        </div>
                    </div>
                </div>

                <div class="right">
                    <div class="title"><span>可添加角色列表</span></div>
                    <div class="item">
                        <div v-for="(item, index) in rolesList" :key="index">
                            <span>{{ item.name }}</span>
                            <el-button @click="rolesAdd(item)">添加</el-button>
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
import { admins_roles_list, roles_list, admins_roles_edit, admins_roles_del } from '@/api/project'
export default {
    data() {
        return {
            dialogTitle: '分配角色',
            dialogVisible: false,
            list: [],
            adminsRolesList: [],
            propData: {},
            rolesList: []
        }
    },
    methods: {
        async openDialog(row) {
            this.propData = row;
            await this.getAdminsRolesList()
            this.dialogVisible = true
            this.getRolesList()

        },
        async getRolesList() {
            let res = await roles_list()
            if (res.code == 200) {
                const idsInA = new Set(this.adminsRolesList.map(item => item.role_id));
                const filteredB = res.data.data.filter(item => !idsInA.has(item.role_id));
                this.rolesList = filteredB;
            }
        },
        async getAdminsRolesList() {
            let res = await admins_roles_list(this.propData.admin_id)
            if (res.code == 200) {
                this.adminsRolesList = res.data;
            }
        },
        async rolesDel(item) {
            this.$confirm('是否移除该角色', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let res = await admins_roles_del(item.role_id)
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    await this.getAdminsRolesList()
                    this.getRolesList()
                    return
                }
                this.$message.error(res.msg)
            })
        },
        async rolesAdd(item) {
            this.$confirm('是否添加该角色', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                console.log(this.propData,item)
                let res = await admins_roles_edit({ admin_id: this.propData.admin_id, role_id: item.role_id })
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    await this.getAdminsRolesList()
                    this.getRolesList()
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