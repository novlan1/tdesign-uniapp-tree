<template>
  <view>
    <t-button theme="primary" block @click="openTree" variant="outline" size="large">默认选中：上海-1, 黄埔区-2</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      checkable
      value-mode="all"
      :check-strictly="true"
      check-strictly-model="strong"
      :line="true"
      :data="localTreeData"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    openTree() {
      var selectIds = ['2-1', '3-3-2'];
      this.checkedTreeData(this.localTreeData, selectIds);
      this.$refs.treeRef.showTree = true;
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
    onConfirm(list) {
      console.log('confirm:', list);
    },
    onCancel() {
      this.checkedTreeData(this.localTreeData, []);
    },
  },
};
</script>
