<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="扣款账号" style="width: 120px;">
                        <el-option label="扣款账号" value="recharge_no" />
                        <el-option label="扣款转入账号" value="transfer_hash" />
                        <el-option label="扣款单号" value="recharge_no" />
                        <el-option label="来源单号" value="recharge_no" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" placeholder="请输入...." /></div>
                <div class="form-item">
                    <el-select v-model="formData.status" placeholder="扣款状态" style="width: 120px;">
                        <el-option label="扣款中" :value="1" />
                        <el-option label="扣款成功" :value="2" />
                        <el-option label="扣款失败" :value="3" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.status" placeholder="审核状态" style="width: 120px;">
                        <el-option label="待审核" :value="1" />
                        <el-option label="审核通过" :value="2" />
                        <el-option label="审核失败" :value="3" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="创建时间" style="width: 120px;">
                        <el-option label="创建时间" :value="1" />
                        <el-option label="审核时间" :value="2" />
                    </el-select>
                </div>
                <div class="form-item">
                    <el-date-picker v-model="formData.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>

                </div>
                <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
                <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
                <div class="form-item submit" @click="editFnc(false)"><span>新增</span></div>
                <div class="form-item reset" @click="batchExamine"><span>批量审核</span></div>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" stripe @selection-change="handleSelectionChange">
                <el-table-column prop="" label="" width="10"></el-table-column>
                <el-table-column type="selection" width="100"></el-table-column>
                <el-table-column prop="order_no" label="扣款单号"></el-table-column>
                <el-table-column prop="transfer_hash" label="交易HASH"></el-table-column>
                <el-table-column prop="from_account" label="扣款账号"></el-table-column>
                <el-table-column prop="money" label="订单金额"></el-table-column>
                <el-table-column prop="to_account" label="扣款账户"></el-table-column>
               
                <el-table-column prop="status" label="操作人信息">
                    <template slot-scope="scope">
                       <div><span>创建人:{{ scope.row.add_name }}</span></div>
                       <div><span>审核人:{{ scope.row.examined_name }}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="扣款状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">扣款中</span>
                        <span v-if="scope.row.status == 2">扣款成功</span>
                        <span v-if="scope.row.status == 3">扣款失败</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="审核状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">待审核</span>
                        <span v-if="scope.row.status == 2">审核通过</span>
                        <span v-if="scope.row.status == 3">审核失败</span>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="时间信息">
                    <template slot-scope="scope">
                      <div> <span>创建时间:{{ convertTimestampToDateString(scope.row.created_at) }}</span></div>
                      <div> <span>审核时间:{{ convertTimestampToDateString(scope.row.examined_time) }}</span></div>
                    </template>
                </el-table-column>
               
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="editFnc(scope.row,'see')" type="text"
                            size="small">详情</el-button>
                        <el-button v-if="scope.row.status==1"  @click="openDialog(scope.row)" type="text"
                            size="small">审核</el-button>
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

        <DeductionDialog ref="deductionRef" @handleExamine="getList(true)" />

        <DeductionDetail ref="detailRef" @handleEmit="getList(true)" />
    </div>
</template>



<script>
import { deduct_list, recharge_checkFail, recharge_reGet } from '@/api/project'
import DeductionDialog from './components/DeductionDialog.vue'
import DeductionDetail from './components/DeductionDetail.vue'
import {convertTimestampToDateString} from '@/utils/time'
export default {
    components: { DeductionDialog,DeductionDetail },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type: 'recharge_no',
                keyword: '',
                status: '',
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
            selectTableData:[]
        }
    },
    mounted() {
        // this.getWithdrawOptions()
        this.getList(true);
        this.convertTimestampToDateString = convertTimestampToDateString;
    },
    methods: {
        batchExamine(){
            if(!this.selectTableData.length){
                this.$message.error('请选勾选至少一个');
                return
            }
            let ids = this.selectTableData.map((val)=>val.deduct_id).join(',')
            this.$refs.deductionRef.openDialog(ids,'list')
        },
        handleSelectionChange(e){
            this.selectTableData = e;
        },
        editFnc(row, type) {
            this.$refs.detailRef.openDialog(row, type)
        },
        openDialog(row){
            this.$refs.deductionRef.openDialog(row.deduct_id,type)
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
            let res = await deduct_list(this.formData)
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