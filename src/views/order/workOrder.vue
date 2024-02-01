<template>
    <div>
        <div class="search">
            <div class="form">


                <div class="form-item"><el-input v-model="formData.search_no" type="text" placeholder="请输入工单号..." /></div>
                <div class="form-item">
                    <el-select v-model="formData.order_status" placeholder="工单状态" style="width: 120px;">
                        <el-option label="全部" value="" />
                        <el-option label="待回复" :value="0" />
                        <el-option label="已回复" :value="1" />
                        <el-option label="已完成" :value="1" />
                        <el-option label="已取消" :value="1" />

                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="注册时间" style="width: 120px;">
                        <el-option label="注册时间" value="created_at" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-date-picker v-model="formData.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>

                </div>
                <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
                <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="" label="" width="10"></el-table-column>
                <el-table-column type="selection" width="100"></el-table-column>
                <el-table-column prop="work_order_id" label="id" />
                <el-table-column prop="mobile" label="手机号码" />
                <el-table-column prop="work_order_no" label="工单号" />
                <el-table-column prop="title" label="工单标题" />
                <el-table-column prop="created_at" label="创建时间" />
                <el-table-column prop="order_status" label="工单状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.order_status == 0">待回复</span>
                        <span v-if="scope.row.order_status == 1">已回复</span>
                        <span v-if="scope.row.order_status == 1">已完成</span>
                        <span v-if="scope.row.order_status == 1">已取消</span>

                    </template>
                </el-table-column>


                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openDialog(scope.row)">审核</el-button>
                        <el-button type="text" size="small" @click="handleBtn(scope.row, 'see')">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="display: flex;flex-direction: row-reverse;">
            <el-pagination :current-page="formData.page" :page-sizes="[10, 20, 30, 40]" :page-size="formData.limit"
                layout="total, sizes, prev, pager, next, jumper" :total="formData.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
        <Detail ref="detailRef" @handleEmit="getList(true)" />

        <CustomerService ref="CustomerService" />
    </div>
</template>
  
<script>
import { workorder_list, admins_del } from '@/api/project'
import Detail from './components/WorkOrderDetail.vue'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import CustomerService from '@/components/CustomerService/index'
export default {
    components: { Detail, DirectiveDialog, CustomerService },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                search_no: '',
                time_type: 'created_at',
                time: '',
                order_status: ''
            },
            tableData: []

        }
    },
    mounted() {
        // this.getWithdrawOptions()
        this.getList(true)
    },
    methods: {
        handleBtn(scope) {
            this.$refs.CustomerService.init()
        },
        openDialog(row) {
            this.$refs.authenticationRef.openDialog(row.dealers_id)
        },
        handleRole(row) {
            this.$refs.adminRolesRef.openDialog(row)
        },
        delFnc(row) {
            this.$confirm('是否删除该管理员', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                const res = await admins_del(row.admin_id)
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getList(true)
                    return
                }
                this.$message.error(res.msg)
                this.getList(true)
            })
        },
        editFnc(row, type) {
            this.$refs.detailRef.openDialog(row, type)
        },
        resertFormFnc() {
            this.formData = {
                page: 1,
                limit: 10,
                total: 0,
                search_no: '',
                time_type: 'created_at',
                time: '',
                order_status: ''
            }
        },
        handleSizeChange(val) {
            this.formData.limit = val
            this.getList(true)
        },
        handleCurrentChange(val) {
            this.formData.page = val
            this.getList()
        },
        async getList(bool = false) {
            if (bool) {
                this.formData.page = 1
            }
            if (this.formData.time.length > 0) {
                this.formData.screen_start_time = this.formData.time[0];
                this.formData.screen_end_time = this.formData.time[1];
            }
            const res = await workorder_list(this.formData)
            if (res.code == 200) {
                this.formData.total = res.data.total
                this.tableData = res.data.data
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
  