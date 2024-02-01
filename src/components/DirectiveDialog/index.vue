<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :width="`${width}px`" :show-close="false" :close-on-click-modal="true">
      <div class="dialog-con">
        <div class="dialog-top" :class="border?'border-bottom':''">
          <span class="title">{{ title }}</span>
          <img class="close" src="../../assets/close_icon.png" alt="" @click="close">
        </div>
        <div class="main">
          <slot />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DirectiveDialog',
  props: {
    width:{
      type:Number,
      default:988
    },
    title: {
      type: String,
      default: '测试'
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    handleClose(e) {
      console.log(e)

      return true
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.border-bottom{
    border-bottom: 1px solid #ECEFF4;
}
::v-deep .el-dialog__header {
    display: none;
}

::v-deep .el-dialog__body {
    padding: 0;
}

::v-deep .el-dialog {
    border-radius: 10px;
    overflow: hidden;
}

.dialog-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0 22px 20px 30px;

    .title {
        font-size: 18px;
        color: #2C2F37;
        font-weight: 600;
    }

    .close {
        width: 30px;
        height: 30px;
    }
}

.main {
    width: 100%;
    // padding: 34px 22px;
}

.dialog-con {
    padding: 15px 0;
    width: 100%;
    height: auto;
    background: url('../../assets/popup_bk.png') no-repeat right bottom / cover;
}</style>
