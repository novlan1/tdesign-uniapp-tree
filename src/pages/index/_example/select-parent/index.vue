<template>
  <view>
    <t-button theme="primary" block @click="openTree(false, false)" variant="outline" size="large">单选 + 父级不可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, false)" variant="outline" size="large">多选 + 父级不可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(false, true)" variant="outline" size="large">单选 + 父级可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, true)" variant="outline" size="large">多选 + 父级可选</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openTree(true, true, true)" variant="outline" size="large">多选 + 父级可选 + 父子关联</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      :funcMode="funcMode"
      :selectParent="selectParent"
      :checkStrictly="checkStrictly"
      checkStrictlyModel="strong"
      :showAuxiliaryLine="true"
      :ifSearch="true"
      searchModel="depHighlight"
      :treeData="localTreeData"
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
      funcMode: 'radio',
      selectParent: false,
      checkStrictly: false,
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    openTree(multiple, selectParent, checkStrictly) {
      this.funcMode = multiple ? 'checkbox' : 'radio';
      this.selectParent = selectParent;
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
