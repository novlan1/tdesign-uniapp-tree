<template>
  <view>
    <t-button theme="primary" block @click="open('common')" variant="outline" size="large">一般模式 common</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="open('hierarchy')" variant="outline" size="large">层级关联模式 hierarchy</t-button>
    <view style="height: 16rpx" />
    <t-button theme="primary" block @click="open('depHighlight')" variant="outline" size="large">从属高亮模式 depHighlight</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      funcMode="radio"
      :ifSearch="true"
      :search-model="searchModel"
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
      searchModel: 'common',
      localTreeData: cloneTreeData(treeData),
    };
  },
  methods: {
    open(type) {
      this.searchModel = type;
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
