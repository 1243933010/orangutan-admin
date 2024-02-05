<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="订单号" style="width: 120px;">
                        <el-option label="订单号" value="order_no" />
                        <el-option label="卡商账号" value="dealers_account" />
                        <el-option label="贸易商账号" value="trader_account" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" type="text" placeholder="请输入工单号..." /></div>
                <div class="form-item">
                    <el-select v-model="formData.order_status" placeholder="收款类型" style="width: 120px;">
                        <el-option v-for="(item,index) in channelList" :key="index" :label="item.name" :value="item.id" />

                    </el-select>
                </div>
                <div class="form-item">
                    <el-select v-model="formData.time_type" placeholder="创建时间" style="width: 120px;">
                        <el-option label="创建时间" value="created_at" />
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
                <el-table-column prop="order_id" label="订单id" />
                <el-table-column prop="order_no" label="订单号" />
                <el-table-column prop="order_status" label="订单状态">
                    <template slot-scope="scope">
                       <span>{{ statusList.find((val)=>val.id==scope.row.order_status).name||'' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="dealers_account" label="卡商账号" />
                <el-table-column prop="trader_account" label="贸易商账号" />
                <el-table-column prop="order_money" label="订单金额" />
                <el-table-column prop="rate" label="收款汇率" />
                <el-table-column prop="fee" label="固定手续费" />
                <el-table-column prop="channel" label="收款类型" />
                <el-table-column prop="payment_address" label="收款地址" />
                <el-table-column prop="created_at" label="创建时间">
                    <template slot-scope="scope">
                       <span>{{ convertTimestampToDateString(scope.row.created_at) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="order_status" label="工单状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.order_status == 0">待回复</span>
                        <span v-if="scope.row.order_status == 1">已回复</span>
                        <span v-if="scope.row.order_status == 2">已完成</span>
                        <span v-if="scope.row.order_status == 3">已取消</span>

                    </template>
                </el-table-column>


                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="openDialog(scope.row, 'see')">详情</el-button>
                        <!-- <el-button type="text" size="small" @click="handleBtn(scope.row)">回复</el-button> -->
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
import { order_list,order_options1 } from '@/api/project'
import Detail from './components/CollectionDetail.vue'
import {convertTimestampToDateString} from '@/utils/time'

export default {
    components: { Detail },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type:'order_no',
                keyword:'',
                channel:'',
                time_type: 'created_at',
                time: '',
            },
            tableData: [],
            channelList:[],
            statusList:[]

        }
    },
    mounted() {
        // this.getWithdrawOptions()
        this.getList(true)
        this.getOptions();
        this.convertTimestampToDateString = convertTimestampToDateString;
    },
    methods: {
        
        openDialog(row,type) {
            this.$refs.detailRef.openDialog(row,type)
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
                keyword_type:'order_no',
                keyword:'',
                channel:'',
                time_type: 'created_at',
                time: '',
            }
            this.getList(true)
        },
        handleSizeChange(val) {
            this.formData.limit = val
            this.getList(true)
        },
        handleCurrentChange(val) {
            this.formData.page = val
            this.getList()
        },
        async getOptions(){
            const res = await order_options1({})
            if (res.code == 200) {
                this.channelList = res.data.channel
                this.statusList = res.data.status
            }
        },
        async getList(bool = false) {
            if (bool) {
                this.formData.page = 1
            }
            if (this.formData.time.length > 0) {
                this.formData.screen_start_time = this.formData.time[0];
                this.formData.screen_end_time = this.formData.time[1];
            }
            const res = await order_list(this.formData)
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
  