<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.type" placeholder="手机号" style="width: 120px;">
                        <el-option label="手机号" :value="1" />
                        <el-option label="账号名称" :value="2" />
                        <el-option label="邮箱" :value="3" />
                        <el-option label="姓名" :value="4" />
                        <el-option label="身份证号" :value="5" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.search_name" placeholder="请输入...." /></div>
                <div class="form-item">
                    <el-select v-model="formData.is_auth" placeholder="认证状态" style="width: 120px;">
                        <!-- <el-option label="全部" value="" /> -->
                        <el-option label="已认证" :value="1" />
                        <el-option label="未认证" :value="0" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.date_type" placeholder="注册时间" style="width: 120px;">
                        <el-option label="注册时间" :value="1" />
                        <el-option label="最近登陆时间" :value="2" />
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
                <el-table-column prop="member_id" label="id" />
                <el-table-column  label="头像" width="100">
                    <template slot-scope="scope">
                       <div style="width: 40px;"><img style="width:100%;" :src="scope.row.head_img" alt=""></div>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="名称" />
                <el-table-column prop="mobile" label="mobile" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="card_no" label="身份证" />

                <el-table-column prop="balance_money" label="账户余额" />

                <el-table-column prop="created_at" label="创建时间">
                    <template slot-scope="scope">
                       <span>{{ convertTimestampToDateString(scope.row.created_at) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间">
                    <template slot-scope="scope">
                       <span>{{ convertTimestampToDateString(scope.row.updated_at) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="is_auth_text" label="认证状态" />
                <el-table-column fixed="right" label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editFnc(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="editFnc(scope.row, 'see')">详情</el-button>
                        <el-button type="text" size="small" @click="handleWallet(scope.row)">添加钱包</el-button>

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
        <WalletDetail ref="walletDetailRef"  @handleEmit="getList(true)"  />
    </div>
</template>
  
<script>
import { member_list, admins_del } from '@/api/project'
import Detail from './components/Detail.vue'
import WalletDetail from './components/WalletDetail1.vue'
import {convertTimestampToDateString} from '@/utils/time'
export default {
    components: { Detail,WalletDetail },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                type:1,
                search_name:'',
                is_auth:'',
                date_type:1,
                time:'',
                start_time:'',
                end_time:''
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
        handleWallet(row) {
            this.$refs.walletDetailRef.openDialog(row,'add')
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
                type:1,
                search_name:'',
                is_auth:'',
                date_type:1,
                time:'',
                start_time:'',
                end_time:''
            }
            this.getList()
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
                this.formData.start_time = this.formData.time[0];
                this.formData.end_time = this.formData.time[1];
            }
            const res = await member_list(this.formData)
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
  