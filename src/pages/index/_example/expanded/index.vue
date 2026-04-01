<template>
  <view>
    <t-button theme="primary" block @click="open(false)" variant="outline" size="large">一般展开模式</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="open(true)" variant="outline" size="large">同级互斥展开模式（手风琴）</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openWithExpanded" variant="outline" size="large">默认展开指定节点</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openExpandAll" variant="outline" size="large">展开全部</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openExpandLevel" variant="outline" size="large">展开前2级</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      checkable
      :expand-mutex="expandMutex"
      :expanded="expanded"
      :expand-all="expandAllFlag"
      :expand-level="expandLevel"
      :line="true"
      :data="localTreeData"
      @change="onChange"
    />
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      expandMutex: false,
      expanded: [],
      expandAllFlag: false,
      expandLevel: 0,
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    open(mutex) {
      this.expandMutex = mutex;
      this.expanded = [];
      this.expandAllFlag = false;
      this.expandLevel = 0;
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    openWithExpanded() {
      this.expandMutex = false;
      this.expandAllFlag = false;
      this.expandLevel = 0;
      this.expanded = ['3', '3-1', '3-1-5', '3-1-5-1'];
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    openExpandAll() {
      this.expandMutex = false;
      this.expanded = [];
      this.expandLevel = 0;
      this.expandAllFlag = true;
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    openExpandLevel() {
      this.expandMutex = false;
      this.expanded = [];
      this.expandAllFlag = false;
      this.expandLevel = 2;
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    onChange(checked) {
      console.log('change:', checked);
    },
  },
};
</script>
