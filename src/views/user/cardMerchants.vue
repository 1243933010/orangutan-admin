<template>
    <div>
        <div class="search">
            <div class="form">

                <div class="form-item">
                    <el-select v-model="formData.type" placeholder="手机号" style="width: 120px;">
                        <el-option label="手机号" :value="1" />
                        <el-option label="账号名称" :value="2"  />
                        <el-option label="邮箱" :value="3"  />
                        <el-option label="姓名" :value="4"  />
                        <el-option label="身份证号" :value="5"  />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.search_name"  placeholder="请输入...." /></div>
                <div class="form-item"><el-input v-model="formData.dealers_name" placeholder="请输入商家名称" /></div>
                <div class="form-item">
                    <el-select v-model="formData.payment_status" placeholder="收款状态" style="width: 120px;">
                        <el-option label="开启" :value="1" />
                        <el-option label="关闭" :value="0" />
                    </el-select>
                </div>
               
                <div class="form-item">
                    <el-select v-model="formData.date_type" placeholder="创建时间" style="width: 120px;">
                        <el-option label="创建时间" :value="1" />
                        <el-option label="最近登录时间" :value="2" />
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
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="dealers_id" label="编号" width="50" />
                <!-- <el-table-column  label="头像" width="100">
                    <template slot-scope="scope">
                       <div style="width: 40px;"><img style="width:100%;" :src="scope.row.head_img" alt=""></div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="username" label="账号名称" />
                <el-table-column prop="dealers_name" label="商家名称" />
                <el-table-column prop="card_no" label="姓名/身份证">
                    <template slot-scope="scope">
                    <div><span>{{ scope.row.name }}</span></div>
                    <div><span>{{ scope.row.card_no }}</span></div>
                </template>
                </el-table-column>

                <el-table-column prop="mobile" label="手机号码" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="payment_status" label="收款状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payment_status==1">开启</span>
                        <span v-if="scope.row.payment_status==0">关闭</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rate" label="汇率"  width="100" />
                <el-table-column prop="sort" label="排序权重" width="100" />
                <el-table-column prop="is_auth_text" label="是否认证"  width="100" />
                <el-table-column prop="created_at" label="时间信息">
                    <template slot-scope="scope">
                      <div> <span>创建时间:{{ convertTimestampToDateString(scope.row.created_at) }}</span></div>
                      <div> <span>最近登录时间:{{ convertTimestampToDateString(scope.row.last_at) }}</span></div>
                    </template>
                </el-table-column>
               
                
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editFnc(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="editFnc(scope.row, 'see')">详情</el-button>

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

        <CardMerchantsDetail ref="cardMerchantsRef" @handleExamine="getList(true)" />
    </div>
</template>



<script>
import { dealers_list, withdraw_options } from '@/api/project'
import CardMerchantsDetail from './components/CardMerchantsDetail.vue'
import {convertTimestampToDateString} from '@/utils/time'
export default {
    components: { CardMerchantsDetail },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                type: 1,
                search_name: '',
                dealers_name:'',
                payment_status:"",
                date_type: 1,
                time: ''
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
        }
    },
    mounted() {
        this.getList(true);
        this.convertTimestampToDateString = convertTimestampToDateString;
    },
    methods: {
        editFnc(row, type) {
            this.$refs.cardMerchantsRef.openDialog(row, type)
        },
        resertFormFnc() {
            this.formData = {
                page: 1,
                limit: 10,
                total: 0,
                keyword_type: 'withdraw_no',
                keyword: '',
                time_type: 1,
                time: ''
            }
        },
        openDialog(row) {
            this.$refs.cardMerchantsRef.openDialog(row.withdraw_id)
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
                this.formData.start_time = this.formData.time[0];
                this.formData.end_time = this.formData.time[1];
            }
            let res = await dealers_list(this.formData)
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