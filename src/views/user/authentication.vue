<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="手机号" style="width: 120px;">
                        <el-option label="手机号" value="mobile" />
                        <el-option label="账号名称" value="username" />
                        <el-option label="商家名称" value="dealers_name" />
                        <el-option label="邮箱" value="email" />
                        <el-option label="姓名" value="name" />
                        <el-option label="身份证" value="card_no" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" type="text" placeholder="请输入..." /></div>
                <div class="form-item">
                    <el-select v-model="formData.is_auth" placeholder="认证状态" style="width: 120px;">
                        <el-option label="全部" :value="-1" />
                        <el-option label="已认证" :value="1" />
                        <el-option label="未认证" :value="0" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="注册时间" style="width: 120px;">
                        <el-option label="注册时间" value="created_at" />
                        <el-option label="最后登录" value="last_at" />
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
                <el-table-column prop="dealers_id" label="id" />
                <el-table-column  label="头像" width="100">
                    <template slot-scope="scope">
                       <div style="width: 40px;"><img style="width:100%;" :src="scope.row.head_img" alt=""></div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="账号名称" />
                <el-table-column prop="dealers_name" label="商家名称" />
                <el-table-column prop="mobile" label="手机号码" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="card_no" label="姓名/身份证">
                    <template slot-scope="scope">
                    <div><span>{{ scope.row.name }}</span></div>
                    <div><span>{{ scope.row.card_no }}</span></div>
                </template>
                </el-table-column>
                <el-table-column prop="created_at" label="时间信息">
                    <template slot-scope="scope">
                      <div> <span>注册时间:{{ convertTimestampToDateString(scope.row.created_at) }}</span></div>
                      <div> <span>最后登录时间:{{ convertTimestampToDateString(scope.row.last_at) }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="is_auth" label="认证状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_auth==1">已认证</span>
                        <span v-if="scope.row.is_auth==0">未认证</span>
                    </template>
                </el-table-column>
                <el-table-column prop="auth_status" label="审核状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.auth_status==1">通过</span>
                        <span v-if="scope.row.auth_status==2">驳回</span>
                    </template>
                </el-table-column>
                
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openDialog(scope.row)">审核</el-button>
                        <el-button type="text" size="small" @click="editFnc(scope.row, 'see')">详情</el-button>
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
        <AuthenticationDialog ref="authenticationRef" @handleExamine="getList(true)" />
    </div>
</template>
  
<script>
import { authentication_list, admins_del } from '@/api/project'
import Detail from './components/AuthenticationDetail.vue'
import  AuthenticationDialog from './components/AuthenticationDialog.vue'
import {convertTimestampToDateString} from '@/utils/time'

export default {
    components: { Detail,AuthenticationDialog },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type:'mobile',
                keyword:'',
                is_auth:'',
                time_type:'created_at',
                time:''
            },
            tableData: []

        }
    },
    mounted() {
        // this.getWithdrawOptions()
        this.getList(true)
        this.convertTimestampToDateString = convertTimestampToDateString;

    },
    methods: {
        openDialog(row){
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
                keyword_type:'mobile',
                keyword:'',
                is_auth:'',
                time_type:'created_at',
                time:''
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
                this.formData.time_start = this.formData.time[0];
                this.formData.time_end = this.formData.time[1];
            }
            const res = await authentication_list(this.formData)
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
  