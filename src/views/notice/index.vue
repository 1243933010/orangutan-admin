<template>
    <div>
        <div class="search">
            <div class="form">


                <div class="form-item"><el-input v-model="formData.title" type="text" placeholder="请输入标题" /></div>

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
                <div class="form-item submit" @click="editFnc(false)"><span>新增</span></div>

            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="" label="" width="10"></el-table-column>
                <el-table-column type="selection" width="100"></el-table-column>
                <el-table-column prop="notice_id" label="id" width="100"></el-table-column>
                <el-table-column prop="name" label="创建人"  width="100"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="created_at" label="创建时间"  width="120">
                    <template slot-scope="scope">
                        <span>{{ convertTimestampToDateString(scope.row.created_at || '') }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="delFnc(scope.row)" type="text" size="small">删除</el-button>
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

        <Detail ref="detailRef" @handleEmit="getList(true)" />
    </div>
</template>



<script>
import { notice_list, notice_del } from '@/api/project'
import { convertTimestampToDateString } from '@/utils/time'
import Detail from './Detail.vue'
export default {
    components: { Detail },
    data() {
        return {
            formData: {
                page: 1,
                limit: 10,
                total: 0,
                title: '',
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
        this.getList(true);
        this.convertTimestampToDateString = convertTimestampToDateString;
    },
    methods: {
        editFnc(row, type) {
            this.$refs.detailRef.openDialog(row, type)
        },
        resertFormFnc() {
            this.formData = {
                page: 1,
                limit: 10,
                total: 0,
                title: '',
                time_start: '',
                time_end: '',
                time_type: 1,
                time: ''
            }
        },
        delFnc(row) {
            this.$confirm('是否删除该数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(async () => {
                let res = await notice_del(row.notice_id, {})
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
            let res = await notice_list(this.formData)
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