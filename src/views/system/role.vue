<template>
    <div>
        <div class="search">
            <div class="form">

                <!-- <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="资金流水号" style="width: 120px;">
                        <el-option label="来源单号" value="from_no" />
                        <el-option label="资金流水号" value="log_no" />
                        <el-option label="资金账号" value="account" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" type="number" placeholder="请输入...." /></div>
                <div class="form-item">
                    <el-select v-model="formData.method" placeholder="状态" style="width: 120px;">
                        <el-option label="充值" value="recharge" />
                        <el-option label="订单冻结" value="order" />
                        <el-option label="提现" value="withdraw" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="创建时间" style="width: 120px;">
                        <el-option label="创建时间" :value="1" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-date-picker v-model="formData.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>

                </div> -->
                <!-- <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
                <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div> -->
                <div class="form-item submit" @click="editFnc(false)"><span>新增</span></div>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="role_id" label="角色id"></el-table-column>
                <el-table-column prop="display_name" label="角色名称"></el-table-column>
                <el-table-column prop="name" label="权限字段"></el-table-column>
                <el-table-column prop="description" label="备注"></el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button  @click="editFnc(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button  @click="editFnc(scope.row,'detail')" type="text" size="small">详情</el-button>
                        <el-button  @click="delFnc(scope.row)" type="text" size="small">删除</el-button>
                        <el-button  @click="handlePermissions(scope.row)" type="text" size="small">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="display: flex;flex-direction: row-reverse;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="formData.page" :page-sizes="[10, 20, 30, 40]" :page-size="formData.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="formData.total">
            </el-pagination>
        </div>

        <RoleDetail ref="roleRef" @handleEmit="getList(true)" />
        <RoleAuthority ref="roleAuthorityRef" />
    </div>
</template>



<script>
import { roles_list,roles_del } from '@/api/project'
import RoleDetail from './components/RoleDetail.vue'
import RoleAuthority from './components/RoleAuthority.vue'

export default {
    components: { RoleDetail,RoleAuthority },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],

        }
    },
    mounted() {
        // this.getWithdrawOptions()
        this.getList(true);

    },
    methods: {
        handlePermissions(row){
            this.$refs.roleAuthorityRef.openDialog(row)
        },
        delFnc(row){
            this.$confirm('是否删除该角色', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消' }).then(async () => {
                let res = await roles_del(row.role_id)
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getList(true)
                    return
                }
                this.$message.error(res.msg)
                this.getList(true)
            })
        },
        editFnc(row,type){
            this.$refs.roleRef.openDialog(row,type)
        },
        resertFormFnc() {
            this.formData = {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type: 'recharge_no',
                keyword: '',
                status: -1,
                time_start: '',
                time_end: '',
                time_type: 1,
                time: ''
            }
        },
        handleSizeChange(val) {
            this.formData.limit = val;
            this.getList(true)
        },
        handleCurrentChange(val) {
            this.formData.page = val;
            this.getList()
        },
        async getList(bool = false) {
            if (bool) {
                this.formData.page = 1;
            }
           
            let res = await roles_list(this.formData)
            if (res.code == 200) {
                this.formData.total = res.data.total;
                this.tableData = res.data.data;
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;

    .form-item {
        margin-right: 7px;
    }

    .submit {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: linear-gradient(90deg, #5B80EE 0%, #3E63F4 100%);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 14px;
    }

    .reset {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: #FFFFFF;
        border: 1px solid #F1F1F1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333333;
        font-size: 14px;
    }
}
</style>