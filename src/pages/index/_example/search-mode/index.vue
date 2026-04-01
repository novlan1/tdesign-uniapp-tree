<template>
  <view>
    <t-button theme="primary" block @click="openTree" variant="outline" size="large">使用 filter 过滤</t-button>

    <tdesign-uniapp-tree
      ref="treeRef"
      :line="true"
      :filter="filterFunc"
      :data="localTreeData"
      @change="onChange"
    >
      <template #topBar>
        <view class="search-bar">
          <t-input v-model:value="keyword" placeholder="输入关键字过滤" clearable @change="onSearchChange" />
        </view>
      </template>
    </tdesign-uniapp-tree>
  </view>
</template>

<script>
import { treeData, cloneTreeData } from '../tree-data';

export default {
  data() {
    return {
      keyword: '',
      localTreeData: cloneTreeData(treeData),
    };
  },
  computed: {
    filterFunc() {
      var kw = this.keyword;
      if (!kw) return null;
      return function (node) {
        return (node.label || '').indexOf(kw) !== -1;
      };
    },
  },
  methods: {
    openTree() {
      this.keyword = '';
      this.$nextTick(() => {
        this.$refs.treeRef.showTree = true;
      });
    },
    onSearchChange() {
      // filter 是响应式计算属性，自动触发组件 computedTreeList 更新
    },
    onChange(checked) {
      console.log('change:', checked);
    },
  },
};
</script>

<style scoped>
.search-bar {
  padding: 12rpx 0;
}
</style>
