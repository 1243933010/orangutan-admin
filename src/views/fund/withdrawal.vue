<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="资金流水号" style="width: 120px;">
                        <el-option label="提现单号" value="withdraw_no" />
                        <el-option label="交易哈希" value="transfer_hash" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" placeholder="请输入...." /></div>
                <div class="form-item">
                    <el-select v-model="formData.status" placeholder="状态" style="width: 120px;">
                        <el-option label="全部" :value="-1" />
                        <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.id" />
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

                </div>
                <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
                <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="" label="" width="10"></el-table-column>
                <el-table-column type="selection" width="100"></el-table-column>
                <el-table-column prop="mobile" label="提现账号"></el-table-column>
                <el-table-column prop="withdraw_no" label="提现单号"></el-table-column>
                <!-- <el-table-column prop="username" label="创建人"></el-table-column> -->
                <el-table-column prop="status" label="操作人信息">
                    <template slot-scope="scope">
                       <div><span>创建人:{{ scope.row.username }}</span></div>
                       <div><span>审核人:无字段</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="收款地址"></el-table-column>
                <el-table-column prop="transfer_hash" label="交易哈希"></el-table-column>
                <el-table-column prop="money" label="提现金额"></el-table-column>
                <el-table-column prop="fee" label="固定费用"></el-table-column>
                <el-table-column prop="rate" label="提现费率"></el-table-column>
                <el-table-column prop="created_at" label="时间信息">
                    <template slot-scope="scope">
                      <div> <span>创建时间:{{ convertTimestampToDateString(scope.row.created_at) }}</span></div>
                      <div> <span>审核时间:{{ convertTimestampToDateString(scope.row.examined_at) }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="examine_status_name" label="审核状态">
                    <template slot-scope="scope">
                        <span>{{ status[scope.row.examine_status_name] || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status_name" label="提现状态">
                    <template slot-scope="scope">
                        <span>{{ examined[scope.row.examine_status_name] || '' }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.examine_status==1" @click="openDialog(scope.row)" type="text" size="small">审核</el-button>
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
import { withdraw_list, withdraw_options } from '@/api/project'
import  WithdrawalDialog from './components/WithdrawalDialog.vue'
import {convertTimestampToDateString} from '@/utils/time'

export default {
    components:{WithdrawalDialog},
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type:'withdraw_no',
                keyword:'',
                time_type:1,
                time:''
            },
            formRule: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            tableData: [],
            examined: {},
            status: {},
            examinedList: [],
            statusList: []
        }
    },
    mounted() {
        this.getWithdrawOptions()
        this.convertTimestampToDateString = convertTimestampToDateString;

    },
    methods: {
        resertFormFnc() {
            this.formData = {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type:'withdraw_no',
                keyword:'',
                time_type:1,
                time:''
            }
        },
        openDialog(row){
            this.$refs.withdrawalRef.openDialog(row.withdraw_id)
        },
        
        async getWithdrawOptions() {
            let res = await withdraw_options({})
            if (res.code == 200) {
                this.examinedList = res.data.examined;
                this.statusList = res.data.status;

                res.data.examined.forEach(element => {
                    this.examined[element.id] = element.name
                });
                res.data.status.forEach(element => {
                    this.status[element.id] = element.name
                });
                this.getList(true);
            }
        },
        handleSizeChange(val) {
            this.formData.limit = val;
            this.getList(true)
        },
        handleCurrentChange(val) {
            this.formData.page = val;
            this.getList(true)
        },
        async getList(bool = false) {
            if (bool) {
                this.formData.page = 1;
            }
            if (this.formData.time.length > 0) {
                this.formData.time_start = this.formData.time[0];
                this.formData.time_end = this.formData.time[1];
            }
            let res = await withdraw_list(this.formData)
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