<template>
  <view>
    <t-button theme="primary" block @click="open('common')" variant="outline" size="large">一般展开模式</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="open('singe')" variant="outline" size="large">单一链路展开模式</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="openWithExpanded" variant="outline" size="large">默认展开指定节点</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      funcMode="checkbox"
      :expanded-mode="expandedMode"
      :expandedKeys="expandedKeys"
      :ifSearch="true"
      searchModel="depHighlight"
      :showAuxiliaryLine="true"
      :treeData="localTreeData"
      @change="onChange"
    />
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      expandedMode: 'common',
      expandedKeys: [],
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    open(mode) {
      this.expandedMode = mode;
      this.expandedKeys = [];
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    openWithExpanded() {
      this.expandedMode = 'common';
      this.expandedKeys = ['3', '3-1', '3-1-5', '3-1-5-1'];
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
