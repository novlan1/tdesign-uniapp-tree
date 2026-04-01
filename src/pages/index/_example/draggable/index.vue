<template>
  <view>
    <t-button theme="primary" block @click="openTree" variant="outline" size="large">打开拖拽排序树</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      editable
      :draggable="true"
      :line="true"
      :data="localTreeData"
      @change="onChange"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @drop="onDrop"
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
    onDragStart(context) {
      console.log('dragstart:', context.node);
    },
    onDragEnd(context) {
      console.log('dragend:', context.node);
    },
    onDrop(context) {
      console.log('drop:', context.node, '→', context.target);
    },
  },
};
</script>
