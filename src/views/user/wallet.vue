<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.use_type" placeholder="用途">
                                <el-option label="收款" :value="1" />
                                <el-option label="提现" :value="2" />
                            </el-select>
                </div>
                
                <div class="form-item">
                    <el-select v-model="formData.channel" placeholder="类型">
                                <el-option label="paypal" value="paypal" />
                                <el-option label="visa" value="visa" />
                            </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.mobile" type="text" placeholder="用户手机号" /></div>
                <div class="form-item"><el-input v-model="formData.username" type="text" placeholder="用户名" /></div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="创建时间" style="width: 120px;">
                        <el-option label="创建时间" :value="1" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-date-picker v-model="formData.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>

                </div>
                <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
                <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
                <div class="form-item submit" @click="editFnc()"><span>添加钱包</span></div>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="" label="" width="10"></el-table-column>
                <el-table-column type="selection" width="100"></el-table-column>
                <el-table-column prop="username" label="用户用户名" />
                <el-table-column prop="mobile" label="用户手机号" />
                <el-table-column prop="url" label="收款地址" />
                <el-table-column prop="channel" label="类型" />
                <el-table-column prop="use_type_text" label="用途" />
                <el-table-column prop="remark" label="备注" />
                <el-table-column prop="created_at" label="时间信息">
                    <template slot-scope="scope">
                      <div> <span>{{ convertTimestampToDateString(scope.row.created_at) }}</span></div>
                      <!-- <div> <span>审核时间:{{ convertTimestampToDateString(scope.row.examined_at) }}</span></div> -->
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1">启用</span>
                        <span v-if="scope.row.status==0">禁用</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editFnc(scope.row)">编辑</el-button>
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
    </div>
</template>
  
<script>
import { payment_list, admins_del } from '@/api/project'
import Detail from './components/WalletDetail.vue'
import {convertTimestampToDateString} from '@/utils/time'

export default {
    components: { Detail },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                use_type:'',
                channel:"",
                mobile:'',
                username:'',
                time_type:1,
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
                use_type:'',
                channel:"",
                mobile:'',
                username:'',
                time_type:1,
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
                this.formData.screen_start_time = this.formData.time[0];
                this.formData.screen_end_time = this.formData.time[1];
            }
            const res = await payment_list(this.formData)
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
  