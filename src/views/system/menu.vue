<template>
  <div>
    <div class="search">
      <div class="form">

        <!-- <div class="form-item">
                    <el-select v-model="formData.keyword_type" placeholder="资金流水号" style="width: 120px;">
                        <el-option label="来源单号" value="from_no" />
                        <el-option label="资金流水号" value="log_no" />
                        <el-option label="资金账号" value="account" />
                    </el-select>
                </div>
                <div class="form-item"><el-input v-model="formData.keyword" type="number" placeholder="请输入...." /></div>
                <div class="form-item">
                    <el-select v-model="formData.method" placeholder="状态" style="width: 120px;">
                        <el-option label="充值" value="recharge" />
                        <el-option label="订单冻结" value="order" />
                        <el-option label="提现" value="withdraw" />
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

                </div> -->
        <!-- <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
                <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div> -->
        <div class="form-item submit" @click="editFnc(false)"><span>新增</span></div>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" row-key="menu_id" default-expand-all 
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
       
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="menu_id" label="菜单id" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="additional" label="附加字段" />
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editFnc(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="editFnc(scope.row, 'see')">详情</el-button>
            <el-button type="text" size="small" @click="delFnc(scope.row)">删除</el-button>
          </template>
        </el-table-column>
       
      </el-table>


    </div>
    <div style="display: flex;flex-direction: row-reverse;">
      <el-pagination :current-page="formData.page" :page-sizes="[10, 20, 30, 40]" :page-size="formData.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="formData.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <MenuDetail ref="menuRef" @handleEmit="getList(true)" />
  </div>
</template>

<script>
import { menus_list, menus_del, route_list } from '@/api/project'
import MenuDetail from './components/MenuDetail.vue'
export default {
  components: { MenuDetail },
  data() {
    return {
      formData: {
        page: 1,
        limit: 10,
        total: 0
      },
      formRule: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      tableData: [],
     

    }
  },
  mounted() {
    // this.getWithdrawOptions()
    this.getList(true)
  },
  methods: {
    delFnc(row) {
      this.$confirm('是否删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const res = await menus_del(row.permission_id)
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
      this.$refs.menuRef.openDialog(row, type)
    },
    resertFormFnc() {
      this.formData = {
        page: 1,
        limit: 10,
        total: 0
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
      const res = await menus_list()
      if (res.code == 200) {
        this.formData.total = res.data.total
        // res.data.forEach(val => {
        //   val.children = val.child;
        // })
       
        this.tableData=this.organizeDataIntoTree(res.data.data)
      }
    },
    organizeDataIntoTree(data, parentId = 0) {
            const result = [];
            for (const item of data) {
                if (item.parent_id === parentId) {
                    const children = this.organizeDataIntoTree(data, item.menu_id);

                    if (children.length) {
                        item.children = children;
                    }

                    result.push(item);
                }
            }

            return result;
        },
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
