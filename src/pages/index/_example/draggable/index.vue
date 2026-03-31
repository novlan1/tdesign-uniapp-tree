<template>
  <view>
    <t-button theme="primary" block @click="openTree" variant="outline" size="large">打开拖拽排序树</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      funcMode="edit"
      :draggable="true"
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
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    openTree() {
      this.$refs.treeRef.showTree = true;
    },
    onChange(checked) {
      console.log('change:', checked);
    },
  },
};
</script>
