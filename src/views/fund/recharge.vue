<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="资金流水号" style="width: 120px;">
                        <el-option label="充值单号" value="recharge_no" />
                        <el-option label="交易哈希" value="transfer_hash" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" placeholder="请输入...." /></div>
                <div class="form-item">
                    <el-select v-model="formData.status" placeholder="状态" style="width: 120px;">
                        <el-option label="全部" :value="-1" />
                        <el-option label="充值中" :value="0" />
                        <el-option label="充值成功" :value="1" />
                        <el-option label="订单取消" :value="2" />
                        <el-option label="充值失败" :value="3" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="创建时间" style="width: 120px;">
                        <el-option label="创建时间" :value="1" />
                        <el-option label="到账时间" :value="2" />
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
                <el-table-column prop="mobile" label="用户手机号"></el-table-column>
                <el-table-column prop="recharge_no" label="充值单号"></el-table-column>
                <el-table-column prop="money" label="充值金额"></el-table-column>
                <el-table-column prop="transfer_hash" label="交易哈希"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">充值中</span>
                        <span v-if="scope.row.status == 1">充值成功</span>
                        <span v-if="scope.row.status == 2">订单取消</span>
                        <span v-if="scope.row.status == 3">充值失败</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间">
                    <template slot-scope="scope">
                       <span>{{ convertTimestampToDateString(scope.row.created_at) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_time" label="到账时间">
                    <template slot-scope="scope">
                       <span>{{ convertTimestampToDateString(scope.row.pay_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.examine_status == 0" @click="markFnc(scope.row)" type="text"
                            size="small">标记失败</el-button>
                        <el-button v-if="scope.row.examine_status !== 1" @click="supplementary(scope.row)" type="text"
                            size="small">补单</el-button>
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

        <WithdrawalDialog ref="withdrawalRef" @handleExamine="getList(true)" />
    </div>
</template>



<script>
import { recharge_list, recharge_checkFail, recharge_reGet } from '@/api/project'
import WithdrawalDialog from './components/WithdrawalDialog.vue'
import {convertTimestampToDateString} from '@/utils/time'
export default {
    components: { WithdrawalDialog },
    data() {
        return {
            formData: {
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
            },
            formRule: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            tableData: [],

        }
    },
    mounted() {
        // this.getWithdrawOptions()
        this.getList(true);
        this.convertTimestampToDateString = convertTimestampToDateString;
    },
    methods: {
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
        markFnc(row) {
            this.$confirm('是否标记失败该数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let res = await recharge_checkFail({ recharge_id: row.recharge_id })
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getList(true)
                    return
                }
                this.$message.error(res.msg)
                this.getList(true)
            })
        },
        supplementary(row) {
            this.$confirm('是否补单该数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let res = await recharge_reGet({ recharge_id: row.recharge_id })
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getList(true)
                    return
                }
                this.$message.error(res.msg)
                this.getList(true)
            })
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
            if (this.formData.time.length > 0) {
                this.formData.time_start = this.formData.time[0];
                this.formData.time_end = this.formData.time[1];
            }
            let res = await recharge_list(this.formData)
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