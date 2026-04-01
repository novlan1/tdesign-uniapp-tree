<template>
  <view>
    <t-button theme="primary" block @click="openTree(false, 'onlyLeaf')" variant="outline" size="large">单选 + 仅叶子可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, 'onlyLeaf')" variant="outline" size="large">多选 + 仅叶子可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(false, 'all')" variant="outline" size="large">单选 + 全部可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, 'all')" variant="outline" size="large">多选 + 全部可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, 'all', true)" variant="outline" size="large">多选 + 全部可选 + 父子关联</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, 'parentFirst')" variant="outline" size="large">多选 + 父优先模式</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      :checkable="checkable"
      :value-mode="valueMode"
      :check-strictly="checkStrictly"
      check-strictly-model="strong"
      :line="true"
      :data="localTreeData"
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
      valueMode: 'onlyLeaf',
      checkStrictly: false,
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    openTree(multiple, valueMode, checkStrictly) {
      this.checkable = multiple;
      this.valueMode = valueMode;
      this.checkStrictly = checkStrictly || false;
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
