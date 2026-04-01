<template>
  <view>
    <t-button theme="primary" block @click="openRadio" variant="outline" size="large"> 单选模式</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openCheckbox" variant="outline" size="large">多选模式</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      :checkable="checkable"
      :line="true"
      :data="localTreeData"
      :expanded="['1']"
      @change="onChange"
      @confirm="onConfirm"
    />
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      checkable: false,
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    openRadio() {
      this.checkable = false;
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    openCheckbox() {
      this.checkable = true;
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    onChange(checked) {
      console.log('change:', checked);
    },
    onConfirm(list) {
      console.log('confirm:', list);
    },
  },
};
</script>
