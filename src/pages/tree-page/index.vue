<template>
  <tdesign-uniapp-tree
    :use-popup="false"
    :title="getTitle"
    :change-verify="changeVerify"
    ref="treeRef"
    check-strictly-model="strong"
    :line="true"
    :check-strictly="true"
    value-mode="all"
    checkable
    :data="treeData"
    :expand-mutex="true"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <template #bottomBar>
      <view style="height: 50px" />
    </template>
    <template #fixedBottomBar>
      <view class="bottom-bar">
        <t-button theme="default" style="flex: 1" @click="cancel">取消</t-button>
        <t-button theme="primary" style="flex: 1">提交</t-button>
      </view>
    </template>
  </tdesign-uniapp-tree>
</template>

<script>
import { treeData, cloneTreeData } from '../index/_example/tree-data';

export default {
  data() {
    return {
      treeData: cloneTreeData(treeData),
    };
  },
  mounted() {
    var self = this;
    self.$nextTick(function () {
      self.echoDefault();
    });
  },
  methods: {
    cancel() {
      uni.navigateBack();
    },
    changeVerify(current, chooseList) {
      console.log('当前变化的数据', current);
      console.log('已选择的数据', chooseList);
      // 只在选中时校验数量，取消时不拦截
      if (current.checked && chooseList && chooseList.length > 4) {
        return '最多可以选择4个节点';
      }
    },
    getTitle(checked) {
      return '已选：' + checked.length + '项';
    },
    echoDefault() {
      var selectIds = ['2-1', '3-3-2'];
      this.checkedTreeData(this.treeData, selectIds);
    },
    checkedTreeData(arr, selectIds) {
      var self = this;
      arr.map(function (item) {
        item.checked = selectIds.indexOf(item.id) !== -1;
        if (item.children && item.children.length) {
          self.checkedTreeData(item.children, selectIds);
        }
      });
    },
    onCancel() {
      this.checkedTreeData(this.treeData, []);
    },
    onConfirm(list) {
      console.log('confirm:', list);
    },
  },
};
</script>

<style lang="less">
.bottom-bar {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.08);
}
</style>
