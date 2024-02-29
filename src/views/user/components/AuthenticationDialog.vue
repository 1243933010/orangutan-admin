<template>
    <div>
        <el-dialog title="审核" :visible.sync="dialogVisible" width="40%" >
            <div>
                <el-form :model="formData" class="demo-form-inline">
                    <el-form-item label="审核">
                        <el-radio-group v-model="formData.status">
                            <el-radio :label="1">审核通过</el-radio>
                            <el-radio :label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formData.remark" placeholder="备注" style="width: 50%;"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleExamine">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>



<script>
import { authentication_examine } from '@/api/project'
export default {
    data() {
        return {

            dialogVisible: false,
            formData: {
                member_id: '',
                status: 1,
                remark: ''
            }
        }
    },
    methods: {
        openDialog(member_id) {
            this.dialogVisible = true
            this.formData.member_id = member_id;
            this.formData.result = 1;
            this.formData.remark = '';

        },
        async handleExamine() {
            let res = await authentication_examine(this.formData);
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.dialogVisible = false;
                this.$emit('handleExamine')
                return
            }
            this.$message.error(res.msg)
        }
    }
}
</script>